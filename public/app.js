var myapp= angular.module("myapp", ['ui.router','geolocation','yaru22.angular-timeago','angular-flexslider','star-rating']);

myapp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
  $stateProvider.state({
    name:'activities',
    url:'/activities/:searchInput/:day/',
    templateUrl:'views/activities.view.html',
    controller:'ActivitiesController'
  });



  $stateProvider.state({
    name:'activity',
    url:'/activity/:activityID',
    templateUrl:'views/activity.view.html',
    controller:'ActivityController'
  });

  $stateProvider.state({
    name:'aboutUs',
    url:'/aboutUs',
    templateUrl:'views/aboutUs.view.html'
  });

  $stateProvider.state({
    name:'home',
    url:'/',
    templateUrl:'views/home.view.html',
    controller:'HomeController'
  });

  $stateProvider.state({
    name:'buttons',
    url:'/buttons',
    templateUrl:'views/buttons.view.html',
    controller:'buttonsController'
  });

  $stateProvider.state({
    name:'analysis',
    url:'/adminAnalysis',
    templateUrl:'views/analysis.view.html',
    controller:'analysisController'
  });

    $stateProvider.state({
    name:'filteredActivities',
    url:'/filteredActivities/:filter/:value/',
    templateUrl:'views/activities.view.html',
    controller:'ActivitiesController'
  });

  $urlRouterProvider.when('','/');



}]);

// myapp.config(function($routeProvider) {
//   $routeProvider
//   // route for the landingPage page
//     .when('/', {
//     templateUrl: 'index.html'
//
//   })
// })


// myapp.controller("SliderController", function($scope) {
//
// });
