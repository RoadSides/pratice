/**
 * Created by Administrator on 2016/8/30.
 * 过滤器
 */

angular.module('QMaker.filter',[])

/**
 * 过滤器，控制选项为大写字母
 */
.filter('optionStr', function(){
    return function(index){
        return String.fromCharCode(index + 65);
    }
})

/**
 * 过滤器，控制题目的类型
 */
.filter('typeStr', function() {
    return function(index){
        if(index == 1) {
            return "单选题";
        }else if(index == 2) {
            return "多选题";
        }else if(index == 3) {
            return "判断题";
        }else if(index == 4){
            return "填空题"
        }else if(index == 5) {
            return "编程题"
        }
    }
})

/**
 * 过滤器，控制多选答案的显示
 */
.filter('selectedStr', function() {
    return function(options){
        var str = '';
        for(var i = 0;i<options.length;i++){
            if(options[i].selected){
                str += String.fromCharCode(i + 65);
            }
        }
        return str;
    }
})


.filter('nl2br', function() {
    var span = document.createElement('span');
    return function(input) {
        if (!input) return input;
        var lines = input.split('\n');

        for (var i = 0; i < lines.length; i++) {
            span.innerText = lines[i];
            span.textContent = lines[i];  //for Firefox
            lines[i] = span.innerHTML;
        }
        return lines.join('<br />');
    }
});
