//VARIABLES DE ESTADO 
let numeroSecreto = Math.floor(Math.random() * 100) + 1; // Genera número aleatorio entre 1 y 100
let tiempoRestante = 30;                                 // Contador inicial de segundos
let intentosFallidos = [];                               // Array para guardar los números fallidos
let juegoActivo = true;                                  // Bandera para controlar si el juego sigue en curso
let intervalo;                                           // Variable para almacenar el setInterval del cronómetro

//Elementos HTML
const inputUser = document.getElementById('user-guess');
const btnGuess = document.getElementById('btn-guess');
const displayTimer = document.getElementById('timer');
const displayFeedback = document.getElementById('feedback');
const displayIntentos = document.getElementById('intentos');
const tarjeta = document.getElementById('tarjeta');
const btnReset = document.getElementById('btn-reset');

/*** Inicia el conteo regresivo de 30 a 0.*/
function iniciarCronometro() {
    intervalo = setInterval(() => {
        tiempoRestante--;
        displayTimer.innerText = tiempoRestante;
        
        //si quedan 10 segundos o menos, el reloj parpadea en rojo
        if (tiempoRestante <= 10 && tiempoRestante > 0) {
            displayTimer.style.color = "var(--neon-red)";
            displayTimer.style.opacity = "0.2";
            setTimeout(() => {
                if (juegoActivo) displayTimer.style.opacity = "1";
            }, 500);
        }

        // Si el tiempo llega a cero, el jugador pierde
        if (tiempoRestante <= 0) {
            displayTimer.style.opacity = "1";
            finalizarJuego(false, "TIEMPO AGOTADO");
        }
    }, 1000); // Se ejecuta cada 1 segundo
}

/*** Valida y procesa el número ingresado por el usuario.*/
function procesarIntento() {
    if (!juegoActivo) return; // Si el juego terminó, no hace nada

    const guess = parseInt(inputUser.value);

    // Validación: que sea un número y esté en el rango 1-100
    if (isNaN(guess) || guess < 1 || guess > 100) {
        displayFeedback.innerText = "ERROR: Inserte número (1-100)";
        return;
    }

    // Calcula la diferencia absoluta entre el secreto y el intento
    const distancia = Math.abs(numeroSecreto - guess);
    limpiarClases(); // Quita colores previos de la tarjeta

    if (distancia === 0) {
        //si adivinó el número
        finalizarJuego(true, "¡ACCESO CONCEDIDO!");
        tarjeta.classList.add('victoria');
        document.body.style.backgroundColor = "#021a02"; // Fondo verde oscuro
    } else {
        //si falla guarda el intento y da pistas según la distancia
        intentosFallidos.push(guess);
        actualizarHistorial();
        
        //si es menor o igual a 5, caliente
        if (distancia <= 5) {
            displayFeedback.innerText = "CALIENTE... Cerca del objetivo";
            tarjeta.classList.add('caliente');
            document.body.style.backgroundColor = "#1a0005"; // Fondo rojo

        //si es menor o igual a 15, tibio
        } else if (distancia <= 15) {
            displayFeedback.innerText = "TIBIO... Señal detectada";
            tarjeta.classList.add('tibio');
            document.body.style.backgroundColor = "#1a1400"; // Fondo naranja/amarillo

        //si no esta en esos rangos, frio
        } else {
            displayFeedback.innerText = "CONGELADO... Fuera de rango";
            tarjeta.classList.add('frio');
            document.body.style.backgroundColor = "#000d1a"; // Fondo azul
        }
    }

    // Limpia el input y devuelve el foco para seguir escribiendo rápido
    inputUser.value = "";
    inputUser.focus();
}

/* Actualiza la lista de números intentados en la pantalla.*/
function actualizarHistorial() {
    displayIntentos.innerText = "LOGS: " + intentosFallidos.join(" - ");
}

/* Remueve todas las clases CSS de temperatura de la tarjeta.*/
function limpiarClases() {
    tarjeta.classList.remove('frio', 'tibio', 'caliente', 'victoria');
}

/* Detiene el juego y muestra el resultado final.*/
function finalizarJuego(victoria, mensaje) {
    juegoActivo = false;
    clearInterval(intervalo); // Detiene el cronómetro
    btnGuess.disabled = true;  // Desactiva botón de envío
    inputUser.disabled = true; // Desactiva cuadro de texto
    displayFeedback.innerText = `${mensaje}. CLAVE: ${numeroSecreto}`;
    
    // Muestra el botón de reinicio
    btnReset.classList.remove('hidden');
}

//EVENTOS

// Al hacer clic en el botón de adivinar, procesa el intento
btnGuess.addEventListener('click', procesarIntento);

// Al presionar la tecla "Enter" dentro del input,procesa el intento
inputUser.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') procesarIntento();
});

// Al hacer clic en reiniciar: recarga la página para empezar de cero
btnReset.addEventListener('click', () => {
    location.reload(); 
});

//INICIO
iniciarCronometro();
