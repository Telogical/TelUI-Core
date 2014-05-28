// creative the directives as re-usable components

angular
    .module('TelUI')
    .directive('ngId', function () {
        'use strict';
        return {
            restrict: 'A',
            replace: false,
            scope: false,
            priority: 9999,
            compile: function compileNgId(tElement, tAttrs, transclude) {

                function preLink($scope, $element, $attrs) {

                    if (!$attrs.id) {
                        var $parent = $element.parent(),
                            id;

                        var isAView = $parent.attr('data-ui-view') || $parent.attr('ui-view');
                        if (typeof isAView === 'string') {

                            id = $attrs.ngId || isAView || 'view' + (Math.floor(Math.random() * 9999)).toString();

                            if ($scope.id) {
                                id = $scope.id + '_' + id;
                            }

                        } else {
                            id = $attrs.ngId + (Math.floor(Math.random() * 9999)).toString();
                        }

                        id = id.toLowerCase();

                        $scope.id = id;
                    } else {
		    	$attrs.id = $attrs.id.toLowerCase();
		    }
                }

                return {
                    pre: preLink
                };
            }
        };
    });
