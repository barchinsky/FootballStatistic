validateGoals = function(goals,scorers){
	console.log("utils.validateGoals()");

	console.log("goals:"+goals+" scorers"+scorers[0].goals);

	var goalsSum = 0;

	console.log("scorers:"+scorers.length);

	//if( !scorers.length ) return true; // return true if there is no scorers
	for(i=0; i < scorers.length; i++){
		var buf = Number.parseInt(scorers[i].goals);

		goalsSum += isNaN( buf )?0:buf;
	}

	console.log(goals,goalsSum);
	return Number.parseInt(goals)===goalsSum;

	console.log("~utils.validateGoals()");
}