DROP TRIGGER IF EXISTS updateTeamStatistic;

DELIMITER $$

CREATE TRIGGER updateTeamStatistic AFTER INSERT ON Games
	FOR EACH ROW
	BEGIN
		-- Update goals scored
		update Teams as t set t.goalsScored = t.goalsScored + NEW.homeTeamGoals where t.id = NEW.homeTeamId; -- count scored goals for home team
		update Teams as t set t.goalsScored = t.goalsScored + NEW.guestTeamGoals where t.id = NEW.guestTeamId; -- count scored goals for guest team

		-- Update goals missed
		update Teams as t SET t.goalsMissed=t.goalsMissed + NEW.guestTeamGoals where t.id = NEW.homeTeamId; -- count missed goals for home team
		update Teams as t SET t.goalsMissed=t.goalsMissed + NEW.homeTeamGoals where t.id = NEW.guestTeamId; -- count missed goals for guest team

		-- Update fouls
		update Teams as t SET t.fouls=t.fouls + NEW.homeTeamFouls where t.id = NEW.homeTeamId; -- count home team fouls
		update Teams as t SET t.fouls=t.fouls + NEW.guestTeamFouls where t.id = NEW.guestTeamId; -- count guest team fouls

		-- Add team points
		if NEW.homeTeamGoals > NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.homeTeamId and NEW.seasonId = t.seasonId;
		elseif NEW.homeTeamGoals < NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.guestTeamId and NEW.seasonId = t.seasonId;
		else
			update Teams as t set t.points = t.points + 1 where t.id = NEW.homeTeamId and NEW.seasonId = t.seasonId;
			update Teams as t set t.points = t.points + 1 where t.id = NEW.guestTeamId and NEW.seasonId = t.seasonId;
		end if;

		-- Update team games played
		update Teams as t set t.gamesPlayed=t.gamesPlayed + 1 where t.id = NEW.homeTeamId;
		update Teams as t set t.gamesPlayed=t.gamesPlayed + 1 where t.id = NEW.guestTeamId;
	
	END;
$$

DELIMITER ;