#!/bin/bash

./db.sh < testdata/2015-2016/seasons.sql
./db.sh < testdata/2015-2016/teams.sql
./db.sh < testdata/2015-2016/players.sql
./db.sh < testdata/2015-2016/games.sql
