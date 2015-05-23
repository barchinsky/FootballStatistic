DROP TABLE IF EXISTS Games;

create table Games(
	id int AUTO_INCREMENT NOT NULL,
	homeTeamId int,
	guestTeamId int,
	homeTeamGoals int DEFAULT 0,
	guestTeamGoals int DEFAULT 0,
	homeTeamRC int DEFAULT 0,
	guestTeamRC int DEFAULT 0,
	homeTeamYC int DEFAULT 0,
	guestTeamYC int DEFAULT 0,
	homeTeamFouls int DEFAULT 0,
	guestTeamFouls int DEFAULT 0,
	homeTeamScorers varchar(150) DEFAULT '',
	guestTeamScorers varchar(150) DEFAULT '',
	gameDate date DEFAULT '2015-01-01',
	seasonId int NOT NULL,
	CONSTRAINT FK_GAMES_HOMETEAM_ID FOREIGN KEY (homeTeamId) REFERENCES Teams (id),
	CONSTRAINT FK_GAMES_GUESTTEAM_ID FOREIGN KEY (guestTeamId) REFERENCES Teams (id),
	CONSTRAINT FK_GAMES_GAME_SEASON FOREIGN KEY (seasonId) REFERENCES Seasons (id),
	PRIMARY KEY (id)
);