-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- 主機: localhost
-- 產生時間： 2018 年 03 月 04 日 22:06
-- 伺服器版本: 5.7.21-0ubuntu0.16.04.1
-- PHP 版本： 7.0.25-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `parkamoto`
--

-- --------------------------------------------------------

--
-- 資料表結構 `admin_push_subscription`
--

CREATE TABLE `admin_push_subscription` (
  `id` int(11) NOT NULL,
  `push_subscription` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `illegal_info`
--

CREATE TABLE `illegal_info` (
  `id` int(10) UNSIGNED NOT NULL,
  `time` datetime DEFAULT NULL,
  `car_number` varchar(10) NOT NULL,
  `parking_lot` varchar(20) NOT NULL,
  `longitude` float NOT NULL,
  `latitude` float NOT NULL,
  `name` varchar(20) NOT NULL,
  `picture` varchar(256) NOT NULL,
  `process_status` varchar(20) NOT NULL,
  `process_time` varchar(20) NOT NULL,
  `processor` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 資料表結構 `push_subscription`
--

CREATE TABLE `push_subscription` (
  `id` int(11) NOT NULL,
  `push_subscription` varchar(1024) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `push_subscription`
--

INSERT INTO `push_subscription` (`id`, `push_subscription`) VALUES
(1, '{"endpoint":"https://fcm.googleapis.com/fcm/send/cp2BY39rItc:APA91bGPB0EwVCMKPDYCUBKr9MqeILfUufBpri1OFNFZzariy27V4P3z2YRVffUakYRNfBPRRjPSoxM0tmFDSXniVRxbet1M2IShpDgVb4DJU1WBTblJvPGncwZ2Oba2a7W1FtVVHf0C","expirationTime":null,"keys":{"p256dh":"BHJUOz3jbFP5ZTgLyMSaawYYeKU1-ObL6vky50mcBI0sCkVGFHAZSwuR13n7MaTMJBPH6QubDnFAr83mPFLIBR8=","auth":"R8ROe0igM05JvIzAZfz64w=="}}');

-- --------------------------------------------------------

--
-- 資料表結構 `user_account`
--

CREATE TABLE `user_account` (
  `id` int(10) UNSIGNED NOT NULL,
  `account` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `car_number` varchar(10) DEFAULT NULL,
  `email` varchar(256) NOT NULL,
  `class` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `user_account`
--

INSERT INTO `user_account` (`id`, `account`, `password`, `car_number`, `email`, `class`) VALUES
(1, '123', '$2a$14$kuYjeGTbEIFBLVG5cDwdSemM9gyx3JuiaxhGF8Z2gsiqMbOx/9v0u', '', 'aaa', 1);

--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `admin_push_subscription`
--
ALTER TABLE `admin_push_subscription`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `illegal_info`
--
ALTER TABLE `illegal_info`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `push_subscription`
--
ALTER TABLE `push_subscription`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `admin_push_subscription`
--
ALTER TABLE `admin_push_subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `illegal_info`
--
ALTER TABLE `illegal_info`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `push_subscription`
--
ALTER TABLE `push_subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- 使用資料表 AUTO_INCREMENT `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
