myapp.controller('IndexNavbarController',function($window,$scope,$state,landingPageSRV){

    // validate backend session
    landingPageSRV.validateSession(JSON.parse($window.localStorage['userAccount'])).success(function(data) {
      console.log('innnnnn');
      if(data!="okk")
      $scope.logout();
      toastr.success(data);
    });


  $scope.logout = function(){
    landingPageSRV.logout().success(function(data){
       $window.localStorage.clear();
       $state.go("home");
    })
  }

  $scope.isLoggedIn = function() {
    return !($window.localStorage['userAccount']==undefined);
  }

  $scope.signupStatechange = function(){
    $state.go("signupLocal");
    }

    $scope.myFasa7ny = function(index){
      let type=JSON.parse($window.localStorage['userAccount']).type;
      switch (index) {
        case 0: switch (type) {
          case 0:$state.go('userPage'); break;
          case 1:$state.go('spPage'); break;
          case 3:$state.go('admin'); break;
          default:  console.log('myProfile with wrong account type : '+type);return;
        } break;
        default: console.log('myFasa7ny with wrong index : '+index);return;

      }
      }
});