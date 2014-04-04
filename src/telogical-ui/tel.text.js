// creative the directives as re-usable components

TelogicalUi
    .directive('telText', [

        function () {
            'use strict';

            return {
                restrict: 'E',
                replace: true,
                require: '?ngModel',
                templateUrl: '_SRS4/tel-text-partial.html',
                scope: {
                    'id': '@',

                    'value': '=?',
                    'label': '@',
                    'tooltip': '@',
                    'placeholder': '@',
                    'click': '&',
                    'ngDisabled': '=',
                    'rows': '@',

                    'iconActive': '@',
                    'iconInactive': '@',

                    'title': '@',
                    'hoverClass': '@',

                    'type': '@',
                    'maxlength': '@',
                    'ngTrim': '@',
                    'validationSettings': '@',
                    'validationStatus': '=?'
                },
                compile: function (tElement, tAttrs, tLinker) {
                    return {
                        pre: function compile() {

                        },
                        post: function link($scope, $element, $attrs, ngModel) {
                            var _$widget,
                                _$frame,
                                _id,
                                _hoverClass,
                                _$input,
                                _$label;

                            function cacheSelectors() {
                                _$widget = _$widget || $element.find('.ui-text:first');
                                _$frame = _$frame || $element.find('.ui-text-frame:first');
                                _id = _id || $scope.id || '';
                                _hoverClass = _hoverClass || $scope.hoverClass || '';
                                _$input = _$input || ($scope.multiline ?
                                    $element.find('textarea:first') :
                                    $element.find('input:first'));
                                _$label = _$label || _$widget.find('label:first');
                            }

                            function clearbox() {
                                $scope._model.value = '';
                                $scope.searchClearIcon = false;
                                setTimeout(function () {
                                    _$input
                                        .trigger('keydown.telText')
                                        .trigger('change.telText')
                                        .focus();
                                    $scope.$apply();
                                });
                            }

                            function updateValue(model) {
                                if (_$input) {
                                    $scope.value = model.value;
                                }
                            }

                            function updateModel(value, oldValue) {
                                if (value != oldValue) {
                                    $scope._model.value = value;
                                }
                            }

                            function clickHandler(handler) {
                                $element
                                    .off('click.telText')
                                    .on('click.telText', handler);
                            }

                            function showHideClearIcon() {
                                $scope.searchClearIcon = false;
                                if (_$input.val()) {
                                    $scope.searchClearIcon = true;
                                }

                                $scope.$apply();
                            }

                            function focus() {
                                if (!_$input.prop('disabled') && _hoverClass) {
                                    _$frame.addClass(_hoverClass);
                                }
                            }

                            function blur() {
                                _$frame.removeClass(_hoverClass);
                            }

                            function enableDisable(value) {
                                if (!_$input) {
                                    return;
                                }
                                $element.attr('disabled', value);
                                if (value) {
                                    _$input.prop('disabled', true);
                                    _$label.addClass('ui-state-disabled');
                                } else {
                                    _$input.prop('disabled', false);
                                    _$label.removeClass('ui-state-disabled');
                                }
                            }

                            function init() {
                                cacheSelectors();
                                if ($scope.type === 'search') {
                                    $scope.searchClearIcon = true;
                                    _$widget.on('keyup.text', showHideClearIcon);
                                }

                                _$widget
                                    .on('mouseenter.text', focus)
                                    .on('mouseleave.text', blur);

                                _$input
                                    .trigger('keyup.text');

                                $scope.$apply();
                            }


                            function focusInput() {
                                _$input.focus();
                            }

                            function updateValidation() {
                                $scope.validationStatus = !$scope.validation.invalid;
                            }

                            $scope.focusInput = focusInput;

                            $scope.rows = $scope.rows ? parseInt($scope.rows, 10) : 1;
                            $scope.multiline = ($scope.rows > 1) ? true : false;
                            $scope.click = $scope.click || $.noop();
                            $scope.value = $scope.value || '';

                            //ng-if makes a child scope
                            $scope._model = {
                                value: $scope.value
                            };
                            $scope.type = $scope.type || 'text';
                            $scope.searchClearIcon = false;
                            $scope.clearbox = clearbox;
                            $scope.validation = {};
                            $scope.validation.invalid = true;
                            $scope.validation.message = '';
                            //ng-if has child scope.
                            $scope.$watch('_model', updateValue, true);
                            $scope.$watch('value', updateModel);

                            $scope.$watch('ngDisabled', enableDisable);
                            $scope.$watch('click', clickHandler);
                            $scope.$watch('validation.invalid', updateValidation)
                            setTimeout(init);
                        }
                    };
                }
            };
        }]);