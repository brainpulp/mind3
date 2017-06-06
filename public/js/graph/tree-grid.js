
setTimeout(function(){

	MM.treeGrid = (function() {

		var arr = [];
		var srcIndexArr = [];
		var tgtIndexArr = [];
		var srcArr = [];
		var indexArr = [];
		var treeArr = [];
		var thData = ["text", "height", "width", "weight", "px", "py", "x", "y", "color", "shape", "border style", "Add Field"];

		MM.graph.links.map(function(links) {
			srcArr.push([links.source.id, links.target.id]);
		});

		for(var i = 1 ; i <= MM.graph.nodes.length ; i ++){
			var flag = false;
			for(var j = 0 ; j < MM.graph.links.length ; j ++) {
				if (MM.graph.links[j].target.id == i) {
					flag = false;
					break;
				} else {
					flag = true;
				}			
			}
			if (MM.graph.links.length == 0) {
				flag = true;
			}
			if (flag) {
				srcIndexArr.push(i);
			} else {
				tgtIndexArr.push(i);
			}
		}

		srcIndexArr.map(function(index) {
			treeArr = [];
			treeArr.push(index);
			var tempArr = [];
			srcArr.map(function(item) {
				tempArr.push(item);
			});
			getIndex(index, tempArr).map(function(item) {
				indexArr.push(item);
			});
		});

		if (typeof MM.graph.nodes[0] != "undefined") {
			thData.map(function (data) {
				$(".tree-grid thead tr").append("<th>"+data+"</th>");
			});


			var padding = 20;

			for(var i = 0 ; i < indexArr.length ; i ++) {
				var shapes = ["rounded", "straight", "circle", "diamond"];
				var borderStyle = ["solid", "dashed", "dotted", "double", "groove", "inset", "outset", "ridge"];
				$(".tree-grid tbody").append("<tr data='"+indexArr[i]+"'></tr>");
				var data = MM.graph.nodes[indexArr[i] - 1];
				$(".tree-grid tbody tr:last-child").append("<td><a class='expanded' data='"+i+"'><span>-</span></a>"+data.text+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+data.height+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+data.width+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+data.weight+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+parseInt(data.px)+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+parseInt(data.py)+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+parseInt(data.x)+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td>"+parseInt(data.y)+"</td>");
				$(".tree-grid tbody tr:last-child").append("<td style='background-color:"+data.settings.shapeColor+"'></td>");
				$(".tree-grid tbody tr:last-child").append("<td class='shape'></td>");
				$(".tree-grid tbody tr:last-child .shape").append("<select data='"+indexArr[i]+"'></select>");
				shapes.map(function(shape) {
					$(".tree-grid tbody tr:last-child .shape select").append("<option value='"+shape+"'>"+shape+"</option>");				
				});
				$(".tree-grid tbody tr:last-child").append("<td class='border-style'></td>");
				$(".tree-grid tbody tr:last-child .border-style").append("<select data='"+indexArr[i]+"'></select>");
				borderStyle.map(function(style) {
					$(".tree-grid tbody tr:last-child .border-style select").append("<option value='"+style+"'>"+style+"</option>");				
				});

				var childArr = [];
				var parentArr = [];
				if(i > 0) {
					MM.graph.nodes[indexArr[i - 1] - 1].children.map(function(arr) {
						childArr.push(arr.id);
					});
					MM.graph.nodes[indexArr[i - 1] - 1].parents.map(function(arr) {
						parentArr.push(arr.id);
					});
				}

				if (childArr.indexOf(indexArr[i]) >= 0) {
					padding += 20;
				} else if (childArr.length != 0 && childArr.indexOf(indexArr[i]) < 0 && parentArr.indexOf(indexArr[i]) < 0) {
					padding -= 20;
					MM.graph.nodes[indexArr[i] - 1].parents.map(function(data) {
						if (indexArr.indexOf(data.id) < i) {
							padding = 20 * (i - indexArr.indexOf(data.id));
						}
					});
				} else if (childArr.length == 0 && MM.graph.nodes[indexArr[i] - 1].children.length > 0) {
					padding = 20;
				}

				if(srcIndexArr.indexOf(indexArr[i]) >= 0) {
					padding = 20;
				}

				$(".tree-grid tbody tr:last-child td:eq(0) a").css({"width":padding+"px", "display":"inline-block"});
			}
			$(".tree-grid table").css({"border-collapse":"collapse"});
			$(".tree-grid").css({"position":"absolute", "top":"100px", "right":"0", "z-index":2});
			$(".tree-grid tbody .rounded").css({"height":"15px", "width":"30px", "border":"solid 1px", "border-radius":"5px", "background-color":"#aaaaaa", "margin":"auto"});
			$(".tree-grid td, .tree-grid th").css({"border":"1px solid", "text-align":"center", "padding":"3px 5px"});
			$(".tree-grid tr td:first-child").css({"text-align":"left"});

			$(".tree-grid .shape select").on("change", function() {
				MM.node.changeShape($(this).attr("data"), this.value);
			});

			$(".tree-grid tbody tr a:first-child span").css({"width":"15px", "background-color":"#428bca", "color":"white", "display":"block", "text-align":"center"})
		}

		$(document).on("click", ".tree-grid tbody .expanded", function(evt) {
			$($(this)[0]).removeClass("expanded");
			$($(this)[0]).addClass("collapsed");
			$($(this)[0]).html("<span>+</span>");
			$(".tree-grid tbody tr a:first-child span").css({"width":"15px", "background-color":"#428bca", "color":"white", "display":"block", "text-align":"center"})
			var i = parseInt($($(this)[0]).attr("data")) + 1;
			var padding = $($(".tree-grid tbody tr td:first-child a")[i - 1]).width();
			while($(".tree-grid tbody tr:eq("+i+") a").width() > padding) {
				$(".tree-grid tbody tr:eq("+i+")").hide();
				i ++;
			}
		});

		$(document).on("click", ".tree-grid tbody .collapsed", function(evt) {
			$($(this)[0]).removeClass("collapsed");
			$($(this)[0]).addClass("expanded");
			$($(this)[0]).html("<span>-</span>");
			$(".tree-grid tbody tr a:first-child span").css({"width":"15px", "background-color":"#428bca", "color":"white", "display":"block", "text-align":"center"})
			var i = parseInt($($(this)[0]).attr("data")) + 1;
			var padding = $($(".tree-grid tbody tr td:first-child a")[i - 1]).width();
			while($(".tree-grid tbody tr:eq("+i+") a").width() > padding) {
				$(".tree-grid tbody tr:eq("+i+")").show();
				$(".tree-grid tbody tr:eq("+i+") td:first-child a span").text("-");
				i ++;
			}
		});

		$(document).on("click", ".tree-grid thead th", function() {
			var rowId = $(this).index();
			if (rowId == 0) {
				$(".tree-grid").append("<div class='items-modal'><a id='rename-row' data='"+rowId+"'>Rename</a></div>");
			} else if (rowId == thData.length - 1) {
				addModal();
			} else {
				$(".tree-grid").append("<div class='items-modal'><a id='rename-row' data='"+rowId+"'>Rename</a><a id='delete-row' data='"+rowId+"'>Delete</a></div>");
			}

			if (rowId != thData.length - 1) {
				$(".tree-grid .items-modal").css({"position":"absolute", "left":$(".tree-grid thead th:eq("+rowId+")").position().left, "top":$(".tree-grid tbody tr:first-child td:eq("+rowId+")").position().top, "background-color":"#f5f5f5", "border":"solid 1px #a5a5a5", "border-radius":"3px"});
				$(".tree-grid .items-modal a").css({"padding":"5px 10px", "border-bottom":"solid 1px #a5a5a5", "display":"block", "color":"darkblue"});
			}
		})

		function addModal() {
			$(".tree-grid .items-modal").remove();
			$("body").append("<div class='add-modal'><b>Field Name : </b><input type='text' id='field_name'/><span>* Please fill out this field.</span><b>Field Type : </b><select id='field-type'><option value='text'>Text</option><option value='number'>Number</option><option value='date'>Date</option></select><b>Field Description : </b><input type='text' id='field-desc'><hr/><button class='btn-cancel'>Cancel</button><button class='btn-add'>Add</button></div>");
			$("body").append("<div class='cover'></div>");
			$(".cover").css({"position":"absolute", "width":"100%", "height":"100%", "top":0, "left":0, "background-color":"black", "opacity":0.2, "z-index":4});
			$(".add-modal").css({"position":"absolute", "width":"250px", "left":"calc((100% - 300px) / 2)", "top":"100px", "background-color":"white", "border-radius":"5px", "border":"solid 1px #a5a5a5", "z-index":5, "padding":"15px"});
			$(".add-modal .btn-add").css({"float":"right"});
			$(".add-modal .btn-cancel").css({"float":"left"});
			$(".add-modal input, .add-modal select").css({"width":"100%", "margin-bottom":"10px"});
			$(".add-modal span").css({"display":"none", "color":"red"});			
		};

		$(document).on("click", "#delete-row", function() {
			var index = $(this).attr("data");
			$(".tree-grid .items-modal").remove();
			if(confirm("Are you sure you want to remove this row?")) {
				$(".tree-grid tbody tr td").remove(":nth-child("+(parseInt(index) + 1)+")");
				$(".tree-grid thead th").remove(":nth-child("+(parseInt(index) + 1)+")");
			}
		});

		$(document).on("click", "#rename-row", function() {
			var index = $(this).attr("data");
			$(".tree-grid .items-modal").remove();
			$("body").append("<div class='rename-modal'><input type='text' name='rename-input'/><span>* Please fill out this field.</span><hr/><button class='btn-cancel'>Cancel</button><button class='btn-ok' data='"+index+"'>Ok</button></div>");
			$("body").append("<div class='cover'></div>");
			$(".cover").css({"position":"absolute", "width":"100%", "height":"100%", "top":0, "left":0, "background-color":"black", "opacity":0.2, "z-index":4});
			$(".rename-modal").css({"position":"absolute", "width":"250px", "left":"calc((100% - 300px) / 2)", "top":"100px", "background-color":"white", "border-radius":"5px", "border":"solid 1px #a5a5a5", "z-index":5, "padding":"10px"});
			$(".rename-modal .btn-ok").css({"float":"right"});
			$(".rename-modal .btn-cancel").css({"float":"left"});
			$(".rename-modal input").css({"width":"100%"});
			$(".rename-modal span").css({"display":"none", "color":"red"});
		});

		$(document).on("click", ".cover", function() {
			$(".rename-modal").remove();
			$(".cover").remove();
		});

		$(document).on("click", ".btn-ok", function() {
			if ($(".rename-modal input").val() == "") {
				$(".rename-modal span").css({"display":"block"});
			} else {
				$(".tree-grid thead th:eq("+$(".btn-ok").attr("data")+")").text($(".rename-modal input").val());
				$(".rename-modal").remove();
				$(".cover").remove();
			}
		});

		$(document).on("click", ".btn-add", function() {
			if ($(".add-modal #field_name").val() == "") {
				$(".add-modal span").css({"display":"block"});
			} else {
				$(".cover").remove();
				$(".tree-grid thead th").remove();
				thData.splice(thData.length - 1, 0, $(".add-modal #field_name").val());
				thData.map(function (data) {
					$(".tree-grid thead tr").append("<th>"+data+"</th>");
				});
				$(".tree-grid tbody tr").append("<td><input type='"+$("#field-type").val()+"'></td>");
				$(".tree-grid th, .tree-grid td").css({"border":"1px solid", "padding":"3px 5px"});
				$(".tree-grid tbody td:last-child input").css({"width":"70px"});
				$(".add-modal").remove();
			}
		});		

		$(document).on("click", ".btn-cancel", function() {
			$(".rename-modal").remove();
			$(".add-modal").remove();
			$(".cover").remove();		
		});

		$("body").click(function(e) {
			$(".tree-grid .items-modal").remove();
		});

		function getIndex(srcIndex, src) {
			var ignArr = [];
			src.map(function(arr) {
				ignArr.push(arr[0]);
			});
			var j = 0;
			for(var i = 0 ; i < src.length ; i ++) {
				var k = 0;
				if(src[i][0] == srcIndex) {
					treeArr.push(src[i][1]);
					j = src[i][1];
					k = src[i][0];
					src.splice(i, 1);
					if (ignArr.indexOf(j) < 0) {
						j = k;
						break;
					}
				}
			}
			if (ignArr.indexOf(j) >= 0) {
				getIndex(j, src);
			}
			return treeArr;
		}
	});

	MM.treeGrid();
}, 2000);
