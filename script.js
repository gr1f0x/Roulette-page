// Función para obtener el número de fichas de las cookies
function getChips() {
    const chips = document.cookie.split('; ').find(row => row.startsWith('chips='));
    return chips ? parseInt(chips.split('=')[1]) : 0;
}

// Función para actualizar el número de fichas en las cookies
function setChips(chips) {
    document.cookie = `chips=${chips}; path=/`;
}

// Función para mostrar el número de fichas en la interfaz
function updateChipsDisplay() {
    const chips = getChips();
    document.getElementById('chips').innerText = `Fichas: ${chips}`;
    document.getElementById('chips-value').innerText = chips; // Actualiza el valor en el header
}

// Evento para agregar fichas
document.getElementById('add-chips-btn').onclick = function() {
    const chipsToAdd = parseInt(document.getElementById('add-chips').value);
    if (!isNaN(chipsToAdd) && chipsToAdd > 0) {
        const currentChips = getChips();
        const newChips = currentChips + chipsToAdd;
        setChips(newChips);
        updateChipsDisplay();
        document.getElementById('add-chips').value = ''; // Limpiar el campo de entrada
    }
};

// Al cargar la página, mostrar el número de fichas
window.onload = function() {
    updateChipsDisplay();
};
