var app = angular.module('mainApp', ['firebase','angularModalService', 'ngAnimate']);

app.controller('gameCtrl', ['$scope', 'ModalService','$firebaseArray', function($scope, ModalService, $firebaseArray ) {

    $scope.complexResult = null;
    var mycontact;

    var myFirebaseRef;
    var DB_PATH = "https://choicothuong.firebaseio.com/game";
    //fetch all games
    function initDBconnection() {
        myFirebaseRef = new Firebase(DB_PATH);
    }

    function getallGames() {
        initDBconnection();
        var games = $firebaseArray(myFirebaseRef);

        $scope.games = games;
    }

    $scope.openGame = function(game){
        var mydiv = document.getElementById("gamecontent");
        mydiv.innerHTML = "<iframe width='100%' height='100%' src = '/eggnpot/index.html'></iframe>"
    }

    //start
    getallGames();
}]);
