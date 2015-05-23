-- First tour
-- Oranta 6 - 2 GL
-- Друзья 8 - 3 Вымпел
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,1,4,6,2,"2015-05-02"),
	(1,2,10,8,3,"2015-05-02");

-- Second tour
-- GL 9 - 2 Sandora
-- Vympel 0 - 9 Oranta
-- Status 2 - 2 Druzja
-- Shyrokyi Lan 3 - 8 Ingul
-- United 3 - 0 Moto
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,4,5,9,2,"2015-05-09"),
	(1,10,1,0,9,"2015-05-10"),
	(1,7,2,2,2,"2015-05-10"),
	(1,8,3,3,8,"2015-05-10"),
	(1,6,9,3,0,"2015-05-10");


--Third tour
-- Druzja 10 - 0 Moto
-- Oranta 7 -1 Shyrokyi Lan
-- Vympel 0 - 10 Sandora
-- Status 2 - 3 GL
-- Ingul 2 - 1 United
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,2,9,10,0,"2015-05-16"),
	(1,1,8,7,1,"2015-05-17"),
	(1,10,5,0,10,"2015-05-17"),
	(1,7,4,2,3,"2015-05-17"),
	(1,3,6,2,1,"2015-05-17");


--Fourth tour

-- GlobalLogic games, id = 4
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,1,4,6,2,"2015-11-25"),
	(1,5,4,2,9,"2015-11-25"),
	(1,7,4,2,3,"2015-11-25");

-- Oranta games, id = 1
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,1,8,7,1,"2015-11-25"),
	(1,1,10,9,0,"2015-11-25");
	-- (1,1,4,6,2,"2015-11-25");

-- Широкий Лан, id=8
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,8,3,3,8,"2015-11-25");

-- Ингул, id=3
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,3,6,2,1,"2015-11-25");

-- Мото-мото, id=9
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,9,2,0,10,"2015-11-25"),
	(1,9,6,0,3,"2015-11-25");

-- Сандора, id=5
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,5,10,10,0,"2015-11-25");

-- Вымпел, id=10
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,10,2,3,8,"2015-11-25");

-- Статус, id=7
INSERT INTO Games(seasonId,homeTeamId,guestTeamId,homeTeamGoals,guestTeamGoals,gameDate) VALUES
	(1,7,2,2,2,"2015-11-25");
