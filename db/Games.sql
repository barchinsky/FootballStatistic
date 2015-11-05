DROP TABLE IF EXISTS Cards;
DROP TABLE IF EXISTS Goals;
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
	gameDate date DEFAULT '2015-01-01',
	seasonId int NOT NULL,
	CONSTRAINT FK_GAMES_HOMETEAM_ID FOREIGN KEY (homeTeamId) REFERENCES Teams (id),
	CONSTRAINT FK_GAMES_GUESTTEAM_ID FOREIGN KEY (guestTeamId) REFERENCES Teams (id),
	CONSTRAINT FK_GAMES_GAME_SEASON FOREIGN KEY (seasonId) REFERENCES Seasons (id),
	PRIMARY KEY (id)
);