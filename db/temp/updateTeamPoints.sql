drop trigger if exists update_team_points;

delimiter $$

create trigger update_team_points after insert on Games
	for each row
	begin
		if NEW.homeTeamGoals > NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.homeTeamId;
		elseif NEW.homeTeamGoals < NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.guestTeamId;
		else
			update Teams as t set t.points = t.points + 1 where t.id = NEW.homeTeamId;
			update Teams as t set t.points = t.points + 1 where t.id = NEW.guestTeamId;
		end if;

	end;

$$

delimiter ;