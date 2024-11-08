-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 08. 17:31
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `bank`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `card`
--

CREATE TABLE `card` (
  `id` int(11) NOT NULL,
  `cardnumber` char(19) NOT NULL,
  `user_id` char(40) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0,
  `pin` char(61) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `priority` tinyint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `card`
--

INSERT INTO `card` (`id`, `cardnumber`, `user_id`, `balance`, `pin`, `status`, `priority`) VALUES
(1, '1122-3344-5566-7788', '10', 68146729, '$2y$10$J6Fc4LIUSQRhvvw/NOaeZeWxCgbAnaYyYbwtZ9EjRIQzKZDJU.ZKK', 1, 1),
(2, '1122-3344-5566-7789', '10', 131742, '$2y$10$SgmpPcWetux3SvFoTZSdhuKqh3BuanTyrdmlKMP6IAn9MAOQaTPz.', 2, 0),
(3, '1122-3344-5566-7798', '10', 61024799, '$2y$10$r/XA.8kAixcCVEvvZlMvp.oId2TPPX1WhXe3Q2U8YMXlB/5FQIO4e', 1, 0),
(4, '1122-3344-5566-1798', '10', 0, '$2y$10$3mB0ccK5vW8fiHlyFi35duRrdS6wwzuMZm1F4bqsox5OPgi92TMhe', 0, 0),
(5, '1122-3344-5166-7798', '10', 2100, '$2y$10$ku8u6b.3x5YJqXscqiGrgesgLL4vc2nYOe5OrO0DVLDmOe0JC8.n6', 1, 0),
(6, '1152-3344-5566-7798', '10', 0, '$2y$10$jS/tfrD1TFPA8IIIvgkZfeSsIfuTCyphzgxxv70n9dnWv8XA9RjnG', 0, 0),
(7, '1122-7744-5566-7789', '5', 50000, '$2y$10$zKfoO1gRbkvXwVFusytT3Ooo7Wr.E4yfMK23n3.j2xinhOgSafP1u', 1, 1),
(8, '1122-3344-1166-7798', '6', 0, '$2y$10$Ld9AC/TDzvsnkV8Z9FqidOPgMSz4Zgd2Y08ZzB5f.uGqsLBkB8VW6', 1, 1),
(9, '1111-2222-3333-4444', '1', 5000, '$2y$10$abcdfg1234567890', 0, 1),
(10, '2222-3333-4444-5555', '2', 10000, '$2y$10$hijklmnop1234567', 1, 2),
(11, '3333-4444-5555-6666', '3', 7500, '$2y$10$qwertyuiop123456', 1, 1),
(12, '4444-5555-6666-7777', '4', 15000, '$2y$10$asdfghjkl123456', 2, 2),
(13, '5555-6666-7777-8888', '5', 6000, '$2y$10$zxcvbnmasdf123456', 0, 1),
(14, '6666-7777-8888-9999', '6', 12000, '$2y$10$poiuytrewq123456', 1, 2),
(15, '7777-8888-9999-0000', '7', 4500, '$2y$10$lkjhgfdsazxcvbnm', 0, 1),
(16, '8888-9999-0000-1111', '8', 3000, '$2y$10$plmoknijbhuvgycfx', 2, 2),
(17, '9999-0000-1111-2222', '9', 9000, '$2y$10$nqwertyuiomnbvcxz', 1, 1),
(18, '0000-1111-2222-3333', '10', 4000, '$2y$10$mnbvcxzlkjhgfdsaq', 0, 0),
(19, '1111-3333-5555-7777', '11', 20000, '$2y$10$aqswdefrgthyjukil', 1, 2),
(20, '2222-4444-6666-8888', '12', 16000, '$2y$10$lkjhgfdsaqwertyui', 0, 1),
(21, '3333-5555-7777-9999', '13', 8000, '$2y$10$oiuytrewqlkjhgfds', 2, 2),
(22, '4444-6666-8888-0000', '14', 18000, '$2y$10$qazwsxedcrfvtgby', 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `cardnumber` char(19) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `statement` char(40) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `transaction`
--

INSERT INTO `transaction` (`id`, `cardnumber`, `amount`, `statement`, `date`) VALUES
(1, '1122-3344-5566-7788', 123123.00, 'Deposit', '2024-09-15 18:13:39'),
(21, '1122-3344-5566-7788', 123123.00, 'Deposit', '2024-09-15 18:21:39'),
(22, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:34:18'),
(23, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:43:10'),
(24, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:45:57'),
(25, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:48:19'),
(26, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:50:03'),
(27, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:51:44'),
(28, '1234-5678-9012-3456', -50.00, 'Withdraw', '2024-09-15 18:52:37'),
(29, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:54:07'),
(30, '1122-3344-5566-7788', 123123.00, 'Withdraw', '2024-09-15 18:55:01'),
(31, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 18:58:15'),
(32, '1234-5678-9012-3456', -50.00, 'Withdraw', '2024-09-15 19:50:49'),
(33, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 19:52:38'),
(34, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 19:52:56'),
(35, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 19:56:46'),
(36, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 19:58:31'),
(37, '1122-3344-5566-7788', 33333.00, 'Withdraw', '2024-09-15 20:02:48'),
(38, '1122-3344-5566-7788', -33333.00, 'Withdraw', '2024-09-15 20:17:30'),
(39, '1122-3344-5566-7788', 33333.00, 'Deposit', '2024-09-20 15:37:14'),
(40, '1122-3344-5566-7788', 33333.00, 'Deposit', '2024-09-20 15:37:28'),
(41, '1122-3344-5566-7788', -33333.00, 'Withdraw', '2024-09-20 15:37:55'),
(42, '1122-3344-5566-7788', 33333.00, 'Deposit', '2024-09-21 13:56:33'),
(43, '1122-3344-5566-7789', 33333.00, 'Deposit', '2024-09-22 15:58:31'),
(44, '1122-3344-5566-7788', -33333.00, 'Withdraw', '2024-09-22 15:59:54'),
(45, '1122-3344-5566-7788', -123123.00, 'Withdraw', '2024-09-22 16:00:07'),
(46, '1122-3344-5566-7788', -123123.00, 'Withdraw', '2024-09-22 16:06:38'),
(47, '1122-3344-5566-7788', -123123.00, 'Withdraw', '2024-09-22 16:07:39'),
(48, '1122-3344-5566-7789', -33333.00, 'Withdraw', '2024-09-22 16:13:23'),
(49, '1122-3344-5566-7789', -33333.00, 'Withdraw', '2024-09-22 16:13:38'),
(50, '1122-3344-5566-7789', 123123.00, 'Deposit', '2024-09-22 17:02:37'),
(51, '1122-3344-5566-7788', -123.00, 'Withdraw', '2024-09-22 17:24:47'),
(52, '1122-3344-5566-7788', -123.00, 'Withdraw', '2024-09-22 17:24:59'),
(53, '1122-3344-5566-7789', 123.00, 'Deposit', '2024-09-22 17:25:33'),
(54, '1122-3344-5566-7789', 33333.00, 'Deposit', '2024-09-25 15:54:37'),
(55, '1122-3344-5566-7789', 99999999.99, 'Deposit', '2024-09-25 15:55:04'),
(56, '1122-3344-5566-7789', 9999999.00, 'Deposit', '2024-09-25 16:11:43'),
(57, '1122-3344-5566-7789', -9999999.00, 'Withdraw', '2024-09-25 16:21:51'),
(58, '1122-3344-5566-7789', -9999999.00, 'Withdraw', '2024-09-25 16:22:04'),
(59, '1122-3344-5566-7798', -1122334.00, 'Withdraw', '2024-09-25 16:23:18'),
(60, '1122-3344-5566-7789', -1000.00, 'Withdraw', '2024-09-25 16:24:08'),
(61, '1122-3344-5566-7789', -1000.00, 'Withdraw', '2024-09-25 17:20:08'),
(62, '1122-3344-5566-7789', 10000.00, 'Deposit', '2024-09-25 17:20:28'),
(63, '1122-3344-5566-7789', -1.00, 'Withdraw', '2024-09-25 17:26:11'),
(64, '1122-3344-5566-7789', -1.00, 'Withdraw', '2024-09-25 17:46:44'),
(65, '1122-3344-5566-7789', -1.00, 'Withdraw', '2024-09-25 17:49:51'),
(66, '1122-3344-5566-7789', -1.00, 'Withdraw', '2024-09-25 17:53:38'),
(67, '1122-3344-5566-7789', -10000.00, 'Withdraw', '2024-09-25 17:53:45'),
(68, '1122-3344-5566-7789', -100.00, 'Withdraw', '2024-09-25 18:00:22'),
(69, '1122-3344-5566-7789', -100.00, 'Withdraw', '2024-09-25 18:00:32'),
(70, '1122-3344-5566-7789', -1.00, 'Withdraw', '2024-09-25 18:04:44'),
(71, '1122-3344-5566-7789', -100.00, 'Withdraw', '2024-09-25 18:09:24'),
(72, '1122-3344-5566-7789', 1.00, 'Deposit', '2024-09-25 18:18:05'),
(73, '1122-3344-5566-7789', -100.00, 'Withdraw', '2024-09-26 19:02:28'),
(74, '1122-3344-5566-7789', 100.00, 'Deposit', '2024-09-26 19:02:36'),
(75, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:05:24'),
(76, '1122-3344-5566-7788', 100.00, 'Transfer from: Atis', '2024-09-26 19:05:24'),
(77, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:10:24'),
(78, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:10:24'),
(79, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:15:28'),
(80, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:15:28'),
(81, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:21:07'),
(82, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:21:07'),
(83, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:22:31'),
(84, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:22:31'),
(85, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:26:45'),
(86, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:26:45'),
(87, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:33:11'),
(88, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:33:11'),
(89, '1122-3344-5566-7789', -100.00, 'asd', '2024-09-26 19:33:20'),
(90, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:33:20'),
(91, '1122-3344-5566-7789', -1.00, 'asd', '2024-09-26 19:33:34'),
(92, '1122-3344-5566-7798', 1.00, 'Transfer from: Atis', '2024-09-26 19:33:34'),
(93, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 19:39:24'),
(94, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:39:24'),
(95, '1122-3344-5566-7789', -100.00, 'asdd', '2024-09-26 19:44:47'),
(96, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:44:47'),
(97, '1122-3344-5566-7789', -100.00, '1234', '2024-09-26 19:45:45'),
(98, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 19:45:45'),
(99, '1122-3344-5566-7789', 10.00, 'Deposit', '2024-09-26 19:57:13'),
(100, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-09-26 20:03:39'),
(101, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-09-26 20:03:39'),
(102, '1122-3344-5566-7789', 33333.00, 'Deposit', '2024-10-02 15:19:20'),
(103, '1122-3344-5566-7789', -100.00, 'Transfer to: Atis', '2024-10-02 16:33:19'),
(104, '1122-3344-5566-7798', 100.00, 'Transfer from: Atis', '2024-10-02 16:33:19'),
(105, '1122-3344-5566-7788', 100.00, 'Deposit', '2024-10-11 15:56:58'),
(106, '1122-3344-5566-7788', -100.00, 'Withdraw', '2024-10-11 15:57:09'),
(107, '1122-3344-5566-7798', -6000000.00, 'Withdraw', '2024-10-13 12:33:02'),
(108, '1122-3344-5566-7798', 1.00, 'Deposit', '2024-10-13 12:33:28'),
(109, '1122-3344-5566-7798', 1.00, 'Deposit', '2024-10-13 12:43:18'),
(110, '1122-3344-5566-7798', 1.00, 'Deposit', '2024-10-13 12:55:30'),
(111, '1122-3344-5566-7798', 100.00, 'Deposit', '2024-10-13 13:06:33'),
(112, '1122-3344-5566-7798', -100.00, 'Withdraw', '2024-10-13 14:14:21'),
(113, '1122-3344-5566-7798', -100.00, 'Withdraw', '2024-10-13 14:15:39'),
(114, '1122-3344-5166-7798', -100.00, 'Withdraw', '2024-10-14 05:15:37'),
(115, '1122-3344-5166-7798', 1000.00, 'Deposit', '2024-10-14 05:19:18'),
(116, '1122-3344-5166-7798', -100.00, 'Withdraw', '2024-10-14 05:19:47'),
(117, '1122-3344-5166-7798', -700.00, 'Withdraw', '2024-10-16 19:29:53'),
(118, '1122-3344-5166-7798', 2000.00, 'Deposit', '2024-10-16 19:30:07'),
(119, '1122-7744-5566-7789', 50000.00, 'Deposit', '2024-10-16 19:33:29'),
(120, '1122-3344-5566-7798', -100.00, 'Valami', '2024-10-17 15:28:20'),
(121, '1122-3344-5566-7788', 100.00, 'Transfer from: Atis', '2024-10-17 15:28:20'),
(122, '1122-3344-5566-7798', -100.00, 'Valami megint', '2024-10-17 15:28:45'),
(123, '1122-3344-5566-7788', 100.00, 'Transfer from: Atis', '2024-10-17 15:28:45'),
(124, '1122-3344-5566-7798', -100.00, 'asd', '2024-10-17 15:32:20'),
(125, '1122-3344-5566-7788', 100.00, 'Transfer from: Atis', '2024-10-17 15:32:20'),
(126, '1111-2222-3333-4444', 150.00, 'Purchase at Store A', '2024-10-01 08:15:00'),
(127, '2222-3333-4444-5555', 75.50, 'Purchase at Store B', '2024-10-02 09:30:00'),
(128, '3333-4444-5555-6666', 250.25, 'Transfer to Account C', '2024-10-03 12:45:00'),
(129, '4444-5555-6666-7777', 89.99, 'Payment for Service D', '2024-10-04 07:20:00'),
(130, '5555-6666-7777-8888', 1200.00, 'Salary Deposit', '2024-10-05 13:00:00'),
(131, '6666-7777-8888-9999', 20.00, 'ATM Withdrawal', '2024-10-06 14:30:00'),
(132, '7777-8888-9999-0000', 300.50, 'Payment for Subscription E', '2024-10-07 10:00:00'),
(133, '8888-9999-0000-1111', 45.75, 'Purchase at Store F', '2024-10-08 06:00:00'),
(134, '9999-0000-1111-2222', 67.80, 'Purchase at Store G', '2024-10-09 15:10:00'),
(135, '0000-1111-2222-3333', 200.00, 'Online Purchase H', '2024-10-10 11:25:00'),
(136, '1111-3333-5555-7777', 500.00, 'Transfer to Account I', '2024-10-11 12:00:00'),
(137, '2222-4444-6666-8888', 150.30, 'Payment for Service J', '2024-10-12 09:00:00'),
(138, '3333-5555-7777-9999', 100.00, 'Payment for Invoice K', '2024-10-13 08:30:00'),
(139, '4444-6666-8888-0000', 350.00, 'Refund for Order L', '2024-10-14 14:45:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` char(40) NOT NULL,
  `email` char(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `authority` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `authority`) VALUES
(2, 'atis', 'antin@atis.hu', '$2y$10$4SoBFZEJtpoH37gU5RSi9.C7PVoYl1URqSw/fkuR6P3sdq71XMHcm', 1),
(3, 'atis', 'antinsn@atis.hu', '$2y$10$bYp3pDmMz39Y3xyKeCaRiOkSI2teRxQBs9UfSIvLN3w.Gb6Lgulg.', 0),
(4, 'Attila Lajko', 'atistes@atis.hu', '$2y$10$7kmbmMezw4o8arntSXCN6O9jYig5jmo6FCEeTWXAo8jEj5iF1TJ6q', 0),
(5, 'antins', 'att@atis.hu', '$2y$10$/1IHsZyH1whyon0m1KqYh.EDe6Rvsgp/WVYdKpq8EQ/wipSGRu932', 2),
(6, 'ati s', 'aat@atis.hu', '$2y$10$ViBjhPkDXAjAiLdXE0riIe94k4vhZ4OM184X48v/lFpoVajOUQZda', 1),
(7, 'atis', 'antindss@atis.hu', '$2y$10$wZDGaES7CYCExFlkCl.nFuzyH0tCtIxbnRS7wrNwC1IwFwscN/4M2', 1),
(8, 'atis', 'antidns@atis.hu', '$2y$10$MBmHC6DuxJYiwt5UhIKdGeRFdK0/kolzvWxOGd8pTc8u3AJGCfyMa', 1),
(9, 'atis', 'atis@atiss.hu', '$2y$10$mQ462ZSMqTjT0p3.FCtkle1YvZLhwhKAoSz/m5WCCicssZVz5Upq2', 1),
(10, 'Atis', 'atis@atis.hu', '$2y$10$ouXXG/lLqGRQfMwPlXRlSe5sKVXTOUFceRUDfuu/3sNAdEcoWtIey', 2),
(11, 'antins', 'atistes@atisss.hu', '$2y$10$bJ.thTOZTBXOi6JPq/u.l.WaxtyHKdZVWqqzF0vwvVAal2v1aG13m', 1),
(12, 'atis', 'atis@atisss.hu', '$2y$10$ZxMha4RTrjdhno7tSbFByu/CqrKNpO6k3HLtM/wKpI/i0Nv4YYhZa', 1),
(13, 'atis', 'antins@attis.hu', '$2y$10$wOAl4yHLLDsnlfMW/gHjhOscAp3cNFYzdtLxuxRCiceHBPMHaCyEy', 1),
(14, 'Attila Lajko', 'dentins@atis.hu', '$2y$10$NQ6dm0xwA65Bdc3.UWJZsuKhnPyfMxwkiMUyPRAWnb878aBzjJT1a', 1),
(15, 'antinstess', 'antinstess@atis.hu', '$2y$10$xVNLwnAkicn06T3Zp5Rk9.Nk.Ca7jb.nmYhhB/UAhXkhu7nJFGafe', 1),
(16, 'John Doe', 'john.doe1@example.com', '$2y$10$abcdfg1234567890', 1),
(17, 'Jane Smith', 'jane.smith2@example.com', '$2y$10$hijklmnop1234567', 1),
(18, 'Peter Parker', 'peter.parker3@example.com', '$2y$10$qwertyuiop123456', 0),
(19, 'Bruce Wayne', 'bruce.wayne4@example.com', '$2y$10$asdfghjkl123456', 1),
(20, 'Clark Kent', 'clark.kent5@example.com', '$2y$10$zxcvbnmasdf123456', 1),
(21, 'Tony Stark', 'tony.stark6@example.com', '$2y$10$poiuytrewq123456', 0),
(22, 'Natasha Romanoff', 'natasha.romanoff7@example.com', '$2y$10$lkjhgfdsazxcvbnm', 1),
(23, 'Steve Rogers', 'steve.rogers8@example.com', '$2y$10$plmoknijbhuvgycfx', 1),
(24, 'Diana Prince', 'diana.prince9@example.com', '$2y$10$nqwertyuiomnbvcxz', 0),
(25, 'Barry Allen', 'barry.allen10@example.com', '$2y$10$mnbvcxzlkjhgfdsaq', 1),
(26, 'Wanda Maximoff', 'wanda.maximoff11@example.com', '$2y$10$aqswdefrgthyjukil', 1),
(27, 'Scott Lang', 'scott.lang12@example.com', '$2y$10$lkjhgfdsaqwertyui', 0),
(28, 'Bruce Banner', 'bruce.banner13@example.com', '$2y$10$oiuytrewqlkjhgfds', 1),
(29, 'Stephen Strange', 'stephen.strange14@example.com', '$2y$10$qazwsxedcrfvtgby', 1),
(30, 'admin', 'admin@admin.hu', '$2y$10$.7rK2ilUqIPQmwbv/i1pUeXBzj02jQTpkEe/wPo1fowvsw8CVBlHq', 2);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `card`
--
ALTER TABLE `card`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cardnumber` (`cardnumber`);

--
-- A tábla indexei `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cardnumber` (`cardnumber`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `card`
--
ALTER TABLE `card`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
