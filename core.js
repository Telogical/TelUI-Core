//This is a fake file cause stupid.
require('jquery');
require('angular');

try{
	angular.module('TelUI');
}
catch(err){
	angular.module('TelUI', []);
}
