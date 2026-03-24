/* js/quiz.js - Lógica del Quiz Carbayón - Adaptado */

const quizData = [
    // --- HISTORIA Y FUNDACIÓN (1-4) ---
    [
        "¿En qué fecha exacta se fundó el Real Oviedo?",
        [
            "1 de Julio de 1905",
            "26 de Marzo de 1926",
            "14 de Abril de 1931",
            "21 de Septiembre de 1928"
        ],
        1 // 26 de Marzo de 1926
    ],
    [
        "¿Qué dos equipos se fusionaron para fundar el Real Oviedo?",
        [
            "Real Juvencia y Astur C.F.",
            "Real Stadium Club Ovetense y Real Club Deportivo Ovetense",
            "Sporting de Oviedo y Club Fortuna",
            "Pumarín F.C. y Vetusta"
        ],
        1
    ],
    [
        "¿Quién fue el primer presidente de la historia del club?",
        [
            "Carlos Tartiere",
            "José Suárez",
            "Manuel Lafuente",
            "Eugenio Prieto"
        ],
        0
    ],
    [
        "¿Cómo se llamaba el campo que utilizó el Oviedo antes del estadio de Buenavista?",
        [
            "Campo de Teatinos",
            "El Requexón",
            "Llamaquique",
            "Vetusta Arena"
        ],
        0
    ],
    
    // --- LEYENDAS Y JUGADORES CLAVE (5-10) ---
    [
        "¿Quién es el máximo goleador histórico del club (257 goles)?",
        [
            "Lángara",
            "Herrerita",
            "Diego Cervero",
            "Carlos"
        ],
        0
    ],
    [
        "¿Qué jugador ostenta el récord de partidos oficiales con la camiseta azul?",
        [
            "Tensi",
            "Berto",
            "Viti",
            "Esteban"
        ],
        1 // Berto (512 partidos)
    ],
    [
        "¿Qué canterano del Oviedo ganó la Champions League y el Mundial?",
        [
            "Santi Cazorla",
            "Juan Mata",
            "Michu",
            "Adrián López"
        ],
        1 // Mata (con Chelsea y España)
    ],
    [
        "¿Quién formaba la famosa 'Delantera Eléctrica' junto a Casuco, Gallart, Lángara y Herrerita?",
        [
            "Emilín",
            "Antón",
            "Goyín",
            "Sánchez"
        ],
        0
    ],
    [
        "¿Qué jugador fue el pichichi de Primera División con el Oviedo en 1935-36?",
        [
            "Herrerita",
            "Lángara",
            "Emilín",
            "Pruden"
        ],
        1
    ],
    [
        "¿Qué dorsal mítico llevó Carlos en el Real Oviedo?",
        [
            "9",
            "10",
            "7",
            "11"
        ],
        1
    ],

    // --- HITOS DEPORTIVOS (11-15) ---
    [
        "¿Cuál ha sido la mejor clasificación del Oviedo en Primera División?",
        [
            "Campeón de Liga",
            "3º (Tercer puesto)",
            "4º (Cuarto puesto)",
            "Subcampeón"
        ],
        1 // Temporadas 34-35, 35-36 y 62-63
    ],
    [
        "¿Qué equipo europeo eliminó al Oviedo en la Copa de la UEFA 1991-92?",
        [
            "Genoa",
            "Inter de Milán",
            "Nápoles",
            "Bayern de Múnich"
        ],
        0
    ],
    [
        "¿A qué equipo ganó el Real Oviedo por 7-3 en una mítica goleada en los años 40?",
        [
            "Real Madrid",
            "F.C. Barcelona",
            "Atlético de Madrid",
            "Athletic Club"
        ],
        1
    ],
    [
        "¿Qué jugador tiene el récord de goles en una temporada en Primera (28)?",
        [
            "Lángara",
            "Carlos",
            "Oli",
            "Herrerita"
        ],
        0
    ],
    [
        "¿Cuál fue el resultado de la mayor victoria del Oviedo en El Molinón (1933)?",
        [
            "0-5",
            "2-7",
            "1-6",
            "2-8"
        ],
        3
    ],

    // --- LA ETAPA DEL BARRO (16-20) ---
    [
        "¿Quién marcó el gol del ascenso a Segunda en Cádiz (2015)?",
        [
            "Diego Cervero",
            "Miguel Linares",
            "David Fernández",
            "Héctor Verdés"
        ],
        2 // David Fernández de cabeza
    ],
    [
        "¿Qué movimiento mundial salvó al club de la desaparición en 2012?",
        [
            "Proud of You",
            "SOS Real Oviedo",
            "Locos por el Oviedo",
            "Volveremos"
        ],
        1
    ],
    [
        "¿Qué entrenador dirigía al equipo en el ascenso de Cádiz en 2015?",
        [
            "Sergio Egea",
            "Fernando Hierro",
            "Anquela",
            "José Rojo 'Pacheta'"
        ],
        0
    ],
    [
        "¿Qué jugador regresó al Oviedo en 2023 cobrando el salario mínimo?",
        [
            "Juan Mata",
            "Michu",
            "Adrián López",
            "Santi Cazorla"
        ],
        3
    ],
    [
        "¿Qué famoso cántico se popularizó durante la crisis de 2003?",
        [
            "Volveremos",
            "Sí se puede",
            "No me falles Real Oviedo",
            "Alirón"
        ],
        0
    ],

    // --- NUEVO TARTIERE Y ACTUALIDAD (21-25) ---
    [
        "¿En qué año se inauguró el NUEVO Carlos Tartiere?",
        [
            "1998",
            "2000",
            "2003",
            "2005"
        ],
        1
    ],
    [
        "¿Quién marcó el primer gol oficial en el Nuevo Carlos Tartiere?",
        [
            "Losada",
            "Oli",
            "Iván Ania",
            "Paunovic"
        ],
        0
    ],
    [
        "¿Qué entrenador logró el ascenso a Primera en la temporada 1987-88?",
        [
            "Vicente Miera",
            "Javier Irureta",
            "Luis Aragonés",
            "Radomir Antić"
        ],
        0
    ],
    [
        "¿Contra qué equipo se jugó la final del playoff de ascenso a Primera en 2024?",
        [
            "Eibar",
            "Espanyol",
            "Sporting de Gijón",
            "Leganés"
        ],
        1
    ],
    [
        "¿Qué grupo empresarial es actualmente el propietario mayoritario del Real Oviedo?",
        [
            "Grupo Carso",
            "Grupo Pachuca",
            "Orlegi Sports",
            "Grupo Slim"
        ],
        1
    ],

    // --- PREGUNTAS ADICIONALES (26-50) ---
    // DERBIS
    [
        "¿Quién marcó dos goles oviedistas en el derbi del nuevo Tartiere (2018)?",
        ["Toché", "Mossa", "Johannesson", "Linares"],
        1
    ],
    [
        "¿Cuál fue el resultado del primer derbi asturiano en Primera División (1944)?",
        ["4-2", "3-3", "1-0", "2-1"],
        3
    ],
    [
        "¿Quién fue el último capitán del Oviedo en Primera (2000-01)?",
        ["Iván Ania", "Oli", "Paunović", "Onopko"],
        3
    ],
    [
        "¿Qué jugador es el segundo máximo goleador del club, tras Lángara?",
        ["Carlos", "Oli", "Emilín", "Herrerita"],
        3
    ],
    [
        "¿Quién es el jugador extranjero con más partidos en el club?",
        ["Janković", "Dubovsky", "Albert Nadj", "Onopko"],
        3
    ],

    // RECORDS
    [
        "¿Qué entrenador logró el ascenso a Primera en 1988?",
        ["Vicente Miera", "Antić", "Irureta", "José Luis Romero"],
        0
    ],
    [
        "¿Cuál es el récord de imbatibilidad de un portero en el Oviedo (minutos)?",
        ["634", "687", "735", "799"],
        2
    ],
    [
        "¿Quién fue el autor del gol número 1000 en el Real Oviedo?",
        ["Michu", "Diego Cervero", "Marianín", "Toché"],
        2
    ],
    [
        "¿Cuál es el nombre del campo de entrenamiento del Real Oviedo?",
        ["El Molinón", "El Requexón", "La Pixarra", "Tudela Veguín"],
        1
    ],

    // GOLEADORES
    [
        "¿Qué jugador del Oviedo fue pichichi de Segunda División en 1971-72?",
        ["Lángara", "Enrique Galán", "Herrerita", "Emilín"],
        1
    ],
    [
        "¿Quién marcó 4 goles al Real Madrid en un mismo partido en Primera?",
        ["Oli", "Carlos", "Dubovsky", "Emilín"],
        3
    ],
    [
        "¿Quién marcó el gol de la permanencia en Primera en 2000 contra el Rayo?",
        ["Oli", "Dely Valdés", "Iván Ania", "Dubovsky"],
        2
    ],
    [
        "¿Quién fue el Pichichi de Segunda B en la temporada 2014-15?",
        ["Carlos", "Marianín", "Lángara", "Linares"],
        3
    ],
    [
        "¿Quién marcó el primer gol de la historia del Real Oviedo (amistoso)?",
        ["Bango", "Zabala", "Justo", "Chuché"],
        2
    ],

    // CURIOSIDADES
    [
        "¿En qué año debutó el Real Oviedo en Primera División?",
        ["1932-33", "1933-34", "1935-36", "1944-45"],
        1
    ],
    [
        "¿En qué año descendió el Real Oviedo a Tercera División por impagos?",
        ["2001", "2003", "2005", "2010"],
        1
    ],
    [
        "¿Cuál es el nombre de la peña ultra más antigua del club?",
        ["Frente Azul", "Symmachiarii", "Orgullo Carbayón", "Desperta Ferro"],
        1
    ],
    [
        "¿Quién fue el autor del himno 'no oficial' Volveremos?",
        ["Vicente Prado", "Tino Casal", "Víctor Manuel", "Melendi"],
        3
    ],
    [
        "¿Qué país aportó la mayor inversión tras el Grupo Carso en 2012?",
        ["Estados Unidos", "España", "Méjico", "Japón"],
        2
    ],

    // CANTERA
    [
        "¿Qué jugador del Oviedo fue campeón de Europa sub-21 con España?",
        ["Borja Bastón", "Javi Mier", "Álex Cardero", "Santi Cazorla"],
        3
    ],
    [
        "¿En qué año debutó Santi Cazorla con el primer equipo (su regreso)?",
        ["2003", "2015", "2023", "2006"],
        2
    ],
    [
        "¿Qué entrenador logró el ascenso a Primera en 1958?",
        ["Juan Manuel Lillo", "Luis Costa", "Picabea", "Fernando Vázquez"],
        2
    ],
    [
        "¿Qué jugador del Oviedo ganó una Eurocopa con España?",
        ["Michu", "Santi Cazorla", "Juan Mata", "Nino"],
        1
    ],
    [
        "¿Quién es el jugador más joven en debutar con el primer equipo?",
        ["Santi Cazorla", "Álex Cardero", "Agudín", "Javi Mier"],
        2
    ],
    [
        "¿Quién es el máximo goleador del Oviedo en Segunda División?",
        ["Carlos", "Toché", "Diego Cervero", "Borja Bastón"],
        0
    ]
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOptionIndex = -1;
const appContainer = document.getElementById('quiz-app');

function initQuiz() {
    renderStartScreen();
}

function renderStartScreen() {
    appContainer.innerHTML = `
        <div class="quiz-start-screen animate-slide">
            <h2>¿Cuánto sabes del Real Oviedo?</h2>
            <p>${quizData.length} preguntas para probar tu oviedismo.</p>
            <button class="btn-start" onclick="startGame()">¡Empezar!</button>
        </div>
    `;
}

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    renderQuestion();
}

function renderQuestion() {
    const questionData = quizData[currentQuestionIndex];
    const questionText = questionData[0];
    const answers = questionData[1];
    
    let answersHtml = '';
    answers.forEach((ans, index) => {
        answersHtml += `<button class="option-btn" onclick="selectOption(${index}, this)">${ans}</button>`;
    });

    appContainer.innerHTML = `
        <div class="quiz-active animate-slide">
            <div class="quiz-question-number">Pregunta ${currentQuestionIndex + 1} de ${quizData.length}</div>
            <div class="quiz-question-text">${questionText}</div>
            <div class="quiz-options">${answersHtml}</div>
            <button class="btn-submit" id="submitBtn" onclick="submitAnswer()" disabled>Confirmar</button>
        </div>
    `;
    selectedOptionIndex = -1;
}

window.selectOption = function(index, btnElement) {
    selectedOptionIndex = index;
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
    btnElement.classList.add('selected');
    document.getElementById('submitBtn').disabled = false;
};

window.submitAnswer = function() {
    if (selectedOptionIndex === -1) return;

    const correctIndex = quizData[currentQuestionIndex][2];
    const isCorrect = selectedOptionIndex === correctIndex;
    
    if(isCorrect) score++;

    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    document.getElementById('submitBtn').disabled = true;

    const options = document.querySelectorAll('.option-btn');
    options[selectedOptionIndex].classList.add(isCorrect ? 'selected-correct' : 'selected-incorrect');
    if (!isCorrect) {
        options[correctIndex].classList.add('correct-answer-show');
    }
    
    const feedbackClass = isCorrect ? 'correct' : 'incorrect';
    const feedbackText = isCorrect ? '¡CORRECTO!' : `¡FALLO! La correcta era: ${quizData[currentQuestionIndex][1][correctIndex]}`;

    const feedbackDiv = document.createElement('div');
    feedbackDiv.classList.add('result-message', feedbackClass, 'animate-slide');
    feedbackDiv.innerHTML = feedbackText;
    appContainer.appendChild(feedbackDiv);
    
    setTimeout(() => {
        appContainer.removeChild(feedbackDiv); 

        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            renderQuestion();
        } else {
            renderResults();
        }
    }, 2500); 
};

function renderResults() {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = "";
    let finalImage = "https://i.ibb.co/CPCwd0s/escudo.png";
    
    if(percentage === 100) {
        message = "¡MATRICULA DE HONOR! Eres historia pura del club.";
    } else if(percentage >= 90) {
        message = "¡EXCELENTE! Sangre azul y oro.";
    } else if(percentage >= 70) {
        message = "¡Notable! Un gran oviedista.";
    } else if(percentage >= 50) {
        message = "Aprobado. Conoce lo esencial.";
    } else {
        message = "¡Uy! Necesitas repasar la historia carbayona.";
        finalImage = "https://i.postimg.cc/851Gk6c1/jugador-fallo.png";
    }

    appContainer.innerHTML = `
        <div class="quiz-end-screen animate-slide">
            <h2>Resultado Final</h2>
            <div class="final-score">${percentage}%</div>
            <p>${message}</p>
            <p>Has acertado ${score} de ${quizData.length} preguntas.</p>
            <img src="${finalImage}" alt="Resultado" class="final-img">
            <button class="btn-restart" onclick="startGame()">Volver a jugar</button>
            <br><br>
            <!-- CORREGIDO: Enlace con ../ para volver a juegos.html -->
            <a href="../juegos.html" style="color: #002a5c; font-weight: bold;">← Volver a Juegos</a>
        </div>
    `;
}

// Iniciar cuando cargue
document.addEventListener('DOMContentLoaded', initQuiz);
