-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: FootballStatisticProd
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Cards`
--

DROP TABLE IF EXISTS `Cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `playerId` int(11) DEFAULT NULL,
  `gameId` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL COMMENT ' 0 is yellow, 1 is red',
  `seasonId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_CARDS_PLAYERS` (`playerId`),
  KEY `FK_CARDS_GAMES` (`gameId`),
  KEY `FK_CARDS_SEASONS` (`seasonId`),
  CONSTRAINT `FK_CARDS_PLAYERS` FOREIGN KEY (`playerId`) REFERENCES `Players` (`id`),
  CONSTRAINT `FK_CARDS_GAMES` FOREIGN KEY (`gameId`) REFERENCES `Games` (`id`),
  CONSTRAINT `FK_CARDS_SEASONS` FOREIGN KEY (`seasonId`) REFERENCES `Seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cards`
--

LOCK TABLES `Cards` WRITE;
/*!40000 ALTER TABLE `Cards` DISABLE KEYS */;
INSERT INTO `Cards` VALUES (1,15,1,0,1),(2,14,1,1,1),(3,14,1,0,1),(4,17,2,0,1),(5,25,3,0,1),(6,32,4,0,1);
/*!40000 ALTER TABLE `Cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Games`
--

DROP TABLE IF EXISTS `Games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `homeTeamId` int(11) DEFAULT NULL,
  `guestTeamId` int(11) DEFAULT NULL,
  `homeTeamGoals` int(11) DEFAULT '0',
  `guestTeamGoals` int(11) DEFAULT '0',
  `homeTeamRC` int(11) DEFAULT '0',
  `guestTeamRC` int(11) DEFAULT '0',
  `homeTeamYC` int(11) DEFAULT '0',
  `guestTeamYC` int(11) DEFAULT '0',
  `gameDate` date DEFAULT '2015-01-01',
  `seasonId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_GAMES_HOMETEAM_ID` (`homeTeamId`),
  KEY `FK_GAMES_GUESTTEAM_ID` (`guestTeamId`),
  KEY `FK_GAMES_GAME_SEASON` (`seasonId`),
  CONSTRAINT `FK_GAMES_HOMETEAM_ID` FOREIGN KEY (`homeTeamId`) REFERENCES `Teams` (`id`),
  CONSTRAINT `FK_GAMES_GUESTTEAM_ID` FOREIGN KEY (`guestTeamId`) REFERENCES `Teams` (`id`),
  CONSTRAINT `FK_GAMES_GAME_SEASON` FOREIGN KEY (`seasonId`) REFERENCES `Seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Games`
--

LOCK TABLES `Games` WRITE;
/*!40000 ALTER TABLE `Games` DISABLE KEYS */;
INSERT INTO `Games` VALUES (1,9,3,5,7,0,1,0,2,'2015-10-31',1),(2,10,6,5,4,0,0,1,0,'2015-10-31',1),(3,8,1,5,8,0,0,1,0,'2015-11-01',1),(4,2,7,6,3,0,0,1,0,'2015-11-01',1);
/*!40000 ALTER TABLE `Games` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER updateTeamStatistic AFTER INSERT ON Games
	FOR EACH ROW
	BEGIN
		
		update Teams as t set t.goalsScored = t.goalsScored + NEW.homeTeamGoals where t.id = NEW.homeTeamId; 
		update Teams as t set t.goalsScored = t.goalsScored + NEW.guestTeamGoals where t.id = NEW.guestTeamId; 

		
		update Teams as t SET t.goalsMissed=t.goalsMissed + NEW.guestTeamGoals where t.id = NEW.homeTeamId; 
		update Teams as t SET t.goalsMissed=t.goalsMissed + NEW.homeTeamGoals where t.id = NEW.guestTeamId; 

		
		if NEW.homeTeamGoals > NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.homeTeamId and NEW.seasonId = t.seasonId;
		elseif NEW.homeTeamGoals < NEW.guestTeamGoals then
			update Teams as t set t.points = t.points + 3 where t.id = NEW.guestTeamId and NEW.seasonId = t.seasonId;
		else
			update Teams as t set t.points = t.points + 1 where t.id = NEW.homeTeamId and NEW.seasonId = t.seasonId;
			update Teams as t set t.points = t.points + 1 where t.id = NEW.guestTeamId and NEW.seasonId = t.seasonId;
		end if;

		
		update Teams as t set t.gamesPlayed=t.gamesPlayed + 1 where t.id = NEW.homeTeamId;
		update Teams as t set t.gamesPlayed=t.gamesPlayed + 1 where t.id = NEW.guestTeamId;
	
	END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `Goals`
--

DROP TABLE IF EXISTS `Goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Goals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gameId` int(11) DEFAULT NULL,
  `playerId` int(11) DEFAULT NULL,
  `goalNumber` int(11) DEFAULT NULL,
  `seasonId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_GOALS_GAMES` (`gameId`),
  KEY `FK_GOALS_PLAYERS` (`playerId`),
  KEY `FK_GOALS_SEASONS` (`seasonId`),
  CONSTRAINT `FK_GOALS_GAMES` FOREIGN KEY (`gameId`) REFERENCES `Games` (`id`),
  CONSTRAINT `FK_GOALS_PLAYERS` FOREIGN KEY (`playerId`) REFERENCES `Players` (`id`),
  CONSTRAINT `FK_GOALS_SEASONS` FOREIGN KEY (`seasonId`) REFERENCES `Seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Goals`
--

LOCK TABLES `Goals` WRITE;
/*!40000 ALTER TABLE `Goals` DISABLE KEYS */;
INSERT INTO `Goals` VALUES (1,1,8,2,1),(2,1,5,1,1),(3,1,11,1,1),(4,1,12,3,1),(5,1,13,3,1),(6,1,14,1,1),(7,1,9,1,1),(8,2,16,2,1),(9,2,17,2,1),(10,2,18,1,1),(11,2,20,2,1),(12,2,21,2,1),(13,3,22,3,1),(14,3,23,1,1),(15,3,38,1,1),(16,3,37,2,1),(17,3,24,1,1),(18,3,36,4,1),(19,3,39,1,1),(20,3,30,2,1),(21,3,33,1,1),(22,3,34,2,1),(23,4,32,1,1),(24,4,31,2,1),(25,4,35,1,1);
/*!40000 ALTER TABLE `Goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Players`
--

DROP TABLE IF EXISTS `Players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Players` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` char(15) CHARACTER SET utf8 DEFAULT 'NONANE',
  `secondName` char(25) CHARACTER SET utf8 DEFAULT 'NOSECONDNAME',
  `dateOfBirth` date DEFAULT NULL,
  `teamId` int(11) DEFAULT NULL,
  `seasonId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_PLAYERS_TEAMS` (`teamId`),
  KEY `FK_PLAYERS_SEASON` (`seasonId`),
  CONSTRAINT `FK_PLAYERS_SEASON` FOREIGN KEY (`seasonId`) REFERENCES `Seasons` (`id`),
  CONSTRAINT `FK_PLAYERS_TEAMS` FOREIGN KEY (`teamId`) REFERENCES `Teams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Players`
--

LOCK TABLES `Players` WRITE;
/*!40000 ALTER TABLE `Players` DISABLE KEYS */;
INSERT INTO `Players` VALUES (1,'Иван','Щигорев',NULL,9,1),(2,'Вадим','Орлов',NULL,9,1),(3,'Андрей','Лопаков',NULL,9,1),(4,'Максим','Барчинский',NULL,9,1),(5,'Богдан','Кливчуцкий',NULL,9,1),(6,'Константин','Баранов',NULL,9,1),(7,'Александр','Орищук',NULL,9,1),(8,'Александр','Добровольский',NULL,9,1),(9,'Артем','Борисовский',NULL,9,1),(10,'Виталий','Ершов',NULL,9,1),(11,'Роман','Сиденко',NULL,9,1),(12,'А.','Дорош',NULL,3,1),(13,'А.','Бондарюк',NULL,3,1),(14,'А.','Шрунь',NULL,3,1),(15,'А.','Товпыга',NULL,3,1),(16,'А.','Дубов',NULL,10,1),(17,'А.','Лискович',NULL,10,1),(18,'А.','Тинкован',NULL,10,1),(19,'Андрей','Лисовский',NULL,10,1),(20,'А.','Барковский',NULL,6,1),(21,'А.','Лебедев',NULL,6,1),(22,'А.','Балакин',NULL,8,1),(23,'А.','Пасечный',NULL,8,1),(24,'С.','Пасечный',NULL,8,1),(25,'А.','Чеботарев',NULL,8,1),(30,'А.','Гуменюк',NULL,2,1),(31,'А.','Лосяк',NULL,2,1),(32,'А.','Кошевой',NULL,2,1),(33,'А.','Коваль',NULL,2,1),(34,'М.','Ханжин',NULL,7,1),(35,'А.','Буравицкий',NULL,7,1),(36,'А.','Бодачев',NULL,1,1),(37,'А.','Баев',NULL,1,1),(38,'А.','Чаленко',NULL,1,1),(39,'А.','Лобанов',NULL,1,1);
/*!40000 ALTER TABLE `Players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Seasons`
--

DROP TABLE IF EXISTS `Seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Seasons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Seasons`
--

LOCK TABLES `Seasons` WRITE;
/*!40000 ALTER TABLE `Seasons` DISABLE KEYS */;
INSERT INTO `Seasons` VALUES (1,'2015-2016(W)');
/*!40000 ALTER TABLE `Seasons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Teams`
--

DROP TABLE IF EXISTS `Teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(15) CHARACTER SET utf8 DEFAULT 'NONAME',
  `seasonId` int(11) DEFAULT NULL,
  `points` int(11) DEFAULT '0',
  `goalsScored` int(11) DEFAULT '0',
  `goalsMissed` int(11) DEFAULT '0',
  `gamesPlayed` int(11) DEFAULT '0',
  `fouls` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_TEAMS_SEASONID` (`seasonId`),
  CONSTRAINT `FK_TEAMS_SEASONID` FOREIGN KEY (`seasonId`) REFERENCES `Seasons` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Teams`
--

LOCK TABLES `Teams` WRITE;
/*!40000 ALTER TABLE `Teams` DISABLE KEYS */;
INSERT INTO `Teams` VALUES (1,'Инваспорт',1,3,8,5,1,0),(2,'Кобера',1,3,6,3,1,0),(3,'Ульяновка',1,3,7,5,1,0),(4,'Тотал',1,0,0,0,0,0),(5,'СБУ',1,0,0,0,0,0),(6,'ГрАвт',1,0,4,5,1,0),(7,'Ингул',1,0,3,6,1,0),(8,'Варваровка',1,0,5,8,1,0),(9,'GlobalLogic',1,0,5,7,1,0),(10,'GBC',1,3,5,4,1,0);
/*!40000 ALTER TABLE `Teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `playersSeasonStatistic`
--

DROP TABLE IF EXISTS `playersSeasonStatistic`;
/*!50001 DROP VIEW IF EXISTS `playersSeasonStatistic`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `playersSeasonStatistic` (
  `firstName` tinyint NOT NULL,
  `secondName` tinyint NOT NULL,
  `team` tinyint NOT NULL,
  `goals` tinyint NOT NULL,
  `red` tinyint NOT NULL,
  `yellow` tinyint NOT NULL,
  `seasonId` tinyint NOT NULL,
  `teamId` tinyint NOT NULL,
  `season` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `seasonResults`
--

DROP TABLE IF EXISTS `seasonResults`;
/*!50001 DROP VIEW IF EXISTS `seasonResults`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `seasonResults` (
  `TeamId` tinyint NOT NULL,
  `Team` tinyint NOT NULL,
  `Games` tinyint NOT NULL,
  `Points` tinyint NOT NULL,
  `Goals` tinyint NOT NULL,
  `GA` tinyint NOT NULL,
  `SeasonId` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `playersSeasonStatistic`
--

/*!50001 DROP TABLE IF EXISTS `playersSeasonStatistic`*/;
/*!50001 DROP VIEW IF EXISTS `playersSeasonStatistic`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `playersSeasonStatistic` AS (select `p`.`firstName` AS `firstName`,`p`.`secondName` AS `secondName`,`t`.`name` AS `team`,(select sum(`g`.`goalNumber`) from `Goals` `g` where ((`g`.`playerId` = `p`.`id`) and (`g`.`seasonId` = `s`.`id`))) AS `goals`,(select count(0) from `Cards` `c` where ((`c`.`playerId` = `p`.`id`) and (`c`.`type` = '1') and (`c`.`seasonId` = `s`.`id`))) AS `red`,(select count(0) from `Cards` `c` where ((`c`.`playerId` = `p`.`id`) and (`c`.`type` = '0') and (`c`.`seasonId` = `s`.`id`))) AS `yellow`,`s`.`id` AS `seasonId`,`p`.`teamId` AS `teamId`,`s`.`name` AS `season` from ((`Players` `p` left join `Teams` `t` on((`t`.`id` = `p`.`teamId`))) left join `Seasons` `s` on((`s`.`id` = `p`.`seasonId`)))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `seasonResults`
--

/*!50001 DROP TABLE IF EXISTS `seasonResults`*/;
/*!50001 DROP VIEW IF EXISTS `seasonResults`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `seasonResults` AS (select `t`.`id` AS `TeamId`,`t`.`name` AS `Team`,`t`.`gamesPlayed` AS `Games`,`t`.`points` AS `Points`,`t`.`goalsScored` AS `Goals`,`t`.`goalsMissed` AS `GA`,`t`.`seasonId` AS `SeasonId` from `Teams` `t` order by `t`.`points` desc,(`t`.`goalsScored` - `t`.`goalsMissed`) desc) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-11-04 23:58:43
