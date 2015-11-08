mainApp.controller("seasonController",function($scope,$http){
	console.log("controller");

	$scope.alerts=["success","info","warning","danger"]
	$scope.alertType="warning";

	$scope.history = [];
	$scope.historyIndex = 0;

	var host="http://192.168.0.103:9800";
	console.log("controller host: "+host);

	$scope.isAdmin = true;
	$scope.isAuthorized = false;
	$scope.isAsc = false;
	$scope.currentUser = "";
	$scope.isEdit = false; // game editing flag

	$scope.currentPageUrl = 'static/home.htm';
	$scope.history.push($scope.currentPageUrl);

	$scope.addActionItems = [{ title:"Team",url:"static/addTeam.htm" },{ title:"Season",url:"static/addSeason.htm" },{ title:"Game",url:"static/addGameProtocol.htm" },{ title:"Players",url:"static/addPlayers.htm" }];
	$scope.editActionItems = [{ title:"Game",url:"static/404.htm" },{ title:"Players",url:"static/404.htm" }];
	$scope.seasonResultHeaders = ["#","Team","Games","Scored","Missed","GA","Points"];
	$scope.playerStatHeaders= [{ title:"#",fieldName:"" },{ title:"Second name",fieldName:"secondName" },{ title:"First name",fieldName:"firstName" },{ title:"Goals",fieldName:"goals" },{ title:"Red cards",fieldName:"red" },{ title:"Yellow cards",fieldName:"yellow" }];
	$scope.scorersInfoHeaders = [ "#","Second name","First name","Team","Goals","Games"];
	$scope.scorersInfo = [{}];


	$scope.arrowUp = "<img id='arrowUp' src='media/arrowUp.png'/>";
	$scope.arrowDown = "<img id='arrowDown' src='media/arrowDown.png'/>";

	$scope.gmd=[]; // games dates list
	
	
	$scope.playersSeasonStatistic = []; // players statistic in season

	// used in add team dialog
	$scope.playersNumber = 0; // number of players in team
	$scope.players=[{}]; // list of players to add to team
	// end add team dialog vars

	$scope.seasonParticipants = []; // list of teams in season
	$scope.teamIdMap = {}; // name is a key, id is a value
	$scope.teamNameMap = {}; // id is a key, name is a value
	// $scope.teams = [{}];

	$scope.homeTeamSquad = [{}]; // squad of home team
	$scope.guestTeamSquad = [{}]; // squad of guest team

	$scope.homeScorers = 0;
	$scope.guestScorers = 0;

	$scope.seasonResults = []; // list of teams results in the season
	$scope.teamGames = [{}]; // list of games for special team
	$scope.teamSeasonHistory = [{}]; // array of game objects

	$scope.selectedTeam = ""; // team name displayed in teamGameStatistic.htm
	$scope.currentTeam = {}; // team selected in addPlayers.htm
	$scope.notificationText = "";

	$scope.newsList = [{date:"May 21, 2015 ",img:"media/news2.png",heading:"Next game this Saturday!",text:"We will play our next game against guys from Vympel! Come to support us, Globytes! Game will be held on Saturday, May 23, at 15-00 near central city stadium."},{date:"May 20, 2015",img:"media/start3.jpg",heading:"Hi, this is our first news!",text:"We will try to take you up to date info about all important GL team events!"}]

	// TODO: Need refactoring
	$scope.initGame = function(){
		console.log("controller:initGame()");

		// Game structure description
		$scope.game = {home:{},guest:{}};
		$scope.game.home.goals = 0;
		$scope.game.home.rcNum = 0;
		$scope.game.home.ycNum = 0;
		$scope.game.home.scorers = [{}];
		$scope.game.home.yc=[];
		$scope.game.home.rc=[];
		// $scope.game.home.id = -1;
		$scope.game.home.team = "";

		$scope.game.guest.goals = 0;
		$scope.game.guest.ycNum = 0;
		$scope.game.guest.rcNum = 0;
		$scope.game.guest.scorers = [{}];
		$scope.game.guest.yc=[];
		$scope.game.guest.rc = [];
		$scope.game.guest.id = -1;
		$scope.game.guest.team = "";

		$scope.game.date = "";
		// End game structure description

		console.log("controller:initGame()");
	}

	$scope.setSeason = function(season){
		console.log("setSeason()")

		console.log("season "+season);

		$scope.currentSeason = season;

		console.log("currentSeason "+$scope.currentSeason.name+$scope.currentSeason.id);
		$scope.loadSeasonInfo();

		console.log("~setSeason()");
	}

	$scope.resetSeason = function(){
		$scope.currentSeason = {name:"Pick season"};
	}

	$scope.route = function(url,opt){
		console.log("route()");
		//console.log("route"+url + "opt:"+opt);

		if( url != "static/teamGameStatistic.htm") $scope.resetSeason();
		$scope.resetData();

		if(opt){ $scope.loadTeamGames(opt); } // load team season games result

		$scope.currentPageUrl = url;

		// add page to history
		$scope.history.push($scope.currentPageUrl);
		$scope.historyIndex = $scope.history.length -1;

		console.log("~route()");
	}

	$scope.addTeam = function(team){
		console.log("addTeam()");

		console.log("Team:"+team+" team.length:"+team.length+" season:"+$scope.currentSeason);
		// $scope.teamName = "Ololo";

		if(team.length < 2 ){
			$scope.notify("Team name should be longer than 1 symbol and shorter than 16.",2);
		}

		else if($scope.currentSeason.name=="Pick season"){
			$scope.notify("Please, pick season.",2);
		}

		else{
			$http.post(host+"/addTeam",{team:team,seasonId:$scope.currentSeason.id}).success(function(response){
				console.log("response"+response);
				if(response["status"]=="1"){
					$scope.notify("Team added successfuly!",0);
					$scope.loadSeasonInfo();

					$scope.resetData();
					
				}
				else{
					$scope.notify("Team NOT added!."+response["msg"],3);
				}
			});
		}

		console.log("~addTeam()");
	}

	$scope.addPlayers = function(team){
		console.log("addPlayers()");
		console.log( typeof( JSON.parse(team)  ) );

		$scope.currentTeam = JSON.parse(team);

		var team = JSON.parse(team);
		var teamId = team.id;

		console.log("teamId:"+teamId+" season:"+$scope.currentSeason.id+ " player[0]:"+$scope.players[0].name);

		if( !$scope.players.length ){ // return if players does not exists
			$scope.notify("Please, add players.", 3);
			return;
		}

		if($scope.currentSeason.name=="Pick season" ){ $scope.notify("Invalid input data. Please pick season and team.",2); return; }

		$http.post(host+"/addPlayers",{teamId:teamId,seasonId:$scope.currentSeason.id,players:$scope.players}).success(function(response){
			console.log("response"+response);
			if(response["status"]=="1"){
				// $scope.displayAddPlayersForm=false;
				// $scope.teamName="";
				$scope.notify("Players added successfuly!",0);
			}
			else{
				$scope.notify("Players NOT added!"+response["msg"],3);
			}
		});

		$scope.resetData();

		console.log("~addPlayers()");
	}

	$scope.addGame = function(game){
		console.log("addGame()");

		console.log(game.home.scorers, game.home.yc, game.guest.scorers, game.guest.yc, game.home.id, game.guest.id);
		//return;
		// input data validation
		if($scope.currentSeason.name=="Pick season"){ $scope.notify("Please, select season.",2); return;}
		if( !$scope.isValidDate($scope.game.date) ) { $scope.notify("Invalid date format! Should be 'yyyy/mm/dd'. Please fix and try again",3); return;}
		if( !game.home.id){ $scope.notify("Please select home team.",2); return; }
		if( !game.guest.id){ $scope.notify("Please select guest team.",2); return; }
		if(game.home.id == game.guest.id) { $scope.notify("Team can't play agains themselves!",2); return; }
		if( !validateGoals(game.home.goals, game.home.scorers) ) { $scope.notify("Home team goals number mismatch!",3); return; }
		if( !validateGoals(game.guest.goals, game.guest.scorers) ) { $scope.notify("Guest team goals number mismatch!",3); return; }

		console.log("game.date"+game.date);
		
		game.seasonId=$scope.currentSeason.id;

		$http.post(host+"/addGame",{game:game}).success(function(response){
			console.log("controller:addGame()::response",response);

			if(response["status"]=="1"){
				$scope.notify("Game added successfuly.",0);
				$scope.resetData();
			}
		});

		$scope.initGame();

		$scope.loadSeasonInfo();

		console.log("~addGame()");
	}

	$scope.deleteGame = function(gameId){

		$http.post("/deleteGame", {id:gameId}).success( function(response){
			if(response["status"] == "1"){

				$scope.notify("Game deleted successfuly.",0);
			}
			else{
				$scope.notify("Game delete failed.",2);
				console.log(response["status"]);
			}
		});
	}

	$scope.addSeason = function(seasonName){
		console.log("controller:addSeason()");

		if(seasonName.length > 3)
		{
			$http.post(host+"/addSeason",{seasonName:seasonName}).success(function(data){
				console.log("controller:addSeason()::data"+data);
				if(data["status"]=="1"){
					$scope.notify("Season added successfuly.",0);
					$scope.getSeasons(); // update local seasons list
				}
				else{
					$scope.notify("Season not added."+data["msg"],3);
				}
			});
		}
		else{
			$scope.notify("Season name should be longer than 3 symbols.",2);
		}

		console.log("~controller:addSeason()");
	}

	$scope.loadSeasonInfo = function(){ // load teams season results
		console.log("loadSeasonInfo()");

		$http.post(host+"/seasonResults",{seasonId:$scope.currentSeason.id}).success(function(data){
			// $scope.processResponse(data);
			$scope.seasonResults=data["data"];

			$scope.seasonParticipants = [];

			console.log($scope.seasonResults);
			// console.log("$scope.seasonResults.length"+$scope.seasonResults['data'].length);
			for( i = 0; i < $scope.seasonResults.length; i++ )
			{
				var team = {};
				team.name = $scope.seasonResults[i]['Team'];
				team.id = $scope.seasonResults[i]["TeamId"];
				// console.log($scope.seasonResults[i].fouls);
				//$scope.teamIdMap[team] = teamId;
				//$scope.teamNameMap[teamId] = team;
				console.log(team);
				$scope.seasonParticipants.push(team);
			}

			console.log("loadSeasonInfo::$scope.seasonParticipants:"+$scope.seasonParticipants);

		});

		console.log("~controller::loadSeasonInfo()");
	}

	$scope.loadScorersInfo = function(season){
		console.log("controller.loadScorersInfo()");

		$scope.setSeason(season);

		console.log("season.id"+season.id);

		$http.post(host+"/scorers",{seasonId:season.id}).success(function(data){
			$scope.scorersInfo = data["data"];

		});

		console.log("$scope.scorersInfo:"+$scope.scorersInfo);

		console.log("~controller.loadScorersInfo()");
	}

	$scope.loadTeamSquad = function(teamId, isHome){
		// isHome - var that specify either home or guest teams squad
		// 1 - home team squad
		// 0 - guest team squad
		console.log("loadTeamSquad()");

		// console.log("guestGoals",$scope.guestGoals);


		console.log("loadTeamSquad::teamId:"+teamId+" isHome:"+ isHome);

		$http.post(host+"/loadTeamSquad",{teamId:teamId}).success(function(response){
			// console.log("response:",response);
			if(isHome){
				$scope.homeTeamSquad = response["data"];
				// console.log("$scope.homeTeamSquad:"+$scope.homeTeamSquad);
			}
			else{
				$scope.guestTeamSquad = response["data"];
				// console.log("$scope.guestTeamSquad:"+$scope.guestTeamSquad);
			}
			// console.log("$scope.homeTeamSquad:"+$scope.homeTeamSquad);

		});

		console.log("~loadTeamSquad()");
	}

	$scope.loadTeamGames = function(team){
		console.log("controller::loadTeamGames()");

		// $scope.teamGameStatistic = [{gameDate:"2015-02-30",home:{team:"Real Madrid FC",goals:"2"},guest:{team:"Barcelona FC",goals:"1"}},{gameDate:"2015-05-10",home:{team:"Real Madrid FC",goals:"2"},guest:{team:"Atletic FC",goals:"2"}},{gameDate:"2015-03-25",home:{team:"Real Madrid FC",goals:"3"},guest:{team:"Sevilia FC",goals:"1"}}]
		console.log("team"+team);

		$scope.selectedTeam = team.Team;

		console.log("teamID="+team.TeamId+" team:"+team.Team);

		$http.post(host+"/teamGames",{teamId:team.TeamId,seasonId:$scope.currentSeason.id}).success(function(data){
			console.log("controller::loadTeamGames():data:"+data["data"]);
			$scope.teamGames = data["data"];
		});


		console.log("~controller::loadTeamGames()");
	}


	$scope.getSeasons = function(){
		console.log("getSeasons()");

		$http.post(host+"/getSeasons").success(function(response){
			$scope.seasons = response["data"];
			// /console.log("getSeasons::$scope.seasons"+$scope.seasons);
		});

		console.log("~getSeasons()");
	}

	$scope.getPlayersSeasonStat = function(teamName){
		console.log("getPlayersSeasonStat()");

		console.log("teamName"+teamName+"seasonid"+$scope.currentSeason.id);

		$http.post(host+"/getPlayersSeasonStat",{team:teamName,seasonId:$scope.currentSeason.id}).success(function(response){
			// console.log("getPlayersSeasonStat::response"+response["data"]);
			$scope.playersSeasonStatistic = response["data"];
			// $scope.currentSeason = $scope.seasons[0];
		});

		console.log("~getPlayersSeasonStat()");
	}

	$scope.seasons = [];
	$scope.getSeasons();
	$scope.currentSeason  = {};
	$scope.currentSeason.name = "Pick season";
	///$scope.initGame();


	// ****************************** UTILS *************************************//

	$scope.range = function(n){
		return new Array(n);
	}

	$scope.setCapitan=function(player){
		// player.isCapitan=true;
	}


	$scope.login = function(user,pass){
		console.log("controller:login()");

		if(user=="admin" && pass=="admin"){
			$scope.isAdmin=true;
			$scope.route("static/home.htm");
			$scope.isAuthorized = true;
			$scope.currentUser = user;
		}

		console.log("~controller:login()");
	}

	$scope.logout = function(){
		console.log("controller:logout()");
		$scope.isAdmin=false;
		$scope.isAuthorized = false;
		$scope.currentUser = "";

		console.log("~controller:logout()");
	}

	$scope.getTeamSeasonHistory = function(){

	}

	$scope.resetData = function(){
		console.log("controller::resetData()");

		$scope.playersSeasonStatistic = [];
		$scope.currentTeam = {name:"", id:0};
		$scope.players=[{}]; // list of players to add to team
		$scope.seasonResults = [];
		$scope.seasonParticipants = [];
		$scope.initGame();
		$scope.homeScorers = 0;
		$scope.guestScorers = 0;


		console.log("~controller::resetData()");
	}

	$scope.sort = function(fieldName,list){
		console.log("controller::sort()");

		console.log("list.before:"+list);

		$scope.displayOrder(fieldName);

		console.log("field:"+fieldName);

		//sort
		if(list.length > 0){
			console.log("Table not empty");
			if($scope.isAsc){ // ascending sort
				console.log("$scope.isAsc",$scope.isAsc);

				list=list.sort( function(a,b){
					// sort descending by fieldName
					// console.log("fieldName"+fieldName);
					console.log(a,b);

					if( a[ fieldName ] > b[ fieldName ] ){
						return 1;
					}
					else if( a[ fieldName] < b[ fieldName ] ){
						return -1;
					}
				});
				// console.log("sortedList::len:"+sortedList.length,sortedList);
			}
			else{ // descending sort
				// console.log("isAsc",isAsc);

				list=list.sort( function(a,b){
					// sort ascending by fieldName
					if( a[ fieldName ] < b[ fieldName ] )	{
						return 1;
					}
					else if( a[ fieldName ] > b[ fieldName ] ){
						return -1;
					}
				});
				// console.log("sortedList::len:"+sortedList.length,sortedList);
				
			}
		}

		$scope.isAsc = !$scope.isAsc;

		// list = sortedList;
		// clearTable();
		// updateTable();
		//console.log("$scope.seasonResults",$scope.seasonResults,$scope.seasonResults.length);

		console.log("list.after:"+list);


		console.log("~controller::sort()");
	}

	$scope.displayOrder = function(id){
		console.log("controller::displayOrder()");

		$("#arrowUp").remove();
		$("#arrowDown").remove();

		var elemId = "#"+id;
		console.log("elementId:"+elemId);
		if($scope.isAsc){
			$(elemId).append($scope.arrowUp);
		}
		else{
			$(elemId).append($scope.arrowDown);
		}

		console.log("controller::displayOrder()");
	}

	$scope.parseDate = function(unformatedDate,index){
		// console.log("item:"+item);

		var date = new Date(unformatedDate);
		var formattedDate = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
		console.log(formattedDate)  //prints 2002/11-21
		$scope.gmd[index] = formattedDate;
	}

	$scope.formatDate = function(unformatedDate){
		var date = new Date(unformatedDate);
		var formattedDate = date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();

		return formattedDate;
	}

	$scope.isValidDate = function(dateString){
		console.log("controller.isValidDate()");

		console.log("controller.isValidDate.date: "+ dateString)

		if(dateString === undefined){ // if date is not set 
			dateString = "1970/01/01"; // define default value
		}

		 // First check for the pattern
		if( !/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString) )
			return false;

		// Parse the date parts to integers
		var parts = dateString.split("/");
		var day = parseInt(parts[2], 10);
		var month = parseInt(parts[1], 10);
		var year = parseInt(parts[0], 10);

		console.log(year,month,day);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month == 0 || month > 12)
			return false;

		var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0) )
			monthLength[1] = 29;

		// Check the range of the day
		console.log(day > 0 && day <= monthLength[month - 1]);
		return day > 0 && day <= monthLength[month - 1];
		
		console.log("~controller.isValidDate()");
	}

	$scope.notify = function(text,id){
		console.log("controller.notify()");

		console.log("alert Id:"+id);

		$scope.notificationText = text;

		$scope.alertType = $scope.alerts[id];


		$("#notification").fadeIn(1000);
		$("#notification").fadeOut(3000);

		console.log("~controller.notify()");
	}

	$scope.addScorers = function(type){
		console.log("$scope.addScorers()");

		if(type){ // homeScorers
			$scope.homeScorers += 1;
			return;
		}

		$scope.guestScorers += 1;


		console.log("$scope.~addScorers()");
	}

	$scope.removeScorers = function(type){
		console.log("$scope.removeScorers()");

		console.log("type:"+type + " $scope.homeScorers:"+$scope.homeScorers + " $scope.guestScorers:"+$scope.guestScorers);

		
		if(type){ // homeScorers
			if( !$scope.homeScorers ) return;
			$scope.homeScorers -= 1;
			return;
		}

		if ( !$scope.guestScorers ) return;
		$scope.guestScorers -= 1;

		console.log("type:"+type + " $scope.homeScorers:"+$scope.homeScorers + " $scope.guestScorers:"+$scope.guestScorers);


		console.log("$scope.~removeScorers()");
	}

	$scope.go = function(back){
		console.log("$scope.go()");

		console.log($scope.history);
		console.log("historyIndex:"+$scope.historyIndex);

		if(back) {
			if( !$scope.historyIndex ) return;
			$scope.historyIndex -= 1;
		}
		else{
			if ( $scope.historyIndex == $scope.history.length -1) return;
			$scope.historyIndex += 1;
		}

		console.log("historyIndex:"+$scope.historyIndex);

		$scope.currentPageUrl = $scope.history[$scope.historyIndex]

	}

	$scope.formatedName = function(player){
		return player.secondName + " " + player.firstName;
	}

	$scope.getGA = function(scored, missed){ // get goal against
		console.log("getGA"+scored+missed);
		return Number.parseInt(scored) - Number.parseInt(missed);
	}


});
