// creative the directives as re-usable components

TelogicalUi
    .directive('telDialog',
        function () {
            'use strict';
            return {
                restrict: 'EA',
                replace: true,
                template: '<div class="waffles"></div>',
                transclude: true,
                scope: {
                    'id': '@',
                    //EVENTS
                    //lifecycle events
                    'create': '&',
                    'open': '&',
                    'beforeClose': '&',
                    'close': '&?',
                    'focus': '&?',
                    //interaction events
                    'drag': '&',
                    'dragStart': '&',
                    'dragStop': '&',
                    'resize': '&',
                    'resizeStart': '&',
                    'resizeStop': '&',

                    //OPTIONS
                    //size
                    'height': '=?',
                    'maxHeight': '=?',
                    'minHeight': '=?',
                    'width': '=?',
                    'minWidth': '=?',
                    'maxWidth': '=?',
                    'modal': '=?',

                    //props
                    'buttons': '=?',
                    'closeOnEscape': '=?',
                    'closeText': '=?',
                    'resizable': '=?',

                    'show': '=',
                    'ngDisabled': '=',
                    'blurTarget': '@',
                    'title': '@'

                },
                link: function ($scope, $element, $attrs) {
                    $element.hide();
                    var initialized = false;
                    setTimeout(function () {

                        $scope.close = $scope.close || null;
                        $scope.title = $scope.title || 'dialog';
                        $scope.buttons = $scope.buttons || [];
                        $scope.width = $scope.width || $(window).width() * 0.4;
                        $scope.height = $scope.height || 250;
                        $scope.modal = $scope.modal || false;
                        $scope.resizable = $scope.resizable === false ? false : true;

                        var config = {
                            autoOpen: false,
                            title: $scope.title,
                            width: $scope.width,
                            height: $scope.height,
                            buttons: $scope.buttons,
                            modal: $scope.modal,
                            close: function () {

                                if ($scope.close) {

                                    $scope.close.call();
                                }

                                $scope.show = false;
                                $scope.$apply();
                            }
                        };

                        $scope.$apply();
                        initialized = $element.dialog(config);
                        
                    });
                    $element.hide();
                    $scope.$watch('show', function (newVal, oldVal) {
                        if (newVal != oldVal && initialized) {
                            $scope.show = newVal;
                            setTimeout(function () {
                                if (newVal === true) {
                                    $element.dialog('open');
                                } else {
                                    $element.dialog('close');
                                    //Jquery dialog auto focuses the triggering element.  This is to allow 'blocking' that action.
                                    if($scope.blurTarget){
                                        $($scope.blurTarget).focus();
                                        $($scope.blurTarget).blur();
                                    }

                                }
                            });
                        }
                    });

                    $scope
                        .$watchCollection('[title, buttons, width, height, modal, resizable]', function (values) {
                            if (initialized) {
                                $element.dialog({
                                    title: values[0] || '',
                                    buttons: values[1] || [],
                                    width: values[2] || 650,
                                    height: values[3] || 250,
                                    modal: values[4] || false,
                                    resizable: values[5] === false ? false : true
                                });
                            }
                        });

                    $scope.$watch('ngDisabled', function (value) {
                        if (initialized) {
                            $element.attr('disabled', value);
                            if (value) {
                                $element.dialog('disable');
                            } else {
                                $element.dialog('enable');
                            }
                        }
                    });
                },
                controller: ['$scope', '$element', '$attrs', '$transclude',
                    function ($scope, $element, $attrs, $transclude) {
                        this.show = false;
                        $transclude(function (clone) {
                            $element.html(clone);
                        });
                    }]
            };
        });