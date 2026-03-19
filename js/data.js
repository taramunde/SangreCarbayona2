/* ===================================
   DATOS DEL CLUB - CD VILLAFERREIRA
   =================================== */

const CLUB_DATA = {
    // Información del club
    club: {
        nombre: "Club Deportivo Villaferreira",
        nombreCorto: "Villaferreira",
        siglas: "CDV",
        fundacion: 1952,
        estadio: "Estadio Municipal de Villaferreira",
        capacidadEstadio: 8500,
        ciudad: "Villaferreira",
        direccion: "Calle del Deporte s/n, 33009 Villaferreira",
        telefono: "985 123 456",
        email: "info@cdvillaferreira.com"
    },

    // Temporada actual
    temporada: {
        año: "2024/25",
        competicion: "Primera RFEF",
        grupo: "Grupo I"
    },

    // Clasificación
    clasificacion: [
        { posicion: 1, siglas: "RAC", nombre: "Racing Ferrol", puntos: 48, jugados: 23, gfavor: 42, gcontra: 15, dg: "+27", destacado: true },
        { posicion: 2, siglas: "CDV", nombre: "Villaferreira", puntos: 45, jugados: 23, gfavor: 38, gcontra: 18, dg: "+20", destacado: true },
        { posicion: 3, siglas: "UDR", nombre: "UD Rosaleda", puntos: 42, jugados: 23, gfavor: 35, gcontra: 20, dg: "+15", destacado: true },
        { posicion: 4, siglas: "ATV", nombre: "Atlético Vergara", puntos: 39, jugados: 23, gfavor: 30, gcontra: 22, dg: "+8", destacado: false },
        { posicion: 5, siglas: "CDS", nombre: "Cultural Soria", puntos: 37, jugados: 23, gfavor: 28, gcontra: 24, dg: "+4", destacado: false },
        { posicion: 6, siglas: "SPE", nombre: "Sporting Esteño", puntos: 35, jugados: 23, gfavor: 32, gcontra: 28, dg: "+4", destacado: false },
        { posicion: 7, siglas: "UNI", nombre: "Unión Sur", puntos: 33, jugados: 23, gfavor: 29, gcontra: 25, dg: "+4", destacado: false },
        { posicion: 8, siglas: "DEP", nombre: "Deportivo Norte", puntos: 31, jugados: 23, gfavor: 26, gcontra: 27, dg: "-1", destacado: false },
        { posicion: 9, siglas: "CFP", nombre: "CF Palencia", puntos: 28, jugados: 23, gfavor: 24, gcontra: 30, dg: "-6", destacado: false },
        { posicion: 10, siglas: "ZAM", nombre: "Zamora CF", puntos: 26, jugados: 23, gfavor: 22, gcontra: 29, dg: "-7", destacado: false },
        { posicion: 11, siglas: "SAL", nombre: "Salamanca UDS", puntos: 24, jugados: 23, gfavor: 20, gcontra: 31, dg: "-11", destacado: false },
        { posicion: 12, siglas: "GUA", nombre: "Guadalajara", puntos: 22, jugados: 23, gfavor: 18, gcontra: 33, dg: "-15", destacado: false },
        { posicion: 13, siglas: "BER", nombre: "Bergantiño FC", puntos: 19, jugados: 23, gfavor: 16, gcontra: 35, dg: "-19", destacado: false },
        { posicion: 14, siglas: "COM", nombre: "Compostela", puntos: 17, jugados: 23, gfavor: 15, gcontra: 38, dg: "-23", destacado: false },
        { posicion: 15, siglas: "PON", nombre: "Pontevedra CF", puntos: 14, jugados: 23, gfavor: 12, gcontra: 40, dg: "-28", destacado: false },
        { posicion: 16, siglas: "LUG", nombre: "CD Lugo B", puntos: 11, jugados: 23, gfavor: 10, gcontra: 42, dg: "-32", destacado: false }
    ],

    // Calendario de partidos
    calendario: [
        { 
            id: 1,
            jornada: 24,
            fecha: "2025-01-26",
            hora: "18:00",
            local: "Villaferreira",
            localSiglas: "CDV",
            visitante: "UD Rosaleda",
            visitanteSiglas: "UDR",
            estadio: "Estadio Municipal",
            competicion: "Primera RFEF",
            resultado: null,
            esProximo: true
        },
        { 
            id: 2,
            jornada: 25,
            fecha: "2025-02-02",
            hora: "16:00",
            local: "Racing Ferrol",
            localSiglas: "RAC",
            visitante: "Villaferreira",
            visitanteSiglas: "CDV",
            estadio: "A Fermín",
            competicion: "Primera RFEF",
            resultado: null,
            esProximo: false
        },
        { 
            id: 3,
            jornada: 26,
            fecha: "2025-02-09",
            hora: "17:00",
            local: "Villaferreira",
            localSiglas: "CDV",
            visitante: "Cultural Soria",
            visitanteSiglas: "CDS",
            estadio: "Estadio Municipal",
            competicion: "Primera RFEF",
            resultado: null,
            esProximo: false
        },
        { 
            id: 4,
            jornada: 27,
            fecha: "2025-02-16",
            hora: "12:00",
            local: "Sporting Esteño",
            localSiglas: "SPE",
            visitante: "Villaferreira",
            visitanteSiglas: "CDV",
            estadio: "El Natahoyo",
            competicion: "Primera RFEF",
            resultado: null,
            esProximo: false
        },
        { 
            id: 5,
            jornada: 28,
            fecha: "2025-02-23",
            hora: "18:00",
            local: "Villaferreira",
            localSiglas: "CDV",
            visitante: "Unión Sur",
            visitanteSiglas: "UNI",
            estadio: "Estadio Municipal",
            competicion: "Primera RFEF",
            resultado: null,
            esProximo: false
        }
    ],

    // Partidos jugados (historial reciente)
    partidosJugados: [
        {
            id: 101,
            jornada: 23,
            fecha: "2025-01-19",
            local: "Villaferreira",
            visitante: "Atlético Vergara",
            golesLocal: 2,
            golesVisitante: 1,
            competicion: "Primera RFEF",
            resultado: "V"
        },
        {
            id: 102,
            jornada: 22,
            fecha: "2025-01-12",
            local: "Cultural Soria",
            visitante: "Villaferreira",
            golesLocal: 0,
            golesVisitante: 3,
            competicion: "Primera RFEF",
            resultado: "V"
        },
        {
            id: 103,
            jornada: 21,
            fecha: "2025-01-05",
            local: "Villaferreira",
            visitante: "Racing Ferrol",
            golesLocal: 1,
            golesVisitante: 1,
            competicion: "Primera RFEF",
            resultado: "E"
        },
        {
            id: 104,
            jornada: 20,
            fecha: "2024-12-22",
            local: "Sporting Esteño",
            visitante: "Villaferreira",
            golesLocal: 2,
            golesVisitante: 4,
            competicion: "Primera RFEF",
            resultado: "V"
        },
        {
            id: 105,
            jornada: 19,
            fecha: "2024-12-15",
            local: "Villaferreira",
            visitante: "UD Rosaleda",
            golesLocal: 2,
            golesVisitante: 0,
            competicion: "Primera RFEF",
            resultado: "V"
        }
    ],

    // Plantilla de jugadores
    jugadores: [
        {
            id: 1,
            nombre: "Miguel Ángel",
            apellidos: "Torres García",
            nombreCompleto: "Miguel Ángel Torres",
            dorsal: 1,
            posicion: "Portero",
            posicionCorta: "POR",
            edad: 28,
            altura: 1.87,
            peso: 82,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Oviedo, Asturias",
            fechaNacimiento: "1997-03-15",
            enClubDesde: "2022",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/gk1/400/500",
            stats: {
                partidos: 23,
                goles: 0,
                asistencias: 0,
                minutos: 2070,
                porterosACero: 15,
                amarillas: 1,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/matgarcia",
                twitter: "https://twitter.com/matgarcia"
            }
        },
        {
            id: 2,
            nombre: "Pablo",
            apellidos: "Menéndez Álvarez",
            nombreCompleto: "Pablo Menéndez",
            dorsal: 13,
            posicion: "Portero",
            posicionCorta: "POR",
            edad: 22,
            altura: 1.83,
            peso: 78,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Gijón, Asturias",
            fechaNacimiento: "2002-07-22",
            enClubDesde: "2024",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/gk2/400/500",
            stats: {
                partidos: 0,
                goles: 0,
                asistencias: 0,
                minutos: 0,
                porterosACero: 0,
                amarillas: 0,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/pablomenendez",
                twitter: null
            }
        },
        {
            id: 3,
            nombre: "Dani",
            apellidos: "Fernández Rodríguez",
            nombreCompleto: "Dani Fernández",
            dorsal: 2,
            posicion: "Lateral Derecho",
            posicionCorta: "LD",
            edad: 26,
            altura: 1.78,
            peso: 73,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Avilés, Asturias",
            fechaNacimiento: "1998-11-03",
            enClubDesde: "2023",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/df1/400/500",
            stats: {
                partidos: 21,
                goles: 2,
                asistencias: 4,
                minutos: 1780,
                amarillas: 3,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/danifdez2",
                twitter: "https://twitter.com/danifdez2"
            }
        },
        {
            id: 4,
            nombre: "Adrián",
            apellidos: "Picos Menéndez",
            nombreCompleto: "Adrián Picos",
            dorsal: 4,
            posicion: "Central",
            posicionCorta: "DC",
            edad: 29,
            altura: 1.85,
            peso: 80,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Santander, Cantabria",
            fechaNacimiento: "1995-06-18",
            enClubDesde: "2022",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/df2/400/500",
            stats: {
                partidos: 23,
                goles: 3,
                asistencias: 1,
                minutos: 2045,
                amarillas: 5,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/adrianpicos4",
                twitter: null
            }
        },
        {
            id: 5,
            nombre: "Víctor",
            apellidos: "Márquez López",
            nombreCompleto: "Víctor Márquez",
            dorsal: 5,
            posicion: "Central",
            posicionCorta: "DC",
            edad: 27,
            altura: 1.82,
            peso: 77,
            pie: "Izquierdo",
            nacionalidad: "Española",
            lugarNacimiento: "León",
            fechaNacimiento: "1997-09-30",
            enClubDesde: "2023",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/df3/400/500",
            stats: {
                partidos: 22,
                goles: 1,
                asistencias: 2,
                minutos: 1890,
                amarillas: 4,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/victormarquez5",
                twitter: "https://twitter.com/victormarquez5"
            }
        },
        {
            id: 6,
            nombre: "Sergio",
            apellidos: "Núñez Pérez",
            nombreCompleto: "Sergio Núñez",
            dorsal: 3,
            posicion: "Lateral Izquierdo",
            posicionCorta: "LI",
            edad: 24,
            altura: 1.76,
            peso: 70,
            pie: "Izquierdo",
            nacionalidad: "Española",
            lugarNacimiento: "Madrid",
            fechaNacimiento: "2000-02-14",
            enClubDesde: "2024",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/df4/400/500",
            stats: {
                partidos: 18,
                goles: 0,
                asistencias: 4,
                minutos: 1420,
                amarillas: 2,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/sergionunez3",
                twitter: null
            }
        },
        {
            id: 7,
            nombre: "Borja",
            apellidos: "Trujillo Fernández",
            nombreCompleto: "Borja Trujillo",
            dorsal: 15,
            posicion: "Central",
            posicionCorta: "DC",
            edad: 25,
            altura: 1.88,
            peso: 83,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Gijón, Asturias",
            fechaNacimiento: "1999-08-05",
            enClubDesde: "2023",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/df5/400/500",
            stats: {
                partidos: 12,
                goles: 0,
                asistencias: 0,
                minutos: 890,
                amarillas: 2,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/borjatrujillo15",
                twitter: null
            }
        },
        {
            id: 8,
            nombre: "Álvaro",
            apellidos: "Santos Díaz",
            nombreCompleto: "Álvaro Santos",
            dorsal: 6,
            posicion: "Mediocentro Defensivo",
            posicionCorta: "MCD",
            edad: 30,
            altura: 1.80,
            peso: 75,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Sevilla",
            fechaNacimiento: "1994-12-10",
            enClubDesde: "2022",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/mf1/400/500",
            stats: {
                partidos: 23,
                goles: 1,
                asistencias: 2,
                minutos: 1980,
                amarillas: 8,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/alvarosantos6",
                twitter: "https://twitter.com/alvarosantos6"
            }
        },
        {
            id: 9,
            nombre: "Nacho",
            apellidos: "Ruiz Martínez",
            nombreCompleto: "Nacho Ruiz",
            dorsal: 8,
            posicion: "Centrocampista",
            posicionCorta: "MC",
            edad: 26,
            altura: 1.77,
            peso: 72,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Valencia",
            fechaNacimiento: "1998-04-25",
            enClubDesde: "2023",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/mf2/400/500",
            stats: {
                partidos: 22,
                goles: 5,
                asistencias: 6,
                minutos: 1750,
                amarillas: 3,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/nachoruiz8",
                twitter: "https://twitter.com/nachoruiz8"
            }
        },
        {
            id: 10,
            nombre: "Pedro",
            apellidos: "Leal García",
            nombreCompleto: "Pedro Leal",
            dorsal: 10,
            posicion: "Mediapunta",
            posicionCorta: "MP",
            edad: 28,
            altura: 1.74,
            peso: 68,
            pie: "Izquierdo",
            nacionalidad: "Española",
            lugarNacimiento: "Barcelona",
            fechaNacimiento: "1996-07-08",
            enClubDesde: "2022",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/mf3/400/500",
            stats: {
                partidos: 21,
                goles: 8,
                asistencias: 5,
                minutos: 1680,
                amarillas: 2,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/pedroleal10",
                twitter: "https://twitter.com/pedroleal10"
            }
        },
        {
            id: 11,
            nombre: "Iván",
            apellidos: "Pacheco López",
            nombreCompleto: "Iván Pacheco",
            dorsal: 14,
            posicion: "Centrocampista",
            posicionCorta: "MC",
            edad: 23,
            altura: 1.79,
            peso: 74,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Murcia",
            fechaNacimiento: "2001-03-20",
            enClubDesde: "2025",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/mf4/400/500",
            stats: {
                partidos: 8,
                goles: 0,
                asistencias: 2,
                minutos: 420,
                amarillas: 1,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/ivanpacheco14",
                twitter: null
            }
        },
        {
            id: 12,
            nombre: "Hugo",
            apellidos: "de la Torre Sánchez",
            nombreCompleto: "Hugo de la Torre",
            dorsal: 16,
            posicion: "Mediocentro",
            posicionCorta: "MC",
            edad: 21,
            altura: 1.75,
            peso: 69,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Oviedo, Asturias",
            fechaNacimiento: "2003-10-12",
            enClubDesde: "2024",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/mf5/400/500",
            stats: {
                partidos: 15,
                goles: 1,
                asistencias: 3,
                minutos: 890,
                amarillas: 1,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/hugodelatorre16",
                twitter: null
            }
        },
        {
            id: 13,
            nombre: "Javi",
            apellidos: "Martínez Fernández",
            nombreCompleto: "Javi Martínez",
            dorsal: 9,
            posicion: "Delantero Centro",
            posicionCorta: "DC",
            edad: 27,
            altura: 1.82,
            peso: 75,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Gijón, Asturias",
            fechaNacimiento: "1997-03-15",
            enClubDesde: "2022",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/fw1/400/500",
            esCapitan: true,
            stats: {
                partidos: 23,
                goles: 14,
                asistencias: 4,
                minutos: 1892,
                amarillas: 4,
                rojas: 0
            },
            golesPorZona: {
                pieDerecho: 9,
                pieIzquierdo: 3,
                cabeza: 2,
                penaltis: "4/4"
            },
            trayectoria: [
                { club: "CD Villaferreira", siglas: "CDV", años: "2022-Actual", partidos: 89, goles: 47, asistencias: 18, actual: true },
                { club: "Racing Gondón", siglas: "RGO", años: "2020-2022", partidos: 54, goles: 21, asistencias: 9, actual: false },
                { club: "Sporting Gijón B", siglas: "SPO", años: "2017-2020", partidos: 68, goles: 24, asistencias: 11, actual: false }
            ],
            logros: [
                "Pichichi Primera RFEF 2023/24 (22 goles)",
                "Mejor Jugador Temporada 2023/24",
                "Capitán del equipo"
            ],
            redes: {
                instagram: "https://instagram.com/javimartinez9",
                twitter: "https://twitter.com/javimartinez9"
            }
        },
        {
            id: 14,
            nombre: "Rubén",
            apellidos: "Cano Pérez",
            nombreCompleto: "Rubén Cano",
            dorsal: 7,
            posicion: "Extremo Derecho",
            posicionCorta: "ED",
            edad: 25,
            altura: 1.73,
            peso: 67,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Bilbao, Vizcaya",
            fechaNacimiento: "1999-05-28",
            enClubDesde: "2023",
            contratoHasta: "2025",
            imagen: "https://picsum.photos/seed/fw2/400/500",
            stats: {
                partidos: 20,
                goles: 6,
                asistencias: 8,
                minutos: 1450,
                amarillas: 1,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/rubencano7",
                twitter: null
            }
        },
        {
            id: 15,
            nombre: "Luis",
            apellidos: "García Rodríguez",
            nombreCompleto: "Luis 'Lucho' García",
            dorsal: 11,
            posicion: "Extremo Izquierdo",
            posicionCorta: "EI",
            edad: 24,
            altura: 1.76,
            peso: 71,
            pie: "Izquierdo",
            nacionalidad: "Española",
            lugarNacimiento: "Buenos Aires, Argentina",
            fechaNacimiento: "2000-09-18",
            enClubDesde: "2024",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/fw3/400/500",
            stats: {
                partidos: 22,
                goles: 7,
                asistencias: 9,
                minutos: 1580,
                amarillas: 2,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/luchogarcia11",
                twitter: "https://twitter.com/luchogarcia11"
            }
        },
        {
            id: 16,
            nombre: "Diego",
            apellidos: "López Sánchez",
            nombreCompleto: "Diego 'Chicho' López",
            dorsal: 17,
            posicion: "Delantero",
            posicionCorta: "DC",
            edad: 22,
            altura: 1.79,
            peso: 76,
            pie: "Derecho",
            nacionalidad: "Española",
            lugarNacimiento: "Santander, Cantabria",
            fechaNacimiento: "2002-01-05",
            enClubDesde: "2024",
            contratoHasta: "2026",
            imagen: "https://picsum.photos/seed/fw4/400/500",
            stats: {
                partidos: 12,
                goles: 3,
                asistencias: 1,
                minutos: 580,
                amarillas: 0,
                rojas: 0
            },
            redes: {
                instagram: "https://instagram.com/chicholopez17",
                twitter: null
            }
        }
    ],

    // Cuerpo técnico
    cuerpoTecnico: [
        {
            id: 1,
            nombre: "Carlos Mendoza",
            cargo: "Entrenador Principal",
            imagen: "https://picsum.photos/seed/coach1/400/450",
            descripcion: "Licenciado en Educación Física con más de 15 años de experiencia en fútbol profesional. Antiguo jugador del club.",
            esPrincipal: true,
            estadisticas: {
                partidos: 89,
                victorias: 46,
                empates: 22,
                derrotas: 21
            }
        },
        {
            id: 2,
            nombre: "Roberto Vázquez",
            cargo: "Segundo Entrenador",
            imagen: "https://picsum.photos/seed/coach2/400/450",
            descripcion: "Especialista en análisis táctico y preparación de partidos.",
            esPrincipal: false
        },
        {
            id: 3,
            nombre: "Miguel Serrano",
            cargo: "Preparador Físico",
            imagen: "https://picsum.photos/seed/coach3/400/450",
            descripcion: "Licenciado en Ciencias del Deporte, especialista en rendimiento deportivo.",
            esPrincipal: false
        },
        {
            id: 4,
            nombre: "Antonio Cruz",
            cargo: "Entrenador de Porteros",
            imagen: "https://picsum.photos/seed/coach4/400/450",
            descripcion: "Ex-portero profesional con amplia experiencia en la preparación de guardametas.",
            esPrincipal: false
        }
    ],

    // Noticias
    noticias: [
        {
            id: 1,
            titulo: "El Villaferreira encadena cinco victorias consecutivas y se mete en puestos de playoff",
            resumen: "El conjunto dirigido por Carlos Mendoza sumó una nueva victoria ante el Atlético Vergara por 2-1.",
            contenido: "El Villaferreira sigue en racha y ha conseguido encadenar cinco victorias consecutivas que le permiten meterse en puestos de playoff de ascenso. El equipo muestra una gran solidez defensiva y efectividad de cara a puerta.",
            categoria: "Primer Equipo",
            fecha: "2025-01-24",
            imagen: "https://picsum.photos/seed/football-main/800/500",
            esPrincipal: true
        },
        {
            id: 2,
            titulo: "Carlos Mendoza: \"El equipo muestra una madurez táctica importante\"",
            resumen: "El técnico asturiano valora el momento de forma del equipo tras la victoria.",
            contenido: "En rueda de prensa, el entrenador destacó el trabajo del grupo y la importancia de mantener la concentración.",
            categoria: "Prensa",
            fecha: "2025-01-23",
            imagen: "https://picsum.photos/seed/football-press/400/300",
            esPrincipal: false
        },
        {
            id: 3,
            titulo: "El Juvenil A se clasifica para la fase nacional de la Copa de Campeones",
            resumen: "El equipo juvenil logra un histórico clasificación tras una gran temporada.",
            contenido: "El Juvenil A del Villaferreira ha logrado clasificarse para la fase nacional de la Copa de Campeones.",
            categoria: "Cantera",
            fecha: "2025-01-22",
            imagen: "https://picsum.photos/seed/football-cantera/400/300",
            esPrincipal: false
        },
        {
            id: 4,
            titulo: "El fútbol femenino sigue creciendo con 150 jugadoras en las categorías base",
            resumen: "El club sigue apostando fuerte por el fútbol femenino con una apuesta clara por la cantera.",
            contenido: "El fútbol femenino del Villaferreira continúa su crecimiento con 150 jugadoras en las categorías base.",
            categoria: "Femenino",
            fecha: "2025-01-21",
            imagen: "https://picsum.photos/seed/football-femenino/400/300",
            esPrincipal: false
        },
        {
            id: 5,
            titulo: "Iván Pacheco, nuevo jugador del Villaferreira hasta final de temporada",
            resumen: "El centrocampista murciano llega para reforzar el centro del campo.",
            contenido: "El Villaferreira ha hecho oficial el fichaje de Iván Pacheco, centrocampista de 23 años procedente del fútbol murciano.",
            categoria: "Fichajes",
            fecha: "2025-01-20",
            imagen: "https://picsum.photos/seed/football-fichaje/400/300",
            esPrincipal: false
        }
    ],

    // Patrocinadores
    patrocinadores: [
        { id: 1, nombre: "Grupo Norte", orden: 1 },
        { id: 2, nombre: "Cervezas del Valle", orden: 2 },
        { id: 3, nombre: "Ferrolider", orden: 3 },
        { id: 4, nombre: "Clínica Dental Sonrisa", orden: 4 }
    ],

    // Productos tienda
    productos: [
        {
            id: 1,
            nombre: "Camiseta Local 24/25",
            precio: 75.00,
            imagen: "https://picsum.photos/seed/jersey-home/400/450",
            esNuevo: true,
            categoria: "Ropa"
        },
        {
            id: 2,
            nombre: "Camiseta Visitante 24/25",
            precio: 75.00,
            imagen: "https://picsum.photos/seed/jersey-away/400/450",
            esNuevo: false,
            categoria: "Ropa"
        },
        {
            id: 3,
            nombre: "Bufanda Oficial",
            precio: 18.00,
            imagen: "https://picsum.photos/seed/scarf/400/450",
            esNuevo: false,
            categoria: "Accesorios"
        },
        {
            id: 4,
            nombre: "Chándal Entrenamiento",
            precio: 95.00,
            imagen: "https://picsum.photos/seed/jacket/400/450",
            esNuevo: false,
            categoria: "Ropa"
        }
    ],

    // Estadísticas del equipo
    estadisticasEquipo: {
        posicion: 2,
        partidosJugados: 23,
        victorias: 13,
        empates: 6,
        derrotas: 4,
        golesFavor: 38,
        golesContra: 18
    },

    // Último partido (hero)
    proximoPartido: {
        jornada: 24,
        competicion: "Primera RFEF",
        fecha: "2025-01-26",
        hora: "18:00",
        local: "Villaferreira",
        localSiglas: "CDV",
        visitante: "UD Rosaleda",
        visitanteSiglas: "UDR",
        estadio: "Estadio Municipal de Villaferreira"
    }
};

// Función para obtener jugador por ID
function getJugadorById(id) {
    return CLUB_DATA.jugadores.find(j => j.id === parseInt(id));
}

// Función para obtener jugadores por posición
function getJugadoresByPosicion(posicion) {
    if (posicion === 'all') return CLUB_DATA.jugadores;
    
    const posicionesMap = {
        'goalkeeper': ['Portero'],
        'defender': ['Lateral Derecho', 'Lateral Izquierdo', 'Central'],
        'midfielder': ['Mediocentro Defensivo', 'Centrocampista', 'Mediocentro', 'Mediapunta'],
        'forward': ['Delantero Centro', 'Extremo Derecho', 'Extremo Izquierdo', 'Delantero']
    };
    
    return CLUB_DATA.jugadores.filter(j => 
        posicionesMap[posicion]?.includes(j.posicion)
    );
}

// Función para formatear fecha
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return {
        dia: fecha.getDate(),
        mes: meses[fecha.getMonth()],
        mesCorto: meses[fecha.getMonth()].substring(0, 3).toUpperCase(),
        año: fecha.getFullYear(),
        completa: `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`
    };
}

// Exportar para uso global
window.CLUB_DATA = CLUB_DATA;
window.getJugadorById = getJugadorById;
window.getJugadoresByPosicion = getJugadoresByPosicion;
window.formatearFecha = formatearFecha;
