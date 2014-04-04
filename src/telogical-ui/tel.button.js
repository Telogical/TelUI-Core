// creative the directives as re-usable components

TelogicalUi
    .directive('telButton', ['$http', '$templateCache',
        function ($http, $templateCache) {
            'use strict';

            return {
                restrict: 'E',
                replace: true,
                require: '?ngModel',
                templateUrl: '_SRS4/tel-button-partial.html',
                scope: {
                    'id': '@',
                    'click': '&',
                    'cssClass': '@',
                    'ngDisabled': '=?',
                    'label': '@',
                    'text': '@',
                    'iconPrimary': '@',
                    'iconSecondary': '@',
                    'appearance': '@',
                    'title': '@',
                    'type': '@',
                    'value': '=?'
                },
                compile: function (tElement, tAttrs, tLinker) {
                    
                    var type = tAttrs.type || 'button';

                    return {
                        pre: function compile($scope, $element, $attrs) {
                            var isButton = type === 'button' ? true : false;
                            var isCheckbox = type === 'checkbox' ? true : false;
                            $scope.type = type || 'button';
                            $scope.isCheckbox = isCheckbox;
                            $scope.isButton = isButton;
                            
                        },
                        post: function link($scope, $element, $attrs, ngModel) {
                            $scope.value = $scope.value || false;

                            function updateProperties(values) {
                                var _label = values[0] || '',
                                    _primary = values[2] || '',
                                    _secondary = values[3] || '',
                                    _text = (values[1] === 'false' || ((_primary || _secondary) && !_label)) ? false : true,
                                    _appearance = values[4];

                                var btnProps = {
                                    label: _label,
                                    text: _text,
                                    cssClass: 'ui-state-error',
                                    icons: {
                                        primary: _primary,
                                        secondary: _secondary
                                    }
                                };

                                _$button
                                    .button(btnProps)
                                    .addClass($scope.cssClass);

                                if ($element.attr('tabindex')) {
                                    _$button.attr('tabindex', $element.attr('tabindex'));
                                }

                                var _$uiButton = $element.find('.ui-button');
                                if (_appearance === 'link') {
                                    _$uiButton.addClass('ui-button-link');
                                } else {
                                    _$uiButton.removeClass('ui-button-link');
                                }
                            }

                            function updateClickHandler(handler) {
                                $scope.click = handler;
                                _$button
                                    .off('click.telButton')
                                    .on('click.telButton', handler);
                            }

                            function updateDisabledState(value) {
                                _$button = $scope.isCheckbox ?
                                    $element.find('input') :
                                    $element.find('button');

                                var _$label = $scope.isCheckbox ?
                                    $element.find('.ui-button-link') :
                                    $element.find('.ui-button-text');

                                _$button.attr('disabled', value);
                                _$button.prop('disabled', value);
                                _$label.attr('disabled', value);
                                _$label.prop('disabled', value);

                                if (value) {
                                    if (_$button.hasClass('ui-button') ||
                                        _$label.hasClass('ui-widget')) {
                                        _$button.button('disable');
                                    }
                                    _$label.addClass('ui-state-disabled');
                                } else {
                                    if (_$button.hasClass('ui-button') ||
                                        _$label.hasClass('ui-widget')) {
                                        _$button.button('enable');
                                    }
                                    _$label.removeClass('ui-state-disabled');
                                }
                            }

                            function updateValue(value) {
                                if ($scope.isCheckbox) {
                                    _$button
                                        .prop('checked', value)
                                        .trigger('change');
                                }
                            }

                            var _$button = $scope.isCheckbox ? $element.find('input') : $element.find('button');
                           
                            $scope.click = $scope.click || $.noop();
                            $scope.$watchCollection('[label, text, iconPrimary, iconSecondary, appearance]', updateProperties);
                            $scope.$watch('click', updateClickHandler);
                            $scope.$watch('ngDisabled', updateDisabledState);
                            $scope.$watch('value', updateValue);

                            setTimeout(function () {
                                _$button = $scope.isCheckbox ? $element.find('input') : $element.find('button');
                                updateValue($scope.value);
                                updateProperties([$scope.label, $scope.text, $scope.iconPrimary, $scope.iconSecondary, $scope.appearance]);
                                updateClickHandler($scope.click);
                                updateDisabledState($scope.ngDisabled);
                                $scope.$apply();
                            });

                        }
                    };
                }
            };
    }]);