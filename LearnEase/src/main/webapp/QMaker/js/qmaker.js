/**
 * Created by Administrator on 2016/8/14.
 * 'ngSanitize','ui.codemirror',
 */
var app = angular.module('QMaker',['QMaker.filter', 'QMaker.services',  'QMaker.controller', 'QMaker.router', 'ui.bootstrap','ngResource','ngSanitize']);
/**
 * 在根路径上引用$state,$stateParams两个对象，方便其他地方直接引进
 */
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);



