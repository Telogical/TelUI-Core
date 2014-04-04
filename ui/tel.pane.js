// creative the directives as re-usable components

TelogicalUi
    .directive('telPane', ['$http', '$templateCache', '$timeout',
        function ($http, $templateCache, $timeout) {
            'use strict';
            return {
                restrict: 'EA',
                replace: true,
                transclude: true,
                scope: {
                    'id': '@',
                    'title': '@',
                    'visible': '@',
                    'iconVisible': '@',
                    'iconHidden': '@',
                    'showVisibilityToggle': '@',
                    'showSpeed': '@',
                    'hideSpeed': '@',
                    'showAnimation': '@',
                    'hideAnimation': '@',
                    'hasIndention': '@',
                    'indentionHasTreeline': '@',
                    'priority': '@',
                    'openCallback': '&'
                },
                templateUrl: '_SRS4/tel-pane-partial.html',
                compile: function (tElement, tAttrs, tTransclude) {

                    return {
                        pre: function compile($scope, iElement, iAttrs) {

                        },
                        post: function link($scope, $element, $attrs) {

                            function updateVisibilityState() {
                                $scope.visible = ($scope.visible === 'false' || $scope.visible === false) ? false : true;

                                $scope.hasIndention = ($scope.hasIndention === 'false' || $scope.hasIndention === false) ? false : true;

                                $scope.showVisibilityToggle =
                                    ($scope.showVisibilityToggle === 'false' || $scope.showVisibilityToggle === false) ? false : true;

                                $scope.indentionHasTreeline =
                                    ($attrs.indentionHasTreeline === 'false' || $scope.indentionHasTreeline === false ||
                                    $scope.showVisibilityToggle === false) ? false : true;

                                $scope.iconVisible = $scope.iconVisible || 'ui-icon-plus';
                                $scope.iconHidden = $scope.iconHidden || 'ui-icon-minus';
                                $scope.showAnimation = $scope.showAnimation || 'blind';
                                $scope.hideAnimation = $scope.hideAnimation || 'blind';
                                $scope._$viewport = $scope._$viewport || $element.find('.ui-pane-viewport-content');
                                $scope._$treeline = $scope._$treeline || $element.find('.ui-pane-indention-treeline');

                                $scope._$treeline.hide();
                                if ($scope.visible) {

                                    $scope.visibilityIcon = $scope.iconHidden;

                                    $element
                                        .find('.ui-pane-indention-treeline')
                                        .css({
                                            'height': $scope._$viewport.height(),
                                            'margin-top': 0
                                        });

                                    $scope
                                        ._$viewport
                                        .show($scope.showAnimation, $scope.showSpeed, function () {
                                            if (typeof $scope.openCallback === 'function') {
                                                $scope.openCallback();
                                            }
                                            setTimeout(function () {
                                                //$(window).resize();
                                            });
                                        });

                                } else {
                                    $scope
                                        ._$viewport
                                        .hide($scope.hideAnimation, $scope.hideSpeed, function () {
                                            $scope.visibilityIcon = $scope.iconVisible;
                                            $element.find('.ui-pane-indention-treeline').css({
                                                'height': $scope._$viewport.height(),
                                                'margin-top': 14
                                            });
                                            setTimeout(function () {
                                                $scope.$apply();
                                               // $(window).resize();
                                            });

                                        });
                                }

                            }

                            var toggleVisibility = function toggleVisibility() {
                                $scope.visible = !$scope.visible;
                                setTimeout(function () {

                                    $scope.$apply();
                                });

                            };

                            $scope.showSpeed = 1000;
                            $scope.hideSpeed = 500;
                            $scope.toggleVisiblity = toggleVisibility;
                            $scope.$watchCollection('[visible, showVisibilityToggle]', updateVisibilityState);

                        }
                    };
                }
            };
        }]);