mainApp.controller("seasonController",function($scope,$http){
	// $scope.seasons = ["2013-2014","2014-2015","2015-2016"];
	console.log("controller");

	// $("#notification").hide();

	$scope.alerts=["success","info","warning","danger"]
	$scope.alertType="warning";

	var host="http://10.105.30.70:9800";

	$scope.isAdmin = true;
	$scope.isAuthorized = false;
	$scope.isAsc = false;
	$scope.currentUser = "";

	$scope.currentPageUrl = 'static/home.htm';
	$scope.addActionItems = [{title:"Team",url:"static/addTeam.htm"},{title:"Season",url:"static/addSeason.htm"},{title:"Game",url:"static/addGameProtocol.htm"},{title:"Players",url:"static/addPlayers.htm"}];
	$scope.editActionItems = [{title:"Game",url:"static/404.htm"},{title:"Players",url:"static/404.htm"}];
	$scope.seasonResultHeaders = ["#","Team","Games","Goals","GA","Fouls","Points"];
	$scope.playerStatHeaders= [{title:"#",fieldName:""},{title:"First name",fieldName:"firstName"},{title:"Second name",fieldName:"secondName"},{title:"Goals",fieldName:"goals"},{title:"Assists",fieldName:"assists"},{title:"Efficiency(g+a)",fieldName:"efficiency"},{title:"Red cards",fieldName:"rCards"},{title:"Yellow cards",fieldName:"yCards"}]; // ,{title:"Birth",fieldName:"dateOfBirth"}


	$scope.arrowUp = "<img id='arrowUp' src='media/arrowUp.png'/>";
	$scope.arrowDown = "<img id='arrowDown' src='media/arrowDown.png'/>";

	$scope.gmd=[]; // games dates list
	
	
	$scope.playersSeasonStatistic = []; // players statistic in season

	// used in add team dialog
	$scope.playersNumber = 1; // number of players in team
	$scope.players=[{}]; // list of players to add to team
	// end add team dialog vars

	$scope.seasonParticipants = []; // list of teams in season
	$scope.teamIdMap = {}; // name is a key, id is a value
	$scope.teamNameMap = {}; // id is a key, name is a value
	// $scope.teams = [{}];

	$scope.homeTeamSquad = [{}]; // squad of home team
	$scope.guestTeamSquad = [{}]; // squad of guest team

	$scope.seasonResults = []; // list of teamsresults in the season
	$scope.teamGames = [{}]; // list of games for special team
	$scope.teamSeasonHistory = [{}]; // array of game objects

	$scope.selectedTeam = ""; // team name displayed in teamGameStatistic.htm
	$scope.notificationText = "";

	// $scope.gameDate = ""; // ???????

	$scope.newsList = [{date:"May 21, 2015 ",img:"media/news2.png",heading:"Next game this Saturday!",text:"We will play our next game against guys from Vympel! Come to support us, Globytes! Game will be held on Saturday, May 23, at 15-00 near central city stadium."},{date:"May 20, 2015",img:"media/start3.jpg",heading:"Hi, this is our first news!",text:"We will try to take you up to date info about all important GL team events!"}]


	$scope.initGame = function(){
		console.log("controller:initGame()");

		// Game structure description
		$scope.game = {home:{},guest:{}};
		$scope.game.home.goals = 0;
		$scope.game.home.rcNum = 0;
		$scope.game.home.ycNum = 0;
		$scope.game.home.scorers = [];
		$scope.game.home.ycOwners=[];
		$scope.game.home.rcOwners=[];
		// $scope.game.home.id = -1;
		$scope.game.home.fouls=0;
		$scope.game.home.team = "";

		$scope.game.guest.goals = 0;
		$scope.game.guest.ycNum = 0;
		$scope.game.guest.rcNum = 0;
		$scope.game.guest.scorers = [];
		$scope.game.guest.ycOwners=[];
		$scope.game.guest.rcOwners = [];
		$scope.game.guest.id = -1;
		$scope.game.guest.fouls=0;
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
		$scope.loadSeasonResults();

		console.log("~setSeason()");
	}

	$scope.route = function(url,opt){
		console.log("route()");
		console.log("route"+url);

		// $scope.resetData();
		if(opt){ $scope.loadTeamGames(opt); }

		$scope.currentPageUrl = url;

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
					$scope.loadSeasonResults();

					$scope.resetData();
					
				}
				else{
					$scope.notify("Team NOT added!."+response["msg"],3);
				}
			});
		}

		console.log("~addTeam()");
	}

	$scope.addPlayers = function(teamName){
		console.log("addPlayers()");

		console.log("team:"+teamName+" season:"+$scope.currentSeason.name);

		for(i=0; i < $scope.players.length;i++){
			// console.log("name:"+$scope.players[i].name+" SecondName:"+$scope.players[i].secondName+" phone:"+$scope.players[i].phone+" birthDate"+$scope.players[i].dateOfBirth);
			if(!$scope.isValidDate($scope.players[i].dateOfBirth)) { $scope.notify("Invalid date of birth.",3); return; }
		}

		if($scope.currentSeason.name=="Pick season" || teamName.length == 0){ $scope.notify("Invalid input data. Please pick season and team.",2); return; }

		var teamId = $scope.teamIdMap[teamName];

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

	$scope.addGame = function(){
		console.log("addGame()");

		// input data validation
		if($scope.currentSeason.name=="Pick season"){ $scope.notify("Please, select season.",2); return;}
		if(!$scope.isValidDate($scope.game.date)){ $scope.notify("Invalid date format! Should be 'yyyy-mm-dd'. Please fix and try again",3); return;}
		if(!$scope.game.home.team){ $scope.notify("Please select home team.",2); return; }
		if(!$scope.game.guest.team){ $scope.notify("Please select guest team.",2); return; }
		if($scope.game.home.team == $scope.game.guest.team) { $scope.notify("Team can't play agains themselves!",2); return; }

		console.log("game.date"+$scope.game.date);
		
		$scope.game.season=$scope.currentSeason.id;
		// console.log($scope.currentSeason,"season:"+$scope.game.season);

		$scope.game.home.id = $scope.teamIdMap[$scope.game.home.team];
		$scope.game.guest.id = $scope.teamIdMap[$scope.game.guest.team];

		// console.log("$scope.game.home.id"+$scope.game.home.id+" "+$scope.game.home.team);
		// console.log("$scope.game.guest.id"+$scope.game.guest.id+" "+$scope.game.guest.team);
		// console.log("game:"+$scope.game);

		// return;

		$http.post(host+"/addGame",{game:$scope.game}).success(function(response){
			console.log("controller:addGame()::response",response);

			if(response["status"]=="1"){
				$scope.notify("Game added successfuly.",0);
				$scope.resetData();
			}
		});

		$scope.initGame();

		$scope.loadSeasonResults();

		console.log("~addGame()");
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

	$scope.loadSeasonResults = function(){
		console.log("loadSeasonResults()");

		$http.post(host+"/seasonResults",{seasonId:$scope.currentSeason.id}).success(function(data){
			// $scope.processResponse(data);
			$scope.seasonResults=data["data"];

			$scope.seasonParticipants = [];

			console.log($scope.seasonResults);
			// console.log("$scope.seasonResults.length"+$scope.seasonResults['data'].length);
			for(i = 0; i < $scope.seasonResults.length;i++)
			{
				var team = $scope.seasonResults[i]['Team'];
				var teamId = $scope.seasonResults[i]["TeamId"];
				// console.log($scope.seasonResults[i].fouls);
				$scope.teamIdMap[team] = teamId;
				$scope.teamNameMap[teamId] = team;
				// console.log(team);
				$scope.seasonParticipants.push(team);
			}

			console.log("loadSeasonResults::$scope.seasonParticipants:"+$scope.seasonParticipants);

		});

		console.log("~controller::loadSeasonResults()");
	}

	$scope.loadTeamSquad = function(teamName, storage){
		// storage - var that specify either home or guest teams squad
		// 1 - home team squad
		// 0 - guest team squad
		console.log("loadTeamSquad()");

		// console.log("guestGoals",$scope.guestGoals);


		console.log("loadTeamSquad::teamName:"+teamName+" storage:"+ storage);

		$http.post(host+"/loadTeamSquad",{team:teamName}).success(function(response){
			// console.log("response:",response);
			if(storage){
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

		$scope.selectedTeam = team;

		console.log("teamID="+$scope.teamIdMap[team]+" team:"+team+" teamIdMap"+$scope.teamIdMap);

		$http.post(host+"/teamGames",{teamId:$scope.teamIdMap[team],seasonId:$scope.currentSeason.id}).success(function(data){
			console.log("controller::loadTeamGames():data:"+data["data"]);
			$scope.teamGameStatistic = data["data"];
		});


		console.log("~controller::loadTeamGames()");
	}


	$scope.getSeasons = function(){
		console.log("getSeasons()");

		$http.post(host+"/getSeasons").success(function(response){
			$scope.seasons = response["data"];
			// console.log("getSeasons::$scope.seasons"+$scope.seasons);
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
	$scope.initGame();


	// ****************************** UTILS *************************************//

	$scope.range = function(n){
		return new Array(n);
	}

	$scope.setCapitan=function(player){
		// player.isCapitan=true;
	}


	$scope.login = function(user,pass){
		console.log("controller:login()");

		if(user=="admin" && pass=="nimda"){
			$scope.isAdmin=true;
			$scope.route("home.htm");
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
		// $scope.currentTeam = "";
		// $scope.teamName = "";
		// $scope.addTeamInputValue = "";
		$scope.players=[{}]; // list of players to add to team
		// $scope.seasonResults = [];/
		$scope.initGame();

		console.log("~controller::resetData()");
	}

		$scope.sort = function(fieldName,list){
		console.log("controller::sort()");

		$scope.displayOrder(fieldName);

		console.log("field:"+fieldName);
		// console.log("event.targer"+$event.target);

		// var sortedList = [];
		//sort

		if(list.length > 0){
			console.log("Table not empty");
			if($scope.isAsc){ // ascending sort
				console.log("$scope.isAsc",$scope.isAsc);

				list=list.sort( function(a,b){
					// sort descending by fieldName
					// console.log("fieldName"+fieldName);

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
		console.log("$scope.seasonResults",$scope.seasonResults,$scope.seasonResults.length);


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
		var formattedDate = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
		console.log(formattedDate)  //prints 26/4/2002
		$scope.gmd[index] = formattedDate;



		// return "2";
	}

	$scope.isValidDate = function(str){
		console.log("controller.isValidDate()");

		var d = new Date(str);

		if(d=="Invalid Date"){
			console.log("Invalid date.");
			return false;
		}
		else{
			console.log(d.toLocaleString());
			return true;
		}

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
});