/**
 * Created by Administrator on 2016/8/30.
 * 前端路由转换器，针对前端页面的跳转
 */
angular.module('QMaker.router', ['ui.router'])
/**
 * 路由配置
 * 使用的是ui-router，可以对视图进行嵌套使用
 */
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url:'/home',
            templateUrl: './QMaker/partials/home.html'
        })
        .state('testQuestion', {
            url: '/testQuestion/:id',
            templateUrl: './QMaker/partials/programmeTest.html',
            controller: 'testQuestionCtrl'
        })
        .state('editQuestion', {
            url: '/editQuestion/:id/:type',
            templateUrl: function($stateParams) {
                if($stateParams.type == 1) {
                    return './QMaker/partials/choice.html'
                }else if($stateParams.type == 2) {
                    return './QMaker/partials/checkBox.html'
                }else if($stateParams.type == 3){
                    return './QMaker/partials/judge.html'
                }else if($stateParams.type == 4){
                    return './QMaker/partials/pack.html'
                }else if($stateParams.type == 5){
                    return './QMaker/partials/programme.html'
                }
            },
            controller: 'editQuestionCtrl'
        })
        .state('addQuestion', {
            url:'/addQuestion/:id',
            //通过id控制模板
            templateUrl: function($stateParams) {
                if($stateParams.id == 1) {
                    return './QMaker/partials/choice.html'
                }else if($stateParams.id == 2) {
                    return './QMaker/partials/checkBox.html'
                }else if($stateParams.id == 3){
                    return './QMaker/partials/judge.html'
                }else if($stateParams.id == 4){
                    return './QMaker/partials/pack.html'
                }else if($stateParams.id == 5){
                    return './QMaker/partials/programme.html'
                }
            },
            controller: 'addQuestionCtrl'
        })
        .state('questionList', {
            url: '/questionList',
            cache: false,
            params: {
                isTypeActive :null
            },
            templateUrl: './QMaker/partials/questionList.html',
            controller: 'QuestionListCtrl'
        })
        .state('questionTag', {
            url: '/questionTag',
            templateUrl: './QMaker/partials/questionTag.html',
            controller: 'QuestionTagCtrl'
        })
        .state('AssClass',{
        	url: '/AssClass',
        	templateUrl: './AssClass/html/AssClass.html'
    	})
    	.state('TotalClass',{
    		url : '/TotalClass',
    		templateUrl: './AssClass/html/total.html'
    	});
    $urlRouterProvider.otherwise('/home');
}]);


