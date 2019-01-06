
var htmlTemp;

/**
 * 将html(ul包着一个li)和json结合,生成li列表
 * 参考自http://www.zhangxinxu.com/wordpress/2012/09/javascript-html-json-template/
 * @param object 含有html模板的对象，例如<ul><li>$param$</li><ul>
 * @param jsonObjs
 * @param reset 当一个页面引用这个方法大于等于两次时，要重设object
 * @return 最终的html成品
 */
function setHtmlByTemplate(object, jsonObjs, reset){
	
	//如果是json对象，则处理为json数组
	var jsonArr;
	
	if(jsonObjs instanceof Array)
		jsonArr = jsonObjs;
	else
		jsonArr = new Array(jsonObjs);
	
	//扩展String原型的方法
	String.prototype.convert = function(obj) {
	    return this.replace(/\$\w+\$/gi, function(matchs) {
	        var returns = obj[matchs.replace(/\$/g, "")];		
	        return (returns + "") == "undefined"? "": returns;
	    });
	};
	
	var htmlList = '';
	
	
	if(htmlTemp == undefined || htmlTemp == null || reset == true)
		htmlTemp = object.html();

	jsonArr.forEach(function(jsonObj) {
	    htmlList += htmlTemp.convert(jsonObj);
	});

	object.html(htmlList);
}

/**
 * 将类似threadId=20&apple=1转换成带有threadId和apple属性的js对象
 * @param 查询字符串(window.location.search.substring(1)
 * @returns js对象
 */
function getSearchObjByLocation(searchStr){
	//alert(searchStr);
	var obj = {};
    var params = searchStr.split("&");
    for(var i in params)
    {
    	//alert(params[i]);
        var tokens=params[i].split("=");
        obj[tokens[0]]=tokens[1];            
    }        
    return obj;
}

/**
 * 取得元素所在表单
 * 参考:http://zhidao.baidu.com/link?url=sLQJCOhHB8WzR6P6AKYOX4BkN8o9SC9-d9Na6qZ6m0Xf-tDrsEFvyQfSq2EWFE-bbIgaUCSFBzcsQUnAdh7p3a
 * @param 提交按钮等表单内物体
 */
function getForm(button) {
	var object=button;
	while(object.tagName.toUpperCase()!="FORM"){
		object=object.parentNode;
	}
	return object;
}

/**
 * 提交表单并刷新列表
 * @param button 提交表单的按钮
 * @param listContainer 列表的容器
 */
function submitForm(button, listContainer){
	var form = $(getForm(button));
	//alert("htmlTemp: " + htmlTemp );
	//alert("form.serialize(): " + form.serialize());
	
	  $.post(form.attr("action"), form.serialize(), function(page) {
		//alert(JSON.stringify(page));
		if(page != null){
			listContainer.css("display", "none");
			
			//技巧：增加stop()，快速连打"上页""下页"时，不会出现不应该出现的按钮
			$("#previous").stop().css({"opacity": "0", "zIndex": "-1"});
			$("#next").stop().css({"opacity": "0", "zIndex": "-1"});
			setHtmlByTemplate(listContainer, page.threads);
			$(".pagenation input[name=currentPage]").val(page.currentPage);
			listContainer.fadeIn();
	        if(page.hasPrevious == true){
	        	$("#previous").css("z-index", "0");
	     	   $("#previous").animate({opacity: "1"});
	        }
	        if(page.hasNext == true){
	        	$("#next").css("z-index", "0");
	        	$("#next").animate({opacity: "1"});
	        }
		}
		
	});
	
}

function comment(button) {

	$("input[name=content]").val(um.getContent());
	submitAndRefresh(button);
}

/**
 * 删除帖子
 * @param button 提交表单的按钮
 * @since 2016/5/22 13:36
 */
function deleteThread(button) {
	
	var serializeStr = $(getForm(button)).serialize();
	var state = serializeStr.indexOf("ordIndex=0") != -1;
	if(state)
		submitAndGoBack(button);
	else
		submitAndRefresh(button);
	return;	
}

function setThreadTop(button) {
	submitAndRefresh(button);
}

function setThreadNoTop(button) {
	submitAndRefresh(button);
}

function register(button){
	
	//校验
	if($("input[name=password]").val() != $("input[name=password2]").val()){
		alert("密码与重复密码不一致!")
	}	
	$("#intro").val(um.getContent());
	$("input[name=password2]").attr("disabled", true);
	
	//提交表单
	submitAndRedirect(button, "/signin-success.html");	
}

function login(button){
	$(getForm(button)).submit();
}

function post(button, partId) {
	
	$("input[name=partId]").val(partId);
	$("input[name=content]").val(um.getContent());

	submitAndRedirect(button, "/nihongo.html?postSuccess");
	
}

/**
 * 提交表单并重定向
 * @param button 提交表单的按钮
 * @param locationStr 重定向的位置
 * @since 2016.05.19 15:01
 */
function submitAndRedirect(button, successLocationStr){
	var form = $(getForm(button));	
	$.post(form.attr("action"), form.serialize(), function(result) {
		if (result == true)
			window.location=successLocationStr;
		else
			alert("提交失败");
	});
}

/**
 * 提交表单并刷新当前页
 * @param button 提交表单的按钮
 * @since 2016.05.19 15:05
 */
function submitAndRefresh(button){
	var form = $(getForm(button));	
	$.post(form.attr("action"), form.serialize(), function(result) {
		if (result == true)
			location.reload();
	});
}

/**
 * 提交表单并返回"上一页"
 * 注意：若先在同页刷新，再调用此方法，也适用
 * 因为上一页，指的是不同地址的上一页
 * @param button 提交表单的按钮
 * @since 2016.05.19 15:05
 */
function submitAndGoBack(button){
	var form = $(getForm(button));	
	$.post(form.attr("action"), form.serialize(), function(result) {
		if (result == true)
			history.back();
	});
}

/**
 * 根据partId为导航栏显示目前区域
 * @param partId 区域id
 * @since 2016.5.20 9:28
 */
function showNav(partId){
	switch(partId){
	case "p1": $("nav .container li:nth-child(2)").addClass("selected");break;
	case "p2": $("nav .container li:nth-child(3)").addClass("selected");break;
	case "p3": $("nav .container li:nth-child(4)").addClass("selected");break;
	case "p4": $("nav .container li:nth-child(5)").addClass("selected");break;
	}
}