angular.module("socially").controller("PartiesListCtrl", ['$scope', '$meteor', '$rootScope', '$state',
  function($scope, $meteor, $rootScope, $state){

    $scope.page = 1;
    $scope.perPage = 3;
    $scope.sort = { name: 1 };
    $scope.orderProperty = '1';

    $scope.users = $meteor.collection(Meteor.users, false).subscribe('users');
    
    $scope.parties = $meteor.collection(function() {
      return Parties.find({}, {
        sort : $scope.getReactively('sort')
      });
    });

    $meteor.autorun($scope, function() {
      $meteor.subscribe('parties', {
        limit: parseInt($scope.getReactively('perPage')),
        skip: (parseInt($scope.getReactively('page')) - 1) * parseInt($scope.getReactively('perPage')),
        sort: $scope.getReactively('sort')
      }, $scope.getReactively('search')).then(function() {
        $scope.partiesCount = $meteor.object(Counts ,'numberOfParties', false);

        $scope.parties.forEach( function (party) {
          party.onClicked = function () {
            $state.go('partyDetails', {partyId: party._id});
          };
        });
      });
    });

    $scope.remove = function(party){
      $scope.parties.splice( $scope.parties.indexOf(party), 1 );
    };

    ///////////////////////////SCAN//////////////////
    console.log('this is scan controller');
    $scope.submit = function(){
      console.log('this is submit');
    };
    $scope.placeholderMessage = "Waiting...";
    var pressed = false;
    var chars = [];
    $(window).keypress(function(e) {
      if (e.which >= 48 && e.which <= 57) {
        chars.push(String.fromCharCode(e.which));
      }
      //console.log(e.which + ":" + chars.join("|"));
      if (pressed == false) {
        setTimeout(function(){
          // check we have a long length e.g. it is a barcode
          if (chars.length >= 10) {
            var barcode = chars.join("");
            console.log("Barcode Scanned: " + barcode);
            $("#barcode").val(barcode);
          }
            console.log("Barcode Scanned: " + $scope.scanCode);
          chars = [];
          pressed = false;
        },500);
      }
      pressed = true;
    });
    //////////////////////////////
}]);