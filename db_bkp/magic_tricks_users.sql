-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: magic_tricks
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `show_password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `otp` int DEFAULT NULL,
  `otp_verified` tinyint(1) DEFAULT '0',
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `event_type` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company_name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_time` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','7248440590','testinghn1@gmail.com','$2b$10$LvbWsLY6F5xn2CKnE5EbI.3K3ZZ9TOPzSc5ksQfHfov9BusrlSwGa','123456',NULL,1,NULL,NULL,NULL,NULL,'2026-01-05 17:43:51'),(2,NULL,'divesh','divesh@gmail.com','$2b$10$XXio7Yf9zbZiEbnHFIBKD.2UBWdL6YxYKY8bfQccYXKnR0aBctGS.','1234',NULL,0,NULL,NULL,NULL,NULL,'2026-01-05 17:44:10'),(3,NULL,'Manij','m@gmail.com','$2b$10$715SlEzgyvkArvrOD9Q6xOcgOVHDxERmPBpQyOMNPhMazl1aZUiji','123456',NULL,0,NULL,NULL,NULL,NULL,'2026-01-05 17:47:22'),(5,NULL,'9589455168',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 10:59:59'),(6,NULL,'Pardeep','diveshinmmortal@gmail.com','$2b$10$43eagOb8qVZHw1Hwt5PJ2uMyKRbr9xpYlOZ8fhwC3RWEiqXO5O/qK','123456',NULL,0,NULL,NULL,NULL,NULL,'2026-01-06 11:17:49'),(7,NULL,'Shruti','shrutiinmortal@gmail.com','$2b$10$B3dxJ9O2wf4TEj5hng6UyeEPR/5BLjvGlxE6lAtXB9YzSwex9FLe.','1234',NULL,0,NULL,NULL,NULL,NULL,'2026-01-06 11:21:28'),(8,'kunal','7355453958','diveshinmmortal@gmail.com','$2b$10$CQHt3qHOO2tMJvRZClzsGu.ToxBujN/wJKSE12ofvZ3denN1mKreW','4321',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 11:30:22'),(9,'Ashu','9887109618','ashuworld13@gmail.com','$2b$10$bpsK34EbjagLYxbDcwDH4u6q5jG7fsH3ILo9M.6.yQaLN3vjkKx6C','12233',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 11:36:56'),(10,'Mannan','6200005378','diveshinmmortal@gmail.com','$2b$10$cdCmtRmTsvkw0EMcQUHcPORIx0UBDV4DWKO7oSkn.U9g46FH.fP9W','620000',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 11:40:04'),(11,'Shruti','9717350122','shrutiinmortal@gmail.com','$2b$10$YXx1JXpvu1cMRPIw1KINEu/Mx4.pXRBBIBxtt.b2F1pOzxtXWKr9S','1234',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 12:50:06'),(12,'danish','1234567899','danish123@gmail.com','$2b$10$JODGniHTY65/eKGXLx0qD.xYYkSJmwEQ.fAwiloTVCQ2lTd.euvoC','1234',NULL,0,NULL,NULL,NULL,NULL,'2026-01-06 13:45:51'),(13,NULL,'1234567890',NULL,NULL,NULL,300703,0,NULL,NULL,NULL,NULL,'2026-01-06 13:48:35'),(14,'Divya','8368165030','divya@gmail.com','$2b$10$Y8jOYPVkE0FU7Q0ElC9EEeTgOiT9tQjrSf5nbBWC.XDQHbNkOZswO','1234',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 13:54:16'),(15,'shr','+911234567899','shr@gmail.com',NULL,NULL,NULL,0,'noida','Corporate Event','1234',NULL,'2026-01-06 15:01:00'),(16,NULL,'2133133222',NULL,NULL,NULL,525743,0,NULL,NULL,NULL,NULL,'2026-01-06 15:39:01'),(17,'neha','+911234567890','neha@gmail.com',NULL,NULL,NULL,0,'1234','Family Event','1234',NULL,'2026-01-06 15:56:23'),(18,'Ashwiji','9311473555','info@ashwinikumarraj.com','$2b$10$pxUsYCmG0uai/wjLzIcNu.jGmTAhCAdrRRb0Ud2ydVnBKEbTTE/c6','Magic@2026',NULL,1,NULL,NULL,NULL,NULL,'2026-01-06 23:05:57');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-19 16:30:36
