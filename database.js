console.log("database.js loaded.");

var mysql = require("mysql");

connection = function(){

	var connection = mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"welcome1",
		database:"FootballStatisticProd"
	});

	return connection;
}

querySql = function(sql,callback){
	// Perform sql queries without send respose to the client
	console.log("database::querySql()");

	var conn = connection();

	conn.query(sql,function(err,rows,fields){
		conn.end();
		if(!err){
			console.log("querySql:: "+sql+"\nQuery result:"+rows[0]["teamNum"]);
			callback({"status":"1","data":rows});
		}
		else{
			console.log("Error occured. Msg:"+err.toString()+" Sql:"+sql);
			callback({"data":[],"status":"0","msg":err.toString()});
		}
	});

	console.log("~database::querySql()");
}

executeSql = function(sql,response,callback){
	// Perform sql query and send result to the client
	console.log("executeSql()");

	var conn = connection();

	conn.query(sql,function(err,rows,fields){
		conn.end();
		if(!err){
			console.log("database:executeSql():: "+sql+"\nQuery result:"+rows);
			// response.send({"data":rows,"status":"1"});
			callback(response,{"data":rows,"status":"1"});
		}
		else{
			console.log("database:executeSql():: Error occured. Message:"+err.toString()+" Sql:"+sql);
			callback(response,{"data":[],"status":"0","err":err.toString()});
		}
	});

	console.log("~executeSql()");
}

loadSeasonResults = function(seasonId,response,callback){
	console.log("database.loadSeasonResults()");

	// Query data from dataabase

	var sql = 'select * from seasonResults as sr where SeasonId="'+ seasonId +'";';
	console.log("database::loadSeasonResults()::sql "+sql);

	executeSql(sql,response,callback);

	console.log("~database.loadSeasonResults()");
}

loadTeamSquad = function(teamId,response,callback){
	console.log("database:loadTeamSquad()");

	var sql = 'select id,secondName,firstName from Players p where p.teamId="'+teamId+'";';

	executeSql(sql,response,callback);

	console.log("~database:loadTeamSquad()");
}

findTemplate = function(template,response,callback){
	console.log("database.findTemplate()");

	var conn = connection();
	conn.connect();

	sql = "SELECT * FROM Phonebook where CONCAT_WS('', firstname,secondname,email,mobile,id) like concat('%', '"+template+"', '%')"

	conn.query(sql, function(err,rows,fields){
		conn.end();
		if(!err){
			console.log("rows",rows);
			callback(response,rows);
		}
		else{
			console.log("Something goes wrong");
		}

	});

	console.log("~database.findTemplate()");
}

insertGame = function(game,response,callback){
	console.log("database:insertGame()");

	addGameSql = "insert into Games(homeTeamId, guestTeamId, homeTeamGoals, guestTeamGoals, homeTeamYC, guestTeamYC, homeTeamRC, guestTeamRC, gameDate, seasonId) values \
	( \
		"+game.home.id+", \
		"+game.guest.id+", \
		"+game.home.goals+", \
		"+game.guest.goals+", \
		"+game.home.ycNum+", \
		"+game.guest.ycNum+", \
		"+game.home.rcNum+", \
		"+game.guest.rcNum+", \
		'"+game.date+"',\
		"+game.seasonId+");";

	executeSql(addGameSql,response,callback);

	console.log("insertGame: addGameSql:"+addGameSql);

	console.log("~database:insertGame()");
}

updatePlayerStatistic = function(seasonId, home, guest){
	console.log("updatePlayerStatistic()");
	var response = {};

	var homeTeamId = home.id;
	var homeScorers = home.scorers; // [{"name":"Petrov", "goals":10}]
	var homeYC = home.yc; // yellow card owners ids
	var homeRC = home.rc; // red card owners ids

	var guestTeamId = guest.id;
	var guestScorers = guest.scorers;
	var guestYC = guest.yc; // yellow card owners ids
	var guestRC = guest.rc; // red card owners ids

	console.log(homeTeamId,homeScorers,homeYC,homeRC,guestTeamId,guestScorers,guestYC,guestRC);

	// update goals
	for(i=0; i < homeScorers.length;i++){
		//sql = "UPDATE Players as p SET p.goals=p.goals+"+1+" where p.secondName='"+homeScorers[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		sql = "INSERT INTO Goals(gameId,playerId,goalNumber,seasonId) VALUES("+ "(select max(id) from Games)"+","+ home.scorers[i].id + ","+ home.scorers[i].goals + "," +seasonId + ")";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestScorers.length;i++){
		sql = "INSERT INTO Goals(gameId,playerId,goalNumber,seasonId) VALUES("+ "(select max(id) from Games)" +","+ guest.scorers[i].id + ","+ guest.scorers[i].goals + "," +seasonId + ")";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	
	// update yc
	for(i=0; i < homeYC.length;i++){
		//sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+homeYCOwners[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		sql = "INSERT INTO Cards( playerId, gameId, type, seasonId ) VALUES("+homeYC[i] + "," + "(select max(id) from Games)" + "," + "0,"  +seasonId +")";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestYC.length;i++){
		//sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+guestYC[i]+"' and p.teamId='"+guestTeamId+"' and p.seasonId='"+season+"';"
		sql = "INSERT INTO Cards( playerId, gameId, type, seasonId ) VALUES("+guestYC[i] + "," + "(select max(id) from Games)" + "," + "0," +seasonId +" )";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}
	
	// update rc
	for(i=0; i < homeYC.length;i++){
		//sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+homeYCOwners[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		sql = "INSERT INTO Cards( playerId, gameId, type, seasonId ) VALUES("+homeRC[i] + "," + "(select max(id) from Games)" + "," + "1," +seasonId +" )";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestYC.length;i++){
		//sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+guestYC[i]+"' and p.teamId='"+guestTeamId+"' and p.seasonId='"+season+"';"
		sql = "INSERT INTO Cards( playerId, gameId, type, seasonId ) VALUES("+guestRC[i] + "," + "(select max(id) from Games)" + "," + "1," + seasonId  + " )";
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}
	

	// callback(response,{"data":[],"status":"1"});

	console.log("~updatePlayerStatistic()");
}

getSeasons = function(response,callback){
	console.log("getSeasons()");

	var sql = "select name,id from Seasons";

	executeSql(sql,response,callback);

	console.log("~getSeasons()");
}

getPlayersSeasonStat = function(seasonId,team,response,callback){
	console.log("database::getPlayersSeasonStat()");

	sql = "select * from playersSeasonStatistic where seasonId='"+seasonId+"' and team='"+team+"';";

	executeSql(sql,response,callback);

	console.log("~database::getPlayersSeasonStat()");
}

exports.loadSeasonResults = loadSeasonResults;
exports.findTemplate = findTemplate;
exports.loadTeamSquad = loadTeamSquad;
exports.insertGame = insertGame;
exports.getSeasons = getSeasons;
exports.getPlayersSeasonStat = getPlayersSeasonStat;
exports.executeSql = executeSql;
exports.querySql = querySql;