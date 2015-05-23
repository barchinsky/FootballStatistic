#!/bin/bash

./db.sh < "testdata/seasons.sql"
./db.sh <"testdata/teams.sql"
./db.sh <"testdata/players.sql"
./db.sh <"testdata/games.sql"
