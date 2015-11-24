var app = angular.module('gameApp', ['firebase','angularModalService', 'ngAnimate']);

app.controller('gamelistCtrl', ['$scope', 'ModalService','$firebaseArray', function($scope, ModalService, $firebaseArray ) {

    $scope.complexResult = null;
    var mycontact;

    var myFirebaseRef;
    var DB_PATH = "https://choicothuong.firebaseio.com/game";
    function initDBconnection() {
        myFirebaseRef = new Firebase(DB_PATH);
    }

    function getallGames() {
        initDBconnection();

        $scope.games = $firebaseArray(myFirebaseRef);
    }


    showGameForm = function(game) {
        var returnObj;
        mygame = game;
        ModalService.showModal({
            templateUrl: "form/frm_game.html",
            controller: "gameformCtrl",
            inputs: {
                title: "Game",
                game:game
            }
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(returnObj) {
		    if(returnObj !== null) {
	                if(mygame == null) {
        	            $scope.games.$add(returnObj);
        	        } else {
                	    mygame.name = returnObj.name;
                        mygame.imageurl = returnObj.imageurl;
                        mygame.prize = returnObj.prize;
                	    $scope.games.$save(mygame);
	                }
		        }
            });
        });

    };

    $scope.addContact = function() {
        showGameForm();
    }

    $scope.editContact = function(game) {
        showGameForm(game);
    }

    $scope.removeContact = function(contact) {
        $scope.games.$remove(contact);
    }


    //start
    getallGames();
}]);