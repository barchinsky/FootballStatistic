INSERT INTO Teams(name,seasonId) VALUES("Real Madrid FC", (select id from Seasons where name="2014-2015"));
INSERT INTO Teams(name,seasonId) VALUES("Barcelona FC", (select id from Seasons where name="2014-2015"));
INSERT INTO Teams(name,seasonId) VALUES("Sevilia FC", (select id from Seasons where name="2014-2015"));
INSERT INTO Teams(name,seasonId) VALUES("Atletico FC", (select id from Seasons where name="2014-2015"));