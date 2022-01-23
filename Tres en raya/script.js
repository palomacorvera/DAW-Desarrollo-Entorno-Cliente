const btn_modos = document.querySelectorAll('.btn-modos');
const btn_fichas = document.querySelectorAll('.btn-fichas');

const tiempoTotal = document.getElementById('tiempoTotal');
const tiempoRonda = document.getElementById('tiempoRonda');

const casillas = document.querySelectorAll('.casilla');

const botonJugar = document.getElementById('jugar');
const botonReiniciar = document.getElementById('reiniciar');

const ganadas = document.getElementById('ganadas');
const perdidas = document.getElementById('perdidas');
const empatadas = document.getElementById('empatadas');

const turnoJugador = document.getElementById('turnoJugador');

// Función que crea las notificaciones de las partidas
function crearNotificacion(mensaje) {
    const notif = document.createElement('div');
    notif.classList.add('toast');

    notif.innerText = mensaje;
     
    toasts.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 1500);
};

// Variables de los intervalos de tiempo
let intervaloRonda;
let intervaloTotal;

// Empieza el tiempo total de la partida (al pulsar el botón de jugar)
const setTiempoTotal = () => {
    let contadorSegundos = 0;
    let contadorMinutos = 0;

    intervaloTotal = setInterval(() => {
        contadorSegundos++;

        if (contadorSegundos === 60) {
            contadorSegundos = 0;
            contadorMinutos++;
        }
                
        if (contadorSegundos < 10) {
            if (contadorMinutos < 10) {
                tiempoTotal.innerText = '0' + contadorMinutos + ':0' + contadorSegundos;
            } else {
                tiempoTotal.innerText = contadorMinutos + ':0' + contadorSegundos;
            }
        } else {
            if (contadorMinutos < 10) {
                tiempoTotal.innerText = '0' + contadorMinutos + ':' + contadorSegundos;
            } else {
                tiempoTotal.innerText = contadorMinutos + ':' + contadorSegundos;
            }
        }
    }, 1000);
};

// Variable que controla a que jugador le toca
let jugador = 0;
// Variable que controla cuántas fichas se han movido
let fichas = 0;

// Resetea todo lo general al cambiar de modo o al reiniciar, o al terminar la partida
const resetGeneral = () => {
    clearInterval(intervaloRonda);
    clearInterval(intervaloTotal);

    tiempoRonda.innerText = '00:00';
    tiempoTotal.innerText = '00:00';

    fichas = 0;
    jugador = 0;

    jugando = false;

    turnoJugador.innerText = '';

    casillas.forEach(casilla => {
        casilla.disabled = true;
    });
};

//Variables que controlan las partidas
let partidasGanadas = 0;
let partidasPerdidas = 0;
let partidasEmpatadas = 0;

// Resetea la tabla al cambiar el modo o reiniciar
const resetTabla = () => {
    partidasGanadas = 0;
    partidasPerdidas = 0;
    partidasEmpatadas = 0;

    ganadas.innerText = partidasGanadas;
    perdidas.innerText = partidasPerdidas;
    empatadas.innerText = partidasEmpatadas;
};

// Empieza el tiempo total de la ronda (al pulsar el botón de jugar)
const setTiempoRonda = () => {
    let segundos = 30;

    intervaloRonda = setInterval(() => {
        segundos--;

        if(segundos < 10) {
            tiempoRonda.innerText = '00:0' + segundos;
        } else {
            tiempoRonda.innerText = '00:' + segundos;
        };
    
        if (segundos <= 0) {
            clearInterval(intervaloRonda);

            if (jugador % 2 === 0) {
                partidasPerdidas++;
                perdidas.innerText = partidasPerdidas;
            } else {
                partidasGanadas++;
                ganadas.innerText = partidasGanadas;
            };

            resetGeneral();
            resetearTablero();
        };
    }, 1000);
}

// Variable que controla que no puedas jugar sin los relojes
let jugando = false;

// Empieza la partida
botonJugar.addEventListener('click', () => {
    if (!jugando) {
        if (modo === 'unoVsUno') {
            turnoJugador.innerText = 'Turno: Jugador X';
        };

        crearNotificacion('Comienza la partida!');

        resetearTablero();
       casillas.forEach(casilla => {
           casilla.disabled = false;
       });

        jugando = true;

        setTiempoTotal();
        setTiempoRonda();
    };
}); 

// Se ejecuta cada vez que se pulsa una casilla
const jugar = (id) => {
    if (modo === 'unoVsUno' && numFichas === 'nueveFichas') {
        unoVsUnoNueveFichas(id);
    } else if (modo === 'jugadorVsAleatorio' && numFichas === 'nueveFichas') {
        jugadorVsAleatorioNueveFichas(id);
    } else if (modo === 'unoVsUno' && numFichas === 'seisFichas') {
        unoVsUnoSeisFichas(id);
    } else if (modo === 'jugadorVsAleatorio' && numFichas === 'seisFichas') {
        unoVsAleatorioSeisFichas(id);
    }
};

// Array que guarda la información del tablero
let arrayTablero = [];

// Resetea el tablero a vacío
const resetearTablero = () => {
    for (let i = 0; i < 3; i++) {
        arrayTablero[i] = [];
        for (let j = 0; j < 3; j++) {
            arrayTablero[i][j] = 0;
        };
    };

    casillas.forEach(casilla => {
        casilla.innerText = '';
    });
};

// Botón de reseteo
botonReiniciar.addEventListener('click', () => {
    resetGeneral();
    resetTabla();
    resetearTablero();
});

// Variables que controlan en qué modo estás y con cuantas fichas juegas
let modo = 'unoVsUno';
let numFichas = 'nueveFichas';

// Cambia los modos de juego
btn_modos.forEach(btn => {
    btn.addEventListener('click', () => {
        btn_modos.forEach(btn => {
            btn.classList.remove('active');
        });

        btn.classList.add('active');
        modo = btn.getAttribute('for');

        resetGeneral();
        resetTabla();
        resetearTablero();
    });
});

// Cambia el número de fichas
btn_fichas.forEach(btn => {
    btn.addEventListener('click', () => {
        btn_fichas.forEach(btn => {
            btn.classList.remove('active');
        });

        btn.classList.add('active');
        numFichas = btn.getAttribute('for');

        resetGeneral();
        resetTabla();
        resetearTablero();
    });
});

// Actualiza el tablero añadiendo las fichas de cada jugador
const actualizarTablero = (id, jugador) => {
    let x = id.split(',')[0];
    let y = id.split(',')[1];

    arrayTablero[x][y] = jugador;
}

// Comprueba si uno de los jugadores ha ganado
const comprobarGanador = () => {
    let ganador;

    if (arrayTablero[0][0] === 1 && arrayTablero[0][1] === 1 && arrayTablero[0][2] === 1) {
        ganador = 1;
    } else if (arrayTablero[1][0] === 1 && arrayTablero[1][1] === 1 && arrayTablero[1][2] === 1) {
        ganador = 1;
    } else if (arrayTablero[2][0] === 1 && arrayTablero[2][1] === 1 && arrayTablero[2][2] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][0] === 1 && arrayTablero[1][0] === 1 && arrayTablero[2][0] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][1] === 1 && arrayTablero[1][1] === 1 && arrayTablero[2][1] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][2] === 1 && arrayTablero[1][2] === 1 && arrayTablero[2][2] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][0] === 1 && arrayTablero[1][1] === 1 && arrayTablero[2][2] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][2] === 1 && arrayTablero[1][1] === 1 && arrayTablero[2][0] === 1) {
        ganador = 1;
    } else if (arrayTablero[0][0] === 2 && arrayTablero[0][1] === 2 && arrayTablero[0][2] === 2) {
        ganador = 2;
    } else if (arrayTablero[1][0] === 2 && arrayTablero[1][1] === 2 && arrayTablero[1][2] === 2) {
        ganador = 2;
    } else if (arrayTablero[2][0] === 2 && arrayTablero[2][1] === 2 && arrayTablero[2][2] === 2) {
        ganador = 2;
    } else if (arrayTablero[0][0] == 2 && arrayTablero[1][0] === 2 && arrayTablero[2][0] === 2) {
        ganador = 2;
    } else if (arrayTablero[0][1] === 2 && arrayTablero[1][1] === 2 && arrayTablero[2][1] === 2) {
        ganador = 2;
    } else if (arrayTablero[0][2] === 2 && arrayTablero[1][2] === 2 && arrayTablero[2][2] === 2) {
        ganador = 2;
    } else if (arrayTablero[0][0] === 2 && arrayTablero[1][1] === 2 && arrayTablero[2][2] === 2) {
        ganador = 2;
    } else if (arrayTablero[0][2] === 2 && arrayTablero[1][1] === 2 && arrayTablero[2][0] === 2) {
        ganador = 2;
    } else {
        ganador = 0;
    };

    if (ganador === 1) {
        resetGeneral();
        crearNotificacion('El jugador X ha ganado!');
        partidasGanadas++;
        ganadas.innerText = partidasGanadas;
        return true;
    } else if (ganador === 2) {
        resetGeneral();
        crearNotificacion('El jugador O ha ganado!');
        partidasPerdidas++;
        perdidas.innerText = partidasPerdidas;
        return true;
    } else if (fichas === 9) {
        resetGeneral();
        crearNotificacion('Empate!');
        partidasEmpatadas++;
        empatadas.innerText = partidasEmpatadas;
        return true;
    } else {
        return false;
    };
};

// Inicia el tablero vacío
resetearTablero();

const jugadorIndividual = (turno, id) => {
    let casilla = document.getElementById(id);
    if (casilla.innerText !== 'X' && casilla.innerText !== 'O') {
        if (turno === 1) {
            turnoJugador.innerText = 'Turno: Jugador O';
            casilla.innerText = 'X';
            actualizarTablero(id, 1);
            fichas++;
        } else {
            turnoJugador.innerText = 'Turno: Jugador X';
            casilla.innerText = 'O';
            actualizarTablero(id, 2);
            fichas++;
        };
        jugador++;

        let ganador = comprobarGanador();

        if (!ganador) {
            clearInterval(intervaloRonda);
            setTiempoRonda();
            return false;
        };
    };
}

// 1VS1 9 FICHAS
const unoVsUnoNueveFichas = (id) => {
    if (jugador % 2 === 0) {
        jugadorIndividual(1, id);
    } else {
        jugadorIndividual(2, id);
    };
};

// Calcula la posición que va a poner la máquina aleatoria
const calcularAleatorio = () => {
    let fila = Math.random() * (3 - 0) + 0;
       let columna = Math.random() * (3 - 0) + 0;
       return Math.floor(fila) + ',' + Math.floor(columna);
};


// Movimiento de la máquina aleatoria
const aleatorio = () => {
    let posicionValida = false;
    let posicion = calcularAleatorio();

    while (!posicionValida) {
        casillas.forEach(casilla => {
            if (casilla.getAttribute('id') === posicion) {
                if (casilla.innerText !== 'X' && casilla.innerText !== 'O') {
                    if(!jugadorIndividual(2, casilla.getAttribute('id'))) {
                        if (numFichas === 'nueveFichas') {  
                            jugadorVsAleatorioNueveFichas();
                        } else {
                            unoVsAleatorioSeisFichas();
                        };
                    };
                    posicionValida = true;
            } else {
                posicion = calcularAleatorio();
            };
            };
        });
    };
};

// 1vsAleatorio 9 FICHAS
const jugadorVsAleatorioNueveFichas = (id) => {
    if (jugador % 2 === 0) {
        if(!jugadorIndividual(1, id)) {
            jugadorVsAleatorioNueveFichas();
        };
    } else {
        aleatorio();
    };
};

// 1vs1 6 FICHAS
const unoVsUnoSeisFichas = (id) => {
    if (fichas < 6) {
        if (jugador % 2 === 0) {
            jugadorIndividual(1, id);
        } else {
            jugadorIndividual(2, id);
        };
    } else {
        let casilla = document.getElementById(id);
        if (jugador % 2 === 0) {
            if (casilla.innerText === 'X') {
                casilla.innerText = '';
                actualizarTablero(id, 0);
                fichas--;
            } 
        } else {
            if (casilla.innerText === 'O') {
                casilla.innerText = '';
                actualizarTablero(id, 0);
                fichas--;
            }; 
        };  
    };
};

// 1vsAleatorio 6 fichas
const unoVsAleatorioSeisFichas = (id) => {
    if (fichas < 6) {
        if (jugador % 2 === 0) {
            if(!jugadorIndividual(1, id)) {
                unoVsAleatorioSeisFichas();
            };
        } else {
            aleatorio();
        };
    } else {
        let casilla = document.getElementById(id);
        if (jugador % 2 === 0) {
            if (casilla.innerText === 'X') {
                casilla.innerText = '';
                actualizarTablero(id, 0);
                fichas--;
            };
        } else {
            let posicionValida = false;
            let posicion = calcularAleatorio();

            while (!posicionValida) {
                casillas.forEach(casilla => {
                    if (casilla.getAttribute('id') === posicion) {
                        if (casilla.innerText === 'O' ) {
                            casilla.innerText = '';
                            actualizarTablero(casilla.getAttribute('id'), 0);
                            fichas--;

                            posicionValida = true;
                            aleatorio();
                        } else {
                            posicion = calcularAleatorio();
                        };
                    };
                });
            };
        };
    };
};