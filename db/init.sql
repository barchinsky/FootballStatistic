DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS Teams;
DROP TABLE IF EXISTS Seasons;

create table Seasons(
	id int NOT NULL AUTO_INCREMENT,
	name char(15),
	PRIMARY KEY(id)
);

INSERT INTO Seasons(name) VALUES("2014-2015");