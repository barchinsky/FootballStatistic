-- gameId, playerId, goalNumber

DROP TABLE IF EXISTS Goals;

CREATE TABLE Goals(
	id int NOT NULL AUTO_INCREMENT,
	gameId int,
	playerId int,
	goalNumber int,
	seasonId int,
	CONSTRAINT FK_GOALS_GAMES FOREIGN KEY (gameId) REFERENCES Games(id),
	CONSTRAINT FK_GOALS_PLAYERS FOREIGN KEY (playerId) REFERENCES Players(id),
	CONSTRAINT FK_GOALS_SEASONS FOREIGN KEY (seasonId) REFERENCES Seasons(id),
	PRIMARY KEY (id)
);