drop view if exists playersSeasonStatistic;

create view playersSeasonStatistic as(
	select p.firstName,p.secondName,DATE_FORMAT(p.dateOfBirth,"%Y/%m/%e") as dateOfBirth, t.name as team, p.goals, p.assists, p.goals+p.assists as "efficiency", p.rCards, p.yCards, p.gamesPlayed, p.seasonId, p.teamId,s.name from Players as p 
	left join Teams as t on t.id=p.teamId
	left join Seasons as s on s.id = p.seasonId
);
