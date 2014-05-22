var _ = require('lodash');

angular
    .module('TelUI')
    .directive('ngValidate',['ValidationCore', function (ValidationCore) {
        'use strict';
        return {
            restrict: 'A',
            replace: true,
            scope: true,

            link: function ($scope, $element, $attrs) {
                function validate (val, types) {
                      var results = [];
                    _.each(types, function (validationType) {
                        var validTest = ValidationCore[validationType](val);
                        results.push(validTest);
                    });
                    var invalidInput = _.find(results, function(result){return result.result === false});
                    if (invalidInput){
                        $scope.validation.invalid = true;
                        $scope.validation.message = invalidInput.message;
                    } else {
                        $scope.validation.invalid = false;
                        $scope.validation.message = '';
                    }
                    $scope.$apply();
                }
                if ($attrs.ngValidate){
                    var validationSettings = JSON.parse([$attrs.ngValidate]);
                    _.each(validationSettings, function (validationSetting){
                        $element.bind(validationSetting.validationEvent, function() {
                            validate($attrs.validationValue, validationSetting.validationTypes)
                        });
                    });
                }
            }
        };
    }]);
