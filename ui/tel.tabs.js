// creative the directives as re-usable components

TelogicalUi
    .controller('telTabsetCtrl', ['$scope', '$element', '$attrs',
        function ($scope) {
            'use strict';
            var ctrl = this,
                tabs = ctrl.tabs = $scope.tabs = [];

            function addTab(tab) {
                tabs.push(tab);
            }

            function addHeader(header) {
                header = header;
            }

            function select(tab) {
                function unselectTab(tab) {
                    tab.selected = false;
                }
                angular.forEach(tabs, unselectTab);
                tab.selected = true;
            }

            $scope.select = select;
            ctrl.addTab = addTab;
            ctrl.addHeader = addHeader;
        }]);


TelogicalUi
    .directive('telTabset', function () {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '_SRS4/tel-tabset-partial.html',
            transclude: true,
            controller: 'telTabsetCtrl',
            scope: {
                'ngDisabled': '=?',
                'id': '@',
                'name': '@'
            },
            compile: function () {
                function compile($scope, $element) {

                    function processTab(tab, key) {

                        var _$pane = $element.find('.ui-tab').eq(key),
                            name = (_$pane.attr('name') || key).split(' ').join('').toLowerCase();

                        tab.anchorId = $scope.id + '_anchor_' + name;
                        tab.panelId = $scope.id + '_panel_' + name;
                        _$pane.attr('id', tab.panelId);
                    }
                    angular.forEach($scope.tabs, processTab);
                }

                function link($scope, $element) {
                    setTimeout(function () {
                        $($element[0]).tabs();
                    });
                }

                return {
                    pre: compile,
                    post: link
                };
            }
        };
    });

TelogicalUi
    .directive('telTab', function () {
        'use strict';
        return {
            restrict: 'EA',
            replace: true,
            require: '^telTabset',
            template: '<div class="w-12 w-v-1 ui-tab w-alpha w-omega" data-ng-transclude></div>',
            transclude: true,
            scope: {
                'ngDisabled': '=?',
                'id': '@',
                'title': '@',
                'name': '@'
            },
            compile: function () {
                return {
                    pre: function compile($scope, $element, $attrs, telTabsetCtrl) {
                        telTabsetCtrl.addTab($scope);
                    }
                };
            }
        };
    });