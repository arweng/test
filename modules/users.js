angular.module('test_module',[]).factory('test_users', function($http,$timeout){

	function test_users(){			// The main function of your controller.

		var self = this;

		self.start = function(scope){

			scope.userObj = {};		// Object.
			scope.userObj.id = 0;	// Object default id value.

			scope.dep_names = [];
			scope.userObjs = [];	// Collection | Array of objects.
			self.list(scope);
			self.select(scope);
		}

		self.list = function(scope){

			$http({
				url: 'handlers/user-list.php',
				method: 'GET'					// Fetching purposes only.
			}).then(function onSuccess(res){
				scope.userObjs = res.data;		// Saves fetched data to the object.
			}, function onError(res){
				
			});

		}

		self.select = function(scope){

			$http({
				url: 'handlers/user-option.php',
				method: 'GET'
			}).then(function onSucc(res){
				scope.dep_names = res.data;
			}, function onErr(res){
				// Error.
			});
		}

		self.save = function(scope){

		if ((scope.userObj.firstname && scope.userObj.lastname)==null)
			{


				alert('Fields Required');
				
			} else {

				$http({
					url: 'handlers/user-save.php',
					method: 'POST',					// Posting value to the database.
					data: scope.userObj
				}).then(function onSave(res){

					alert('Saved');

					scope.userObj = {};				// Reset object to empty after saving.
					scope.userObj.id = 0;			// Reset id value to 0 after saving.

					self.list(scope);				// Refreshes the list.
					
				}, function onUnsave(res){
					//error
				});

			}

		}

		self.edit = function(scope,userObj){

			if (scope.$id>2) scope = scope.$parent;		// Value may go under parent, use to call value inside the parent.

			if(userObj == null){				// When empty, set the object and id to empty.

				scope.userObj = {};
				scope.userObj.id = 0;
			} else {

				$http({
					url: 'handlers/user-edit.php',
					method: 'POST',
					data: {id: userObj.id}
				}).then(function onEdit(res){
					scope.userObj = res.data;
				}, function onUnedit(res){
					
				})
			}
		}

		self.delete = function(scope,userObj){

			if (scope.$id>2) scope = scope.$parent;


			$http({
				url: 'handlers/user-delete.php',
				method: 'POST',
				data: {id: [userObj.id]}		// Delete always read the value in array form.
			}).then(function onDelete(res){

				self.list(scope);

			}, function onError(res){

			});
		}
	}

	return new test_users();		// Returns new value of a class.
});