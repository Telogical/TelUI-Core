// creative the directives as re-usable components

TelogicalUi
    .directive('telCheckbox', ['$compile',
        function ($compile) {
            'use strict';
            return {
                restrict: 'E',
                replace: true,
                require: '?ngModel',
                templateUrl: '_SRS4/tel-checkbox-partial.html',
                scope: {
                    'id': '@',
                    'value': '=?',
                    'label': '@',
                    'text': '@',

                    'click': '&',
                    'ngDisabled': '=',

                    'iconActive': '@',
                    'iconInactive': '@',
                    'hoverbutton': '@',
                    'hoverbuttonClick': '&?',
                    'hoverbuttonIcon': '@',
                    'hoverbuttonLabel': '@',

                    'title': '@',
                    'hoverClass': '@'
                },
                compile: function (tElement, tAttrs, tLinker) {
                    return {
                        pre: function compile() {

                        },
                        post: function link($scope, $element, $attrs, ngModel) {

                            var _$widget = $element.find('.ui-checkbox:first'),
                                _$frame = _$widget.find('.ui-checkbox-frame:first'),
                                _iconActiveDefault = 'ui-icon-check',
                                _iconInactiveDefault = 'ui-icon-blank',
                                _id = $scope.id || '',
                                _$input = _$widget.find('input:first'),
                                _$label = _$widget.find('label:first'),
                                _$currentStateIcon = _$widget.find('.ui-checkbox-display'),
                                _hoverClass = $scope.hoverClass || 'ui-state-hover',
                                _$hoverButton = $('');

                            $scope.hoverbuttonClick = $scope.hoverbuttonClick || $.noop();
                            $scope.click = $scope.click || $.noop();
                            $scope.value = $scope.value || false;

                            _$widget
                                .on('mouseenter', function () {

                                    if (!_$input.prop('disabled')) {
                                        _$frame.addClass(_hoverClass);
                                        _$hoverButton.show('fade', 250);
                                    }
                                })
                                .on('mouseleave', function () {
                                    _$frame.removeClass(_hoverClass);
                                    _$hoverButton.hide('fade', 250);
                                });

                            _$currentStateIcon.on('click', function () {
                                _$input.click();
                            });

                            function updateValue(value) {
                                setCheckIcon();
                            }

                            function labelTextIconMutate(values) {
                                var _label = values[0] || '',
                                    _iconActive = values[2] || _iconActiveDefault,
                                    _iconInactive = values[3] || _iconInactiveDefault,
                                    _text = (values[1] === 'false') ? false : true;

                                $scope.iconActive = _iconActive;
                                $scope.iconInactive = _iconInactive;
                                $scope.label = _label;

                                if (_text === false) {
                                    _$label.addClass('ui-helper-hidden');
                                }
                            }

                            function clickHandler(handler) {
                                $element
                                    .off('click.telCheckbox')
                                    .on('click.telCheckbox', handler);
                            }

                            function enableDisable(value) {
                                $element.attr('disabled', value);
                                if (value) {
                                    _$input.prop('disabled', true);
                                    _$hoverButton.prop('disabled', true);
                                    _$currentStateIcon.addClass('ui-state-disabled');
                                    _$label.addClass('ui-state-disabled');
                                } else {
                                    _$input.prop('disabled', false);
                                    _$hoverButton.prop('disabled', false);
                                    _$currentStateIcon.removeClass('ui-state-disabled');
                                    _$label.removeClass('ui-state-disabled');
                                }
                            }

                            function setCheckIcon() {
                                if ($scope.value) {
                                    _$currentStateIcon
                                        .addClass($scope.iconActive)
                                        .removeClass($scope.iconInactive);
                                } else {
                                    _$currentStateIcon
                                        .addClass($scope.iconInactive)
                                        .removeClass($scope.iconActive);
                                }
                            }

                            setTimeout(function () {
                                _$hoverButton = _$frame.find('.ui-checkbox-hoverbutton');
                                _$hoverButton.hide();
                                $scope.$apply();
                                setCheckIcon();
                            });

                            $scope.$watch('value', updateValue);
                            $scope.$watch('ngDisabled', enableDisable);
                            $scope.$watch('click', clickHandler);
                            $scope.$watchCollection('[label, text, iconActive, iconInactive]', labelTextIconMutate);
                        }
                    };
                }
            };
}]);