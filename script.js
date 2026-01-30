let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let tiempoRestante = 30;
let intentosFallidos = [];
let juegoActivo = true;
let intervalo;

const inputUser = document.getElementById('user-guess');
const btnGuess = document.getElementById('btn-guess');
const displayTimer = document.getElementById('timer');
const displayFeedback = document.getElementById('feedback');
const displayIntentos = document.getElementById('intentos');
const tarjeta = document.getElementById('tarjeta');
const btnReset = document.getElementById('btn-reset');

function iniciarCronometro() {
    intervalo = setInterval(() => {
        tiempoRestante--;
        displayTimer.innerText = tiempoRestante;
        
        // Efecto de parpadeo desde el segundo 10 al 1
        if (tiempoRestante <= 10 && tiempoRestante > 0) {
            displayTimer.style.color = "var(--neon-red)";
            // Alterna la opacidad rápidamente
            displayTimer.style.opacity = "0.2";
            setTimeout(() => {
                if (juegoActivo) displayTimer.style.opacity = "1";
            }, 500);
        }

        if (tiempoRestante <= 0) {
            displayTimer.style.opacity = "1";
            finalizarJuego(false, "TIEMPO AGOTADO");
        }
    }, 1000);
}

function procesarIntento() {
    if (!juegoActivo) return;

    const guess = parseInt(inputUser.value);

    if (isNaN(guess) || guess < 1 || guess > 100) {
        displayFeedback.innerText = "ERROR: Inserte número (1-100)";
        return;
    }

    const distancia = Math.abs(numeroSecreto - guess);
    limpiarClases();

    if (distancia === 0) {
        finalizarJuego(true, "¡ACCESO CONCEDIDO!");
        tarjeta.classList.add('victoria');
        document.body.style.backgroundColor = "#021a02"; 
    } else {
        intentosFallidos.push(guess);
        actualizarHistorial();
        
        if (distancia <= 5) {
            displayFeedback.innerText = "CALIENTE... Cerca del objetivo";
            tarjeta.classList.add('caliente');
            document.body.style.backgroundColor = "#1a0005"; 
        } else if (distancia <= 15) {
            displayFeedback.innerText = "TIBIO... Señal detectada";
            tarjeta.classList.add('tibio');
            document.body.style.backgroundColor = "#1a1400"; 
        } else {
            displayFeedback.innerText = "CONGELADO... Fuera de rango";
            tarjeta.classList.add('frio');
            document.body.style.backgroundColor = "#000d1a";
        }
    }

    inputUser.value = "";
    inputUser.focus();
}

function actualizarHistorial() {
    displayIntentos.innerText = "LOGS: " + intentosFallidos.join(" - ");
}

function limpiarClases() {
    tarjeta.classList.remove('frio', 'tibio', 'caliente', 'victoria');
}

function finalizarJuego(victoria, mensaje) {
    juegoActivo = false;
    clearInterval(intervalo);
    btnGuess.disabled = true;
    inputUser.disabled = true;
    displayFeedback.innerText = `${mensaje}. CLAVE: ${numeroSecreto}`;
    
    // Mostramos el botón de reset quitando la clase 'hidden'
    btnReset.classList.remove('hidden');
}

btnGuess.addEventListener('click', procesarIntento);

inputUser.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') procesarIntento();
});

btnReset.addEventListener('click', () => {
    location.reload(); 
});

// Inicialización del sistema
iniciarCronometro();