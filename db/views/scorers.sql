DROP VIEW IF EXISTS Scorers;

CREATE VIEW Scorers as (
    select \
        p.firstName,\
        p.secondName,\
        (select name from Teams where id=(select teamId from Players where id=playerId) ) team,\
        sum(g.goalNumber) as goals,\
        ( select count(*) \
            from Games \
            where \
                homeTeamId=(select teamId from Players where id=playerId) \
                or \
                guestTeamId = (select teamId from Players where id=playerId) ) as games,\
        g.seasonId
    from Goals g,Players p \
    where p.id = playerId \
    group by g.playerId
);
