-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2023 at 06:03 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vcsdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `developers`
--

CREATE TABLE `developers` (
  `dev_id` int(10) UNSIGNED NOT NULL,
  `dev_name` varchar(400) NOT NULL,
  `dev_password` varchar(64) NOT NULL,
  `joined` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `developers`
--

INSERT INTO `developers` (`dev_id`, `dev_name`, `dev_password`, `joined`) VALUES
(2, 'Primeagen', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(6, 'Theo', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(7, 'John-Carmack', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(8, 'Jeff-Delany', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(9, 'Cody-Seibert', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(10, 'Matt-12', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(11, 'Todd-J', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(12, 'Laura', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16');

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `org_id` int(11) UNSIGNED NOT NULL,
  `org_name` varchar(400) NOT NULL,
  `org_password` varchar(64) NOT NULL,
  `joined` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`org_id`, `org_name`, `org_password`, `joined`) VALUES
(2, 'OpenAI', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-16'),
(3, 'Meta', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`dev_id`),
  ADD UNIQUE KEY `dev_name` (`dev_name`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`org_id`),
  ADD UNIQUE KEY `org_name_unique` (`org_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `developers`
--
ALTER TABLE `developers`
  MODIFY `dev_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `org_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
