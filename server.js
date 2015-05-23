var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var db = require("./database");

var host = "localhost";

var port = 9800;

app = express();

app.use(logger("dev"));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(urlencodedParser); // Parse request body into request.body.*

app.use(express.static(path.join(__dirname, 'public')));

app.post("/seasonResults",function(request,response){
	console.log("load()");

	// console.log("request.body",request.body.season, request.body);

	var seasonId = request.body.seasonId;
	console.log("srver::seasonResults()::SeasonId goted: "+seasonId);

	loadSeasonResults(seasonId,response,sendResponse);

	console.log("~load()");
});

app.post("/loadTeamSquad",function(request,response){
	console.log("server:loadTeamSquad()");

	var teamName = request.body.team;
	console.log("team:"+teamName);

	loadTeamSquad(teamName,response,sendResponse);

	console.log("~server:loadTeamSquad()");
});

app.post("/addGame",function(request,response){
	console.log("server::addGame()");

	var game = request.body.game;

	// console.log("Game:"+game+ "Season:"+game.season);

	// console.log("game.home.id: "+game.home.id);
	// console.log("game.homeTeam: "+game.home.team);
	// console.log("game.homeGoals: "+game.home.goals);
	// console.log("game.homeYCNumber: "+game.home.ycNum);
	// console.log("game.homeRCNumber: "+game.home.rcNum);
	// console.log("game.homeTeamScorers: "+game.home.scorers);
	// console.log("game.homeTeamRCOwners: "+game.home.rcOwners);
	// console.log("game.homeTeamYCOwners: "+game.home.ycOwners);

	// console.log("game.guest.id: "+game.guest.id);
	// console.log("game.guest.Team: "+game.guest.team);
	// console.log("game.guest.Goals: "+game.guest.goals);
	// console.log("game.guest.YCNumber: "+game.guest.ycNum);
	// console.log("game.guest.RCNumber: "+game.guest.rcNum);
	// console.log("game.guest.TeamScorers: "+game.guest.scorers);
	// console.log("game.guest.TeamRCOwners: "+game.guest.rcOwners);
	// console.log("game.guest.TeamYCOwners: "+game.guest.ycOwners);

	insertGame(game,response,sendResponse);
	updatePlayerStatistic(game.season,game.home,game.guest);

	console.log("~server::addGame()");
});

app.post("/getSeasons",function(request,response){
	console.log("getSeasons()");
	// response.send({"data":["2014-2015"]});
	// response.end();
	getSeasons(response,sendResponse);

	console.log("getSeasons()");
});

app.post("/getPlayersSeasonStat",function(request,response){
	console.log("getPlayerSeasonStat()");

	var teamName = request.body.team;
	var seasonId = request.body.seasonId;

	console.log("teamName "+teamName+" seasonId "+ seasonId);

	getPlayersSeasonStat(seasonId,teamName,response,sendResponse);

	console.log("~getPlayerSeasonStat()");
});

app.post("/addTeam",function(request,response){
	// Check if new team doest not already exist in db
	// Add new team to db
	console.log("addTeam()");

	var seasonId = request.body.seasonId;
	var teamName = request.body.team;

	console.log("addTeam::seasonId:"+seasonId+" teamName:"+teamName);

	var sql = "insert into Teams(name,seasonId) values('"+teamName+"',"+seasonId+");"; // insert new team to db statements
	var teamExistSql = "select count(*) as teamNum from Teams where name='"+teamName+"'and seasonId='"+seasonId+"';"; //sql statement to check if new team does not already exist in db

	querySql(teamExistSql,function(queryResult){
		var teamNumber = queryResult["data"][0]["teamNum"];
		console.log("Teams found:"+teamNumber+" Status:" + queryResult["status"]);

		if(teamNumber == "0"){
			console.log("Adding team...")
			executeSql(sql,response,sendResponse);
			console.log("Team added.")
		}
		else{
			console.log("Team already exist.")
			response.send({"status":"0","msg":"This team already exists!"});
		}
	});

	console.log("~addTeam()");
});

app.post("/addPlayers",function(request,response){
	// Add players to team
	console.log("server::addPlayers()");

	var players = request.body.players;
	var teamId = request.body.teamId;
	var seasonId = request.body.seasonId;

	console.log("Team:"+teamId+" seasonId:"+seasonId + " players number:"+players.length);
	// var sql = "insert into Players(firstName,secondName,teamId,seasonId) ";
	var values = "values "

	// generate string template with players info
	for(i=0; i < players.length;i++){
		console.log("Name:"+players[i].name+" Second name:"+players[i].secondName +" Phone:"+players[i].phone);
		values = values + "('"+players[i].name+"','"+players[i].secondName+"',"+teamId+","+seasonId+",'"+players[i].dateOfBirth+"'),";
	}
	// console.log("values.length:"+values.length+" last symbol:"+values[values.length-1]);
	values+=";";
	values = values.replace(",;",";");

	var sql = "insert into Players(firstName,secondName,teamId,seasonId,dateOfBirth) "+values;

	executeSql(sql,response,sendResponse);
	// console.log("values:"+values);
	console.log("addPlayers::resultQuery:"+sql+values);

	console.log("~server::addPlayers()");
});

app.post("/addSeason",function(request,response){
	console.log("server:addSeason");

	var seasonName=request.body.seasonName;

	console.log("server:addSeason::seasonName:"+seasonName);

	var checkSeasonSql = "select count(*) as seasonCount from Seasons where name='"+seasonName+"';";

	querySql(checkSeasonSql,function(data){
		var seasonCount = data["data"][0]["seasonCount"];
		if(!seasonCount){
			var insertSeasonSql = "insert into Seasons(name) values('"+seasonName+"');";
			executeSql(insertSeasonSql,response,sendResponse);
		}
		else{
			sendResponse(response,{"status":"0","msg":"Such season already exist."});
		}

	});

	console.log("~server:addSeason");

});

app.post("/teamGames",function(request,response){
	console.log("server::teamGames");

	var teamId = request.body.teamId;
	var seasonId = request.body.seasonId;

	var sql = "select * from Games where seasonId="+seasonId+" and (homeTeamId="+teamId+" or guestTeamId="+teamId+");";

	executeSql(sql,response,sendResponse);

	console.log("~server::teamGames");

});

sendResponse = function(response,data){
	console.log("prepareResponse()");
	// Convert data to Json-friendly object
	// Send results back to the client

	response.send(data);
	response.end();

	console.log("~prepareResponse()");
}

app.listen(port);
console.log("Server started at host:"+host+":"+port);
