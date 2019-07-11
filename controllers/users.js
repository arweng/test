angular.module('test_app', ['test_module']).controller('controller_app', function($scope,test_users){

	$scope.manageObj = test_users;		// Calls and put the function/s to the scope.

	$scope.manageObj.start($scope);		// Prepares the scope to use.

});