UPDATE Teams as t left join Games as g on g.homeTeamId = t.id SET t.goalsScored = (select sum(homeTeamGoals) from Games as g where g.homeTeamId=t.id)

(select g.homeTeamId,sum(g.homeTeamGoals) from Games as g  left join Teams as t  on t.id=g.homeTeamId group by (t.id));

UPDATE Teams as t SET t.goalsScored=(select sum(g.homeTeamGoals) from Games as g where t.id=g.homeTeamId)+(select sum(g.guestTeamGoals) from Games as g where t.id=g.guestTeamId);



UPDATE Teams as t SET t.goalsScored=t.goalsScored + (select sum(g.guestTeamGoals) from Games as g where g.guestTeamId=t.id);
UPDATE Teams as t SET t.goalsScored=(select sum(g.homeTeamGoals) from Games as g where g.homeTeamId=t.id);