-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2023 at 05:44 AM
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
(4, 'Meta', 'c6ad98bfd4895cf5ca82b9d99582c13508be33f64f0b2a5750f0fb8417b3456b', '2023-10-21');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) UNSIGNED NOT NULL,
  `project_name` varchar(400) NOT NULL,
  `org_id` int(11) UNSIGNED NOT NULL,
  `techlead_name` varchar(400) NOT NULL,
  `developers` int(11) NOT NULL,
  `created` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `org_id`, `techlead_name`, `developers`, `created`) VALUES
(5, 'Llama-2', 4, 'John-Carmack', 4, '2023-10-21'),
(6, 'Falcon-LLM', 4, 'Laura', 2, '2023-10-21'),
(7, 'Meta-QL', 4, 'Todd-J', 3, '2023-10-21');

-- --------------------------------------------------------

--
-- Table structure for table `project_developers`
--

CREATE TABLE `project_developers` (
  `project_id` int(10) UNSIGNED NOT NULL,
  `dev_id` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `project_developers`
--

INSERT INTO `project_developers` (`project_id`, `dev_id`) VALUES
(5, 7),
(5, 12),
(5, 10),
(5, 2),
(6, 8),
(6, 7),
(7, 9),
(7, 8),
(7, 6);

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
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD UNIQUE KEY `unique_project_name` (`project_name`),
  ADD KEY `foreign_org_id` (`org_id`);

--
-- Indexes for table `project_developers`
--
ALTER TABLE `project_developers`
  ADD KEY `foreign_dev_id` (`dev_id`),
  ADD KEY `foreign_project_id` (`project_id`);

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
  MODIFY `org_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `foreign_org_id` FOREIGN KEY (`org_id`) REFERENCES `organizations` (`org_id`);

--
-- Constraints for table `project_developers`
--
ALTER TABLE `project_developers`
  ADD CONSTRAINT `foreign_dev_id` FOREIGN KEY (`dev_id`) REFERENCES `developers` (`dev_id`),
  ADD CONSTRAINT `foreign_project_id` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
