/**
 * Created by Administrator on 2016/8/31.
 * 控制器层与数据层之间交互的枢纽，在这里可以进行多控制器之间的数据共享
 */
angular.module('QMaker.services', ['ngResource'])


.factory('dataService',['$resource', '$q', '$stateParams','$location','$state', function($resource, $q, $stateParams, $location, $state) {//$q用于同步数据服务
    return {
        //获取试题数据
       getQuestions : function() {
           var deferred = $q.defer();//声明承诺
           var Questions = $resource('/api/choice');
           Questions.query(function(questions) {
               deferred.resolve(questions);//请求成功
           });
           return deferred.promise;
       },
        //通过标签删除试题数据
       deleteQuestionsByTag: function(tagName) {
           var deferred = $q.defer();
           var questions = $resource('/api/choice/tag/' + tagName);
           questions.delete({
               tag:$stateParams.tag
           },function(q) {
               deferred.resolve(q);//请求成功
           });
           return deferred.promise;
       },
        //通过Id删除试题数据
       deleteQuestionById: function(question) {
          var QuestionsDelete = $resource('/api/choice/' + question._id);
           QuestionsDelete.delete({
               id:$stateParams.id
           },function(q){
               $state.go('questionList',{},{reload: true});
           });
       },
        findQuestionById: function(id) {
            var deferred = $q.defer();
            var Questions = $resource('/api/choice/' + id,{
                id:'@_id'
            });
            Questions.get({
                id:$stateParams.id
            },function(q){
                deferred.resolve(q);//请求成功
            });
            return deferred.promise;
        },
        //删除和修改标签后进行跳转
       goTag: function() {
           $state.go('questionTag',{},{reload: true});
       },
       //查看标签后进行跳转
       findGoTag: function(tagName) {
           $state.go('questionList',{isTypeActive : tagName });
       },
       findByTag : function(TypeItem) {
           var deferred = $q.defer();//声明承诺
           var Questions = $resource('/api/choice/tag/' + TypeItem);
           Questions.query(function(questions) {
               deferred.resolve(questions);//请求成功
           });
           return deferred.promise;
       },
       findByType : function(TypeId) {
            var deferred = $q.defer();//声明承诺
            var Questions = $resource('/api/choice/type/' + TypeId);
            Questions.query(function(questions) {
                deferred.resolve(questions);//请求成功
            });
            return deferred.promise;
       },
       findByTypeAndTag : function(tagName,TypeId) {
            var deferred = $q.defer();//声明承诺
            var Questions = $resource('/api/choice/type/' + TypeId + '/' + tagName);
            Questions.query(function(questions) {
                deferred.resolve(questions);//请求成功
            });
            return deferred.promise;
       }
    };
}]);