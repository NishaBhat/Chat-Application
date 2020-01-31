(function() {
  'use strict';

  angular
    .module('app')
    .controller('JoinCtrl', JoinCtrl);

  JoinCtrl.$inject = ['$location', '$scope', '$localStorage', 'socket'];

  function JoinCtrl($location, $scope, $localStorage, socket) {
  	let nickname;

  	$scope.join = function()
  	{
  		$localStorage.nickname = nickname = $scope.name;
  		socket.emit('join',{
  			nickname : nickname
  		});
  		$location.path("/main");
  	}
  }
})();