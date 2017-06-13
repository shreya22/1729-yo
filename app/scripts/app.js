'use strict';

/**
 * @ngdoc overview
 * @name 1729App
 * @description
 * # 1729App
 *
 * Main module of the application.
 */
angular
  .module('1729App', [
    // 'ngAnimate',
    // 'ngCookies',
    // 'ngResource',
    'ngRoute',
    'toastr',
    // 'ngSanitize',
    // 'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl as main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
