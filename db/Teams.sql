DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS Games;
DROP TABLE IF EXISTS Teams;

create table Teams(
	id int NOT NULL AUTO_INCREMENT,
	name char(15) CHARACTER SET utf8 DEFAULT 'NONAME',
	seasonId int,
	points int DEFAULT 0,
	goalsScored int DEFAULT 0,
	goalsMissed int DEFAULT 0,
	gamesPlayed int DEFAULT 0,
	fouls int DEFAULT 0,
	CONSTRAINT FK_TEAMS_SEASONID FOREIGN KEY (seasonId) REFERENCES Seasons(id),
	PRIMARY KEY(id)
);