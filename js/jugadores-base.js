/* ===================================
   FICHA TÉCNICA BASE - JUGADORES
   Datos que nunca cambian de un jugador
   =================================== */

const JUGADORES_BASE = {
  // Identificador único (slug)
  "aaron-escandell": {
    id: "aaron-escandell-banacloche",
    codigo: "aaron-escandell-banacloche",
    nombre: "Aarón",
    apellidos: "Escandell Banacloche",
    nombreCompleto: "Aarón Escandell Banacloche",
    apodo: "Aarón",
    fechaNacimiento: "1995-09-27",
    lugarNacimiento: "Carcagente, Valencia",
    nacionalidad: "Española",
    altura: 1.84,
    pie: "Derecho",
    peso: null, // Opcional
    imagenBase: "https://i.postimg.cc/hvxDQPg1/Aarón_PNG_(3).webp",
    redes: { instagram: "#", twitter: null },
    fallecido: false,
    biografia: "Portero con gran juego aéreo...",
  },

  "javi-martinez": {
    id: "javi-martinez",
    codigo: "javi-martinez",
    nombre: "Javi",
    apellidos: "Martínez Fernández",
    nombreCompleto: "Javi Martínez",
    apodo: null,
    fechaNacimiento: "1997-03-15",
    lugarNacimiento: "Gijón, Asturias",
    nacionalidad: "Española",
    altura: 1.82,
    pie: "Derecho",
    imagenBase: "https://picsum.photos/seed/fw1-24/400/500",
    redes: { instagram: "#", twitter: "#" },
    fallecido: false,
    esCapitan: true,
    logrosHistoricos: ["Pichichi Primera RFEF 2023/24"],
    seleccion: {
      pais: "España",
      bandera: "https://flagcdn.com/w40/es.png",
      datos: [
        { categoria: "Absoluta", partidos: 28, goles: 3 },
        { categoria: "U21", partidos: 15, goles: 2 },
      ],
    },
  },

  // Jugador fallecido ejemplo
  "raul-fernandez": {
    id: "raul-fernandez",
    codigo: "raul-fernandez",
    nombre: "Raúl",
    apellidos: "Fernández Soto",
    nombreCompleto: "Raúl Fernández",
    fechaNacimiento: "1993-02-14",
    lugarNacimiento: "Gijón, Asturias",
    nacionalidad: "Española",
    altura: 1.84,
    fallecido: true,
    fechaFallecimiento: "2024-05-15",
    imagenBase: "https://picsum.photos/seed/df3-22/400/500",
    redes: { instagram: "#", twitter: "#" },
  },

  // ... más jugadores
};
