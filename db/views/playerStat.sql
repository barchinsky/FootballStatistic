DROP VEIW IF EXISTS Scorers;

CREATE VIEW Scores as (
    select \
        p.firstName,\
        p.secondName,\
        (select name from Teams where id=(select teamId from Players where id=playerId) ) team,\
        sum(g.goalNumber),\
        ( select count(*) \
            from Games \
            where \
                homeTeamId=(select teamId from Players where id=playerId) \
                or \
                guestTeamId = (select teamId from Players where id=playerId) )     as games\
    from Goals g,Players p \
    where p.id = playerId \
    group by playerId
);
