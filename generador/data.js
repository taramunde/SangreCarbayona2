/* ===================================
   DATOS DEL CLUB - REAL OVIEDO
   =================================== */

const CLUB_DATA = {
    // Información del club
    club: {
        nombre: "Real Oviedo",
        nombreCorto: "Real Oviedo",
        siglas: "OVI",
        fundacion: 1926,
        estadio: "Estadio Carlos Tartiere",
        capacidadEstadio: 30400,
        ciudad: "Oviedo",
        direccion: "Calle Carlos Tartiere s/n, 33013 Oviedo",
        telefono: "985 111 111",
        email: "info@realoviedo.es"
    },

    // Temporada actual (por defecto)
    temporadaActual: "2024-25",
    
    // Lista de temporadas disponibles
    temporadasDisponibles: [
        { id: "2024-25", nombre: "2024/25", actual: true },
        { id: "2023-24", nombre: "2023/24", actual: false },
        { id: "2022-23", nombre: "2022/23", actual: false }
    ],

    // Datos por temporada
    temporadas: {
        // ===================================
        // TEMPORADA 2024/25
        // ===================================
        "2024-25": {
            competicion: "Primera RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: {
                posicion: 2,
                partidosJugados: 23,
                victorias: 13,
                empates: 6,
                derrotas: 4,
                golesFavor: 38,
                golesContra: 18
            },
            
            clasificacion: [
                { posicion: 1, siglas: "RAC", nombre: "Racing Ferrol", puntos: 48, jugados: 23, gfavor: 42, gcontra: 15, dg: "+27", destacado: true, logo: "https://picsum.photos/seed/racing-logo/60/60" },
                { posicion: 2, siglas: "OVI", nombre: "Real Oviedo", puntos: 45, jugados: 23, gfavor: 38, gcontra: 18, dg: "+20", destacado: true, logo: "https://picsum.photos/seed/real-oviedo-logo/60/60" },
                { posicion: 3, siglas: "UDR", nombre: "UD Rosaleda", puntos: 42, jugados: 23, gfavor: 35, gcontra: 20, dg: "+15", destacado: true, logo: "https://picsum.photos/seed/rosaleda-logo/60/60" },
                { posicion: 4, siglas: "ATV", nombre: "Atlético Vergara", puntos: 39, jugados: 23, gfavor: 30, gcontra: 22, dg: "+8", destacado: false, logo: "https://picsum.photos/seed/vergara-logo/60/60" },
                { posicion: 5, siglas: "CDS", nombre: "Cultural Soria", puntos: 37, jugados: 23, gfavor: 28, gcontra: 24, dg: "+4", destacado: false, logo: "https://picsum.photos/seed/soria-logo/60/60" }
            ],
            
            jugadores: [
                { id: 1, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 28, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://i.postimg.cc/hvxDQPg1/Aarón_PNG_(3).webp", stats: { partidos: 23, goles: 0, asistencias: 0, minutos: 2070, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 2, codigo: "pablo-menendez", nombre: "Pablo", apellidos: "Menéndez Álvarez", nombreCompleto: "Pablo Menéndez", dorsal: 13, posicion: "Portero", posicionCorta: "POR", edad: 22, altura: 1.83, peso: 78, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "2002-07-22", enClubDesde: "2024", contratoHasta: "2025", imagen: "https://picsum.photos/seed/gk2-24/400/500", stats: { partidos: 0, goles: 0, asistencias: 0, minutos: 0, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 3, codigo: "dani-fernandez", nombre: "Dani", apellidos: "Fernández Rodríguez", nombreCompleto: "Dani Fernández", dorsal: 2, posicion: "Lateral Derecho", posicionCorta: "LD", edad: 26, altura: 1.78, peso: 73, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Avilés, Asturias", fechaNacimiento: "1998-11-03", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df1-24/400/500", stats: { partidos: 21, goles: 2, asistencias: 4, minutos: 1780, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 4, codigo: "adrian-picos", nombre: "Adrián", apellidos: "Picos Menéndez", nombreCompleto: "Adrián Picos", dorsal: 4, posicion: "Central", posicionCorta: "DC", edad: 29, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "1995-06-18", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://i.postimg.cc/T1nddZNZ/Belar.webp", stats: { partidos: 23, goles: 3, asistencias: 1, minutos: 2045, amarillas: 5, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 5, codigo: "victor-marquez", nombre: "Víctor", apellidos: "Márquez López", nombreCompleto: "Víctor Márquez", dorsal: 5, posicion: "Central", posicionCorta: "DC", edad: 27, altura: 1.82, peso: 77, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "León", fechaNacimiento: "1997-09-30", enClubDesde: "2023", contratoHasta: "2026", imagen: "https://picsum.photos/seed/df3-24/400/500", stats: { partidos: 22, goles: 1, asistencias: 2, minutos: 1890, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 6, codigo: "sergio-nunez", nombre: "Sergio", apellidos: "Núñez Pérez", nombreCompleto: "Sergio Núñez", dorsal: 3, posicion: "Lateral Izquierdo", posicionCorta: "LI", edad: 24, altura: 1.76, peso: 70, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Madrid", fechaNacimiento: "2000-02-14", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/df4-24/400/500", stats: { partidos: 18, goles: 0, asistencias: 4, minutos: 1420, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 7, codigo: "borja-trujillo", nombre: "Borja", apellidos: "Trujillo Fernández", nombreCompleto: "Borja Trujillo", dorsal: 15, posicion: "Central", posicionCorta: "DC", edad: 25, altura: 1.88, peso: 83, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1999-08-05", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df5-24/400/500", stats: { partidos: 12, goles: 0, asistencias: 0, minutos: 890, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 8, codigo: "alvaro-santos", nombre: "Álvaro", apellidos: "Santos Díaz", nombreCompleto: "Álvaro Santos", dorsal: 6, posicion: "Mediocentro Defensivo", posicionCorta: "MCD", edad: 30, altura: 1.80, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Sevilla", fechaNacimiento: "1994-12-10", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf1-24/400/500", stats: { partidos: 23, goles: 1, asistencias: 2, minutos: 1980, amarillas: 8, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 9, codigo: "nacho-ruiz", nombre: "Nacho", apellidos: "Ruiz Martínez", nombreCompleto: "Nacho Ruiz", dorsal: 8, posicion: "Centrocampista", posicionCorta: "MC", edad: 26, altura: 1.77, peso: 72, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Valencia", fechaNacimiento: "1998-04-25", enClubDesde: "2023", contratoHasta: "2026", imagen: "https://picsum.photos/seed/mf2-24/400/500", stats: { partidos: 22, goles: 5, asistencias: 6, minutos: 1750, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 10, codigo: "pedro-leal", nombre: "Pedro", apellidos: "Leal García", nombreCompleto: "Pedro Leal", dorsal: 10, posicion: "Mediapunta", posicionCorta: "MP", edad: 28, altura: 1.74, peso: 68, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Barcelona", fechaNacimiento: "1996-07-08", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf3-24/400/500", stats: { partidos: 21, goles: 8, asistencias: 5, minutos: 1680, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 11, codigo: "ivan-pacheco", nombre: "Iván", apellidos: "Pacheco Fernández", nombreCompleto: "Iván Pacheco", dorsal: 16, posicion: "Centrocampista", posicionCorta: "MC", edad: 23, altura: 1.75, peso: 70, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Salamanca", fechaNacimiento: "2001-03-18", enClubDesde: "2025", contratoHasta: "2027", imagen: "https://picsum.photos/seed/mf4-24/400/500", stats: { partidos: 5, goles: 0, asistencias: 1, minutos: 210, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 12, codigo: "antonio-suarez", nombre: "Antonio", apellidos: "Suárez Vega", nombreCompleto: "Antonio Suárez", dorsal: 14, posicion: "Centrocampista", posicionCorta: "MC", edad: 26, altura: 1.80, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Zamora", fechaNacimiento: "1998-09-22", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/mf5-24/400/500", stats: { partidos: 15, goles: 2, asistencias: 3, minutos: 1100, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 13, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 27, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw1-24/400/500", esCapitan: true, stats: { partidos: 23, goles: 14, asistencias: 4, minutos: 1892, amarillas: 4, rojas: 0 }, logros: ["Pichichi Primera RFEF 2023/24", "Capitán del equipo"], redes: { instagram: "#", twitter: "#" }, seleccion: { pais: "España", bandera: "https://flagcdn.com/w40/es.png", datos: [ { categoria: "Absoluta", partidos: 28, goles: 3 }, { categoria: "U21", partidos: 15, goles: 2 } ] } },
                { id: 14, codigo: "ruben-cano", nombre: "Rubén", apellidos: "Cano Pérez", nombreCompleto: "Rubén Cano", dorsal: 7, posicion: "Extremo Derecho", posicionCorta: "ED", edad: 25, altura: 1.73, peso: 67, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Bilbao, Vizcaya", fechaNacimiento: "1999-05-28", enClubDesde: "2023", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw2-24/400/500", stats: { partidos: 20, goles: 6, asistencias: 8, minutos: 1450, amarillas: 1, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 15, codigo: "luis-garcia", nombre: "Luis", apellidos: "García Rodríguez", nombreCompleto: "Luis 'Lucho' García", dorsal: 11, posicion: "Extremo Izquierdo", posicionCorta: "EI", edad: 24, altura: 1.76, peso: 71, pie: "Izquierdo", nacionalidad: "Argentino", lugarNacimiento: "Buenos Aires", fechaNacimiento: "2000-09-18", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw3-24/400/500", stats: { partidos: 22, goles: 7, asistencias: 9, minutos: 1580, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 16, codigo: "diego-lopez", nombre: "Diego", apellidos: "López Sánchez", nombreCompleto: "Diego 'Chicho' López", dorsal: 17, posicion: "Delantero", posicionCorta: "DC", edad: 22, altura: 1.79, peso: 76, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "2002-01-05", enClubDesde: "2024", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw4-24/400/500", stats: { partidos: 12, goles: 3, asistencias: 1, minutos: 580, amarillas: 0, rojas: 0 }, redes: { instagram: "#", twitter: null } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1/400/450", descripcion: "Licenciado en Educación Física con más de 15 años de experiencia.", esPrincipal: true, estadisticas: { partidos: 89, victorias: 46, empates: 22, derrotas: 21 } },
                { id: 2, nombre: "Roberto Vázquez", cargo: "Segundo Entrenador", imagen: "https://picsum.photos/seed/coach2/400/450", descripcion: "Especialista en análisis táctico.", esPrincipal: false }
            ],

            partidosJugados: [
                { id: 1, jornada: 23, fecha: "2025-01-19", local: "Real Oviedo", visitante: "Atlético Vergara", golesLocal: 2, golesVisitante: 1, resultado: "V" },
                { id: 2, jornada: 22, fecha: "2025-01-12", local: "Cultural Soria", visitante: "Real Oviedo", golesLocal: 0, golesVisitante: 3, resultado: "V" },
                { id: 3, jornada: 21, fecha: "2025-01-05", local: "Real Oviedo", visitante: "Racing Ferrol", golesLocal: 1, golesVisitante: 1, resultado: "E" }
            ]
        },
        
        // ===================================
        // TEMPORADA 2023/24
        // ===================================
        "2023-24": {
            competicion: "Primera RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: { posicion: 4, partidosJugados: 38, victorias: 18, empates: 10, derrotas: 10, golesFavor: 56, golesContra: 35 },
            
            clasificacion: [
                { posicion: 1, siglas: "RAC", nombre: "Racing Ferrol", puntos: 72, jugados: 38, gfavor: 65, gcontra: 28, dg: "+37", destacado: true, logo: "https://picsum.photos/seed/racing-logo/60/60" },
                { posicion: 4, siglas: "OVI", nombre: "Real Oviedo", puntos: 64, jugados: 38, gfavor: 56, gcontra: 35, dg: "+21", destacado: true, logo: "https://picsum.photos/seed/real-oviedo-logo/60/60" }
            ],
            
            jugadores: [
                { id: 101, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 27, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/gk1-23/400/500", stats: { partidos: 36, goles: 0, asistencias: 0, minutos: 3240, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 104, codigo: "adrian-picos", nombre: "Adrián", apellidos: "Picos Menéndez", nombreCompleto: "Adrián Picos", dorsal: 4, posicion: "Central", posicionCorta: "DC", edad: 28, altura: 1.85, peso: 80, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Santander, Cantabria", fechaNacimiento: "1995-06-18", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/df2-23/400/500", stats: { partidos: 35, goles: 4, asistencias: 2, minutos: 3080, amarillas: 7, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 111, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 26, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2026", imagen: "https://picsum.photos/seed/fw1-23/400/500", stats: { partidos: 35, goles: 22, asistencias: 6, minutos: 2980, amarillas: 5, rojas: 0 }, logros: ["Pichichi Primera RFEF 2023/24"], redes: { instagram: "#", twitter: "#" }, seleccion: { pais: "España", bandera: "https://flagcdn.com/w40/es.png", datos: [ { categoria: "Absoluta", partidos: 28, goles: 3 }, { categoria: "U21", partidos: 15, goles: 2 } ] } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1-23/400/450", descripcion: "Temporada de consolidación.", esPrincipal: true, estadisticas: { partidos: 38, victorias: 18, empates: 10, derrotas: 10 } }
            ],

            partidosJugados: [
                { id: 101, jornada: 38, fecha: "2024-05-19", local: "Real Oviedo", visitante: "Cultural Soria", golesLocal: 3, golesVisitante: 1, resultado: "V" },
                { id: 102, jornada: 37, fecha: "2024-05-12", local: "Racing Ferrol", visitante: "Real Oviedo", golesLocal: 2, golesVisitante: 2, resultado: "E" }
            ]
        },
        
        // ===================================
        // TEMPORADA 2022/23
        // ===================================
        "2022-23": {
            competicion: "Segunda RFEF",
            grupo: "Grupo I",
            
            estadisticasEquipo: { posicion: 1, partidosJugados: 34, victorias: 22, empates: 6, derrotas: 6, golesFavor: 62, golesContra: 28 },
            
            clasificacion: [
                { posicion: 1, siglas: "OVI", nombre: "Real Oviedo", puntos: 72, jugados: 34, gfavor: 62, gcontra: 28, dg: "+34", destacado: true, logo: "https://picsum.photos/seed/real-oviedo-logo/60/60" },
                { posicion: 2, siglas: "ATV", nombre: "Atlético Vergara", puntos: 65, jugados: 34, gfavor: 55, gcontra: 30, dg: "+25", destacado: true, logo: "https://picsum.photos/seed/vergara-logo/60/60" }
            ],
            
            jugadores: [
                { id: 201, codigo: "miguel-angel-torres", nombre: "Miguel Ángel", apellidos: "Torres García", nombreCompleto: "Miguel Ángel Torres", dorsal: 1, posicion: "Portero", posicionCorta: "POR", edad: 26, altura: 1.87, peso: 82, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Oviedo, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/gk1-22/400/500", stats: { partidos: 34, goles: 0, asistencias: 0, minutos: 3060, amarillas: 2, rojas: 0 }, redes: { instagram: "#", twitter: "#" } },
                { id: 205, codigo: "raul-fernandez", nombre: "Raúl", apellidos: "Fernández Soto", nombreCompleto: "Raúl Fernández", dorsal: 5, posicion: "Central", posicionCorta: "DC", edad: 31, altura: 1.84, peso: 79, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1993-02-14", enClubDesde: "2021", contratoHasta: "2023", imagen: "https://picsum.photos/seed/df3-22/400/500", stats: { partidos: 28, goles: 3, asistencias: 1, minutos: 2480, amarillas: 4, rojas: 0 }, redes: { instagram: "#", twitter: "#" }, fallecido: true, fechaFallecimiento: "2024-05-15" },
                { id: 206, codigo: "jorge-martin", nombre: "Jorge", apellidos: "Martín Díaz", nombreCompleto: "Jorge Martín", dorsal: 3, posicion: "Lateral Izquierdo", posicionCorta: "LI", edad: 25, peso: 71, pie: "Izquierdo", nacionalidad: "Española", lugarNacimiento: "Zamora", fechaNacimiento: "1998-11-30", enClubDesde: "2022", contratoHasta: "2024", imagen: "https://picsum.photos/seed/df4-22/400/500", stats: { partidos: 26, goles: 0, asistencias: 7, minutos: 2200, amarillas: 3, rojas: 0 }, redes: { instagram: "#", twitter: null } },
                { id: 210, codigo: "javi-martinez", nombre: "Javi", apellidos: "Martínez Fernández", nombreCompleto: "Javi Martínez", dorsal: 9, posicion: "Delantero Centro", posicionCorta: "DC", edad: 25, altura: 1.82, peso: 75, pie: "Derecho", nacionalidad: "Española", lugarNacimiento: "Gijón, Asturias", fechaNacimiento: "1997-03-15", enClubDesde: "2022", contratoHasta: "2025", imagen: "https://picsum.photos/seed/fw1-22/400/500", stats: { partidos: 32, goles: 18, asistencias: 5, minutos: 2750, amarillas: 4, rojas: 0 }, logros: ["Ascenso a Primera RFEF"], redes: { instagram: "#", twitter: "#" }, seleccion: { pais: "España", bandera: "https://flagcdn.com/w40/es.png", datos: [ { categoria: "Absoluta", partidos: 28, goles: 3 }, { categoria: "U21", partidos: 15, goles: 2 } ] } }
            ],
            
            cuerpoTecnico: [
                { id: 1, nombre: "Carlos Mendoza", cargo: "Entrenador Principal", imagen: "https://picsum.photos/seed/coach1-22/400/450", descripcion: "Primera temporada. Ascenso.", esPrincipal: true, estadisticas: { partidos: 34, victorias: 22, empates: 6, derrotas: 6 } }
            ],

            partidosJugados: [
                { id: 201, jornada: 34, fecha: "2023-05-14", local: "Real Oviedo", visitante: "Atlético Vergara", golesLocal: 3, golesVisitante: 0, resultado: "V" },
                { id: 202, jornada: 33, fecha: "2023-05-07", local: "Cultural Soria", visitante: "Real Oviedo", golesLocal: 1, golesVisitante: 1, resultado: "E" }
            ]
        }
    },

    // ===================================
    // DATOS GENERALES
    // ===================================
    
    calendario: [ { id: 1, jornada: 24, fecha: "2025-01-26", hora: "18:00", local: "Real Oviedo", visitante: "UD Rosaleda", estadio: "Carlos Tartiere", esProximo: true } ],
    noticias: [ { id: 1, titulo: "El Real Oviedo encadena victorias", resumen: "Gran momento de forma.", categoria: "Primer Equipo", fecha: "2025-01-24", imagen: "https://picsum.photos/seed/news1/800/500", esPrincipal: true } ],
    patrocinadores: [ { id: 1, nombre: "Grupo Norte" } ],
    proximoPartido: { jornada: 24, competicion: "Primera RFEF", fecha: "2025-01-26", hora: "18:00", local: "Real Oviedo", localSiglas: "OVI", visitante: "UD Rosaleda", visitanteSiglas: "UDR", estadio: "Carlos Tartiere" },

    // ===================================
    // JUEGOS (Menú Multimedia)
    // ===================================
    juegos: [
        {
            id: 'quiz',
            titulo: 'Quiz Carbayón',
            descripcion: '¿Cuánto sabes de la historia del club?',
            imagen: 'https://i.postimg.cc/3J1wMxw4/Quiz.webp',
            enlace: 'juegos/quiz.html',
            esEspecial: true
        },
        {
            id: 'memoria',
            titulo: 'Juego de Memoria',
            descripcion: 'Encuentra las parejas de escudos y jugadores.',
            imagen: 'https://picsum.photos/seed/memory-game/400/300',
            enlace: '#',
            esEspecial: false
        },
        {
            id: 'penaltis',
            titulo: 'Lanzamiento de Penaltis',
            descripcion: 'Elige la esquina y marca el gol decisivo.',
            imagen: 'https://picsum.photos/seed/penalty-game/400/300',
            enlace: '#',
            esEspecial: false
        }
    ],

    // ===================================
    // VIDEOS (Resúmenes de Partidos)
    // ===================================
    videos: [
        {
            id: 1,
            jornada: 12,
            titulo: "R. Oviedo vs Elche CF",
            fecha: "2024-10-27",
            videoId: "C5E4g_uy9PE" // Tu ID real de YouTube
        },
        {
            id: 2,
            jornada: 11,
            titulo: "Eibar vs R. Oviedo",
            fecha: "2024-10-20",
            videoId: "dQw4w9WgXcQ" // ID de ejemplo (cambiar por real)
        },
        {
            id: 3,
            jornada: 10,
            titulo: "R. Oviedo vs Racing",
            fecha: "2024-10-13",
            videoId: "dQw4w9WgXcQ" // ID de ejemplo (cambiar por real)
        }
    ]
};

// ===================================
// FUNCIONES DE AYUDA
// ===================================

function getTemporada(seasonId) {
    return CLUB_DATA.temporadas[seasonId] || CLUB_DATA.temporadas[CLUB_DATA.temporadaActual];
}

function getJugadorById(id, seasonId) {
    const temporada = getTemporada(seasonId);
    return temporada.jugadores.find(j => j.id === parseInt(id));
}

// Nota: formatearFecha ya está definida en app.js, no es necesaria aquí duplicada.

window.CLUB_DATA = CLUB_DATA;
window.getTemporada = getTemporada;
window.getJugadorById = getJugadorById;
