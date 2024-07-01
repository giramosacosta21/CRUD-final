//BOTON MOSTRAR FORMULARIO
document.addEventListener('DOMContentLoaded', function() {
    const botonModificar = document.querySelector('.boton-modificar');
    const contenidoTexto = document.querySelector('.contenido-texto');

    //const botonModificar = document.getElementsByClassName('.boton-modificar');

    botonModificar.addEventListener('click', function() {
        contenidoTexto.style.display = 'grid';
    });
});



//BOTON CERRAR FORMULARIO
document.addEventListener('DOMContentLoaded', function() {
    var cerrarBtn = document.querySelector('.cerrar');
    var contenidoTexto = document.querySelector('.contenido-texto');

    cerrarBtn.addEventListener('click', function() {
        contenidoTexto.style.display = 'none';
    });
});

