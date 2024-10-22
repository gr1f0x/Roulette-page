document.addEventListener('DOMContentLoaded', function() {
    // Elemento donde se muestra el valor de las fichas
    const chipsValue = document.getElementById('chips-value');
    // Obtener el crédito del usuario desde las cookies
    let userCredit = getChips();
    chipsValue.textContent = userCredit; // Mostrar el crédito inicial

    let selectedFicha = null; // Variable para almacenar la ficha seleccionada

    // Selección de fichas
    const fichas = document.querySelectorAll('.ficha');
    for (let i = 0; i < fichas.length; i++) {
        fichas[i].addEventListener('click', function() {
            selectedFicha = this; // Asignar la ficha seleccionada
            // Limpiar selecciones anteriores
            for (let j = 0; j < fichas.length; j++) {
                fichas[j].classList.remove('seleccionada');
            }
            this.classList.add('seleccionada'); // Marcar la ficha como seleccionada
        });
    }

    // Colocar ficha en apuesta
    const apuestas = document.querySelectorAll('.apuesta');
    for (let i = 0; i < apuestas.length; i++) {
        apuestas[i].addEventListener('click', function() {
            if (!selectedFicha) {
                alert("Primero selecciona una ficha.");
                return; // No hacer nada si no hay ficha seleccionada
            }

            const fichaValue = parseInt(selectedFicha.getAttribute('data-value')); // Obtener el valor de la ficha seleccionada
            const totalBet = parseInt(this.getAttribute('data-bet') || '0'); // Obtener la apuesta total actual
            const newBet = totalBet + fichaValue; // Calcular la nueva apuesta

            // Comprobar si la nueva apuesta no supera el crédito del usuario
            if (newBet <= userCredit) {
                this.setAttribute('data-bet', newBet); // Actualizar la apuesta en el elemento
                this.style.backgroundImage = `url('${selectedFicha.src}')`; // Establecer la imagen de la ficha
                this.style.backgroundSize = '50px'; // Ajustar el tamaño de la imagen
                this.style.backgroundRepeat = 'no-repeat';
                this.style.all = 'no-repeat';
                this.style.backgroundPosition = 'center';
                updateChips(-fichaValue); // Actualizar las fichas del usuario
            } else {
                alert("No puedes apostar más de lo que tienes."); // Mensaje de error
            }
        });
    }

    // Evento para girar la ruleta
    document.getElementById('girar-btn').addEventListener('click', function() {
        // Verificar si hay alguna apuesta realizada
        let hasBets = false; // Inicializar la variable que verifica si hay apuestas

        for (let i = 0; i < apuestas.length; i++) {
            if (parseInt(apuestas[i].getAttribute('data-bet') || '0') > 0) {
                hasBets = true; // Hay al menos una apuesta
                break;
            }
        }

        if (!hasBets) {
            alert("Debes realizar al menos una apuesta antes de girar la ruleta.");
            return; // No girar si no hay apuestas
        }

        const ruleta = document.getElementById('ruleta');
        const randomNumber = Math.floor(Math.random() * 37); // Generar un número aleatorio entre 0 y 36
        const resultDisplay = document.getElementById('result');

        // Simular la rotación de la ruleta
        ruleta.style.transition = 'transform 3s';
        ruleta.style.transform = 'rotate(' + (360 * 3 + (randomNumber * 9.73)) + 'deg)';

        // Esperar 3 segundos para mostrar el resultado
        setTimeout(() => {
            resultDisplay.textContent = 'Número de la ruleta: ' + randomNumber; // Mostrar el número de la ruleta
            checkWin(randomNumber); // Comprobar si hay ganadores
            ruleta.style.transition = 'none'; // Reiniciar la transición
            ruleta.style.transform = 'rotate(0deg)'; // Reiniciar la rotación

            // Eliminar las apuestas después de la ronda
            removeChips();
        }, 3000);
    });

   // Comprobar si el jugador ha ganado
   function checkWin(number) {
    const bets = document.querySelectorAll('.apuesta'); // Obtener todas las apuestas
    let win = false; // Inicializar variable de ganancia
    let winningAmount = 0; // Inicializar cantidad ganada

    // Números rojos y negros en la ruleta
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

    for (let i = 0; i < bets.length; i++) {
        const bet = bets[i];
        const betValue = parseInt(bet.getAttribute('data-bet') || '0'); // Obtener el valor de la apuesta
        const betNumber = parseInt(bet.getAttribute('data-number')); // Obtener el número de la apuesta
        const betType = bet.getAttribute('data-apuesta'); // Obtener el tipo de apuesta

        // Comprobar las condiciones de ganancia
        if (betNumber === number) {
            win = true; // Ganar si se acierta el número exacto
            winningAmount += betValue * 35; // Ganancia de 35 a 1 para apuestas directas
        } else if (betType === 'rojo' && redNumbers.includes(number)) {
            win = true; // Ganar si se apuesta a rojo y sale un número rojo
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a rojo
        } else if (betType === 'negro' && blackNumbers.includes(number)) {
            win = true; // Ganar si se apuesta a negro y sale un número negro
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a negro
        } else if (betType === 'pares' && number % 2 === 0 && number !== 0) {
            win = true; // Ganar si se apuesta a pares y sale un número par
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a pares
        } else if (betType === 'impares' && number % 2 === 1) {
            win = true; // Ganar si se apuesta a impares y sale un número impar
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a impares
        } else if (betType === 'bajos' && number >= 1 && number <= 18) {
            win = true; // Ganar si se apuesta a números bajos y el número está en el rango
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a números bajos
        } else if (betType === 'altos' && number >= 19 && number <= 36) {
            win = true; // Ganar si se apuesta a números altos y el número está en el rango
            winningAmount += betValue; // Ganancia de 1 a 1 para apuestas a números altos
        }
    }

    // Mostrar resultado de la apuesta
    if (win) {
        updateChips(winningAmount); // Actualizar fichas con las ganancias
        alert(`¡Ganaste! Número: ${number}, Ganancia: €${winningAmount}`);
    } else {
        const totalBet = Array.from(bets).reduce((sum, bet) => sum + (parseInt(bet.getAttribute('data-bet')) || 0), 0);
        alert(`Perdiste. Número: ${number}. Pérdida: €${totalBet}`);
    }

    // Resetear las apuestas
    for (let i = 0; i < bets.length; i++) {
        bets[i].removeAttribute('data-bet'); // Limpiar la apuesta
        bets[i].style.backgroundImage = 'none'; // Limpiar la imagen de la apuesta
    }
    chipsValue.textContent = getChips(); // Actualizar visualización de fichas
}
    // Función para eliminar las fichas después de la ronda
    function removeChips() {
        for (let i = 0; i < apuestas.length; i++) {
            apuestas[i].removeAttribute('data-bet'); // Limpiar la apuesta
            apuestas[i].style.backgroundImage = 'none'; // Limpiar la imagen de la apuesta
        }
    }

    // Función para actualizar las fichas del usuario
    function updateChips(amount) {
        userCredit = getChips() + amount; // Calcular el nuevo total de fichas
        setChips(userCredit); // Actualizar cookies
        chipsValue.textContent = userCredit; // Actualizar visualización de fichas
    }

    // Funciones para manejar las cookies
    function setChips(chips) {
        document.cookie = `chips=${chips}; path=/`; // Guardar el total de fichas en una cookie
    }

    function getChips() {
        const chips = document.cookie.split('; ').find(row => row.startsWith('chips=')); // Buscar la cookie de fichas
        return chips ? parseInt(chips.split('=')[1]) : 100; // Retornar las fichas o 100 si no existe
    }
});
