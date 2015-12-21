'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'ContactsCtrl'
  });
}])

// Contacts Controller
.controller('ContactsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
	// Init Firebase
	var ref = new Firebase('https://cntx.firebaseio.com/contacts');
	
	// Get Contacts
	$scope.contacts = $firebaseArray(ref);


	// Show Add Form
	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	}
	
	//show edit form
	$scope.showEditForm = function (contact){
		$scope.editFormShow = true;

		$scope.id 				= contact.$id;
		$scope.name 			= contact.name;
		$scope.email 			= contact.email;
		$scope.company 			= contact.company;
		$scope.work_phone 		= contact.phones[0].work;
		$scope.home_phone 		= contact.phones[0].home;
		$scope.mobile_phone 	= contact.phones[0].mobile;
		$scope.street_address 	= contact.address[0].street_address;
		$scope.city 			= contact.address[0].city;
		$scope.state 			= contact.address[0].state;
		$scope.zipcode 			= contact.address[0].zipcode;
	}
	
	// Hide Add Form
	$scope.hide = function(){
		$scope.addFormShow = false;
		$scope.contactShow = false;
	}

	// Submit Contact
	$scope.addFormSubmit = function(){
		console.log('Adding Contact...');

		// Assign Values
		if($scope.name){ var name = $scope.name } else { var name = null; }
		if($scope.email){ var email = $scope.email; } else { var email = null; }
		if($scope.company){ var company = $scope.company; } else { var company = null; }
		if($scope.mobile_phone){ var mobile_phone = $scope.mobile_phone; } else { var mobile_phone = null; }
		if($scope.home_phone){ var home_phone = $scope.home_phone; } else { var home_phone = null; }
		if($scope.work_phone){ var work_phone = $scope.work_phone; } else { var work_phone = null; }
		if($scope.street_address){ var street_address = $scope.street_address; } else { var street_address = null; }
		if($scope.city){ var city = $scope.city; } else { var city = null; }
		if($scope.state){ var state = $scope.state; } else { var state = null; }
		if($scope.zipcode){ var zipcode = $scope.zipcode; } else { var zipcode = null; }

		// Build Object
		$scope.contacts.$add({
			name: name,
			email: email,
			company: company,
			phones:[
				{
					mobile: mobile_phone,
					home: home_phone,
					work: work_phone
				}
			],
			address: [
				{
					street_address: street_address,
					city: city,
					state: state,
					zipcode: zipcode
				}
			]
		}).then(function(ref){
			var id = ref.key();
			
			// Clear Form
			clearFields();

			// Hide Form
			$scope.addFormShow = false;

			// Send Message
			$scope.msg = "Contact Added";
		});
	}

	$scope.editFormSubmit = function(){
		console.log("editing contact...")
		
		//get id
		var id = $scope.id;
		
		//get record
		var record = $scope.contacts.$getRecord(id);
		
		//Assign Values
		record.name 						= $scope.name;
		record.email 						= $scope.email;
		record.company 						= $scope.company || null;
		record.phones[0].work 				= $scope.work_phone || null;
		record.phones[0].home 				= $scope.home_phone || null;
		record.phones[0].mobile 			= $scope.mobile_phone || null;
		record.address[0].street_address 	= $scope.street_address || null;
		record.address[0].city 				= $scope.city || null;
		record.address[0].state 			= $scope.state || null;
		record.address[0].zipcode 			= $scope.zipcode || null;

		//save contact
		$scope.contacts.$save(record).then(function(ref) {
			console.log(ref.key);
		});

		clearFields();
		

		//Hide Form
		$scope.editFormShow = false;

		$scope.msg = "Contact updated";
	}

	$scope.showContact = function(contact) {
		console.log("getting contact....");

		$scope.name = contact.name;
		$scope.email = contact.email;
		$scope.company = contact.company;
		$scope.work_phone =   contact.phones[0].work;
		$scope.home_phone =   contact.phones[0].home;
		$scope.mobile_phone = contact.phones[0].mobile;
		$scope.street_address = contact.address[0].street_address;
		$scope.city = contact.address[0].city;
		$scope.state = contact.address[0].state;
		$scope.zipcode = contact.address[0].zipcode;
		
		$scope.contactShow = true;
	}

	$scope.removeContact = function(contact){
		console.log("removing contact");

		$scope.contacts.$remove(contact);

		$scope.msg = "contact removed";
	}

	// Clear $scope fields
		function clearFields(){
			$scope.name + "";
			$scope.email + "";
			$scope.company + "";
			$scope.mobile_phone + "";
			$scope.work_phone + "";
			$scope.home_phone + "";
			$scope.street_address + "";
			$scope.apt_num + "";
			$scope.city + "";
			$scope.state + "";
			$scope.zipcode + "";
		}
}]);