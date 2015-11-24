var app = angular.module('gameApp');

app.controller('gameformCtrl', ['$scope', '$element', 'title', 'game','close',
  function($scope, $element, title, game, close) {

    $scope.name = null;
    $scope.age = null;
    $scope.title = title;
    $scope.game = game;


  //  This close function doesn't need to use jQuery or bootstrap, because
  //  the button has the 'data-dismiss' attribute.
  $scope.close = function() {
        //var resultObj = copyContactObj($scope.contact);
        var prize = $scope.game.prize;
        prize = accounting.formatMoney(prize, "", 0, ",", ".");
 	    close({
          name:$scope.game.name,
          image_url:$scope.game.image_url,
          prize_number:$scope.game.prize,
          prize_str:prize,
          source_url:$scope.game.source_url
        }, 500); // close, but give 500ms for bootstrap to animate
  };

  //  This cancel function must use the bootstrap, 'modal' function because
  //  the doesn't have the 'data-dismiss' attribute.
  $scope.cancel = function() {

    //  Manually hide the modal.
    $element.modal('hide');
    //  Now call close, returning control to the caller.
    close(null, 500); // close, but give 500ms for bootstrap to animate
  };

}]);