-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 14, 2023 at 06:15 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_tb`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'Form tugas web  1', 'mata kuliah : web', '2023-06-14 02:56:05', '2023-06-14 02:56:05');

-- --------------------------------------------------------

--
-- Table structure for table `signature`
--

CREATE TABLE `signature` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `signed_at` varchar(55) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `signature`
--

INSERT INTO `signature` (`id`, `user_id`, `document_id`, `file_name`, `status`, `signed_at`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'logo192.png', 2, '2023-06-14T04:09:57.109Z', '2023-06-14 02:58:12', '2023-06-14 02:58:12'),
(2, 8, 1, 'logo192.png', 2, '0000-00-00 00:00:00', '2023-06-14 03:02:03', '2023-06-14 03:02:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active` int(11) NOT NULL,
  `sign_img` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `active`, `sign_img`, `created_at`, `updated_at`) VALUES
(1, 'uu', 'ss@gmail.com', '$2b$11$F/rSmRXoJ5.eQ4x6j65EDuyHdd.75HtUW530YI1ULSfQDDMeGdK2G', 1, '', '2023-06-06 23:13:03', '2023-06-06 23:13:03'),
(2, 'rtyuk', 'ghjkl@gmail.com', '$2b$10$zjjvyHbCGuXeVZ8ulzvzDOomCet85YehhCb5Rx2BQgsy9f80Kaei.', 1, '', '2023-06-07 01:02:41', '2023-06-07 01:02:41'),
(3, 'qawedrtfygu', 'wesd@gmail.com', '$2b$10$xv.DlxhePoiUzAXArG9EHuIGBfEzeeNxHcBAIGqKsgv5vBE3pdRTq', 1, '', '2023-06-07 01:16:10', '2023-06-07 01:16:10'),
(4, 'iii', 'yy@gmail.com', '$2b$11$x9ANotxOjiVe.hjWBCcu6ODwxUfHDp.gXMkbbTKM8OrnslirD4WfC', 1, '', '2023-06-10 23:15:41', '2023-06-10 23:15:41'),
(5, 'hhh', 'ff@gmail.com', '$2b$11$H63Th.BWxxi5WMw.P5Wf5.CTPE1LxOfhLdNyRdAtwWYNbxhQ8tYM6', 1, '', '2023-06-10 23:16:28', '2023-06-10 23:16:28'),
(6, 'rrr', 'w@gmail.com', '$2b$11$oaYzlr/b2gJNAY7CDtfHGuDTM8KCIUMETqBorY3YZ27KMRKVQVp5i', 1, '', '2023-06-10 23:19:26', '2023-06-10 23:19:26'),
(7, 'gghg', 'werfts@gmail.com', '$2b$11$DRXbxJkslPCyUBOViPCJEegxg7Eruw6GrMlrvskhW9dY7Lf73dhgG', 1, '', '2023-06-13 00:51:56', '2023-06-13 00:51:56'),
(8, '19000', 'ee@gmail.com', '$2b$11$VNs6e9VBaJetfgEd3imx5.tmfPhwmMrR4iOgkdY9Au5DYCH/YRaHG', 1, '', '2023-06-14 02:56:32', '2023-06-14 02:56:32'),
(9, 'gfdf', 'gg@gmail.com', '$2b$11$r8/wTpTiR7PLw4puY43c5OjZo3RCi2rCx037z3/1a3tsmph/MxQQm', 1, '', '2023-06-14 03:10:21', '2023-06-14 03:10:21'),
(10, 'ffdg', 'dfgh@gmail.com', '$2b$11$OMPoDjB3qHWq6ad8Db2SiOicl/FBn4QzZT7Mu2H3UdhtibkCs/Cmq', 1, '', '2023-06-14 04:10:17', '2023-06-14 04:10:17');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `signature`
--
ALTER TABLE `signature`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `signature`
--
ALTER TABLE `signature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
