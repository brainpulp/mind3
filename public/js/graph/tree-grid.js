
$(".tree-grid thead").append("<tr></tr>");

setTimeout(function(){
	var arr = [];
	var srcIndexArr = [];
	var tgtIndexArr = [];
	var srcArr = [];
	var indexArr = [];
	var treeArr = [];

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
		var thData = ["text", "height", "width", "weight", "px", "py", "x", "y", "color", "shape", "border style"];
		thData.map(function (data) {
			$(".tree-grid thead tr").append("<th>"+data+"</th>");
		});

		var padding = 20;

		for(var i = 0 ; i < indexArr.length ; i ++) {
			var shapes = ["rounded", "straight", "circle", "diamond"];
			$(".tree-grid tbody").append("<tr></tr>");
			var data = MM.graph.nodes[indexArr[i] - 1];
			$(".tree-grid tbody tr:last-child").append("<td><a class='expanded'>-</a>"+data.text+"</td>");
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
			$(".tree-grid tbody tr:last-child").append("<td class='"+data.settings.borderStyle+"'><hr></td>");

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

			$(".tree-grid tbody tr:last-child td:eq(0) a").css({"width":padding+"px", "display":"inline-block"});
		}
		$(".tree-grid table").css({"border-collapse":"collapse"});
		$(".tree-grid").css({"position":"absolute"});
		$(".tree-grid tbody .solid hr").css({"border-style":"solid"});
		$(".tree-grid tbody .rounded").css({"height":"15px", "width":"30px", "border":"solid 1px", "border-radius":"5px", "background-color":"#aaaaaa", "margin":"auto"});
		$(".tree-grid td, .tree-grid th").css({"border":"1px solid", "text-align":"center", "padding":"3px 5px"});
		$(".tree-grid tr td:first-child").css({"text-align":"left"});

		$(".tree-grid .shape select").on("change", function() {
			MM.node.changeShape($(this).attr("data"), this.value);
		});
	}

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
}, 2000);
