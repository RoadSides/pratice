/**
 * Created by Administrator on 2016/8/30.
 * 控制器端
 */
angular.module('QMaker.controller',['ui.bootstrap', 'ngResource'])

/**
 * 试题标签控制器
 */
.controller('QuestionTagCtrl', ['$scope', '$resource', '$uibModal', '$state',  '$rootScope', '$stateParams', '$location', 'dataService',  function($scope, $resource, $uibModal, $rootScope, $state, $stateParams,$location,dataService) {
    $scope.TagList = [];
    var Questions = dataService.getQuestions();
    Questions.then(function(questions) {
        questionTagInit(questions);
        $scope.questionLength = questions.length;
    });
    //数据按标签进行分类
    var questionTagInit = function(questions) {
        if(questions.length != 0){
            //获取所有标签
            for(var i = 0;i<questions.length;i++){
                if($scope.TagList.length != 0){
                    var ifNew = false;
                    for(var j = 0;j< $scope.TagList.length;j++){
                        if($scope.TagList[j].name == questions[i].tag) {
                            $scope.TagList[j].options.push(questions[i]);
                            ifNew = true;
                        }
                    }
                    if(!ifNew) {
                        var tagChild = {
                            name: questions[i].tag,
                            options: []
                        };
                        tagChild.options.push(questions[i]);
                        $scope.TagList.push(tagChild);
                        ifNew = true;
                    }
                }else{
                    var tag = {
                        name: questions[i].tag,
                        options: []
                    };
                    tag.options.push(questions[i]);
                    $scope.TagList.push(tag);
                }
            }
            $scope.Tags = $scope.TagList.length;
        }
    };
    /**
     * 修改标签
     * @param tagName
     */
    $scope.questionTagEdit = function(tagName) {
        $scope.item = tagName;
        //打开模态框
        var modalInstance = $uibModal.open({
            templateUrl: './QMaker/partials/questionTagEditModels.html',//模板内容
            controller: 'EditModalCtrl',//模板控制器
            backdrop:true,
            resolve: {
                items1: function () {
                    return $scope.item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        },function(){
        });

        //切换动画属性
        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    };

    /**
     * 标签删除操作
     * @param tagName
     */
    $scope.questionTagDelete = function(tagName) {
       var qtd = dataService.deleteQuestionsByTag(tagName);
        qtd.then(function(q) {
            dataService.goTag();
        });
    };

    /**
     * 标签查看数据
     * @param tagName
     */
    $scope.questionTagFind = function(tagName) {
        dataService.findGoTag(tagName);
    }
}])
/**
 * 修改标签模态框
  */
.controller('EditModalCtrl',['$scope', '$uibModalInstance',  'items1', '$location','$resource', 'dataService', function($scope, $uibModalInstance,items1,$location,$resource, dataService) {
    $scope.item = items1;
    //关闭模态框
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    /**
     * 修改标签
     * @constructor
     */
    $scope.TagEditSure = function() {
        //关闭模态框
        $uibModalInstance.close();
        //获取修改前后的值
        var oldTagName = items1;
        var newTagName = $scope.item;
        //更新操作
        var questionTags = $resource('/api/choice/tag/' + oldTagName, null ,{
            update: {
                method:'PUT'
            }
        });
        questionTags.query(function(questions) {
            for(var i = 0;i<questions.length;i++) {
                var question = questions[i];
                question.tag = newTagName;
                questionTags.update(question);
            }
            dataService.goTag();
        });
    }
}])

/**
 * 查询和删除操作
 */
.controller('QuestionListCtrl', ['$scope', '$resource', '$stateParams', 'dataService', function($scope, $resource, $stateParams, dataService) {
    $scope.islActive = {'id' : 0,'name' :'不限'};
    if($stateParams.isTypeActive != null) {
        $scope.isTypeActive  = $stateParams.isTypeActive;
        var QuestionFind = dataService.findByTag($stateParams.isTypeActive);
        QuestionFind.then(function(questions) {
            $scope.questions = questions;
            $scope.questionLength = $scope.questions.length;
        });
    }else{
        $scope.isTypeActive = '不限';
    }
    var Questions = dataService.getQuestions();
    Questions.then(function(questions) {
        $scope.questionTags = ['不限'];
        if($stateParams.isTypeActive == null){
            $scope.questions = questions;
            $scope.questionLength = $scope.questions.length;
        }
        for(var i = 0;i< questions.length;i++){
            if(questions[i].tag != null){
                if($scope.questionTags.indexOf(questions[i].tag) == -1 && $scope.questionTags.length != 0){
                    $scope.questionTags.push(questions[i].tag);
                }else if($scope.questionTags.length == 0){
                    $scope.questionTags.push(questions[i].tag);
                }
            }
        }
        $scope.Tags = $scope.questionTags.length - 1;
    });
    //删除操作
    $scope.deleteQuestion = function(question) {
        dataService.deleteQuestionById(question);
    };

    //通过类型id查询数据
    $scope.findOneByType = function(item) {
        $scope.islActive = item;
        var QuestionFind;
        if(item.id == 0) {
            if($scope.isTypeActive == '不限'){
                QuestionFind = dataService.getQuestions();
            }else{
                QuestionFind = dataService.findByTag($scope.isTypeActive);
            }
        }else {
            if($scope.isTypeActive == '不限') {
                QuestionFind = dataService.findByType(item.id);
            }else{
                QuestionFind = dataService.findByTypeAndTag($scope.isTypeActive, item.id);
            }
        }
        QuestionFind.then(function(questions) {
            $scope.questions = questions;
            $scope.questionLength = $scope.questions.length;
        });
    };
    /**
     * 通过标签查找数据
     * @param qt
     */
    $scope.findOneByTag = function(qt) {
        $scope.isTypeActive = qt;
        var QuestionFind;
        if(qt == '不限') {
            if($scope.islActive.id == 0){
                QuestionFind = dataService.getQuestions();
            }else{
                QuestionFind = dataService.findByType($scope.islActive.id);
            }
        }else{
            if($scope.islActive.id == 0){
                QuestionFind = dataService.findByTag(qt);
            }else{
                QuestionFind = dataService.findByTypeAndTag(qt, $scope.islActive.id);
            }
        }
        QuestionFind.then(function(questions) {
            $scope.questions = questions;
            $scope.questionLength = $scope.questions.length;
        });
    };
}])

/**
 * 编辑操作
 */
.controller('editQuestionCtrl', ['$scope', '$resource', '$stateParams','$location', function($scope, $resource, $stateParams, $location){
    var Questions = $resource('/api/choice/:id',{
        id: '@_id'
    },{
        update: {
            method: 'PUT'
        }
    });
    Questions.get({
        id: $stateParams.id
    }, function(question) {
        $scope.formData = question;
    });
    //添加选项
    $scope.addOption = function(){
        $scope.formData.options.push({name: ''})
    };
    //删除选项
    $scope.removeOption = function(index) {
        $scope.formData.options.splice(index, 1);
    };
    //更新保存操作
    $scope.saveQuestion = function() {
        Questions.update($scope.formData, function() {
            $location.path('/questionList');
        });
    }
}])
/**
 * 主控制器
 */
.controller('QMakerCtrl',['$scope', '$uibModal', function($scope, $uibModal) {
    $scope.items = [
        {'id':0,'name':'不限'},
        {'id':1,'name':'单选题'},
        {'id':2,'name':'多选题'},
        {'id':3,'name':'判断题'},
        {'id':4,'name':'填空题'},
        {'id':5,'name':'编程题'}
    ];
    $scope.open = function(size) {
        //打开模态框
        var modalInstance = $uibModal.open({
            templateUrl: './QMaker/partials/Modals.html',//模板内容
            controller: 'ModalCtrl',//模板控制器
            backdrop:true,
            size: size,
            resolve: {
                items1: function () {
                    return $scope.items;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        },function(){
        });
    };
    //切换动画属性
    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };
}])
/**
 * 添加试题控制器
 */
.controller('addQuestionCtrl',['$scope', '$stateParams', '$location', '$resource', 'dataService', function($scope, $stateParams, $location, $resource, dataService) {
    //添加试题的类型
    var questionType = $stateParams.id;
    if(questionType == 1){
        //单选题
        $scope.formData = {
            type: questionType,
            answer: 0,
            options: [{}, {}, {}, {}],
            name : '',
            tag: ''
        };
    }else if(questionType == 2) {
        //多选题
        $scope.formData = {
            type : questionType,
            options :[{name:'' ,selected : true },{name:'' ,selected : false},{name:'' ,selected : false},{name:'' ,selected : false}],
            name : '',
            tag: ''
        };
    }else if(questionType == 3){
        //判断题
        $scope.formData = {
            type:questionType,
            options:[{name : '说法正确'},{name : '说法错误'}],
            name : '',
            tag : '',
            answer : 0
        }
    }else if(questionType == 5) {
        //编程题
        $scope.formData = {
            type:questionType,
            description: '',//描述，即题干
            print: '',//输入
            output: '',//输出
            samplePrint: '',//样例输入
            sampleOutput: '',//样例输出
            cue:'',//提示
            tag:'',//标签
            answer:'' // 参考答案
        }
    }
    //添加选项
    $scope.addOption = function(){
        if(questionType == 1){
            $scope.formData.options.push({name: ''});
        }else if(questionType == 2){
            $scope.formData.options.push({name: '',selected : false});
        }
    };
    //删除选项
    $scope.removeOption = function(index) {
        $scope.formData.options.splice(index, 1);
    };
    //保存试题
    $scope.saveQuestion = function() {
    	console.log($scope.errMeassage);
        var Choice = $resource('/api/choice');
        Choice.save($scope.formData, function() {
            $location.path('/questionList');
        });
    };
}])

/**
 * 编程题测试控制器
 */
.controller('testQuestionCtrl',['$scope', '$stateParams', 'dataService', function($scope, $stateParams, dataService) {  var answer = '';
    var Question = dataService.findQuestionById($stateParams.id);
    Question.then(function(q) {
        $scope.answer = q.answer;
    });
    $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        readOnly: false,
        mode: 'javascript'
    };

}])

/**
 * 模态框控制器
 */
.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'items1', '$location',  function($scope, $uibModalInstance,items1,$location) {
    //传递到模态框的数据
    $scope.items = items1;
    //关闭模态框
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.addQuestion = function(id) {
        $uibModalInstance.close();
        var path = '/addQuestion/'+id;
        $location.path(path);
    }
}]);