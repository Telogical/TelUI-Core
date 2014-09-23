// creative the directives as re-usable components

angular
    .module('TelUI')
    .directive('imageFix', [
        function () {
            'use strict';
            return {
                restrict: 'A',
                replace: true,
                scope: true,
                link: function ($scope, $element, $attrs) {

                    $scope.$elParent = $element.parent();
                    $scope.$errorLabel = $('<span class="ui-imagefix-label ui-priority-foreground ui-typography-textalign-center"></span>');

                    function replaceImageWithText() {
                        $element.hide();
                        var title = $element.attr('alt') || $element.attr('title') || 'No Image';
                        $scope.$errorLabel.text(title);
                        $scope.$errorLabel.show();
                    }

                    function restoreImage() {
                        if ($element.is(':hidden')) {
                            $scope.$errorLabel.hide();
                            $element.show();
                        }
                    }

                    setTimeout(function () {
                        $scope.$elParent.prepend($scope.$errorLabel);
                        $scope.$errorLabel.hide();
                    });

                    $element.on('error', replaceImageWithText);
                    $element.on('load', restoreImage);
                }
            };
    }]);