var headerData = [{"title":"No", "description":"", "width":60, "type":"number"},
	{"title":"Name", "description":"", "delete":false, "primary":true, "rename":true, "width":100, "type":"text", "filled":0},
	{"title":"Date", "description":"", "delete":true, "primary":false, "rename":true, "width":145, "type":"date", "filled":0},
	{"title":"Add Field", "width":90}];

var modalList = ["Property", "Rename", "Delete"];

var itemType = ["text", "number", "date"];

var bodyData = [];

var editIndex = 0;

$("#custom-table").append("<table id='custom'><thead><tr></tr></thead><tbody></tbody></table>");
$("#custom-table #custom").css({"margin":"auto"});
$("#custom-table thead").css({"background":"#f5f5f5"});
$("#custom-table tbody").css({"background":"#fff"});

function showModal(index) {
	$("#modal").remove();

	var left = $("#custom-table #custom").position().left + 250;
	for(var i = 0 ; i < headerData.length ; i ++) {
		if (index >= i + 1) {
			left += headerData[i].width + 10;
		} else {
			break;
		}
	}

	var top = $("#custom-table tbody").position().top;

	var modal = {"text": "<div id='modal' data='"+index+"'></div>",
		"css": {"position": "absolute", "left": left + "px", "top":top + "px", "padding":"5px 10px", "background":"white", "border":"solid 1px", "z-index":1006}};
	$("#custom-table").append(modal.text);
	$("#custom-table #modal").css(modal.css);
	
	var ul = {"text": "<ul></ul>", 
		"css": {"padding":0, "margin":0}};
	$("#modal").append(ul.text);
	$("#modal ul").css(ul.css);

	modalList.map(function(l) {
		var li = {"text":"<li><a>"+l+"</a></li>",
			"css": {"list-style":"none"}};
		$("#modal ul").append(li.text);
		$("#modal ul li").css(li.css);
	});

	$("#custom-table li a").css({"font-size":"16px", "text-decoration":"none"});
	$("#custom-table li").css({"border-bottom":"solid 1px #aaa", "padding":"5px 0"});
	$("#custom-table li:last-child").css({"border-bottom":0});
}

function showAddFieldModal(action, index) {
	$("#add-modal").remove();
	$(".cover").remove();

	var h3 = (action == "create") ? "Add Field" : "Edit Field";
	var modal = {"text":"<div id='add-modal'><h3>"+h3+"</h3></div>",
		"css":{"position":"absolute", "top":"50px", "width":"300px", "left":"calc((100% - 300px)/2)", "padding":"10px", "background":"white", "z-index":1001, "border-radius":"10px", "border":"solid #888"}};
	$("body").append(modal.text);

	var name = (action == "create") ? "" : headerData[index].title;
	$("#add-modal").append("<div><label>*Name:</label><input type='text' class='name' value='"+name+"' required></div>");
	$("#add-modal").append("<span class='error'>Please fill out this field.<span>");
	$("#add-modal .error").css({"color":"red"});
	$("#add-modal .error").hide();
	$("#add-modal").css(modal.css);

	var description = (action == "create") ? "" : headerData[index].description;
	$("#add-modal").append("<div><label>Description:</label><textarea class='description'>"+description+"</textarea></div>");
	
	$("#add-modal").append("<div><label>Type:</label><select class='type'></select></div>");
	itemType.map(function(type) {
		if (action == "create") {
			if (itemType.indexOf(type) == 0) {
				$("#add-modal .type").append("<option selected value='"+type+"'>"+type+"</option>");
			} else
				$("#add-modal .type").append("<option value='"+type+"'>"+type+"</option>");
		} else {
			if (headerData[index].type == type) {
				$("#add-modal .type").append("<option selected value='"+type+"'>"+type+"</option>");
			} else
				$("#add-modal .type").append("<option value='"+type+"'>"+type+"</option>");
		}
	});

	$("#add-modal").append("<hr/>");

	$("#add-modal").append("<div><button class='cancel'>Cancel</button><button class='create'>Create</button><button class='edit'>Save</button></div>");
	if (action == "create") {
		$("#add-modal .edit").css("display", "none");
	} else {
		$("#add-modal .create").css("display", "none");
	}

	$("body").append("<div class='cover'></div>");
	$(".cover").css({"position":"absolute", "top":0, "width":"100%", "height":"100%", "background":"rgba(0, 0, 0, 0.2)", "z-index":1000});
	$("#add-modal h3").css({"text-align":"center"});
	$("#add-modal input").css({"width":"100%"});
	$("#add-modal textarea").css({"width":"100%"});
	$("#add-modal select").css({"width":"100%"});
	$("#add-modal hr").css({"border-width":"2px"});
	$("#add-modal .cancel").css({"float":"left"});
	$("#add-modal .create").css({"float":"right", "background":"#3276b1", "color":"#fff"});
	$("#add-modal .edit").css({"float":"right", "background":"#3276b1", "color":"#fff"});
	$("#add-modal button").css({"border-radius":"10px"});
}

function createTableHeader() {
	$("#custom th").remove();
	headerData.map(function(data) {
		var th = "<th width='"+data.width+"'><input type='text' data='"+headerData.indexOf(data)+"' disabled='"+data.rename+"' value='"+data.title+"'/><span>"+data.filled+"</span></th>";
		if (data.title == "No") {
			th = "<th width='"+data.width+"'><input type='text' data='"+headerData.indexOf(data)+"' disabled value='"+data.title+"'/><a class='add-row'>+</a></th>";
		} else if (data.title == "Add Field") {
			th = "<th width='"+data.width+"'>"+data.title+"</th>";
		}
		$("#custom>thead>tr").append(th);
		$("#custom th input").css({"width": "70%", "border":"none", "background":"transparent"});
		$("#custom th span").css({"width": "30%"});
	});
	$("#custom-table th").css({"border":"solid 1px", "padding":"5px"});
	$("#custom-table th span").css({"float":"right", "text-align":"right"});
	$("#custom-table a.add-row").css({"font-size":"20px", "text-decoration":"none", "line-height":0});
}

createTableHeader();

function addTableRow(rowId) {	
	$("#custom-table tbody").append("<tr></tr>");
	var cols = headerData.length;
	for(var i = 0 ; i < cols ; i ++) {
		if (i == 0) {
			$("#custom-table tbody tr:last-child").append("<td width='"+headerData[i].width+"'><input type='number' disabled value='"+$("#custom-table tbody tr").length+"'/></td>");
			$("#custom-table tbody tr td:first-child input").css({"text-align":"center"});	
		} else if (i == cols - 1) {
			$("#custom-table tbody tr:last-child").append("<td width='"+headerData[i].width+"'><a class='del-item' data='"+($("#custom-table tbody tr").length-1)+"'>x</a></td>");
			$("#custom-table tbody tr td:last-child").css({"text-align":"center"});
		} else {
			if (typeof rowId != "undefined" && typeof bodyData[rowId][i-1] != "undefined") {
				$("#custom-table tbody tr:last-child").append("<td width='"+headerData[i].width+"'><input type='"+headerData[i].type+"' data='"+i+"' value='"+bodyData[rowId][i-1]+"'/></td>");
			} else {
				$("#custom-table tbody tr:last-child").append("<td width='"+headerData[i].width+"'><input type='"+headerData[i].type+"' data='"+i+"'/></td>");				
			}
		}
		$("#custom-table tbody tr:last-child td input:eq("+i+")").css({"width":headerData[i].width, "height":"30px"});
	}
	$("#custom-table td").css({"border":"solid 1px", "padding":"3px"});
	$("#custom-table input").css({"border":0, "background":"transparent"});
	$("#custom-table a.del-item").css({"font-size":"20px", "text-decoration":"none", "padding":"0 10px"});
}

function createTableBody() {
	$("#custom-table tbody tr").remove();
	for(var i = 0 ; i < bodyData.length ; i ++) {
		addTableRow(i);
	}
}

function updateData() {
	bodyData = [];
	for(var i = 0 ; i < $("#custom-table tbody tr").length ; i ++) {
		var item = [];
		for(var j = 1 ; j < headerData.length - 1 ; j ++) {
			item.push($("#custom-table tbody tr:eq("+i+") input:eq("+j+")").val());
		}
		bodyData.push(item);
	}
	updateStateValue();
}

function updateStateValue() {
	for(var j = 1 ; j < headerData.length - 1 ; j ++) {
		var sum = 0;
		for(var i = 0 ; i < bodyData.length ; i ++) {
			if (typeof bodyData[i][j - 1] != "undefined" && bodyData[i][j - 1] != "") {
				sum += 1;
			}
		}
		headerData[j].filled = sum;
	}
}

$(document).on("click", "#custom th", function(){
	if (!$("#custom th:eq("+$(this).index()+") input").attr("disabled") || $(this).index() == 0) {
		return;
	}
  	showModal($(this).index());
});

$(document).on("click", "#modal li", function(){
	var thIndex = $("#modal").attr('data');
	$("#modal").hide();
	if (modalList[$(this).index()] == "Rename") {
		$("#custom th:eq("+thIndex+") input").prop("disabled", false);
		$("#custom th:eq("+thIndex+") input").focus();
	} else if(modalList[$(this).index()] == "Property") {
		editIndex = thIndex;
		showAddFieldModal("edit", thIndex);
	} else if(modalList[$(this).index()] == "Delete") {
		headerData.splice(thIndex, 1);
		createTableHeader();
		$("#custom-table tbody tr td").remove(":nth-child("+(parseInt(thIndex)+1)+")");
	}
});

$("body").click(function(e) {
	e.preventDefault();
	$("#modal").hide();
	if(e.target.localName == "input" && !e.target.disabled) return;
	$("#custom th input").prop("disabled", true);
});

$(document).on("click", "#custom th:last-child", function() {
	showAddFieldModal("create");
});

$(document).on("click", "#add-modal .cancel", function() {
	$("#add-modal").hide();
	$(".cover").hide();
});

$(document).on("click", "#add-modal .create", function() {
	if($("#add-modal .name").val() == "") {
		$("#add-modal .error").show();
		return;
	}
	$("#add-modal").hide();
	$(".cover").hide();
	var data = {"title":$("#add-modal .name").val(), "description":$("#add-modal .description").val(), "type":$("#add-modal .type").val(), "filled":0, "width":$("#add-modal .type").val()=="date"?145:100};
	headerData.splice(headerData.length - 1, 0, data);
	createTableHeader();
	createTableBody();
});

$(document).on("click", "#add-modal .edit", function() {
	if($("#add-modal .name").val() == "") {
		$("#add-modal .error").show();
		return;
	}
	$("#add-modal").hide();
	$(".cover").hide();
	var data = {"title":$("#add-modal .name").val(), "description":$("#add-modal .description").val(), "type":$("#add-modal .type").val(), "filled":0, "width":headerData[editIndex].width};
	headerData[editIndex] = data;
	createTableHeader();
});

$(document).on("change", "#custom th input", function() {
	headerData[$($(this)[0]).attr("data")].title = $(this).val();
	createTableHeader();
});

$(document).on("click", "#custom-table .add-row", function() {
	addTableRow();
	updateData();
});

$(document).on("click", ".cover", function() {
	$("#add-modal").hide();
	$(".cover").hide();
});

$(document).on("click", ".del-item", function() {
	bodyData.splice($($(this)[0]).attr("data"), 1);
	updateStateValue();
	createTableHeader();
	createTableBody();
});

$(document).on("blur", "#custom-table tbody input", function() {
	updateData();
	createTableHeader();
});

$(document).on("mouseover", "#custom-table th", function() {
	if ($(this).index() > 0)
		$("#custom-table th:eq("+$(this).index()+")").css({"color":"#aaa"});
});

$(document).on("mouseout", "#custom-table th", function() {
	if ($(this).index() > 0)
		$("#custom-table th:eq("+$(this).index()+")").css({"color":"#000"});
});

function getHeaderData() {
	return headerData;
}

function setHeaderData(data) {
	headerData = data;
}

function getTableData() {
	return bodyData;
}

function setTableData(data) {
	bodyData = data;
}