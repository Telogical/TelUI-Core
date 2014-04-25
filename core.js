//This is a fake file cause stupid.
require('jquery');
require('jquery-ui');
require('angular');

try{
	angular.module('TelUI');
}
catch(err){
	angular.module('TelUI', []);
}
