console.log("database.js loaded.");

var mysql = require("mysql");

connection = function(){

	var connection = mysql.createConnection({
		host:"localhost",
		user:"root",
		password:"welcome1",
		database:"FootballStatistic"
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
	console.log("database::loadSeasonResults()::sql"+sql);

	executeSql(sql,response,callback);

	console.log("~database.loadSeasonResults()");
}

loadTeamSquad = function(teamName,response,callback){
	console.log("database:loadTeamSquad()");

	var sql = 'select secondName from Players as p where p.teamId=(select id from Teams as t where t.name="'+teamName+'")';

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
	console.log("insertGame()");
	// game.home.team;
	// game.home.goals;
	// game.home.ycNum;
	// game.home.rcNum;
	// game.home.scorers;
	// game.home.rcOwners;
	// game.home.ycOwners;

	// game.guest.team;
	// game.guest.goals;
	// game.guest.ycNum;
	// game.guest.rcNum;
	// game.guest.scorers;
	// game.guest.rcOwners;
	// game.guest.ycOwners;

	addGameSql = "insert into Games(homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,homeTeamYC,guestTeamYC,homeTeamRC,guestTeamRC,homeTeamFouls,guestTeamFouls,homeTeamScorers,guestTeamScorers,gameDate,seasonId) values \
	( \
		"+game.home.id+", \
		"+game.guest.id+", \
		"+game.home.goals+", \
		"+game.guest.goals+", \
		"+game.home.ycNum+", \
		"+game.guest.ycNum+", \
		"+game.home.rcNum+", \
		"+game.guest.rcNum+", \
		"+game.home.fouls+", \
		"+game.guest.fouls+", \
		'"+game.home.scorers.join()+"',\
		'"+game.guest.scorers.join()+"',\
		'"+game.date+"',\
		"+game.season+");";

	executeSql(addGameSql,response,callback);

	console.log("addGameSql:"+addGameSql);

	console.log("~insertGame()");
}

updatePlayerStatistic = function(season,homeTeamInfo,guestTeamInfo){
	console.log("updatePlayerStatistic()");
	var response = {};

	var homeTeamId = homeTeamInfo.id;
	var homeScorers = homeTeamInfo.scorers;
	var homeTeamYCOwners = homeTeamInfo.ycOwners;
	var homeTeamRCOwners = homeTeamInfo.rcOwners;

	var guestTeamId = guestTeamInfo.id;
	var guestScorers = guestTeamInfo.scorers;
	var guestTeamYCOwners = guestTeamInfo.ycOwners;
	var guestTeamRCOwners = guestTeamInfo.rcOwners;

	console.log(homeTeamId,homeScorers,homeTeamYCOwners,homeTeamRCOwners,guestTeamId,guestScorers,guestTeamYCOwners,guestTeamRCOwners);

	// update goals
	for(i=0; i < homeScorers.length;i++){
		sql = "UPDATE Players as p SET p.goals=p.goals+"+1+" where p.secondName='"+homeScorers[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestScorers.length;i++){
		sql = "UPDATE Players as p SET p.goals=p.goals+"+1+" where p.secondName='"+guestScorers[i]+"' and p.teamId='"+guestTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	// update yc
	for(i=0; i < homeTeamYCOwners.length;i++){
		sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+homeTeamYCOwners[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestTeamYCOwners.length;i++){
		sql = "UPDATE Players as p SET p.yCards=p.yCards+"+1+" where p.secondName='"+guestTeamYCOwners[i]+"' and p.teamId='"+guestTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	// update rc
	for(i=0; i < homeTeamRCOwners.length;i++){
		sql = "UPDATE Players as p SET p.rCards=p.rCards+"+1+" where p.secondName='"+homeTeamRCOwners[i]+"' and p.teamId='"+homeTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	for(i=0; i < guestTeamRCOwners.length;i++){
		sql = "UPDATE Players as p SET p.rCards=p.rCards+"+1+" where p.secondName='"+guestTeamRCOwners[i]+"' and p.teamId='"+guestTeamId+"' and p.seasonId='"+season+"';"
		executeSql(sql,response,function(response,data){
			console.log("updatePlayerStatistic()::update data:"+data);
		});
	}

	// callback(response,{"data":[],"status":"1"});

	console.log("~updatePlayerStatistic()");
}

getSeasons = function(response,callback){
	var sql = "select name,id from Seasons";

	executeSql(sql,response,callback);
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