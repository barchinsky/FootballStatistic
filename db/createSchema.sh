#!/bin/bash

echo "Dropping schema..."
./db.sh < "dropTables.sql"
echo "Schema dropped."

echo "Creating new schema..."

echo "Creating tables..."

./db.sh < "Seasons.sql"
echo "Seasons.sql finished."

./db.sh < "Teams.sql"
echo "Teams.sql finished."

./db.sh < "Players.sql"
echo "Players.sql finished."

./db.sh < "Games.sql"
echo "Games.sql finished."

./db.sh < "Goals.sql"
echo "Goals.sql finished"

./db.sh < "Cards.sql"
echo "Cards.sql finished"

echo "Tables created."

echo "Creating triggers..."

./db.sh < "triggers/updateTeamStatistic.sql"
echo "triggers/updateTeamStatistic.sql finished."

echo "Triggers created."

echo "Creating views..."

./db.sh < "views/seasonResultsView.sql"
./db.sh < "views/playersSeasonStatistic.sql"

echo "Views created."

echo "New schema created."
