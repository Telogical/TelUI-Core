angular
    .module('TelUI')
    .directive('confirmClick', function confirmClick() {
        'use strict';
        return {
            restrict: 'A',
            replace: false,
            scope: false,
            priority: -1,
            compile: function compileConfirmClick(tElement, tAttrs, transclude) {
                function preLink(scope, element, attrs) {
                    element.on('click', function(e){
                        var message = attrs.confirmClick;
                        if(message && !confirm(message)){
                            e.originalEvent.stopImmediatePropagation();
                            e.stopImmediatePropagation();
                            e.preventDefault();
                        }
                    });
                }

                return {
                    pre: preLink
                };
            }
        };
    });
