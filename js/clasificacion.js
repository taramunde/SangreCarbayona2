(function () {
  // js/clasificacion.js
  // =====================================================
  // DATOS: Para actualizar la clasificación solo tienes
  // que añadir los resultados de cada jornada al array
  // "enfrentamientos" con el formato:
  // { equipo1: "Nombre", equipo2: "Nombre", goles1: X, goles2: Y }
  // Si el partido no se ha jugado aún: goles1: null, goles2: null
  // =====================================================

  // --- EQUIPOS (Ahora 22 equipos para Segunda División) ---
  const equipos = [
    { nombre: 'Albacete Balompié', escudo: 'img/escudos/Albacete.webp' },
    { nombre: 'U.D. Almería', escudo: 'img/escudos/Almeria.webp' },
    { nombre: 'F.C. Andorra', escudo: 'img/escudos/Andorra.webp' },
    { nombre: 'Burgos C.F.', escudo: 'img/escudos/Burgos.webp' },
    { nombre: 'Cádiz C.F.', escudo: 'img/escudos/Cadiz.webp' },
    { nombre: 'C.D. Castellón', escudo: 'img/escudos/Castellon.webp' },
    { nombre: 'R.C. Celta Fortuna', escudo: 'img/escudos/CeltaVigo.webp' },
    { nombre: 'A.D. Ceuta C.F.', escudo: 'img/escudos/Ceuta.webp' },
    { nombre: 'Córdoba C.F.', escudo: 'img/escudos/Cordoba.webp' },
    { nombre: 'S.D. Eibar', escudo: 'img/escudos/Eibar.webp' },
    { nombre: 'C.D. Eldense', escudo: 'img/escudos/Eldense.webp' },
    { nombre: 'Girona F.C.', escudo: 'img/escudos/Girona.webp' },
    { nombre: 'Granada C.F.', escudo: 'img/escudos/Granada.webp' },
    { nombre: 'U.D. Las Palmas', escudo: 'img/escudos/LasPalmas.webp' },
    { nombre: 'C.D. Leganés', escudo: 'img/escudos/Leganes.webp' },
    { nombre: 'R.C.D. Mallorca', escudo: 'img/escudos/Mallorca.webp' },
    { nombre: 'Real Oviedo', escudo: 'img/escudos/Oviedo.webp' },
    { nombre: 'Real Sociedad B', escudo: 'img/escudos/RealSociedad.webp' },
    { nombre: 'C.E. Sabadell', escudo: 'img/escudos/Sabadell.webp' },
    { nombre: 'Real Sporting de Gijón', escudo: 'img/escudos/Sporting.webp' },
    { nombre: 'C.D. Tenerife', escudo: 'img/escudos/Tenerife.webp' },
    { nombre: 'Real Valladolid', escudo: 'img/escudos/Valladolid.webp' },
  ];

  // --- PARTIDOS ---
  // Calendario completo Temporada 2026/2027 - LaLiga Hypermotion
  // 42 jornadas x 11 partidos (22 equipos)
  const enfrentamientos = [
    // Jornada 1 (16/08/2026)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },

    // Jornada 2 (23/08/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },

    // Jornada 3 (30/08/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },

    // Jornada 4 (06/09/2026)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },

    // Jornada 5 (13/09/2026)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },

    // Jornada 6 (20/09/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },

    // Jornada 7 (27/09/2026)
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 8 (04/10/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },

    // Jornada 9 (11/10/2026)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },

    // Jornada 10 (18/10/2026)
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },

    // Jornada 11 (25/10/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },

    // Jornada 12 (01/11/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },

    // Jornada 13 (08/11/2026)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },

    // Jornada 14 (15/11/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },

    // Jornada 15 (22/11/2026)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },

    // Jornada 16 (29/11/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },

    // Jornada 17 (06/12/2026)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },

    // Jornada 18 (13/12/2026)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },

    // Jornada 19 (20/12/2026)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },

    // Jornada 20 (03/01/2027)
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 21 (10/01/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 22 (17/01/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 23 (24/01/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },

    // Jornada 24 (31/01/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },

    // Jornada 25 (07/02/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 26 (14/02/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },

    // Jornada 27 (21/02/2027)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },

    // Jornada 28 (28/02/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },

    // Jornada 29 (07/03/2027)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 30 (14/03/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },

    // Jornada 31 (21/03/2027)
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 32 (28/03/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },

    // Jornada 33 (04/04/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },

    // Jornada 34 (11/04/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },

    // Jornada 35 (18/04/2027)
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },

    // Jornada 36 (25/04/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },

    // Jornada 37 (02/05/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },

    // Jornada 38 (09/05/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 39 (16/05/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },

    // Jornada 40 (23/05/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },

    // Jornada 41 (30/05/2027)
    {
      equipo1: 'F.C. Andorra',
      equipo2: 'Granada C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Burgos C.F.',
      equipo2: 'S.D. Eibar',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Cádiz C.F.',
      equipo2: 'C.D. Tenerife',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Castellón',
      equipo2: 'Real Oviedo',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C. Celta Fortuna',
      equipo2: 'C.D. Leganés',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Eldense',
      equipo2: 'Real Valladolid',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Girona F.C.',
      equipo2: 'A.D. Ceuta C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Las Palmas',
      equipo2: 'Córdoba C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'R.C.D. Mallorca',
      equipo2: 'Albacete Balompié',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sociedad B',
      equipo2: 'C.E. Sabadell',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Sporting de Gijón',
      equipo2: 'U.D. Almería',
      goles1: null,
      goles2: null,
    },

    // Jornada 42 (06/06/2027)
    {
      equipo1: 'Albacete Balompié',
      equipo2: 'Cádiz C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'U.D. Almería',
      equipo2: 'R.C.D. Mallorca',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'A.D. Ceuta C.F.',
      equipo2: 'Burgos C.F.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Córdoba C.F.',
      equipo2: 'Real Sporting de Gijón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'S.D. Eibar',
      equipo2: 'Girona F.C.',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Granada C.F.',
      equipo2: 'C.D. Eldense',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Leganés',
      equipo2: 'Real Sociedad B',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Oviedo',
      equipo2: 'F.C. Andorra',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.E. Sabadell',
      equipo2: 'C.D. Castellón',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'C.D. Tenerife',
      equipo2: 'R.C. Celta Fortuna',
      goles1: null,
      goles2: null,
    },
    {
      equipo1: 'Real Valladolid',
      equipo2: 'U.D. Las Palmas',
      goles1: null,
      goles2: null,
    },
  ];

  // =====================================================
  // LÓGICA
  // =====================================================

  const EQUIPOS_POR_JORNADA = 11; // 22 equipos = 11 partidos

  function resetearEquipos() {
    equipos.forEach((eq) => {
      eq.pj = 0;
      eq.pg = 0;
      eq.pe = 0;
      eq.pp = 0;
      eq.gf = 0;
      eq.gc = 0;
      eq.pts = 0;
      eq.dg = 0;
    });
  }

  function calcularEstadisticas(partidos) {
    resetearEquipos();
    partidos.forEach((p) => {
      if (p.goles1 === null || p.goles2 === null) return;
      const eqA = equipos.find((e) => e.nombre === p.equipo1);
      const eqB = equipos.find((e) => e.nombre === p.equipo2);
      if (!eqA || !eqB) return;

      eqA.pj++;
      eqB.pj++;
      eqA.gf += p.goles1;
      eqA.gc += p.goles2;
      eqB.gf += p.goles2;
      eqB.gc += p.goles1;

      if (p.goles1 > p.goles2) {
        eqA.pg++;
        eqA.pts += 3;
        eqB.pp++;
      } else if (p.goles1 < p.goles2) {
        eqB.pg++;
        eqB.pts += 3;
        eqA.pp++;
      } else {
        eqA.pe++;
        eqB.pe++;
        eqA.pts++;
        eqB.pts++;
      }
    });

    equipos.forEach((eq) => {
      eq.dg = eq.gf - eq.gc;
    });

    equipos.sort(
      (a, b) =>
        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf ||
        a.nombre.localeCompare(b.nombre),
    );
    equipos.forEach((eq, i) => {
      eq.posicion = i + 1;
    });
  }

  function getJornadaActual() {
    const jugados = enfrentamientos.filter((p) => p.goles1 !== null).length;
    return Math.ceil(jugados / EQUIPOS_POR_JORNADA);
  }

  function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    if (!tbody) return; // Solo en clasificacion.html
    tbody.innerHTML = '';

    equipos.forEach((eq) => {
      let claseZona = '';
      // Puestos de Segunda División
      if (eq.posicion <= 2) claseZona = 'pos-ascenso-directo';
      else if (eq.posicion <= 6) claseZona = 'pos-playoff';
      else if (eq.posicion >= 19) claseZona = 'pos-descenso';

      const esOviedo = eq.nombre === 'Real Oviedo';

      let claseDG = '',
        signoDG = '';
      if (eq.dg > 0) {
        claseDG = 'dg-positiva';
        signoDG = '+';
      } else if (eq.dg < 0) {
        claseDG = 'dg-negativa';
      }

      const tr = document.createElement('tr');
      if (esOviedo) tr.classList.add('row-oviedo');

      tr.innerHTML = `
            <td class="${claseZona}">${eq.posicion}</td>
            <td>
                <img src="${eq.escudo}" alt="${eq.nombre}" class="escudo-tabla">
                <span>${eq.nombre}</span>
            </td>
            <td class="pts-col">${eq.pts}</td>
            <td>${eq.pj}</td>
            <td>${eq.pg}</td>
            <td>${eq.pe}</td>
            <td>${eq.pp}</td>
            <td>${eq.gf}</td>
            <td>${eq.gc}</td>
            <td class="${claseDG}">${signoDG}${eq.dg}</td>
        `;
      tbody.appendChild(tr);
    });
  }

  function actualizarJornadaBadge() {
    const jornada = getJornadaActual();
    const badge = document.getElementById('jornadaBadge');
    if (badge) {
      badge.removeAttribute('data-i18n');
      const label = CLUB_DATA.temporadaActual.replace('-', '/');
      badge.textContent =
        jornada > 0
          ? `${t('jornada')} ${jornada} · ${CLUB_DATA.competicionActual} ${label}`
          : `${CLUB_DATA.competicionActual} ${label}`;
    }
  }

  // --- GRÁFICA ---
  function calcularPosicionJornada(jornadaLimite) {
    const eqTemp = equipos.map((e) => ({
      nombre: e.nombre,
      pts: 0,
      gf: 0,
      gc: 0,
    }));
    const partidos = enfrentamientos.slice(
      0,
      jornadaLimite * EQUIPOS_POR_JORNADA,
    );

    partidos.forEach((p) => {
      if (p.goles1 === null) return;
      const a = eqTemp.find((x) => x.nombre === p.equipo1);
      const b = eqTemp.find((x) => x.nombre === p.equipo2);
      if (!a || !b) return;
      if (p.goles1 > p.goles2) {
        a.pts += 3;
      } else if (p.goles1 < p.goles2) {
        b.pts += 3;
      } else {
        a.pts++;
        b.pts++;
      }
      a.gf += p.goles1;
      a.gc += p.goles2;
      b.gf += p.goles2;
      b.gc += p.goles1;
    });

    eqTemp.sort((a, b) => b.pts - a.pts || b.gf - b.gc - (a.gf - a.gc));
    return eqTemp.findIndex((e) => e.nombre === 'Real Oviedo') + 1;
  }

  function initChart() {
    const canvas = document.getElementById('team-position-chart-canvas');
    if (!canvas) return;

    const jornadaActual = getJornadaActual();
    if (jornadaActual === 0) return;

    const posiciones = [];
    for (let j = 1; j <= jornadaActual; j++) {
      posiciones.push(calcularPosicionJornada(j));
    }

    canvas.parentElement.style.minWidth =
      Math.max(posiciones.length * 45, 600) + 'px';

    const mejor = Math.min(...posiciones);
    const peor = Math.max(...posiciones);
    const actual = posiciones[posiciones.length - 1];

    const elMejor = document.getElementById('team-position-best');
    const elPeor = document.getElementById('team-position-worst');
    const elActual = document.getElementById('team-position-current');
    if (elMejor) elMejor.textContent = mejor + 'º';
    if (elPeor) elPeor.textContent = peor + 'º';
    if (elActual) elActual.textContent = actual + 'º';

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: posiciones.map((_, i) => 'J' + (i + 1)),
        datasets: [
          {
            label: 'Posición Real Oviedo',
            data: posiciones,
            borderColor: '#0033cc',
            backgroundColor: 'rgba(0, 51, 204, 0.08)',
            borderWidth: 3,
            pointBackgroundColor: posiciones.map((p) =>
              p <= 2
                ? '#2ecc71'
                : p <= 6
                  ? '#f39c12'
                  : p >= 19
                    ? '#e74c3c'
                    : '#0033cc',
            ),
            pointBorderColor: '#001a6e',
            pointBorderWidth: 2,
            pointRadius: 6,
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            reverse: true,
            min: 1,
            max: 22,
            grid: { color: '#eef0f8' },
            ticks: { stepSize: 1, color: '#666' },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#666' },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#001a6e',
            titleColor: '#ffcc00',
            bodyColor: '#fff',
            padding: 10,
            callbacks: {
              label: (ctx) => `Posición: ${ctx.raw}º`,
            },
          },
        },
      },
    });
  }

  // --- TABLA HOME (Top 6 + Oviedo si está fuera) ---
  function renderizarTablaHome() {
    const tbody = document.getElementById('homeCuerpoTabla');
    if (!tbody) return;

    tbody.innerHTML = '';

    const top6 = equipos.slice(0, 6);
    const oviedo = equipos.find((eq) => eq.nombre === 'Real Oviedo');
    const oviedoEn6 = top6.some((eq) => eq.nombre === 'Real Oviedo');

    const filas = oviedoEn6 ? top6 : [...top6, null, oviedo];

    filas.forEach((eq) => {
      if (eq === null) {
        const trSep = document.createElement('tr');
        trSep.classList.add('row-oviedo-separator');
        trSep.innerHTML = `<td colspan="8"></td>`;
        tbody.appendChild(trSep);
        return;
      }

      let claseZona = '';
      if (eq.posicion <= 2) claseZona = 'pos-ascenso-directo';
      else if (eq.posicion <= 6) claseZona = 'pos-playoff';
      else if (eq.posicion >= 19) claseZona = 'pos-descenso';

      const esOviedo = eq.nombre === 'Real Oviedo';

      let claseDG = '',
        signoDG = '';
      if (eq.dg > 0) {
        claseDG = 'dg-positiva';
        signoDG = '+';
      } else if (eq.dg < 0) {
        claseDG = 'dg-negativa';
      }

      const tr = document.createElement('tr');
      if (esOviedo) tr.classList.add('row-oviedo');

      tr.innerHTML = `
            <td class="${claseZona}">${eq.posicion}</td>
            <td>
                <img src="${eq.escudo}" alt="${eq.nombre}" class="home-escudo-tabla">
                <span>${eq.nombre}</span>
            </td>
            <td class="pts-col">${eq.pts}</td>
            <td>${eq.pj}</td>
            <td>${eq.pg}</td>
            <td>${eq.pe}</td>
            <td>${eq.pp}</td>
            <td class="${claseDG}">${signoDG}${eq.dg}</td>
        `;
      tbody.appendChild(tr);
    });

    const badge = document.getElementById('homeJornadaBadge');
    if (badge) {
      badge.removeAttribute('data-i18n'); // ← esta faltaba
      const j = getJornadaActual();
      const label = CLUB_DATA.temporadaActual.replace('-', '/');
      badge.textContent =
        j > 0
          ? `Jornada ${j} · ${CLUB_DATA.competicionActual} ${label}`
          : `${CLUB_DATA.competicionActual} ${label}`;
    }
  }

  // --- INIT ---
  calcularEstadisticas(enfrentamientos);
  renderizarTabla();
  actualizarJornadaBadge();
  initChart();
  renderizarTablaHome();

  window.equipos = equipos;
  window.enfrentamientos = enfrentamientos;
  window.actualizarJornadaBadge = actualizarJornadaBadge;
})();
