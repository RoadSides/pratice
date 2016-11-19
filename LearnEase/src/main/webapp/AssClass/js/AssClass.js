/**
 * Created by Administrator on 2016/7/29.
 */
var coursePlanList = new Array();
var courseDataList = new Array();
var totalDataList = new totalData(0,"小计");

function getAssClass() {
	$.get("../LearnEase/AssClass/html/AssClass.html",function(data) {
		$('#content').html(data);	
	});
}


/**
 * 添加一级课程
 */
function add(name,id,pId) {
    var cpt = new coursePlanTable(name,id);
    //进行一个判断，id小的在前，id大的在后，即按id的大小排序
    sortData(coursePlanList,cpt,id);
    var cptData = new coursePlanData(id,pId);
    sortData(courseDataList,cptData,id);
    cpt.setCoursePlanId(id);
    //第二个表格的相关操作
    createTotalData(pId);
    //添加一级课程
    var str = cpt.emitHTML();
    //删除后再添加
    $("#tables tr[class*=default]").remove();
    //重新加
    for(var i = 0;i<coursePlanList.length;i++) {
        var cpt = coursePlanList[i];
        if(cpt != undefined){
            var str;
            if(coursePlanList.length != 0) {
                str = cpt.emitHTML();
                $('#tables').append(str);
            }
        }
    }
    dictionTable();
}

/**
 * 创建表格数据信息
 * @param pId
 */
function createTotalData(pId){
    //获取信息
    var pName = "";
    var td = {};
    var IdStr = [];
    $.ajax({
        type: "GET",
        url: "../LearnEase/data/totalData.json",
        dateType: "json",
        cache: false,
        async: false,
        success: function (result) {
           for(var i = 0;i<result.data.length;i++){
                if(result.data[i].id == pId){
                    pName = result.data[i].name;
                }
           }
        }
    });
    /**
     * 创建第二个表格数据域，若创建了，不用创建
     * @type {totalData}
     */
     if(totalDataList.childList.length == 0){
         td = new totalData(pId,pName);
         sortData(totalDataList.childList,td,pId);
     }else{
         for(var i = 0;i<totalDataList.childList.length;i++){
             IdStr.push(totalDataList.childList[i].id);
         }
         if($.inArray(pId,IdStr) == -1){
             td = new totalData(pId,pName);
             sortData(totalDataList.childList,td,pId);
         }
     }
}

/**
 * 每次修改值就修改表格的数据
 */
function getTotalData() {
    //初始化
    for(var i = 0;i<totalDataList.childList.length;i++){
        totalDataList.childList[i].initList();
    }
    //获取数据
    for(var i = 0;i<courseDataList.length;i++){
        var td = createChildData(courseDataList[i]);//更新数据
        var tdId = parseInt(courseDataList[i].parentId);//父id
        for(var j = 0;j<totalDataList.childList.length;j++){
            if(totalDataList.childList[j].id == tdId){
                sortData(totalDataList.childList[j].childList,td,td.id);
            }
        }
    }
   //相关数据的操作
    totalDataList.init();
    totalDataList.proportion = 100;
    for(var i = 0;i<totalDataList.childList.length;i++){
        var oneChild = totalDataList.childList[i];
        oneChild.init();
        setTotalData(oneChild);
    }
    setTotalData(totalDataList);
    //计算百分比
    for(var i = 0;i<totalDataList.childList.length;i++) {
        var oneChild = totalDataList.childList[i];
        for(var j = 0;j < oneChild.childList.length;j++) {
            //格式化占比为小数点后两位
            var sumData = ((parseFloat(oneChild.childList[j].credit / totalDataList.credit)*100).toFixed(2));
            if(isNaN(sumData)){
                oneChild.childList[j].proportion = 0;
            }else{
                oneChild.childList[j].proportion = sumData;
            }
        }
    }
    drawTotalTable();
}

/**
 * 设置数据域的子域
 * @param oneChild
 */
function setTotalData(oneChild){
    for(var j = 0;j<oneChild.childList.length;j++){
        var twoChild = oneChild.childList[j];
        oneChild.credit += parseInt(twoChild.credit);
        //oneChild.totalUnit += parseInt(twoChild.totalUnit);
        //oneChild.practiveUnit += parseInt(twoChild.practiveUnit);
        //oneChild.theroyUnit += parseInt(twoChild.theroyUnit);
        oneChild.totalUnit = DataParse(twoChild.totalUnit,oneChild.totalUnit);
        oneChild.practiveUnit = DataParse(twoChild.practiveUnit,oneChild.practiveUnit);
        oneChild.theroyUnit = DataParse(twoChild.theroyUnit,oneChild.theroyUnit);
        oneChild.unitTerm1 += parseInt(twoChild.unitTerm1);
        oneChild.unitTerm2 += parseInt(twoChild.unitTerm2);
        oneChild.unitTerm3 += parseInt(twoChild.unitTerm3);
        oneChild.unitTerm4 += parseInt(twoChild.unitTerm4);
        oneChild.unitTerm5 += parseInt(twoChild.unitTerm5);
        oneChild.unitTerm6 += parseInt(twoChild.unitTerm6);
        oneChild.unitTerm7 += parseInt(twoChild.unitTerm7);
        oneChild.unitTerm8 += parseInt(twoChild.unitTerm8);
    }
}
/**
 * 创建数据域的子域
 * @param cdl
 * @returns {totalData}
 */
function createChildData(cdl) {
    var td = new totalData(cdl.id,"");
    td.credit = cdl.oneTotalCredit;
    td.totalUnit = cdl.oneTotalUnit;
    td.practiveUnit = cdl.oneTotalPractiveUnit;
    td.theroyUnit = cdl.oneTotalTheroyUnit;
    td.unitTerm1 = cdl.oneTotalUnitTerm1;
    td.unitTerm2 = cdl.oneTotalUnitTerm2;
    td.unitTerm3 = cdl.oneTotalUnitTerm3;
    td.unitTerm4 = cdl.oneTotalUnitTerm4;
    td.unitTerm5 = cdl.oneTotalUnitTerm5;
    td.unitTerm6 = cdl.oneTotalUnitTerm6;
    td.unitTerm7 = cdl.oneTotalUnitTerm7;
    td.unitTerm8 = cdl.oneTotalUnitTerm8;
    return td;
}

/**
 * 渲染表格，即在修改数据后渲染
 */
function drawTotalTable() {
    $('#tableTotal tr[class=default]').remove();
    for(var i = 0;i <totalDataList.childList.length;i++){
        var pb = totalDataList.childList[i];
        setData(pb);
    }
    
    var str = '<tr class="default"><td colspan="3">小计</td><td>'+totalDataList.credit+'</td><td>'+totalDataList.proportion+'</td><td>'
        +totalDataList.totalUnit+'</td><td>'+totalDataList.practiveUnit+'</td><td>'+totalDataList.theroyUnit+'</td><td>'+totalDataList.unitTerm1+'</td><td>'
        +totalDataList.unitTerm2+'</td><td>'+totalDataList.unitTerm3+'</td><td>'+totalDataList.unitTerm4+'</td><td>'+totalDataList.unitTerm5+'</td><td>'
        +totalDataList.unitTerm6+'</td><td>'+totalDataList.unitTerm7+'</td><td>'+totalDataList.unitTerm8+'</td><td>'+totalDataList.demo+'</td></tr>';
    $('#tableTotal').append(str);
}

/**
 * 设置渲染的内容
 * @param pb
 */
function setData(pb){
    var length = pb.childList.length;
    for(var i = 0;i <length;i++){
        var childName = "";
        var d = pb.childList[i];
        if(d.id/pb.id != 1){
            childName = "选修";
        }else{
            childName = "必修";
        }
        var str = "";
        var childStr= "";
        if(i == 0) {
            str = '<tr class="default"><td rowspan="' + pb.childList.length + '">' + pb.id + '</td><th rowspan="' + pb.childList.length + '">' + pb.name + '</th>';
        }else{
            str = '<tr class="default">';
        }
        childStr = '<td>'+ childName +'</td><td>'+d.credit+'</td><td>'+d.proportion+'</td><td>'+d.totalUnit+'</td><td>'
            +d.practiveUnit+'</td><td>'+d.theroyUnit+'</td><td>'+d.unitTerm1+'</td><td>'+d.unitTerm2+'</td><td>'
            +d.unitTerm3+'</td><td>'+d.unitTerm4+'</td><td>'+d.unitTerm5+'</td><td>'+d.unitTerm6+'</td><td>'
            +d.unitTerm7+'</td><td>'+d.unitTerm8+'</td><td>'+d.demo+'</td>';
        str += childStr + '</tr>';
        $('#tableTotal').append(str);
    }
}

/**
 * 对每一级课程都按id排序，方便进行数据的删除和重新添加
 * @param c
 * @param cpt
 * @param id
 */
function sortData(c,cpt,id){
    //测试
    if(c.length == 0){
        c.push(cpt);
    }else{
        var length = c.length;
        if(length == 1){
            if(c[0].id < id){
                c.push(cpt);
            }else{
                c.unshift(cpt);//添加到第一位置
            }
        }else if(length > 1){
            var ifInsert = false;
            for(var i = 0,j = 1;j <= length-1;i++,j++){
                if(c[i].id > id){//添加到第一的位置
                    c.unshift(cpt);
                    ifInsert = true;
                    return;
                }else if(c[i].id < id && c[j].id > id){
                    c.insert(i+1,cpt);
                    ifInsert = true;
                    return;
                }
            }
            if(!ifInsert){
                //没添加进去，则添加到最后
                c.push(cpt);
            }
        }
    }
}

/**
 * 加载一级模态框
 */
function loadAddModal() {
    $('#selectProModal').modal();
    $('#selectProContent').empty();
    //添加一级课程类型数据
    $.ajax({
        type: "GET",
        url:"../LearnEase/data/pro_Property.json",
        dateType: "json",
        success: function (result) {
            var data = result.property;
            for(var i = 0;i <data.length;i++){
                $('#selectProContent').append('<option value="'+data[i].id+'">' + data[i].name + '</option>');
            }
            $('#selectProContent').editableSelect({
                appendTo: '#pro_modal_body'
            });
        }
    });
}

/**
 * 使用正则格式化数据
 * @param childData 要添加进字符串的数据
 * @param parentData 原数据
 * @returns {*} 返回格式化好的数据
 * @constructor
 */
function DataParse(childData,parentData){
    var Regx = /^[0-9]*$/;
    if(childData == 0){
        return parentData;
    }
    if(Regx.test(childData)){
        //childData为纯数字
        if(Regx.test(parentData)){
            //parentData为纯数字
            parentData = parseInt(parentData) + parseInt(childData);
        }else{
            if(parentData.indexOf("+") != -1){
                //parentData含有其他文字，不是纯数字
                var test2s = parentData.split('+');
                parentData = parseInt(test2s[0]) + parseInt(childData) + "+" + test2s[1];
            }else{
                parentData = childData + "+" + parentData;
            }
        }
    }else{
        if(Regx.test(parentData)){
            //childData不是纯数字，包含其他文字
            if(parentData == 0) {
                parentData = childData;
            }else{
                parentData = parentData + "+" + childData;
            }
        }else{
            if(parentData.indexOf("+") != -1){
                var test2s = parentData.split('+');
                parentData = test2s[0] + "+" + (parseInt(test2s[1]) + parseInt(childData)) + "周";
            }else{
                parentData = (parseInt(parentData)+parseInt(childData)) + "周";
            }
        }
    }
    return parentData;
}
/**
 * 确认一级课程
 */
function loadedAdd(){
    $('#selectProModal').modal('hide');
    var selectName = $('#selectProContent').val();
    var selectNum = 0 ;
    var parentId = 0;
    $.ajax({
        type: "GET",
        url:"../LearnEase/data/pro_Property.json",
        dateType: "json",
        cache : false,
        async : false,
        success: function (result) {
            var data = result.property;
            for(var i = 0;i <data.length;i++){
              if(data[i].name == selectName) {
                    selectNum = data[i].id;
                    parentId = data[i].parentId;
              }
            }
        }
    });
    add(selectName,selectNum,parentId);
}

/**
 * 通过id获取相对应的课程数据域，再返回进行操作，
 * 主要解决ID不是按顺序添加时出现的无法获取到正确的数据
 * @param c
 * @param Id
 * @returns {*}
 */
function getData(c,Id){
    if(c.length == 1) {
        return c[0];
    }else{
        for(var i = 0;i < c.length;i++){
            if(c[i].id == Id) {
                return c[i];
            }
        }
    }
    return null;
}

/**
 * 添加二级课程
 * @param name
 * @param oneChildIndex
 * @param selectId
 */
function addOneChild(name,oneChildIndex,selectId) {
    //二级课程集合
    var cs = new courseSet(name);
    cs.setCourseId(selectId);
    var cpt = getData(coursePlanList,oneChildIndex);
    sortData(cpt.courseSetList,cs,selectId);
    cpt.courseSetCount++;
    //添加二级课程数据域
    var cptData = getData(courseDataList,oneChildIndex);
    var csd = new courseSetData(selectId);
    sortData(cptData.courseSetDatas,csd,selectId);
    //添加二级课程
    var str = cpt.emitHTML();
    //删除后再添加
    $("#tables tr[class*=default]").remove();
    //重新加
    for(var i = 0;i<coursePlanList.length;i++) {
        var cpt = coursePlanList[i];
        if(cpt != undefined){
            var str;
            if(coursePlanList.length != 0) {
                str = cpt.emitHTML();
            }
            $('#tables').append(str);
        }
    }
    dictionTable();
}

/**
 * 加载二级课程模态框
 * @param oneChildIndex
 * @param selectId
 */
function loadOneChildModel(oneChildIndex, selectId){
    $('#selectTypeContent').empty();
    $('#selectTypeModal').modal();
    if(selectId != 0) {
        $.ajax({
            type: "GET",
            url:"../LearnEase/data/pro_Type.json",
            dateType: "json",
            cache : false,
            async : false,
            success: function (result) {
                var data = result.type[parseInt(selectId-1)];
                if(data === undefined){
                    $('#selectTypeContent').editableSelect();
                }else{
                    $.each(data, function (n, v) {
                        for(var i = 0;i< v.length;i++){
                            $('#selectTypeContent').append('<option value="'+v[i].id+'">' + v[i].name + '</option>');
                        }
                    });
                    $('#selectTypeContent').editableSelect({
                        appendTo: '#type_modal_body'
                    });
                }
            }
        });
    }else{
        $('#selectTypeContent').editableSelect();
    }
    $('#oneChild').val(oneChildIndex);
}

/**
 * 确认二级课程信息
 */
function loadedOneChild() {
    $('#selectTypeModal').modal('hide');
    var selectName = $('#selectTypeContent').val();
    var oneChildIndex = $('#oneChild').val();
    var selectNum = 0;
    var ifFind = false;
    $.ajax({
        type: "GET",
        url:"../LearnEase/data/pro_Type.json",
        dateType: "json",
        cache : false,
        async : false,
        success: function (result) {
            var data = result.type;
            for(var i = 0;i<data.length;i++) {
                if(!ifFind){
                    $.each(data[i],function(n,v) {
                        for(var j = 0;j< v.length;j++){
                            if(v[j].name == selectName) {
                                selectNum = v[j].id;
                                ifFind = true;
                            }
                        }
                    });
                }
            }
        }
    });
    addOneChild(selectName,oneChildIndex,selectNum);
}

/**
 * 添加三级课程
 * @param row 三级课程类
 * @param oneChildIndex 一级课程位置
 * @param twoChildIndex 二级课程位置
 */
function addTwoChild(row,oneChildIndex,twoChildIndex) {
    var c = new course(row);
    var cpt = getData(coursePlanList,oneChildIndex);
    var cs = cpt.courseSetList[twoChildIndex];
    sortData(cs.courseList,c,row.id);
    cpt.courseCount++;
    //添加三级课程数据域
    var cptData = getData(courseDataList,oneChildIndex);
    var csd = cptData.courseSetDatas[twoChildIndex];
    var sc = new courseData(row.id);
    sortData(csd.courses,sc,row.id);
    //删除后再添加
    $("#tables tr[class*=default]").remove();
    //重新加
    for(var i = 0;i<coursePlanList.length;i++) {
        var cpt = coursePlanList[i];
        if(cpt != undefined){
            var str;
            if(coursePlanList.length != 0) {
                str = cpt.emitHTML();
            }
            $('#tables').append(str);
        }
    }
    editTdFun();
    dictionTable();
}

/**
 * 加载三级课程模态框
 * @param oneChildIndex
 * @param twoChildIndex
 * @param selectId
 */
function loadTwoChildModal(oneChildIndex,twoChildIndex, selectId) {
    $('#selectClassModal').modal();
    $('#selectClassContent').empty();
    if(selectId != 0){
        $.ajax({
            type: "GET",
            url: "../LearnEase/data/pro_Class.json",
            dateType: "json",
            cache: false,
            async: false,
            success: function (result) {
                var data = result[parseInt(selectId)];
                if(data === undefined){
                    $('#selectClassContent').editableSelect();
                }else{
                    for(var i = 0;i<data.length;i++){
                        $('#selectClassContent').append('<option value="'+data[i].id+'">' + data[i].name + '</option>');
                    }
                    $('#selectClassContent').editableSelect({
                        appendTo: '#class_modal_body'
                    });
                }
            }
        });
    }else {
        $('#selectClassContent').editableSelect();
    }
    $('#two1Child').val(oneChildIndex);
    $('#two2Child').val(twoChildIndex);
    $('#selectId').val(selectId);
}

/**
 * 确认二级课程
 */
function loadedTwoChild() {
    $('#selectClassModal').modal('hide');
    var selectName = $('#selectClassContent').val();
    var oneChildIndex = $('#two1Child').val();
    var twoChildIndex = $('#two2Child').val();
    var selectOneId =  $('#selectId').val();
    var selectTwoId = 0;
    var ifFind = false;
    if(selectOneId != 0) {
        $.ajax({
            type: "GET",
            url: "../LearnEase/data/pro_Class.json",
            dateType: "json",
            cache: false,
            async: false,
            success: function (result) {
                var data =result[parseInt(selectOneId)];
                for(var i = 0;i<data.length;i++){
                    if(!ifFind){
                        if(data[i].name == selectName){
                            selectTwoId = data[i].id;
                            ifFind = true;
                        }
                    }
                }
            }
        });
    }
    var row = {
        "name":selectName,
        "credit":0,
        "totalUnit":0,
        "theroyUnit":0,
        "practiveUnit":0,
        "unitTerm1":0,
        "unitTerm2":0,
        "unitTerm3":0,
        "unitTerm4":0,
        "unitTerm5":0,
        "unitTerm6":0,
        "unitTerm7":0,
        "unitTerm8":0,
        "demo":"备注",
         "id":selectTwoId
    };
    addTwoChild(row, oneChildIndex, twoChildIndex);
}

/**
 * 单元格可编辑模块
 */
function editTdFun() {
     $('table td[class*="editClass"]').click(function(){
         if(!$(this).is('.input')){
             //在这里获取修改数据的id
             var inputData = '<input type="text" value="'+ $(this).text() +'"/>';
             var oldData = $(this).context.innerText;
             var tdId = $(this).context.id;
             $(this).addClass('input').html(inputData).find('input').focus().blur(function(){
                 $(this).parent().removeClass('input').html($(this).val() || "");
                 //失去焦点后在这里进行操作
                 var newData = $(this).val();//修改后的值
                 if(newData != oldData){
                     var tdIds= tdId.split('_');
                     //获取一级课程和二级课程在类中的位置
                     //获取一级课程的数据
                     var cptData = getData(courseDataList,tdIds[2]);
                     var csd = cptData.courseSetDatas[tdIds[3]];
                     var sc = csd.courses;
                     for(var i = 0;i<sc.length;i++){
                         if(sc[i].id == tdIds[1]) {
                             sc[i][tdIds[0]] = newData;
                             if(tdIds[0] == "credit"){
                                 sc[i].ifCredit = true;
                             }
                         }
                     }
                     drawData();
                 }
             });
         }
     }).hover(function(){
         $(this).addClass('hover');
     },function(){
         $(this).removeClass('hover');
     });
}
/**
 * 渲染表格
 */
function dictionTable() {
    getTotalData();
    if(courseDataList.length > 0){
        $('#tableTotalPanel').show();
    }else{
        $('#tableTotalPanel').hide();
    }
    $.each(courseDataList, function(key, val) {
        var vId = val.id;
        $.each(val,function(k,v) {
            if(v != 0 || typeof v!="function") {
                if(typeof v == "object"){
                    $.each(v,function(k1,v1) {
                        var v1Id = v1.id;
                        $.each(v1,function(k11,v11) {
                            if(v11 != 0 || typeof v11!="function"){
                                if(typeof v11 == "object"){
                                    $.each(v11,function(k2,v2) {
                                        var v2Id = v2.id;
                                        $.each(v2,function(k22,v22) {
                                            if(v22 != 0 ||  typeof v22 != "object" || typeof v22 !="function") {
                                                var name = k22 + "_" + v2Id + "_" + vId + "_" + k1;
                                                $('#' + name).html(v22);
                                            }
                                        });
                                    });
                                }else{
                                    var name = k11+"_"+v1Id;
                                    $('#'+name).html(v11);
                                }
                            }
                        });
                    });
                }else{
                    var name = k + "_" +vId;
                    $('#'+name).html(v);
                }
            }
        });
    });
}

/**
 * 删除功能
 * 删除数据域和渲染域的相关对象
 */
function deleteCourse(data) {
    var removeId = data.id;//要删除的id
    var removeIds = removeId.split('_');//0:要删除的类型，1：第一级位置；2：第二级的位置；3：第三级的位置（如果是删除第三级的话）
    if(removeIds[0] == "OneCourse"){//一级课程
        var length = courseDataList.length;
        var ifRemove = false;
        for(var i = 0;i < length;i++) {
            if(!ifRemove){
                if(courseDataList[i].id == removeIds[2]){
                    //数据域
                    courseDataList.remove(i);
                    //渲染域
                    coursePlanList.remove(i);
                    ifRemove = true;
                }
            }
        }
    }else if(removeIds[0] == "TwoCourse") {//二级课程
        var oneParentId = removeIds[1];
        var cptData = getData(courseDataList,oneParentId);
        var cpt = getData(coursePlanList,oneParentId);
        var length = cptData.courseSetDatas.length;
        var ifRemove = false;
        for(var i = 0;i <length;i++) {
            if(!ifRemove){
                if(cptData.courseSetDatas[i].id == removeIds[2]){
                    //数据域
                    cptData.courseSetDatas.remove(i);
                    //删除二级渲染域，需要计算有多少个三级渲染域
                    var n = cpt.courseSetList[i].courseList.length + 1;
                    //渲染域
                    cpt.courseSetList.remove(i);
                    cpt.courseSetCount -= n;
                    ifRemove = true;
                }
            }
        }
    }else if(removeIds[0] == "course") {//三级课程
        var oneParentId = removeIds[1];
        var cptData = getData(courseDataList,oneParentId);
        var csd = cptData.courseSetDatas[removeIds[2]];
        var cpt = getData(coursePlanList,oneParentId);
        var cl = cpt.courseSetList[removeIds[2]];
        var length = csd.courses.length;
        var ifRemove = false;
        for(var i = 0;i<length;i++) {
            if(!ifRemove){
                if(csd.courses[i].id == removeIds[3]) {
                    csd.courses.remove(i);
                    cl.courseList.remove(i);
                    cpt.courseCount--;
                    ifRemove = true;
                }
            }
        }
    }
    drawData();
}




/**
 * 渲染修改后的数据域
 */
function drawData(){
    if(courseDataList.length > 0){
        for(var i = 0;i< courseDataList.length;i++){
            var cptData = courseDataList[i];
            cptData.initUnitTerm();
            cptData.init();
            if(cptData.courseSetDatas.length > 0){
                for(var j = 0;j<cptData.courseSetDatas.length;j++) {
                    var csd = cptData.courseSetDatas[j];
                    csd.initUnitTerm();
                    csd.init();
                    if(csd.courses.length > 0) {
                        for (var k = 0; k < csd.courses.length; k++) {
                            var sc = csd.courses[k];
                            //sc.totalUnit = parseInt(sc.theroyUnit) + parseInt(sc.practiveUnit);
                            sc.totalUnit = 0;
                            sc.totalUnit = DataParse(sc.theroyUnit,sc.totalUnit);
                            sc.totalUnit = DataParse(sc.practiveUnit,sc.totalUnit);
                            if (!sc.ifCredit) {
                                if (sc.practiveUnit == 0 && sc.theroyUnit == 0) {
                                    sc.credit = 0;
                                }
                                else if (sc.practiveUnit == 0 && sc.theroyUnit != 0) {
                                    //只有理论没有实践
                                    var ifSum = false;
                                    for (j = 1; j <= 8; j++) {
                                        if (!ifSum) {
                                            var name = "unitTerm" + j;
                                            if (sc[name] != 0) {
                                                sc.credit = parseInt(sc[name]);
                                                ifSum = true;
                                            }
                                        }
                                    }
                                } else if (sc.practiveUnit != 0 && sc.theroyUnit != 0) {
                                    //既有理论也有实践
                                    var ifSum = false;
                                    for (j = 1; j <= 8; j++) {
                                        if (!ifSum) {
                                            var name = "unitTerm" + j;
                                            if (sc[name] != 0) {
                                                sc.credit = parseInt(sc[name]) / 2 + 0.5;
                                                ifSum = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //二级课程相关数据计算
                        for (var n1 = 0; n1 < csd.courses.length; n1++) {
                            csd.twoTotalCredit += parseFloat(csd.courses[n1].credit);//学分小计
                            csd.twoTotalPractiveUnit = DataParse(csd.courses[n1].practiveUnit,csd.twoTotalPractiveUnit);//实践课时小计
                            csd.twoTotalTheroyUnit = DataParse(csd.courses[n1].theroyUnit,csd.twoTotalTheroyUnit);//理论课时小计
                            csd.twoTotalUnit = DataParse(csd.courses[n1].totalUnit,csd.twoTotalUnit);//总课时小计

                            for (var n2 = 1; n2 <= 8; n2++) {
                                var unitTermName = "unitTerm" + n2;
                                var twoUnitTermName = "twoTotalUnitTerm" + n2;
                                csd[twoUnitTermName] += parseInt(csd.courses[n1][unitTermName]);
                            }
                        }
                    }
                }
                //一级课程小计汇总
                for (var m1 = 0; m1 < cptData.courseSetDatas.length; m1++) {
                    cptData.oneTotalTheroyUnit = DataParse(cptData.courseSetDatas[m1].twoTotalTheroyUnit,cptData.oneTotalTheroyUnit);//理论课时小计
                    cptData.oneTotalPractiveUnit = DataParse(cptData.courseSetDatas[m1].twoTotalPractiveUnit,cptData.oneTotalPractiveUnit);//实践课时小计
                    cptData.oneTotalUnit = DataParse(cptData.courseSetDatas[m1].twoTotalUnit,cptData.oneTotalUnit);//总课时小计
                    cptData.oneTotalCredit += parseFloat(cptData.courseSetDatas[m1].twoTotalCredit);
                    for (var m2 = 1; m2 <= 8; m2++) {
                        var twoUnitTermName = "twoTotalUnitTerm" + m2;
                        var oneUnitTermName = "oneTotalUnitTerm" + m2;
                        cptData[oneUnitTermName] += parseInt(cptData.courseSetDatas[m1][twoUnitTermName]);
                    }
                }
            }
        }
    }
    //删除后再添加
    $("#tables tr[class*=default]").remove();
    //重新加
    for(var i = 0;i<coursePlanList.length;i++) {
        var cpt = coursePlanList[i];
        if(cpt != undefined){
            var str;
            if(coursePlanList.length != 0) {
                str = cpt.emitHTML();
            }
            $('#tables').append(str);
        }
    }
    editTdFun();
    dictionTable();
}

/**
 * 设置表格的动态隐藏和显示的来回切换
 * @param data
 */
function hideData(data){
   var hideId = data.id;
   var hideName = 'default t-'+ hideId ;
   var showName = hideName + " " + hideId;
   var spanId = "span_" + hideId;
   $('#tables tr[class="'+ hideName +'"]').toggle();
    if($('#' + spanId).attr('class') == "glyphicon glyphicon-minus"){
        $('#' + spanId).attr('class','glyphicon glyphicon-plus');
        $('#tables tr[class="'+ showName +'"] th').attr('colSpan',3);
    }else{
        $('#' + spanId).attr('class','glyphicon glyphicon-minus');
        $('#tables tr[class="'+ showName +'"] th').attr('colSpan',2);
    }
}


/**
 * 一级课程类
 * @param name
 */
function coursePlanTable(name,index) {
    this.courseSetCount = 1;
    this.courseCount = 0 ;
    this.courseSetList = new Array();
    this.name = name;
    this.id = 0;
   this.setCoursePlanId = function(id) {
       this.id = id;
   };
    //生成表格
    this.emitHTML = function(){
        var tl = "t-" + index;
        var className = 'default '+ tl;
        var str = '<tr  class="'+ className +'">';
        var removeOneCourseId = "OneCourse_" + index + "_" + this.id;
        str += '<th  rowspan="'+ (this.courseSetCount + this.courseCount )+'">'+this.name +'&nbsp;<a href="#/AssClass" onclick="loadOneChildModel('
            + index +','+this.id+');"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>&nbsp;<a href="#/AssClass" id="'
            + removeOneCourseId +'" onclick="deleteCourse(this);"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></a></th>';
        if(this.courseSetList.length == 0){
            str += '<th colspan=2>'+ this.name + "小计"+'</th><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>'+ "无备注"+'</td>';
            str += '</tr>';
            return str;
        }else{
            for(var i = 0;i<this.courseSetList.length;i++) {
                var cs = this.courseSetList[i];
                if( i != 0) {
                    str +='<tr class="'+ className +'">';
                }
                var removeCourseSetId = "TwoCourse_" + index + "_" + cs.id;
                str += '<th rowspan="'+ (cs.courseList.length + 1)+'">'+cs.name +'&nbsp;<a href="#/AssClass" onclick="loadTwoChildModal('
                    + index +','+ i +','+ cs.id +');"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></a>&nbsp;<a href="#/AssClass" id="'
                    + removeCourseSetId +'" onclick="deleteCourse(this);"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></a></th>';
                if(cs.courseList.length == 0) {
                    str += '<th>'+ "小计"+'</th><td>0</td><td >0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>'+ "无备注"+'</td>';
                    str += '</tr>';
                }else{
                    for(var j = 0;j<cs.courseList.length;j++){
                        var c = cs.courseList[j];
                        if( j != 0) {
                            str +='<tr class="'+ className +'">';
                        }
                        var ClassName = c.id + "_" + index +"_" + i;
                        var removeCourseId = "course_" + index + "_" + i + "_" + c.id;
                        str += '<th>'+ c.name+'&nbsp;<a href="#/AssClass" onclick="deleteCourse(this);" id="'+ removeCourseId +'"><span class="glyphicon glyphicon-minus" aria-hidden="true"></span></a></th><td class="editClass" id="credit_'+ ClassName +'">'+ c.credit+'</td><td id="totalUnit_'+ ClassName +'">'
                            + c.totalUnit +'</td><td class="editClass" id="theroyUnit_'+ ClassName +'">'+ c.theroyUnit+'</td><td class="editClass" id="practiveUnit_'+ ClassName +'">'
                            + c.practiveUnit+'</td><td class="editClass" id="unitTerm1_'+ ClassName +'">'+ c.unitTerm1+'</td><td class="editClass" id="unitTerm2_'+ ClassName +'">'
                            + c.unitTerm2+'</td><td class="editClass" id="unitTerm3_'+ ClassName +'">'+ c.unitTerm3+'</td><td class="editClass" id="unitTerm4_'+ ClassName +'">'
                            + c.unitTerm4+'</td><td class="editClass" id="unitTerm5_'+ ClassName +'">'+ c.unitTerm5+'</td><td class="editClass" id="unitTerm6_'+ ClassName +'">'
                            + c.unitTerm6+'</td><td class="editClass" id="unitTerm7_'+ ClassName +'">'+ c.unitTerm7+'</td><td class="editClass" id="unitTerm8_'+ ClassName +'">'
                            + c.unitTerm8+'</td><td class="editClass" id="demo_'+ ClassName +'">'+ c.demo+'</td>';
                        str += '</tr>';
                    }
                    str +='<tr class="'+ className + '">';
                    str += '<th>'+ "小计"+'</th><td id="twoTotalCredit_'+ cs.id +'">0</td><td id="twoTotalUnit_'+ cs.id +'">0</td><td id="twoTotalTheroyUnit_'
                        + cs.id +'">0</td><td id="twoTotalPractiveUnit_'+ cs.id +'">0</td><td id="twoTotalUnitTerm1_'+ cs.id +'">0</td><td id="twoTotalUnitTerm2_'
                        + cs.id +'">0</td><td id="twoTotalUnitTerm3_'+ cs.id +'">0</td><td id="twoTotalUnitTerm4_'+ cs.id +'">0</td><td id="twoTotalUnitTerm5_'
                        + cs.id +'">0</td><td id="twoTotalUnitTerm6_'+ cs.id +'">0</td><td id="twoTotalUnitTerm7_'+ cs.id +'">0</td><td id="twoTotalUnitTerm8_'
                        + cs.id +'">0</td><td id="twoTotalDemo_'+ cs.id +'">'+ "无备注"+'</td>';
                    str += '</tr>';
                }
            }
            var cptId = this.id;
            var newName = className + " " + index;
            var spanId = "span_" + index;
            str +='<tr class="'+ newName +'">';
            str += '<th colspan=2>'+ this.name +"小计"+'&nbsp;<a id="'
                + index+'" href="#/AssClass" onclick="hideData(this);"><span id="'+ spanId +'" class="glyphicon glyphicon-minus" aria-hidden="true"></span></a></th><td id="oneTotalCredit_'
                + cptId +'">0</td><td id="oneTotalUnit_'+ cptId +'">0</td><td id="oneTotalTheroyUnit_'
                + cptId +'">0</td><td id="oneTotalPractiveUnit_'+ cptId +'">0</td><td id="oneTotalUnitTerm1_'+ cptId +'">0</td><td id="oneTotalUnitTerm2_'
                + cptId +'">0</td><td id="oneTotalUnitTerm3_'+ cptId +'">0</td><td id="oneTotalUnitTerm4_'+ cptId +'">0</td><td id="oneTotalUnitTerm5_'
                + cptId +'">0</td><td id="oneTotalUnitTerm6_'+ cptId +'">0</td><td id="oneTotalUnitTerm7_'+ cptId +'">0</td><td id="oneTotalUnitTerm8_'
                + cptId +'">0</td><td id="oneTotalDemo_'+ cptId +'">'+ "无备注"+'</td>';
            str += '</tr>';
            return str;
        }
    };
}
/**
 * 二级课程类
 * @param name
 */
function courseSet(name){
    this.courseList  = new Array();
    this.name = name;
     this.id = 0;
    this.setCourseId = function(id) {
        this.id = id;
    };
}
/**
 * 3级课程类
 * @param row
 */
function course(row) {
    this.name = row.name;
    this.credit = row.credit;
    this.totalUnit = row.totalUnit;
    this.theroyUnit = row.theroyUnit;
    this.practiveUnit = row.practiveUnit;
    this.unitTerm1 = row.unitTerm1;
    this.unitTerm2 = row.unitTerm2;
    this.unitTerm3 = row.unitTerm3;
    this.unitTerm4 = row.unitTerm4;
    this.unitTerm5 = row.unitTerm5;
    this.unitTerm6 = row.unitTerm6;
    this.unitTerm7 = row.unitTerm7;
    this.unitTerm8 = row.unitTerm8;
    this.demo = row.demo;
    this.id  =row.id;
}

/**
 * 一级课程数据域
 * @param id
 */
function coursePlanData(id,pId) {
    this.parentId = pId;
    this.oneTotalCredit = 0;
    this.oneTotalUnit = 0;
    this.oneTotalTheroyUnit= 0;
    this.oneTotalPractiveUnit = 0;
    this.oneTotalUnitTerm1 = 0;
    this.oneTotalUnitTerm2 = 0;
    this.oneTotalUnitTerm3 = 0;
    this.oneTotalUnitTerm4 = 0;
    this.oneTotalUnitTerm5 = 0;
    this.oneTotalUnitTerm6 = 0;
    this.oneTotalUnitTerm7 = 0;
    this.oneTotalUnitTerm8 = 0;
    this.oneTotalDemo = "";
    this.id = id;
    //包含一个二级课程的list集合
    this.courseSetDatas = new Array();
    this.init = function() {
        this.oneTotalCredit = 0;
        this.oneTotalUnit = 0;
        this.oneTotalTheroyUnit= 0;
        this.oneTotalPractiveUnit = 0;
    };
    this.initUnitTerm = function() {
        this.oneTotalUnitTerm1 = 0;
        this.oneTotalUnitTerm2 = 0;
        this.oneTotalUnitTerm3 = 0;
        this.oneTotalUnitTerm4 = 0;
        this.oneTotalUnitTerm5 = 0;
        this.oneTotalUnitTerm6 = 0;
        this.oneTotalUnitTerm7 = 0;
        this.oneTotalUnitTerm8 = 0;
    }
}

/**
 * 二级课程数据域
 * @param id
 */
function courseSetData(id) {
    this.twoTotalCredit = 0;
    this.twoTotalUnit = 0;
    this.twoTotalTheroyUnit= 0;
    this.twoTotalPractiveUnit = 0;
    this.twoTotalUnitTerm1 = 0;
    this.twoTotalUnitTerm2 = 0;
    this.twoTotalUnitTerm3 = 0;
    this.twoTotalUnitTerm4 = 0;
    this.twoTotalUnitTerm5 = 0;
    this.twoTotalUnitTerm6 = 0;
    this.twoTotalUnitTerm7 = 0;
    this.twoTotalUnitTerm8 = 0;
    this.twoTotalDemo = "";
    this.id = id;
    //每个二级课程都包含一个三级课程的list集合
    this.courses = new Array();
    this.init = function() {
        this.twoTotalCredit = 0;
        this.twoTotalUnit = 0;
        this.twoTotalTheroyUnit= 0;
        this.twoTotalPractiveUnit = 0;

    };
    this.initUnitTerm = function() {
        this.twoTotalUnitTerm1 = 0;
        this.twoTotalUnitTerm2 = 0;
        this.twoTotalUnitTerm3 = 0;
        this.twoTotalUnitTerm4 = 0;
        this.twoTotalUnitTerm5 = 0;
        this.twoTotalUnitTerm6 = 0;
        this.twoTotalUnitTerm7 = 0;
        this.twoTotalUnitTerm8 = 0;
    }
}

/**
 * 三级课程数据域
 * @param id
 */
function courseData(id) {
    this.credit = 0;
    this.totalUnit = 0;
    this.theroyUnit= 0;
    this.practiveUnit = 0;
    this.unitTerm1 = 0;
    this.unitTerm2 = 0;
    this.unitTerm3 = 0;
    this.unitTerm4 = 0;
    this.unitTerm5 = 0;
    this.unitTerm6 = 0;
    this.unitTerm7 = 0;
    this.unitTerm8 = 0;
    this.demo = "";
    this.id = id;
    this.ifCredit = false;
    this.init = function() {
        this.credit = 0;
        this.totalUnit = 0;
        this.theroyUnit= 0;
        this.practiveUnit = 0;
        this.unitTerm1 = 0;
        this.unitTerm2 = 0;
        this.unitTerm3 = 0;
        this.unitTerm4 = 0;
        this.unitTerm5 = 0;
        this.unitTerm6 = 0;
        this.unitTerm7 = 0;
        this.unitTerm8 = 0;
    }
}

/**
 * 分类模块数据域类
 * @param id
 * @param name
 */
function  totalData(id,name) {
    this.credit = 0;
    this.proportion = 0;
    this.totalUnit = 0;
    this.practiveUnit = 0;
    this.theroyUnit = 0;
    this.unitTerm1 = 0;
    this.unitTerm2 = 0;
    this.unitTerm3 = 0;
    this.unitTerm4 = 0;
    this.unitTerm5 = 0;
    this.unitTerm6 = 0;
    this.unitTerm7 = 0;
    this.unitTerm8 = 0;
    this.demo = "";
    this.id = id;
    this.name = name;
    //存放子集
    this.childList = new Array();
    this.init = function(){
        this.credit = 0;
        this.proportion = 0;
        this.totalUnit = 0;
        this.practiveUnit = 0;
        this.theroyUnit = 0;
        this.unitTerm1 = 0;
        this.unitTerm2 = 0;
        this.unitTerm3 = 0;
        this.unitTerm4 = 0;
        this.unitTerm5 = 0;
        this.unitTerm6 = 0;
        this.unitTerm7 = 0;
        this.unitTerm8 = 0;
    };
    this.initList = function() {
        this.childList.length = 0;//清空数组
    }
}
/**
 * 扩展数组删除指定元素的操作
 * @param obj
 */
Array.prototype.remove = function(obj) {
    for(var i = 0;i<this.length;i++) {
        var temp = this[i];
        if(!isNaN(obj)){
            temp = i;
        }
        if(temp == obj) {
            for(var j = i;j<this.length;j++){
                this[j] = this[j+1];
            }
            this.length  = this.length-1;
        }
    }
};
/**
 * 扩展数组插入元素在指定位置
 * @param index
 * @param item
 */
Array.prototype.insert = function(index,item){
    this.splice(index,0,item);
};