var isAsc = false;

$(document).ready(function(){
	console.log("ready");


	$("#theader").on("click",function (e) {
		var targetId = e.target.id;
		console.log("header",e.target.tagName,"targetId",targetId,typeof(targetId));
		console.log("thead.isAsc before",order.isAsc);
		// setOrder(targetId,order,e.target);
		console.log("thead.isAsc after",order.isAsc);
	});


	// console.log($('datepicker').val());
});

setOrder= function(fieldName,order,target){
	console.log("main.setOrder()");
	$("#arrowUp").remove();
	$("#arrowDown").remove();

	order.isAsc = !order.isAsc;

	var td = $(target);
	td.append(order.isAsc?arrowUp:arrowDown);
	// console.log("isAsc",order.isAsc);

	console.log("~main.setOrder()");
}
