/**
 * Created by Administrator on 2016/8/10.
 */


/**
 * 课程汇总
 */
function getTotal() {
	$.get("../LearnEase/wms/html/total.html",function(data) {
		$('#content').html(data);	
	});
}


/**
 * 获取汇总的数据
 */
function getTotalStaticData() {
    $.ajax({
        type: "GET",
        url: "../LearnEase/data/total.json",
        dateType: "json",
        cache: false,
        async: false,
        success: function (result) {
            var pb = result.public;
            setStaticData(pb);
            var major = result.major;
            setStaticData(major);
            var str = '<tr class="default"><td colspan="3">小计</td><td>'+result.credit+'</td><td>'+result.proportion+'</td><td>'
                +result.totalUnit+'</td><td>'+result.practiveUnit+'</td><td>'+result.theroyUnit+'</td><td>'+result.unitTerm1+'</td><td>'
                +result.unitTerm2+'</td><td>'+result.unitTerm3+'</td><td>'+result.unitTerm4+'</td><td>'+result.unitTerm5+'</td><td>'
                +result.unitTerm6+'</td><td>'+result.unitTerm7+'</td><td>'+result.unitTerm8+'</td><td>'+result.demo+'</td></tr>';
            $('#tableTotalStatic').append(str);
        }
    })
}

/**
 * 渲染通识教育课程数据
 * @param pb
 */
function setStaticData(pb){
    var length = pb.child.length;
    for(var i = 0;i <length;i++){
        var str = "";
        var d = pb.child[i];
        var childStr= "";
        if(i == 0) {
            str = '<tr class="default"><td rowspan="' + pb.child.length + '">' + pb.id + '</td><th rowspan="' + pb.child.length + '">' + pb.name + '</th>';
        }else{
            str = '<tr class="default">';
        }
        childStr = '<td>'+d.name+'</td><td>'+d.credit+'</td><td>'+d.proportion+'</td><td>'+d.totalUnit+'</td><td>'
            +d.practiveUnit+'</td><td>'+d.theroyUnit+'</td><td>'+d.unitTerm1+'</td><td>'+d.unitTerm2+'</td><td>'
            +d.unitTerm3+'</td><td>'+d.unitTerm4+'</td><td>'+d.unitTerm5+'</td><td>'+d.unitTerm6+'</td><td>'
            +d.unitTerm7+'</td><td>'+d.unitTerm8+'</td><td>'+d.demo+'</td>';
        str += childStr + '</tr>';
        $('#tableTotalStatic').append(str);
    }
}