select \
	p.firstName,\
	p.secondName,\
	t.name as team,\
	( select sum(goalNumber) from Goals g \
		where ( g.playerId = p.id and g.seasonId=s.id) ) as goals,\
	( select count(*) from Cards c \
		where ( c.playerId = p.id and c.type = '1' and c.seasonId = s.id ) ) as red,\
	( select count(*) from Cards c \
		where ( c.playerId = p.id and c.type = '0' and c.seasonId = s.id ) ) as yellow,\
	s.id as seasonId,\
	p.teamId as teamId,\
	s.name as season \
from Players as p \
left join Teams t on t.id=p.teamId \
left join Seasons s on s.id = p.seasonId;
