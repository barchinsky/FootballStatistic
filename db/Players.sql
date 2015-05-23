DROP TABLE IF EXISTS Players;

create table Players(
	id int NOT NULL AUTO_INCREMENT,
	firstName char(15) CHARACTER SET utf8 DEFAULT "NONANE",
	secondName char(25) CHARACTER SET utf8 DEFAULT "NOSECONDNAME",
	dateOfBirth date,
	teamId int,
	goals int DEFAULT 0,
	assists int DEFAULT 0,
	rCards int DEFAULT 0,
	yCards int DEFAULT 0,
	gamesPlayed int DEFAULT 0,
	seasonId int,
	CONSTRAINT FK_PLAYERS_TEAMS FOREIGN KEY (teamId) REFERENCES Teams (id),
	CONSTRAINT FK_PLAYERS_SEASON FOREIGN KEY (seasonId) REFERENCES Seasons(id),
	PRIMARY KEY (id)
);