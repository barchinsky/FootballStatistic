drop view if exists seasonResults;

CREATE VIEW seasonResults as(
	select t.id as TeamId,t.name as Team, t.gamesPlayed as Games, t.points as Points, t.goalsScored as Goals, t.goalsMissed as `GA`, seasonId as SeasonId from Teams as t
	ORDER BY (t.points) DESC, (t.goalsScored - t.goalsMissed) DESC
);
