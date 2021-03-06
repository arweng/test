angular.module('test_module',['bootstrap-growl','bootstrap-modal']).factory('test_users', function($http,$timeout,$compile,growl,bootstrapModal){

	function test_users(){			// The main function of your controller.

		var self = this;

		self.start = function(scope) {

			scope.controls = {
				ok: {btn: false, label: 'Save'},
				cancel: {btn: false, label: 'Cancel'},
			};

			scope.userObj = {};		// Object.
			scope.userObj.id = 0;	// Object default id value.

			scope.dep_names = [];
			scope.userObjs = [];	// Collection | Array of objects.
						
			scope.btns = {
				add: false,
				cancel: {
					control: false,
					label: 'Cancel'
				}
			};

			self.list(scope);
			select(scope);
				
		};

		function validate(scope) { 	//validation
			
			var controls = scope.formHolder.userObj.$$controls;
			angular.forEach(controls,function(elem,i) {
				
				if (elem.$$attr.$attr.required) elem.$touched = elem.$invalid;					
			});
			return scope.formHolder.userObj.$invalid;
			
		};
		
		self.list = function(scope) {

			if (scope.$id>2) scope = scope.$parent;	

			$('#content').html('Loading...');			

			scope.btns.add = false;
			scope.btns.cancel.label = 'Cancel';

			$http({
				url: 'handlers/user-list.php',
				method: 'GET'					// Fetching purposes only.
			}).then(function onSuccess(res) {
				
				scope.userObjs = res.data;	// Saves fetched data to the object.
				
				$('#content').load('lists/users.html', function() {
					
					$compile($('#content')[0])(scope);

					// instantiate datable
					$timeout(function() {
						$('#users').DataTable({
							"ordering": true,
							"processing": true,
							"lengthChange": false,
							"searching": false,
							"paginate": false,
							"paging": false

						});	
					},500);					
					
				});				
				
			}, function onError(res){
				
			});	

		};		
	
		function select(scope) {

			$http({
				url: 'handlers/user-option.php',
				method: 'GET'
			}).then(function onSucc(res){
				scope.dep_names = res.data;
			}, function onErr(res){
				// Error.
			});
			
		};


		self.save = function(scope){

		if (validate(scope)){ 
				growl.show('alert alert-danger',{from: 'top', amount: 55},'Please complete required fields.');
				return;
			};

		if ((scope.userObj.firstname && scope.userObj.lastname)==null)
			{

				alert('Fields Required');
				
			} else {

				$http({
					url: 'handlers/user-save.php',
					method: 'POST',					// Posting value to the database.
					data: scope.userObj
				}).then(function onSave(res){

					self.list(scope);
					growl.show('alert alert-success',{from: 'top', amount: 55},'Success');

					scope.userObj = {};				// Reset object to empty after saving.
					scope.userObj.id = 0;			// Reset id value to 0 after saving.

									// Refreshes the list.
					
				}, function onUnsave(res){
					//error
				});

			}

		};

		self.user = function(scope,userObj) {					
			
			if (scope.$id>2) scope = scope.$parent;		// Value may go under parent, use to call value inside the parent.

			scope.btns.add = true;

			if(userObj == null) {			// When empty, set the object and id to empty.

				scope.userObj = {};
				scope.userObj.id = 0;
				
				scope.btns.cancel.label = 'Cancel';			
				
			} else {
				
				scope.btns.cancel.label = 'Close';

				$http({
					url: 'handlers/user-edit.php',
					method: 'POST',
					data: {id: userObj.id}
				}).then(function success(res) {

					scope.userObj = res.data;

				}, function error(res) {
					
				});
				
			}

			$('#content').html('Loading...');
			
			$('#content').load('forms/user.html', function() {
				
				$compile($('#content')[0])(scope);				
				
			});			
			
		};

		self.delete = function(scope,userObj){

			var onOk = function () {
				
				if (scope.$id>2) scope = scope.$parent;
				
				$http({
					url: 'handlers/user-delete.php',
					method: 'POST',
					data: {id: [userObj.id]}		// Delete always read the value in array form.
				}).then(function onDelete(res){
					
					growl.show('alert alert-success',{from: 'top', amount: 55},'Success deleted');
					self.list(scope);
					
				}, function onError(res){
					
				});
				
			};
			
			bootstrapModal.confirm(scope,'Confirmation','Are you sure you want to delete this record?',onOk,function() {});
			
		};
	};

	return new test_users();		// Returns new value of a class.
});