(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$localStorage', 'socket', 'lodash'];

  function MainCtrl($scope, $localStorage, socket, lodash) {
  	$scope.messages = [];
  	$scope.likes = [];
  	$scope.mynickname = $localStorage.nickname;
  	socket.emit('get-users');
  	socket.on('all-users',function(data){
  		$scope.users = data.filter( e => e.nickname != $scope.mynickname)
  	});
  	socket.on('update-chat',function(data){
  		$scope.messages.push(data);
  	});
  	socket.on('recieve-like',function(data){
  		$scope.likes.push(data.from);
  	});
  	$scope.sendMessage = function()
  	{
  		let msgObj = {
  			'from': $scope.mynickname,
  			'message':$scope.message};
  		socket.emit('message-recieved',msgObj);
  		
  		$scope.message = '';
  	}
  	$scope.sendLike = function(toUser)
  	{
  		let obj = {
  			to : toUser.socketid,
  			from : $scope.mynickname
  		}
  		socket.emit('send-like',obj);
  	}
  };
})();