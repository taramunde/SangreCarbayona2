// js/clasificacion.js
// =====================================================
// DATOS: Para actualizar la clasificación solo tienes
// que añadir los resultados de cada jornada al array
// "enfrentamientos" con el formato:
// { equipo1: "Nombre", equipo2: "Nombre", goles1: X, goles2: Y }
// Si el partido no se ha jugado aún: goles1: null, goles2: null
// =====================================================

// --- EQUIPOS ---
const equipos = [
    { nombre: "Deportivo Alavés",  escudo: "https://i.postimg.cc/Jzk39hHH/Alav-s.jpg" },
    { nombre: "Athletic Club",     escudo: "https://i.postimg.cc/wvk3Y2Hv/Athletic-Club-2025.png" },
    { nombre: "Atlético de Madrid",escudo: "https://i.postimg.cc/RFg8098M/Club-Atl-tico-de-Madrid-1989.jpg" },
    { nombre: "F.C. Barcelona",    escudo: "https://i.postimg.cc/0yH0rj5X/F-C-Barcelona-C-2007.jpg" },
    { nombre: "Celta de Vigo",     escudo: "https://i.postimg.cc/GtF1h6kz/R-C-Celta-de-Vigo-2016.jpg" },
    { nombre: "Elche C.F.",        escudo: "https://i.postimg.cc/Kj439Dfc/Elche-C-F-2023-PNG.png" },
    { nombre: "R.C.D. Espanyol",   escudo: "https://i.postimg.cc/ydBThzdg/RCD-Espanyol-2023.png" },
    { nombre: "Getafe C.F.",       escudo: "https://i.postimg.cc/kXgS8Cp0/Getafe-C-F-2018.jpg" },
    { nombre: "Girona F.C.",       escudo: "https://i.postimg.cc/d0xBnVnf/Girona-F-C-2025.png" },
    { nombre: "Levante U.D.",      escudo: "https://i.postimg.cc/W1FCSyhH/Levante-U-D-PNG.png" },
    { nombre: "R.C.D. Mallorca",   escudo: "https://i.postimg.cc/PryB3WKL/R-C-D-Mallorca-1996.jpg" },
    { nombre: "C.A. Osasuna",      escudo: "https://i.postimg.cc/mkhYyGr2/C-A-Osasuna-2015.jpg" },
    { nombre: "Rayo Vallecano",    escudo: "https://i.postimg.cc/153WzLct/Rayo-Vallecano-de-Madrid-B-2007.jpg" },
    { nombre: "Real Betis",        escudo: "https://i.postimg.cc/J49HDXVF/Real-Betis-Balompi-2016.jpg" },
    { nombre: "Real Madrid",       escudo: "https://i.postimg.cc/FHcQ5ZGr/Real-Madrid-2022.png" },
    { nombre: "Real Oviedo",       escudo: "https://i.postimg.cc/yYcPrs6f/Oviedo.png" },
    { nombre: "Real Sociedad",     escudo: "https://i.postimg.cc/GtykfwWL/Real-Sociedad-de-F-tbol-2002.jpg" },
    { nombre: "Sevilla F.C.",      escudo: "https://i.postimg.cc/KzFSjx5V/Sevilla-F-C-2020.jpg" },
    { nombre: "Valencia C.F.",     escudo: "https://i.postimg.cc/pTD6xZ98/Valencia-C-F.png" },
    { nombre: "Villarreal C.F.",   escudo: "https://i.postimg.cc/wBRLMdBh/Villarreal-C-F-B-2020.jpg" }
];

// --- PARTIDOS ---
// Añade aquí los resultados jornada a jornada.
// null = partido no jugado aún.
const enfrentamientos = [
    // Jornada 1
    { equipo1: "Deportivo Alavés",  equipo2: "Levante U.D.",      goles1: 2,    goles2: 1    },
    { equipo1: "Athletic Club",     equipo2: "Sevilla F.C.",      goles1: 3,    goles2: 2    },
    { equipo1: "Celta de Vigo",     equipo2: "Getafe C.F.",       goles1: 0,    goles2: 2    },
    { equipo1: "Girona F.C.",       equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 3    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Atlético de Madrid",goles1: 2,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "F.C. Barcelona",    goles1: 0,    goles2: 3    },
    { equipo1: "Elche C.F.",        equipo2: "Real Betis",        goles1: 1,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    { equipo1: "Valencia C.F.",     equipo2: "Real Sociedad",     goles1: 1,    goles2: 1    },
    { equipo1: "Villarreal C.F.",   equipo2: "Real Oviedo",       goles1: 2,    goles2: 0    },
    // Jornada 2
    { equipo1: "Athletic Club",     equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 0    },
    { equipo1: "Atlético de Madrid",equipo2: "Elche C.F.",        goles1: 1,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Valencia C.F.",     goles1: 1,    goles2: 0    },
    { equipo1: "Real Oviedo",       equipo2: "Real Madrid",       goles1: 0,    goles2: 3    },
    { equipo1: "Real Betis",        equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 0    },
    { equipo1: "Levante U.D.",      equipo2: "F.C. Barcelona",    goles1: 2,    goles2: 3    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Celta de Vigo",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "R.C.D. Espanyol",   goles1: 2,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Getafe C.F.",       goles1: 1,    goles2: 2    },
    { equipo1: "Villarreal C.F.",   equipo2: "Girona F.C.",       goles1: 5,    goles2: 0    },
    // Jornada 3
    { equipo1: "Deportivo Alavés",  equipo2: "Atlético de Madrid",goles1: 1,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "Villarreal C.F.",   goles1: 1,    goles2: 1    },
    { equipo1: "Elche C.F.",        equipo2: "Levante U.D.",      goles1: 2,    goles2: 0    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "Sevilla F.C.",      goles1: 0,    goles2: 2    },
    { equipo1: "Real Oviedo",       equipo2: "Real Sociedad",     goles1: 1,    goles2: 0    },
    { equipo1: "Real Betis",        equipo2: "Athletic Club",     goles1: 1,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "F.C. Barcelona",    goles1: 1,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Getafe C.F.",       goles1: 3,    goles2: 0    },
    { equipo1: "Real Madrid",       equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 1    },
    // Jornada 4
    { equipo1: "Atlético de Madrid",equipo2: "Villarreal C.F.",   goles1: 2,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Valencia C.F.",     goles1: 6,    goles2: 0    },
    { equipo1: "Celta de Vigo",     equipo2: "Girona F.C.",       goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "R.C.D. Mallorca",   goles1: 3,    goles2: 2    },
    { equipo1: "Getafe C.F.",       equipo2: "Real Oviedo",       goles1: 2,    goles2: 0    },
    { equipo1: "C.A. Osasuna",      equipo2: "Rayo Vallecano",    goles1: 2,    goles2: 0    },
    { equipo1: "Athletic Club",     equipo2: "Deportivo Alavés",  goles1: 0,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Real Betis",        goles1: 2,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Elche C.F.",        goles1: 2,    goles2: 2    },
    { equipo1: "Real Sociedad",     equipo2: "Real Madrid",       goles1: 1,    goles2: 2    },
    // Jornada 5
    { equipo1: "Deportivo Alavés",  equipo2: "Sevilla F.C.",      goles1: 1,    goles2: 2    },
    { equipo1: "F.C. Barcelona",    equipo2: "Getafe C.F.",       goles1: 3,    goles2: 0    },
    { equipo1: "Real Betis",        equipo2: "Real Sociedad",     goles1: 3,    goles2: 1    },
    { equipo1: "Elche C.F.",        equipo2: "Real Oviedo",       goles1: 1,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "Levante U.D.",      goles1: 0,    goles2: 4    },
    { equipo1: "Valencia C.F.",     equipo2: "Athletic Club",     goles1: 2,    goles2: 0    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Atlético de Madrid",goles1: 1,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "Celta de Vigo",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "R.C.D. Espanyol",   goles1: 2,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "C.A. Osasuna",      goles1: 2,    goles2: 1    },
    // Jornada 6
    { equipo1: "Athletic Club",     equipo2: "Girona F.C.",       goles1: 1,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "Rayo Vallecano",    goles1: 3,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Valencia C.F.",     goles1: 2,    goles2: 2    },
    { equipo1: "Levante U.D.",      equipo2: "Real Madrid",       goles1: 1,    goles2: 4    },
    { equipo1: "Sevilla F.C.",      equipo2: "Villarreal C.F.",   goles1: 1,    goles2: 2    },
    { equipo1: "Getafe C.F.",       equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "F.C. Barcelona",    goles1: 1,    goles2: 3    },
    { equipo1: "Celta de Vigo",     equipo2: "Real Betis",        goles1: 1,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Elche C.F.",        goles1: 1,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "R.C.D. Mallorca",   goles1: 1,    goles2: 0    },
    // Jornada 7
    { equipo1: "Atlético de Madrid",equipo2: "Real Madrid",       goles1: 5,    goles2: 2    },
    { equipo1: "F.C. Barcelona",    equipo2: "Real Sociedad",     goles1: 2,    goles2: 1    },
    { equipo1: "Real Betis",        equipo2: "C.A. Osasuna",      goles1: 2,    goles2: 0    },
    { equipo1: "Getafe C.F.",       equipo2: "Levante U.D.",      goles1: 1,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "Sevilla F.C.",      goles1: 0,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Athletic Club",     goles1: 1,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "Celta de Vigo",     goles1: 2,    goles2: 1    },
    { equipo1: "Girona F.C.",       equipo2: "R.C.D. Espanyol",   goles1: 0,    goles2: 0    },
    { equipo1: "Valencia C.F.",     equipo2: "Real Oviedo",       goles1: 1,    goles2: 2    },
    // Jornada 8
    { equipo1: "Deportivo Alavés",  equipo2: "Elche C.F.",        goles1: 3,    goles2: 1    },
    { equipo1: "Athletic Club",     equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 1    },
    { equipo1: "Girona F.C.",       equipo2: "Valencia C.F.",     goles1: 2,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "Villarreal C.F.",   goles1: 3,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "Atlético de Madrid",goles1: 1,    goles2: 1    },
    { equipo1: "Sevilla F.C.",      equipo2: "F.C. Barcelona",    goles1: 4,    goles2: 1    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Real Betis",        goles1: 1,    goles2: 2    },
    { equipo1: "C.A. Osasuna",      equipo2: "Getafe C.F.",       goles1: 2,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "Levante U.D.",      goles1: 0,    goles2: 2    },
    { equipo1: "Real Sociedad",     equipo2: "Rayo Vallecano",    goles1: 0,    goles2: 1    },
    // Jornada 9
    { equipo1: "Deportivo Alavés",  equipo2: "Valencia C.F.",     goles1: 0,    goles2: 0    },
    { equipo1: "Atlético de Madrid",equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Girona F.C.",       goles1: 2,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "Real Sociedad",     goles1: 1,    goles2: 1    },
    { equipo1: "Getafe C.F.",       equipo2: "Real Madrid",       goles1: 0,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Rayo Vallecano",    goles1: 0,    goles2: 3    },
    { equipo1: "Elche C.F.",        equipo2: "Athletic Club",     goles1: 0,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Real Betis",        goles1: 2,    goles2: 2    },
    { equipo1: "Real Oviedo",       equipo2: "R.C.D. Espanyol",   goles1: 0,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "R.C.D. Mallorca",   goles1: 1,    goles2: 3    },
    // Jornada 10
    { equipo1: "Athletic Club",     equipo2: "Getafe C.F.",       goles1: 0,    goles2: 1    },
    { equipo1: "Girona F.C.",       equipo2: "Real Oviedo",       goles1: 3,    goles2: 3    },
    { equipo1: "Real Sociedad",     equipo2: "Sevilla F.C.",      goles1: 2,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Villarreal C.F.",   goles1: 0,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 0    },
    { equipo1: "Real Betis",        equipo2: "Atlético de Madrid",goles1: 0,    goles2: 2    },
    { equipo1: "Real Madrid",       equipo2: "F.C. Barcelona",    goles1: 2,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Celta de Vigo",     goles1: 2,    goles2: 3    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Elche C.F.",        goles1: 1,    goles2: 0    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Levante U.D.",      goles1: 1,    goles2: 1    },
    // Jornada 11
    { equipo1: "Deportivo Alavés",  equipo2: "R.C.D. Espanyol",   goles1: 2,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "Sevilla F.C.",      goles1: 3,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Elche C.F.",        goles1: 3,    goles2: 1    },
    { equipo1: "Real Betis",        equipo2: "R.C.D. Mallorca",   goles1: 3,    goles2: 0    },
    { equipo1: "Getafe C.F.",       equipo2: "Girona F.C.",       goles1: 2,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "Valencia C.F.",     goles1: 4,    goles2: 0    },
    { equipo1: "Real Sociedad",     equipo2: "Athletic Club",     goles1: 3,    goles2: 2    },
    { equipo1: "Levante U.D.",      equipo2: "Celta de Vigo",     goles1: 1,    goles2: 2    },
    { equipo1: "Real Oviedo",       equipo2: "C.A. Osasuna",      goles1: 0,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Rayo Vallecano",    goles1: 4,    goles2: 0    },
    // Jornada 12
    { equipo1: "Athletic Club",     equipo2: "Real Oviedo",       goles1: 1,    goles2: 0    },
    { equipo1: "Atlético de Madrid",equipo2: "Levante U.D.",      goles1: 3,    goles2: 1    },
    { equipo1: "Elche C.F.",        equipo2: "Real Sociedad",     goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Villarreal C.F.",   goles1: 0,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "Real Madrid",       goles1: 0,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 0    },
    { equipo1: "Celta de Vigo",     equipo2: "F.C. Barcelona",    goles1: 2,    goles2: 4    },
    { equipo1: "Valencia C.F.",     equipo2: "Real Betis",        goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Getafe C.F.",       goles1: 1,    goles2: 0    },
    { equipo1: "Sevilla F.C.",      equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    // Jornada 13
    { equipo1: "Deportivo Alavés",  equipo2: "Celta de Vigo",     goles1: 0,    goles2: 1    },
    { equipo1: "Real Betis",        equipo2: "Girona F.C.",       goles1: 1,    goles2: 1    },
    { equipo1: "Elche C.F.",        equipo2: "Real Madrid",       goles1: 2,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Sevilla F.C.",      goles1: 2,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Real Sociedad",     goles1: 1,    goles2: 3    },
    { equipo1: "Real Oviedo",       equipo2: "Rayo Vallecano",    goles1: 0,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Athletic Club",     goles1: 4,    goles2: 0    },
    { equipo1: "Getafe C.F.",       equipo2: "Atlético de Madrid",goles1: 0,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Levante U.D.",      goles1: 1,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 1    },
    // Jornada 14
    { equipo1: "Atlético de Madrid",equipo2: "Real Oviedo",       goles1: 2,    goles2: 0    },
    { equipo1: "Celta de Vigo",     equipo2: "R.C.D. Espanyol",   goles1: 0,    goles2: 1    },
    { equipo1: "Girona F.C.",       equipo2: "Real Madrid",       goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "C.A. Osasuna",      goles1: 2,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "Valencia C.F.",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "Villarreal C.F.",   goles1: 2,    goles2: 3    },
    { equipo1: "F.C. Barcelona",    equipo2: "Deportivo Alavés",  goles1: 3,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Athletic Club",     goles1: 0,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Real Betis",        goles1: 0,    goles2: 2    },
    { equipo1: "Getafe C.F.",       equipo2: "Elche C.F.",        goles1: 1,    goles2: 0    },
    // Jornada 15
    { equipo1: "Deportivo Alavés",  equipo2: "Real Sociedad",     goles1: 1,    goles2: 0    },
    { equipo1: "Athletic Club",     equipo2: "Atlético de Madrid",goles1: 1,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "Girona F.C.",       goles1: 3,    goles2: 0    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 0    },
    { equipo1: "Real Betis",        equipo2: "F.C. Barcelona",    goles1: 3,    goles2: 5    },
    { equipo1: "Real Madrid",       equipo2: "Celta de Vigo",     goles1: 0,    goles2: 2    },
    { equipo1: "Villarreal C.F.",   equipo2: "Getafe C.F.",       goles1: 2,    goles2: 0    },
    { equipo1: "C.A. Osasuna",      equipo2: "Levante U.D.",      goles1: 2,    goles2: 0    },
    { equipo1: "Real Oviedo",       equipo2: "R.C.D. Mallorca",   goles1: 0,    goles2: 0    },
    { equipo1: "Valencia C.F.",     equipo2: "Sevilla F.C.",      goles1: 1,    goles2: 1    },
    // Jornada 16
    { equipo1: "Deportivo Alavés",  equipo2: "Real Madrid",       goles1: 1,    goles2: 2    },
    { equipo1: "Atlético de Madrid",equipo2: "Valencia C.F.",     goles1: 2,    goles2: 1    },
    { equipo1: "F.C. Barcelona",    equipo2: "C.A. Osasuna",      goles1: 2,    goles2: 0    },
    { equipo1: "Levante U.D.",      equipo2: "Villarreal C.F.",   goles1: 0,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "Athletic Club",     goles1: 2,    goles2: 0    },
    { equipo1: "Rayo Vallecano",    equipo2: "Real Betis",        goles1: 0,    goles2: 0    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Elche C.F.",        goles1: 3,    goles2: 1    },
    { equipo1: "Getafe C.F.",       equipo2: "R.C.D. Espanyol",   goles1: 0,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "Girona F.C.",       goles1: 1,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Real Oviedo",       goles1: 4,    goles2: 0    },
    // Jornada 17
    { equipo1: "Athletic Club",     equipo2: "R.C.D. Espanyol",   goles1: 1,    goles2: 2    },
    { equipo1: "Real Betis",        equipo2: "Getafe C.F.",       goles1: 4,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "Rayo Vallecano",    goles1: 4,    goles2: 0    },
    { equipo1: "Levante U.D.",      equipo2: "Real Sociedad",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "Sevilla F.C.",      goles1: 2,    goles2: 0    },
    { equipo1: "C.A. Osasuna",      equipo2: "Deportivo Alavés",  goles1: 3,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "Atlético de Madrid",goles1: 0,    goles2: 3    },
    { equipo1: "Villarreal C.F.",   equipo2: "F.C. Barcelona",    goles1: 0,    goles2: 2    },
    { equipo1: "Real Oviedo",       equipo2: "Celta de Vigo",     goles1: 0,    goles2: 0    },
    { equipo1: "Valencia C.F.",     equipo2: "R.C.D. Mallorca",   goles1: 1,    goles2: 1    },
    // Jornada 18
    { equipo1: "Deportivo Alavés",  equipo2: "Real Oviedo",       goles1: 1,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "Valencia C.F.",     goles1: 4,    goles2: 1    },
    { equipo1: "Elche C.F.",        equipo2: "Villarreal C.F.",   goles1: 1,    goles2: 3    },
    { equipo1: "C.A. Osasuna",      equipo2: "Athletic Club",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "Atlético de Madrid",goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "F.C. Barcelona",    goles1: 0,    goles2: 2    },
    { equipo1: "Real Madrid",       equipo2: "Real Betis",        goles1: 5,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "Getafe C.F.",       goles1: 1,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Girona F.C.",       goles1: 1,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Levante U.D.",      goles1: 0,    goles2: 3    },
    // Jornada 19
    { equipo1: "Athletic Club",     equipo2: "Real Madrid",       goles1: 0,    goles2: 3    },
    { equipo1: "Getafe C.F.",       equipo2: "Real Sociedad",     goles1: 1,    goles2: 2    },
    { equipo1: "Girona F.C.",       equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Deportivo Alavés",  goles1: 3,    goles2: 1    },
    { equipo1: "F.C. Barcelona",    equipo2: "Atlético de Madrid",goles1: 3,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "Real Betis",        goles1: 1,    goles2: 1    },
    { equipo1: "Sevilla F.C.",      equipo2: "Celta de Vigo",     goles1: 0,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Elche C.F.",        goles1: 1,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "R.C.D. Espanyol",   goles1: 1,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 1    },
    // Jornada 20
    { equipo1: "Real Betis",        equipo2: "Villarreal C.F.",   goles1: 2,    goles2: 0    },
    { equipo1: "Celta de Vigo",     equipo2: "Rayo Vallecano",    goles1: 3,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "Sevilla F.C.",      goles1: 2,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Girona F.C.",       goles1: 0,    goles2: 2    },
    { equipo1: "Getafe C.F.",       equipo2: "Valencia C.F.",     goles1: 0,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Real Oviedo",       goles1: 3,    goles2: 2    },
    { equipo1: "Atlético de Madrid",equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 0    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Athletic Club",     goles1: 3,    goles2: 2    },
    { equipo1: "Real Sociedad",     equipo2: "F.C. Barcelona",    goles1: 2,    goles2: 1    },
    { equipo1: "Real Madrid",       equipo2: "Levante U.D.",      goles1: 2,    goles2: 0    },
    // Jornada 21
    { equipo1: "Deportivo Alavés",  equipo2: "Real Betis",        goles1: 2,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "R.C.D. Mallorca",   goles1: 3,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Real Oviedo",       goles1: 3,    goles2: 0    },
    { equipo1: "Sevilla F.C.",      equipo2: "Athletic Club",     goles1: 2,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "Celta de Vigo",     goles1: 3,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Elche C.F.",        goles1: 3,    goles2: 2    },
    { equipo1: "Valencia C.F.",     equipo2: "R.C.D. Espanyol",   goles1: 3,    goles2: 2    },
    { equipo1: "Girona F.C.",       equipo2: "Getafe C.F.",       goles1: 1,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 3    },
    { equipo1: "Villarreal C.F.",   equipo2: "Real Madrid",       goles1: 0,    goles2: 2    },
    // Jornada 22
    { equipo1: "Athletic Club",     equipo2: "Real Sociedad",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Betis",        equipo2: "Valencia C.F.",     goles1: 2,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Sevilla F.C.",      goles1: 4,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Villarreal C.F.",   goles1: 2,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 2    },
    { equipo1: "Levante U.D.",      equipo2: "Atlético de Madrid",goles1: 0,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "F.C. Barcelona",    goles1: 1,    goles2: 3    },
    { equipo1: "Getafe C.F.",       equipo2: "Celta de Vigo",     goles1: 0,    goles2: 0    },
    { equipo1: "Real Oviedo",       equipo2: "Girona F.C.",       goles1: 1,    goles2: 0    },
    { equipo1: "Real Madrid",       equipo2: "Rayo Vallecano",    goles1: 2,    goles2: 1    },
    // Jornada 23
    { equipo1: "Deportivo Alavés",  equipo2: "Getafe C.F.",       goles1: 0,    goles2: 2    },
    { equipo1: "Athletic Club",     equipo2: "Levante U.D.",      goles1: 4,    goles2: 2    },
    { equipo1: "Atlético de Madrid",equipo2: "Real Betis",        goles1: 0,    goles2: 1    },
    { equipo1: "F.C. Barcelona",    equipo2: "R.C.D. Mallorca",   goles1: 3,    goles2: 0    },
    { equipo1: "Celta de Vigo",     equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 2    },
    { equipo1: "Real Sociedad",     equipo2: "Elche C.F.",        goles1: 3,    goles2: 1    },
    { equipo1: "Villarreal C.F.",   equipo2: "R.C.D. Espanyol",   goles1: 4,    goles2: 1    },
    { equipo1: "Sevilla F.C.",      equipo2: "Girona F.C.",       goles1: 1,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Real Madrid",       goles1: 0,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "Real Oviedo",       goles1: 3,    goles2: 0    },
    // Jornada 24
    { equipo1: "Elche C.F.",        equipo2: "C.A. Osasuna",      goles1: 0,    goles2: 0    },
    { equipo1: "Getafe C.F.",       equipo2: "Villarreal C.F.",   goles1: 2,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Valencia C.F.",     goles1: 0,    goles2: 2    },
    { equipo1: "Real Madrid",       equipo2: "Real Sociedad",     goles1: 4,    goles2: 1    },
    { equipo1: "Sevilla F.C.",      equipo2: "Deportivo Alavés",  goles1: 1,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "Athletic Club",     goles1: 1,    goles2: 2    },
    { equipo1: "Rayo Vallecano",    equipo2: "Atlético de Madrid",goles1: 3,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "F.C. Barcelona",    goles1: 2,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Real Betis",        goles1: 1,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Celta de Vigo",     goles1: 2,    goles2: 2    },
    // Jornada 25
    { equipo1: "Deportivo Alavés",  equipo2: "Girona F.C.",       goles1: 2,    goles2: 2    },
    { equipo1: "Athletic Club",     equipo2: "Elche C.F.",        goles1: 2,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "R.C.D. Espanyol",   goles1: 4,    goles2: 2    },
    { equipo1: "F.C. Barcelona",    equipo2: "Levante U.D.",      goles1: 3,    goles2: 0    },
    { equipo1: "Real Betis",        equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 1    },
    { equipo1: "Celta de Vigo",     equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 0    },
    { equipo1: "Getafe C.F.",       equipo2: "Sevilla F.C.",      goles1: 0,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "Real Madrid",       goles1: 2,    goles2: 1    },
    { equipo1: "Villarreal C.F.",   equipo2: "Valencia C.F.",     goles1: 2,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "Real Oviedo",       goles1: 3,    goles2: 3    },
    // Jornada 26
    { equipo1: "F.C. Barcelona",    equipo2: "Villarreal C.F.",   goles1: 4,    goles2: 1    },
    { equipo1: "Real Betis",        equipo2: "Sevilla F.C.",      goles1: 2,    goles2: 2    },
    { equipo1: "Elche C.F.",        equipo2: "R.C.D. Espanyol",   goles1: 2,    goles2: 2    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Real Sociedad",     goles1: 0,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Deportivo Alavés",  goles1: 2,    goles2: 0    },
    { equipo1: "Rayo Vallecano",    equipo2: "Athletic Club",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "Atlético de Madrid",goles1: 0,    goles2: 1    },
    { equipo1: "Girona F.C.",       equipo2: "Celta de Vigo",     goles1: 1,    goles2: 2    },
    { equipo1: "Real Madrid",       equipo2: "Getafe C.F.",       goles1: 0,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "C.A. Osasuna",      goles1: 1,    goles2: 0    },
    // Jornada 27
    { equipo1: "Athletic Club",     equipo2: "F.C. Barcelona",    goles1: 0,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "Real Sociedad",     goles1: 3,    goles2: 2    },
    { equipo1: "Celta de Vigo",     equipo2: "Real Madrid",       goles1: 1,    goles2: 2    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Real Oviedo",       goles1: 1,    goles2: 1    },
    { equipo1: "Valencia C.F.",     equipo2: "Deportivo Alavés",  goles1: 3,    goles2: 2    },
    { equipo1: "Getafe C.F.",       equipo2: "Real Betis",        goles1: 2,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Elche C.F.",        goles1: 2,    goles2: 1    },
    { equipo1: "Levante U.D.",      equipo2: "Girona F.C.",       goles1: 1,    goles2: 1    },
    { equipo1: "C.A. Osasuna",      equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 1    },
    // Jornada 28
    { equipo1: "Deportivo Alavés",  equipo2: "Villarreal C.F.",   goles1: 1,    goles2: 1    },
    { equipo1: "Atlético de Madrid",equipo2: "Getafe C.F.",       goles1: 1,    goles2: 0    },
    { equipo1: "F.C. Barcelona",    equipo2: "Sevilla F.C.",      goles1: 5,    goles2: 2    },
    { equipo1: "Real Betis",        equipo2: "Celta de Vigo",     goles1: 1,    goles2: 1    },
    { equipo1: "Real Oviedo",       equipo2: "Valencia C.F.",     goles1: 1,    goles2: 0    },
    { equipo1: "Girona F.C.",       equipo2: "Athletic Club",     goles1: 3,    goles2: 0    },
    { equipo1: "Real Madrid",       equipo2: "Elche C.F.",        goles1: 4,    goles2: 1    },
    { equipo1: "R.C.D. Mallorca",   equipo2: "R.C.D. Espanyol",   goles1: 2,    goles2: 1    },
    { equipo1: "Rayo Vallecano",    equipo2: "Levante U.D.",      goles1: 1,    goles2: 1    },
    { equipo1: "Real Sociedad",     equipo2: "C.A. Osasuna",      goles1: 3,    goles2: 1    },
    // Jornada 29
    { equipo1: "Athletic Club",     equipo2: "Real Betis",        goles1: 2,    goles2: 1    },
    { equipo1: "F.C. Barcelona",    equipo2: "Rayo Vallecano",    goles1: 1,    goles2: 0    },
    { equipo1: "Elche C.F.",        equipo2: "R.C.D. Mallorca",   goles1: 2,    goles2: 1    },
    { equipo1: "R.C.D. Espanyol",   equipo2: "Getafe C.F.",       goles1: 1,    goles2: 2    },
    { equipo1: "Levante U.D.",      equipo2: "Real Oviedo",       goles1: 4,    goles2: 2    },
    { equipo1: "Sevilla F.C.",      equipo2: "Valencia C.F.",     goles1: 0,    goles2: 2    },
    { equipo1: "Celta de Vigo",     equipo2: "Deportivo Alavés",  goles1: 3,    goles2: 4    },
    { equipo1: "Real Madrid",       equipo2: "Atlético de Madrid", goles1: 3,    goles2: 2    },
    { equipo1: "C.A. Osasuna",      equipo2: "Girona F.C.",       goles1: 1,    goles2: 0    },
    { equipo1: "Villarreal C.F.",   equipo2: "Real Sociedad",     goles1: 3,    goles2: 1    },
    // Jornada 30
    { equipo1: "Deportivo Alavés",  equipo2: "C.A. Osasuna",      goles1: null, goles2: null },
    { equipo1: "Atlético de Madrid",equipo2: "F.C. Barcelona",    goles1: null, goles2: null },
    { equipo1: "Real Betis",        equipo2: "R.C.D. Espanyol",   goles1: null, goles2: null },
    { equipo1: "Girona F.C.",       equipo2: "Villarreal C.F.",   goles1: null, goles2: null },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Real Madrid",       goles1: null, goles2: null },
    { equipo1: "Real Oviedo",       equipo2: "Sevilla F.C.",      goles1: null, goles2: null },
    { equipo1: "Getafe C.F.",       equipo2: "Athletic Club",     goles1: null, goles2: null },
    { equipo1: "Valencia C.F.",     equipo2: "Celta de Vigo",     goles1: null, goles2: null },
    { equipo1: "Rayo Vallecano",    equipo2: "Elche C.F.",        goles1: null, goles2: null },
    { equipo1: "Real Sociedad",     equipo2: "Levante U.D.",      goles1: null, goles2: null },
    // Jornadas 31
    { equipo1: "Athletic Club",     equipo2: "Villarreal C.F.",   goles1: null, goles2: null },
    { equipo1: "F.C. Barcelona",    equipo2: "R.C.D. Espanyol",   goles1: null, goles2: null },
    { equipo1: "Celta de Vigo",     equipo2: "Real Oviedo",       goles1: null, goles2: null },
    { equipo1: "Elche C.F.",        equipo2: "Valencia C.F.",     goles1: null, goles2: null },
    { equipo1: "R.C.D. Mallorca",   equipo2: "Rayo Vallecano",    goles1: null, goles2: null },
    { equipo1: "Real Sociedad",     equipo2: "Deportivo Alavés",  goles1: null, goles2: null },
    { equipo1: "Sevilla F.C.",      equipo2: "Atlético de Madrid",goles1: null, goles2: null },
    { equipo1: "C.A. Osasuna",      equipo2: "Real Betis",        goles1: null, goles2: null },
    { equipo1: "Levante U.D.",      equipo2: "Getafe C.F.",       goles1: null, goles2: null },
    { equipo1: "Real Madrid",       equipo2: "Girona F.C.",       goles1: null, goles2: null },
    // Jornada 32
    { equipo1: "Deportivo Alavés", equipo2: "R.C.D. Mallorca", goles1: null, goles2: null },
    { equipo1: "Real Betis", equipo2: "Real Madrid", goles1: null, goles2: null },
    { equipo1: "R.C.D. Espanyol", equipo2: "Levante U.D.", goles1: null, goles2: null },
    { equipo1: "C.A. Osasuna", equipo2: "Sevilla F.C.", goles1: null, goles2: null },
    { equipo1: "Rayo Vallecano", equipo2: "Real Sociedad", goles1: null, goles2: null },
    { equipo1: "Atlético de Madrid", equipo2: "Athletic Club", goles1: null, goles2: null },
    { equipo1: "Getafe C.F.", equipo2: "F.C. Barcelona", goles1: null, goles2: null },
    { equipo1: "Villarreal C.F.", equipo2: "Celta de Vigo", goles1: null, goles2: null },
    { equipo1: "Real Oviedo", equipo2: "Elche C.F.", goles1: null, goles2: null },
    { equipo1: "Valencia C.F.", equipo2: "Girona F.C.", goles1: null, goles2: null },
    // Jornada 33
    { equipo1: "Athletic Club", equipo2: "C.A. Osasuna", goles1: null, goles2: null },
    { equipo1: "F.C. Barcelona", equipo2: "Celta de Vigo", goles1: null, goles2: null },
    { equipo1: "Levante U.D.", equipo2: "Sevilla F.C.", goles1: null, goles2: null },
    { equipo1: "R.C.D. Mallorca", equipo2: "Valencia C.F.", goles1: null, goles2: null },
    { equipo1: "Real Oviedo", equipo2: "Villarreal C.F.", goles1: null, goles2: null },
    { equipo1: "Real Madrid", equipo2: "Deportivo Alavés", goles1: null, goles2: null },
    { equipo1: "Elche C.F.", equipo2: "Atlético de Madrid", goles1: null, goles2: null },
    { equipo1: "Girona F.C.", equipo2: "Real Betis", goles1: null, goles2: null },
    { equipo1: "Rayo Vallecano", equipo2: "R.C.D. Espanyol", goles1: null, goles2: null },
    { equipo1: "Real Sociedad", equipo2: "Getafe C.F.", goles1: null, goles2: null },
    // Jornada 34
    { equipo1: "Deportivo Alavés", equipo2: "Athletic Club", goles1: null, goles2: null },
    { equipo1: "Real Betis", equipo2: "Real Oviedo", goles1: null, goles2: null },
    { equipo1: "Celta de Vigo", equipo2: "Elche C.F.", goles1: null, goles2: null },
    { equipo1: "R.C.D. Espanyol", equipo2: "Real Madrid", goles1: null, goles2: null },
    { equipo1: "Getafe C.F.", equipo2: "Rayo Vallecano", goles1: null, goles2: null },
    { equipo1: "Girona F.C.", equipo2: "R.C.D. Mallorca", goles1: null, goles2: null },
    { equipo1: "Valencia C.F.", equipo2: "Atlético de Madrid", goles1: null, goles2: null },
    { equipo1: "C.A. Osasuna", equipo2: "F.C. Barcelona", goles1: null, goles2: null },
    { equipo1: "Villarreal C.F.", equipo2: "Levante U.D.", goles1: null, goles2: null },
    { equipo1: "Sevilla F.C.", equipo2: "Real Sociedad", goles1: null, goles2: null },
    // Jornada 35
    { equipo1: "Athletic Club", equipo2: "Valencia C.F.", goles1: null, goles2: null },
    { equipo1: "Atlético de Madrid", equipo2: "Celta de Vigo", goles1: null, goles2: null },
    { equipo1: "F.C. Barcelona", equipo2: "Real Madrid", goles1: null, goles2: null },
    { equipo1: "Levante U.D.", equipo2: "C.A. Osasuna", goles1: null, goles2: null },
    { equipo1: "R.C.D. Mallorca", equipo2: "Villarreal C.F.", goles1: null, goles2: null },
    { equipo1: "Elche C.F.", equipo2: "Deportivo Alavés", goles1: null, goles2: null },
    { equipo1: "Real Sociedad", equipo2: "Real Betis", goles1: null, goles2: null },
    { equipo1: "Sevilla F.C.", equipo2: "R.C.D. Espanyol", goles1: null, goles2: null },
    { equipo1: "Real Oviedo", equipo2: "Getafe C.F.", goles1: null, goles2: null },
    { equipo1: "Rayo Vallecano", equipo2: "Girona F.C.", goles1: null, goles2: null },
    // Jornada 36
    { equipo1: "Deportivo Alavés", equipo2: "F.C. Barcelona", goles1: null, goles2: null },
    { equipo1: "Real Betis", equipo2: "Elche C.F.", goles1: null, goles2: null },
    { equipo1: "Celta de Vigo", equipo2: "Levante U.D.", goles1: null, goles2: null },
    { equipo1: "Getafe C.F.", equipo2: "R.C.D. Mallorca", goles1: null, goles2: null },
    { equipo1: "Girona F.C.", equipo2: "Real Sociedad", goles1: null, goles2: null },
    { equipo1: "R.C.D. Espanyol", equipo2: "Athletic Club", goles1: null, goles2: null },
    { equipo1: "C.A. Osasuna", equipo2: "Atlético de Madrid", goles1: null, goles2: null },
    { equipo1: "Valencia C.F.", equipo2: "Rayo Vallecano", goles1: null, goles2: null },
    { equipo1: "Villarreal C.F.", equipo2: "Sevilla F.C.", goles1: null, goles2: null },
    { equipo1: "Real Madrid", equipo2: "Real Oviedo", goles1: null, goles2: null },
    // Jornada 37
    { equipo1: "Athletic Club", equipo2: "Celta de Vigo", goles1: null, goles2: null },
    { equipo1: "Atlético de Madrid", equipo2: "Girona F.C.", goles1: null, goles2: null },
    { equipo1: "F.C. Barcelona", equipo2: "Real Betis", goles1: null, goles2: null },
    { equipo1: "Elche C.F.", equipo2: "Getafe C.F.", goles1: null, goles2: null },
    { equipo1: "Levante U.D.", equipo2: "R.C.D. Mallorca", goles1: null, goles2: null },
    { equipo1: "Rayo Vallecano", equipo2: "Villarreal C.F.", goles1: null, goles2: null },
    { equipo1: "Real Sociedad", equipo2: "Valencia C.F.", goles1: null, goles2: null },
    { equipo1: "Real Oviedo", equipo2: "Deportivo Alavés", goles1: null, goles2: null },
    { equipo1: "C.A. Osasuna", equipo2: "R.C.D. Espanyol", goles1: null, goles2: null },
    { equipo1: "Sevilla F.C.", equipo2: "Real Madrid", goles1: null, goles2: null },
    // Jornada 38
    { equipo1: "Deportivo Alavés", equipo2: "Rayo Vallecano", goles1: null, goles2: null },
    { equipo1: "Real Betis", equipo2: "Levante U.D.", goles1: null, goles2: null },
    { equipo1: "Celta de Vigo", equipo2: "Sevilla F.C.", goles1: null, goles2: null },
    { equipo1: "R.C.D. Espanyol", equipo2: "Real Sociedad", goles1: null, goles2: null },
    { equipo1: "Getafe C.F.", equipo2: "C.A. Osasuna", goles1: null, goles2: null },
    { equipo1: "R.C.D. Mallorca", equipo2: "Real Oviedo", goles1: null, goles2: null },
    { equipo1: "Real Madrid", equipo2: "Athletic Club", goles1: null, goles2: null },
    { equipo1: "Villarreal C.F.", equipo2: "Atlético de Madrid", goles1: null, goles2: null },
    { equipo1: "Valencia C.F.", equipo2: "F.C. Barcelona", goles1: null, goles2: null },
    { equipo1: "Girona F.C.", equipo2: "Elche C.F.", goles1: null, goles2: null }
];

// =====================================================
// LÓGICA — No hace falta tocar nada de aquí abajo
// =====================================================

const EQUIPOS_POR_JORNADA = 10; // Partidos por jornada (Liga = 10)

function resetearEquipos() {
    equipos.forEach(eq => {
        eq.pj = 0; eq.pg = 0; eq.pe = 0; eq.pp = 0;
        eq.gf = 0; eq.gc = 0; eq.pts = 0; eq.dg = 0;
    });
}

function calcularEstadisticas(partidos) {
    resetearEquipos();
    partidos.forEach(p => {
        if (p.goles1 === null || p.goles2 === null) return;
        const eqA = equipos.find(e => e.nombre === p.equipo1);
        const eqB = equipos.find(e => e.nombre === p.equipo2);
        if (!eqA || !eqB) return;

        eqA.pj++; eqB.pj++;
        eqA.gf += p.goles1; eqA.gc += p.goles2;
        eqB.gf += p.goles2; eqB.gc += p.goles1;

        if (p.goles1 > p.goles2)      { eqA.pg++; eqA.pts += 3; eqB.pp++; }
        else if (p.goles1 < p.goles2) { eqB.pg++; eqB.pts += 3; eqA.pp++; }
        else                           { eqA.pe++; eqB.pe++; eqA.pts++; eqB.pts++; }
    });

    equipos.forEach(eq => { eq.dg = eq.gf - eq.gc; });

    equipos.sort((a, b) =>
        (b.pts - a.pts) || (b.dg - a.dg) || (b.gf - a.gf) || a.nombre.localeCompare(b.nombre)
    );
    equipos.forEach((eq, i) => { eq.posicion = i + 1; });
}

function getJornadaActual() {
    const jugados = enfrentamientos.filter(p => p.goles1 !== null).length;
    return Math.ceil(jugados / EQUIPOS_POR_JORNADA);
}

function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');
    tbody.innerHTML = '';

    equipos.forEach(eq => {
        let claseZona = '';
        if      (eq.posicion <= 4)  claseZona = 'pos-champions';
        else if (eq.posicion === 5) claseZona = 'pos-europa';
        else if (eq.posicion === 6) claseZona = 'pos-conference';
        else if (eq.posicion >= 18) claseZona = 'pos-descenso';

        const esOviedo = eq.nombre === 'Real Oviedo';

        let claseDG = '', signoDG = '';
        if      (eq.dg > 0) { claseDG = 'dg-positiva'; signoDG = '+'; }
        else if (eq.dg < 0) { claseDG = 'dg-negativa'; }

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
            <td class="desktop-only">${eq.pg}</td>
            <td class="desktop-only">${eq.pe}</td>
            <td class="desktop-only">${eq.pp}</td>
            <td class="desktop-only">${eq.gf}</td>
            <td class="desktop-only">${eq.gc}</td>
            <td class="${claseDG}">${signoDG}${eq.dg}</td>
        `;
        tbody.appendChild(tr);
    });
}

function actualizarJornadaBadge() {
    const jornada = getJornadaActual();
    const badge = document.getElementById('jornadaBadge');
    if (badge) badge.textContent = jornada > 0 ? `Jornada ${jornada}` : 'Sin datos';
}

// --- GRÁFICA ---
function calcularPosicionJornada(jornadaLimite) {
    const eqTemp = equipos.map(e => ({ nombre: e.nombre, pts: 0, gf: 0, gc: 0 }));
    const partidos = enfrentamientos.slice(0, jornadaLimite * EQUIPOS_POR_JORNADA);

    partidos.forEach(p => {
        if (p.goles1 === null) return;
        const a = eqTemp.find(x => x.nombre === p.equipo1);
        const b = eqTemp.find(x => x.nombre === p.equipo2);
        if (!a || !b) return;
        if      (p.goles1 > p.goles2) { a.pts += 3; }
        else if (p.goles1 < p.goles2) { b.pts += 3; }
        else                           { a.pts++; b.pts++; }
        a.gf += p.goles1; a.gc += p.goles2;
        b.gf += p.goles2; b.gc += p.goles1;
    });

    eqTemp.sort((a, b) => (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)));
    return eqTemp.findIndex(e => e.nombre === 'Real Oviedo') + 1;
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

    const mejor  = Math.min(...posiciones);
    const peor   = Math.max(...posiciones);
    const actual = posiciones[posiciones.length - 1];

    const elMejor  = document.getElementById('team-position-best');
    const elPeor   = document.getElementById('team-position-worst');
    const elActual = document.getElementById('team-position-current');
    if (elMejor)  elMejor.textContent  = mejor + 'º';
    if (elPeor)   elPeor.textContent   = peor  + 'º';
    if (elActual) elActual.textContent  = actual + 'º';

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: posiciones.map((_, i) => 'J' + (i + 1)),
            datasets: [{
                label: 'Posición Real Oviedo',
                data: posiciones,
                borderColor: '#0033cc',
                backgroundColor: 'rgba(0, 51, 204, 0.08)',
                borderWidth: 3,
                pointBackgroundColor: posiciones.map(p => p <= 3 ? '#2ecc71' : p >= 18 ? '#e74c3c' : '#ffcc00'),
                pointBorderColor: '#001a6e',
                pointBorderWidth: 2,
                pointRadius: 6,
                fill: true,
                tension: 0.35
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    reverse: true,
                    min: 1,
                    max: 20,
                    grid: { color: '#eef0f8' },
                    ticks: { stepSize: 1, color: '#666' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#666' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#001a6e',
                    titleColor: '#ffcc00',
                    bodyColor: '#fff',
                    padding: 10,
                    callbacks: {
                        label: ctx => `Posición: ${ctx.raw}º`
                    }
                }
            }
        }
    });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    calcularEstadisticas(enfrentamientos);
    renderizarTabla();
    actualizarJornadaBadge();
    initChart();
});