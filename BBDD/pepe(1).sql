-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-02-2024 a las 17:42:30
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pepe`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `manzanas`
--

CREATE TABLE `manzanas` (
  `Id_M` int(11) NOT NULL,
  `Nombre` varchar(25) DEFAULT NULL,
  `Dir` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `manzanas`
--

INSERT INTO `manzanas` (`Id_M`, `Nombre`, `Dir`) VALUES
(1, 'Bosa', 'Kra 103 10-25'),
(2, 'Suba', 'Kra 114F 10-25'),
(3, 'Chapinero', 'Kra 63 10-25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `m_s`
--

CREATE TABLE `m_s` (
  `Id_M1` int(11) DEFAULT NULL,
  `Id_S1` int(11) DEFAULT NULL,
  `Fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `m_s`
--

INSERT INTO `m_s` (`Id_M1`, `Id_S1`, `Fecha`) VALUES
(1, 6, NULL),
(1, 4, NULL),
(1, 7, NULL),
(2, 6, NULL),
(2, 3, NULL),
(2, 8, NULL),
(3, 1, NULL),
(3, 2, NULL),
(3, 3, NULL),
(3, 4, NULL),
(3, 5, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `Id_S` int(11) NOT NULL,
  `Nombre` varchar(25) DEFAULT NULL,
  `Tipo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`Id_S`, `Nombre`, `Tipo`) VALUES
(1, 'Clase de baile', 'Entretenimiento'),
(2, 'Cine ', 'Entretenimiento'),
(3, 'Pscina', 'Deporte'),
(4, 'Gym', 'Deporte'),
(5, 'Cocina', 'Gastronomia'),
(6, 'Lavanderia', 'Aseo'),
(7, 'Coser', 'Maquina'),
(8, 'Yoga', 'Deporte');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes`
--

CREATE TABLE `solicitudes` (
  `Id_solicitudes` int(11) NOT NULL,
  `Fecha` datetime DEFAULT NULL,
  `Id1` int(10) DEFAULT NULL,
  `CodigoS` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes`
--

INSERT INTO `solicitudes` (`Id_solicitudes`, `Fecha`, `Id1`, `CodigoS`) VALUES
(1, '2024-02-13 12:11:00', 42, 4),
(2, '2024-02-13 12:11:00', 42, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `Id` int(10) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Tipo` set('TI','CC') NOT NULL,
  `Documento` varchar(50) NOT NULL,
  `Rol` set('usuario','administrador') NOT NULL DEFAULT 'usuario',
  `Id_M1` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`Id`, `Nombre`, `Tipo`, `Documento`, `Rol`, `Id_M1`) VALUES
(42, 'OPM', 'TI', '1234', 'usuario', 1),
(43, 'NP', 'TI', '12345', 'usuario', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  ADD PRIMARY KEY (`Id_M`);

--
-- Indices de la tabla `m_s`
--
ALTER TABLE `m_s`
  ADD KEY `fk_id2` (`Id_M1`),
  ADD KEY `fk_id3` (`Id_S1`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`Id_S`);

--
-- Indices de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD PRIMARY KEY (`Id_solicitudes`),
  ADD KEY `fk_idsoli` (`Id1`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Documento` (`Documento`),
  ADD KEY `fk_id1` (`Id_M1`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `manzanas`
--
ALTER TABLE `manzanas`
  MODIFY `Id_M` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `Id_S` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  MODIFY `Id_solicitudes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `Id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `m_s`
--
ALTER TABLE `m_s`
  ADD CONSTRAINT `fk_id2` FOREIGN KEY (`Id_M1`) REFERENCES `manzanas` (`Id_M`),
  ADD CONSTRAINT `fk_id3` FOREIGN KEY (`Id_S1`) REFERENCES `servicios` (`Id_S`);

--
-- Filtros para la tabla `solicitudes`
--
ALTER TABLE `solicitudes`
  ADD CONSTRAINT `fk_idsoli` FOREIGN KEY (`Id1`) REFERENCES `usuario` (`Id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_id1` FOREIGN KEY (`Id_M1`) REFERENCES `manzanas` (`Id_M`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
