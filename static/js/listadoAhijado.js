const URL = "https://giramosacosta21.pythonanywhere.com/"
// Al subir al servidor, deberá utilizarse la siguiente ruta.
//USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"


//Definir variables a nivel global
let IDAhijadoSeleccionado = null;
let nombre = '';
let apellido = '';
let fechaNacimiento = '';
let enfermedad = '';
let domicilio = '';
let grupoSanguineo = '';
let donanteCompatible = '';
let imagen_url = '';
let imagenSeleccionada = null;
let imagenUrlTemp = null;
document.getElementById('imagen-vista-previa').style.display = 'none';


//-------------------------- LISTADO DE AHIJADOS --------------------------//
// Realizamos la solicitud GET al servidor para obtener todos los ahijados.
function mostrarListadoAhijado(){
    fetch(URL + 'ahijados')
    .then(function (response) {

        if (response.ok) {
        //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
            return response.json();
    } else {
        // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
            throw new Error('Error al obtener el listado de ahijados.');
        }
    })

    //Esta función maneja los datos convertidos del JSON.
    .then(function (data) {
        let tablaAhijados = document.getElementById('tablaAhijados'); //Selecciona el elemento del DOM donde se mostrarán los ahijados.
        let contador = 0; //establecemos un contador

        console.log("--------Lista de Ahijados--------")
        console.log(data)
        console.log("------------------------")
        console.log("")

        // Limpiar contenido previo de la tabla
        tablaAhijados.innerHTML = '';

        // Iteramos sobre cada ahijado y agregamos filas a la tabla
        for (let ahijado of data) {
            let fila = document.createElement('tr'); //Crea una nueva fila de tabla (<tr>) para cada ahijado.

            fila.innerHTML = '<td>' + ahijado.ID + '</td>' + 
                            '<td>' + ahijado.nombre + '</td>' + 
                            '<td>' + ahijado.apellido + '</td>' + 
                            '<td>' + formatearFechaNacimiento(ahijado.fechaNacimiento) + '</td>' +
                            '<td>' + ahijado.edad + '</td>' + 
                            '<td>' + ahijado.grupoSanguineo + '</td>' + 
                            '<td>' + ahijado.donantesCompatibles + '</td>' +
                            '<td>' + ahijado.enfermedad + '</td>' + 
                            '<td>' + ahijado.domicilio + '</td>' + 
                            '<td><button class="boton-modificar" data-id ="' + ahijado.ID + '"><i class="bi bi-pencil-square"></i><span>Modificar</span></button></td>' +
                            '<td><button class="boton-eliminar" data-id = "' + ahijado.ID + '"><i class="bi bi-trash"></i><span>Eliminar</span></button></td>'
                            ;

            //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
            //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + ahijado.imagen_url +' alt="Imagen del ahijado" style="width: 100px;"></td>';
            //Una vez que se crea la fila con el contenido del ahijado, se agrega a la tabla utilizando el método appendChild del elemento tablaAhijados.

            tablaAhijados.appendChild(fila);
            contador ++;
        }

        //Muestra la cantidad total de ahijados 
        document.getElementById('cantidad').textContent = contador.toString();


        //BOTON MOSTRAR FORMULARIO
        let botonModificar = document.getElementsByClassName('boton-modificar');
        const contenidoTexto = document.querySelector('.contenido-texto');

        for (let boton of botonModificar) {
            boton.addEventListener('click', function() {
                contenidoTexto.style.display = 'grid';

                // Obtener el ID del ahijado
                let ahijadoID = this.getAttribute('data-id');
                console.log('Modificar ahijado con ID:', ahijadoID);

                mostrarFormulario(ahijadoID);
                IDAhijadoSeleccionado = ahijadoID;
            });
        }


        //BOTON ELIMNAR AHIJADO(ID)
        let botonEliminar = document.getElementsByClassName('boton-eliminar');
        for (let boton of botonEliminar){
            boton.addEventListener('click', function(){
                let ahijadoID = this.getAttribute('data-id');

                eliminarAhijado(ahijadoID)
            })
        }
        
    })

    //Captura y maneja errores, mostrando una alerta en caso de error al obtener los ahijados.
    .catch(function (error) {
        // Código para manejar errores
        alert('Error al obtener el listado de ahijados.', error);
    });

}mostrarListadoAhijado();



//-------------------------- AHIJADO SELECCIONADO POR ID --------------------------//
//MUESTRA LOS DATOS DEL AHIJADO SELECCIONADO POR ID
function mostrarFormulario(ahijadoID) {
    fetch(URL + 'ahijados/' + ahijadoID)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al obtener los datos del ahijado.');
        }
    })
    .then(data => {
        nombre = data.nombre;
        apellido = data.apellido;
        fechaNacimiento = formatearFechaNacimiento(data.fechaNacimiento);
        enfermedad = data.enfermedad;
        domicilio = data.domicilio;
        grupoSanguineo = data.grupoSanguineo;
        imagen_url = data.imagen_url;
        donanteCompatible = data.donanteCompatible;

        // Llenar los campos del formulario con los datos del ahijado
        document.getElementById('nuevo_nombre').value = nombre;
        document.getElementById('nuevo_apellido').value = apellido;
        document.getElementById('nueva_fechaNacimiento').value = fechaNacimiento;
        document.getElementById('nuevo_grupoSanguineo').value = grupoSanguineo;
        document.getElementById('nuevo_donanteCompatible').value = donanteCompatible;
        document.getElementById('nueva_enfermedad').value = enfermedad;
        document.getElementById('nuevo_domicilio').value = domicilio;

        const imagenActual = document.getElementById('imagen-actual');

        if (imagen_url && !imagenSeleccionada) { // Verifica si imagen_url no está vacía y no se ha seleccionado una imagen
                    
            imagenActual.src = 'https://www.pythonanywhere.com/user/giramosacosta21/files/home/giramosacosta21/mysite/static/imagenes/' + imagen_url;                    
            imagenActual.style.display = 'block'; // Muestra la imagen actual
            document.getElementById('imagen-default').style.display = 'none';
        } else {
            imagenActual.style.display = 'none'; // Oculta la imagen si no hay URL
            document.getElementById('imagen-default').style.display = 'block';
        }

        console.log("\n------------------------")
        console.log("Ahijado seleccionado: " + data.nombre)
        console.log("imagen: " + imagen_url)
        console.log("------------------------\n")
        
    })

    .catch(error => {
        console.error('Error al obtener los datos del ahijado:', error);
        alert('Error al obtener los datos del ahijado.');
    });
}



// Función para formatear la fecha al formato yyyy-MM-dd
function formatearFechaNacimiento(dateString) {
    const dateObject = new Date(dateString);
    const anio = dateObject.getFullYear();
    let mes = (dateObject.getMonth() + 1).toString();
    let dia = dateObject.getDate().toString();

    // Añadir ceros iniciales si es necesario
    if (mes.length === 1) {
        mes = '0' + mes;
    }
    if (dia.length === 1) {
        dia = '0' + dia;
    }

    return anio + '-' + mes + '-' + dia;
}



//-------------------------- MODIFICAR DATOS DEL AHIJADO SELECCIONADO --------------------------//
// FORMULARIO PARA MODIFICAR LOS DATOS DE UN AHIJADO.
document.getElementById('formulario-modificar').addEventListener('submit', function (event){
    event.preventDefault(); // Evitamos que se envie el form

    const formData = new FormData();
    formData.append('ID', IDAhijadoSeleccionado);
    formData.append('nombre', document.getElementById('nuevo_nombre').value);
    formData.append('apellido', document.getElementById('nuevo_apellido').value);
    formData.append('fechaNacimiento', document.getElementById('nueva_fechaNacimiento').value);
    formData.append('domicilio', document.getElementById('nuevo_domicilio').value);
    formData.append('grupoSanguineo', document.getElementById('nuevo_grupoSanguineo').value);
    formData.append('enfermedad', document.getElementById('nueva_enfermedad').value);
    formData.append('donanteCompatible', document.getElementById('nuevo_donanteCompatible').value); // Agregar donanteCompatible

    // Verificar si hay una nueva imagen seleccionada
    if (imagenSeleccionada) {
        formData.append('imagen', imagenSeleccionada, imagenSeleccionada.name);
    } 

    // Realizamos la solicitud PUT al servidor
    fetch(URL + 'ahijados/' + IDAhijadoSeleccionado ,{
        method: 'PUT',
        body: formData, // Aquí enviamos formData. Dado que formData puede contener archivos, no se utiliza JSON.
    })

        //Después de realizar la solicitud PUT, se utiliza el método then() para manejar la respuesta del servidor.
        .then(function (response) {
            if (response.ok) {
                //Si la respuesta es exitosa, convierte los datos de la respuesta a formato JSON.
                return response.json();
            } else {
                // Si hubo un error, lanzar explícitamente una excepción

                // para ser "catcheada" más adelante
                console.log("Respuesta de red OK pero respuesta HTTP no OK");
                throw new Error('Error al guardar las modificaciones del ahijado.');
            }
        })

        //Respuesta OK, muestra una alerta informando que el ahijado se agregó correctamente y limpia los campos del formulario para que puedan ser utilizados para un nuevo ahijado.
        .then(function (data) {
            alert('✅ Ahijado modificado correctamente.', data);
            console.log('Ahijado modificado correctamente.');
            limpiarFormulario();
        })

        // En caso de error, mostramos una alerta con un mensaje de error.
        .catch(function (error) {
            console.log("Hubo un problema con la petición Fetch:", error.message);
            console.error("Error al dar modificar ahijado:", error);

            alert('❌ Ocurrió un error al intentar modificar el ahijado.');
            document.getElementById("mensaje-error").style.color = "#C21518";
        })


})


// Se dispara cuando el usuario selecciona una imagen para cargar.
document.getElementById('nueva_imagen').addEventListener('change', function (event) {
    const file = event.target.files[0];

    // Verificar si FileReader está disponible
    if (FileReader && file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imagenVistaPrevia = document.getElementById('imagen-actual');
            imagenVistaPrevia.src = e.target.result;
            document.getElementById('imagen-default').style.display = 'none';
            imagenVistaPrevia.style.display = 'block';
        }

        reader.readAsDataURL(file);
        // Guardar la imagen seleccionada
        imagenSeleccionada = file;

        // Actualizar imagen_url si es necesario
        imagen_url = imagenSeleccionada;
    }

})



// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
    document.getElementById('nuevo_nombre').value = '';
    document.getElementById('nuevo_apellido').value = '';
    document.getElementById('nueva_fechaNacimiento').value = '';
    document.getElementById('nuevo_domicilio').value = '';
    document.getElementById('nuevo_grupoSanguineo').value = '';
    document.getElementById('nueva_enfermedad').value = '';
    document.getElementById('nuevo_donanteCompatible').value = ''; // Agregar donanteCompatible
    document.getElementById('nueva_imagen').value = '';

    IDAhijadoSeleccionado = null;
    nombre = '';
    apellido = '';
    fechaNacimiento = '';
    enfermedad = '';
    domicilio = '';
    grupoSanguineo = '';
    donanteCompatible = '';
    imagenSeleccionada = null;
    imagenUrlTemp = null;
    document.getElementById('imagen-default').style.display = 'block';
    document.getElementById('imagen-actual').style.display = 'none';
    document.querySelector('.contenido-texto').style.display = 'none';
    mostrarListadoAhijado();

    console.clear();
    console.log('Se modifico correctamente el ahijado.')
}


//-------------------------- ELIMINAR AHIJADO --------------------------//
// Se utiliza para eliminar un ahijado
function eliminarAhijado(ahijadoID) {
    // Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de fetch(URL + 'ahijados/${codigo}', {method: 'DELETE' }).
    if (confirm('¿Estás seguro de que quieres eliminar este ahijado?')) {
        fetch(URL + `ahijados/${ahijadoID}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    // Si es exitosa (response.ok), elimina el ahijado y da mensaje de ok.
                    mostrarListadoAhijado(); // Vuelve a obtener la lista de ahijados para actualizar la tabla.
                    alert('✅ Ahijado eliminado correctamente.');
                }
            })
            // En caso de error, mostramos una alerta con un mensaje de error.
            .catch(error => {
                console.log(error.message);
                alert('❌ Ocurrió un error al intentar eliminar ahijado.');
            });
    }
}





