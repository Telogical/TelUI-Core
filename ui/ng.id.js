// creative the directives as re-usable components

angular
    .module('TelUI')
    .directive('ngId', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        //scope: true,
        link: function ($scope, $element, $attrs) {
            if (!$attrs.id) {
                $attrs.id = $scope.ngId + (Math.floor(Math.random() * 9999)).toString();
                $element.attr('id', $attrs.id);
            }
            $scope.id = ($attrs.id).toLowerCase();
        }
    };
});
