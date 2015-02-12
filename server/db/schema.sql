SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

CREATE DATABASE IF NOT EXISTS `kuwaitandme` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `kuwaitandme`;

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
	`id` int(2) NOT NULL AUTO_INCREMENT,
	`parent` int(2) DEFAULT NULL,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `ci_sessions`;
CREATE TABLE IF NOT EXISTS `ci_sessions` (
	`session_id` varchar(40) COLLATE utf8_bin NOT NULL DEFAULT '0',
	`ip_address` varchar(16) COLLATE utf8_bin NOT NULL DEFAULT '0',
	`user_agent` varchar(150) COLLATE utf8_bin NOT NULL,
	`last_activity` int(10) unsigned NOT NULL DEFAULT '0',
	`user_data` text COLLATE utf8_bin NOT NULL,
	PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS `classified`;
CREATE TABLE IF NOT EXISTS `classified` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`title` varchar(255) COLLATE utf8_bin  NOT NULL,
	`description` text COLLATE utf8_bin  NOT NULL,
	`category` int(2) NOT NULL,
	`attributes` enum('0','1','2','3') DEFAULT NULL COMMENT '0:None,1:Free,2:Urgent,3:Promote',
	`type` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:Want,1:Sale',
	`price` decimal(10, 2) NOT NULL,
	`saleby` enum('1','2') NOT NULL COMMENT '1:Owner,2:Distributer',
	`phone` varchar(255) DEFAULT NULL,
	`email` varchar(255) DEFAULT NULL,
	`location` int(3) NOT NULL,
	`language` int(3) DEFAULT 0,
	`address1` varchar(255) DEFAULT NULL,
	`address2` varchar(255) DEFAULT NULL,
	`meta` text,
	`owner` int(11) NOT NULL,
	`is_guest` tinyint(1) NOT NULL DEFAULT '0',
	`status` enum('0','1','2','3','4') NOT NULL DEFAULT '0' COMMENT '0:Inactive,1:Active,2:Archived,3:Banned,4:expired',
	`daycreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

DROP TABLE IF EXISTS `classified_image`;
CREATE TABLE IF NOT EXISTS `classified_image` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`cid` int(11) NOT NULL,
	`url` varchar(1024) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

DROP TABLE IF EXISTS `guest`;
CREATE TABLE IF NOT EXISTS `guest` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`classified` int(11) NULL DEFAULT -1,
	`auth_hash` varchar(512) NOT NULL,
	`banned` tinyint(1) NOT NULL DEFAULT '0',
	`ban_reason` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	`last_ip` varchar(40) COLLATE utf8_bin NOT NULL,
	`last_login` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
	`created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS `location`;
CREATE TABLE IF NOT EXISTS `location` (
	`id` int(2) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `language`;
CREATE TABLE IF NOT EXISTS `language` (
	`id` int(2) NOT NULL AUTO_INCREMENT,
	`name` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

DROP TABLE IF EXISTS `login_attempts`;
CREATE TABLE IF NOT EXISTS `login_attempts` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`ip_address` varchar(40) COLLATE utf8_bin NOT NULL,
	`login` varchar(50) COLLATE utf8_bin NOT NULL,
	`time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=5 ;

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`username` varchar(50) COLLATE utf8_bin NOT NULL,
	`password` varchar(255) COLLATE utf8_bin NOT NULL,
	`email` varchar(100) COLLATE utf8_bin NOT NULL,
	`activated` tinyint(1) NOT NULL DEFAULT '1',
	`banned` tinyint(1) NOT NULL DEFAULT '0',
	`ban_reason` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	`new_password_key` varchar(50) COLLATE utf8_bin DEFAULT NULL,
	`new_password_requested` datetime DEFAULT NULL,
	`new_email` varchar(100) COLLATE utf8_bin DEFAULT NULL,
	`new_email_key` varchar(50) COLLATE utf8_bin DEFAULT NULL,
	`last_ip` varchar(40) COLLATE utf8_bin NOT NULL,
	`last_login` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
	`created` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
	`modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS `user_autologin`;
CREATE TABLE IF NOT EXISTS `user_autologin` (
	`key_id` char(32) COLLATE utf8_bin NOT NULL,
	`user_id` int(11) NOT NULL DEFAULT '0',
	`user_agent` varchar(150) COLLATE utf8_bin NOT NULL,
	`last_ip` varchar(40) COLLATE utf8_bin NOT NULL,
	`last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`key_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

DROP TABLE IF EXISTS `user_profiles`;
CREATE TABLE IF NOT EXISTS `user_profiles` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`user_id` int(11) NOT NULL,
	`name` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	`meta` text COLLATE utf8_bin NULL,
	`gender` enum('0', '1', '2') DEFAULT NULL COMMENT '0:Male,1:Female,2:Other',
	`phone` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	`email` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	`location` int(3) COLLATE utf8_bin DEFAULT NULL,
	`nationality` int(3) COLLATE utf8_bin DEFAULT NULL,
	`address1` text COLLATE utf8_bin DEFAULT NULL,
	`address2` text COLLATE utf8_bin DEFAULT NULL,
	`verified` tinyint(1) COLLATE utf8_bin DEFAULT 0,
	`website` varchar(255) COLLATE utf8_bin DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;