const URL = "https://giramosacosta21.pythonanywhere.com/"
// Al subir al servidor, deberá utilizarse la siguiente ruta.
//USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
//const URL = "https://USUARIO.pythonanywhere.com/"


//Definir variables a nivel global
let IDDonanteSeleccionado = null;
let dni = '';
let nombre = '';
let apellido = '';
let fechaNacimiento = '';
let domicilio = '';
let telefono = '';
let mail = '';
let grupoSanguineo = '';
let ahijadoCompatible = '';


//-------------------------- LISTADO DE DONANTES --------------------------//
// Realizamos la solicitud GET al servidor para obtener todos los donantes.
function mostrarListadoDonante(){
    fetch(URL + 'donantes')
    .then(function (response) {

        if (response.ok) {
        //Si la respuesta es exitosa (response.ok), convierte el cuerpo de la respuesta de formato JSON a un objeto JavaScript y pasa estos datos a la siguiente promesa then.
            return response.json();
    } else {
        // Si hubo un error, lanzar explícitamente una excepción para ser "catcheada" más adelante
            throw new Error('Error al obtener el listado de donantes.');
        }
    })

    //Esta función maneja los datos convertidos del JSON.
    .then(function (data) {
        let tablaDonantes = document.getElementById('tablaDonantes'); //Selecciona el elemento del DOM donde se mostrarán los donantes.
        let contador = 0; //establecemos un contador

        console.log("--------Lista de Donantes--------")
        console.log(data)
        console.log("------------------------")
        console.log("")

        // Limpiar contenido previo de la tabla
        tablaDonantes.innerHTML = '';

        // Iteramos sobre cada donante y agregamos filas a la tabla
        for (let donante of data) {
            let fila = document.createElement('tr'); //Crea una nueva fila de tabla (<tr>) para cada donante.

            fila.innerHTML = '<td>' + donante.dni + '</td>' + 
                            '<td>' + donante.nombre + '</td>' + 
                            '<td>' + donante.apellido + '</td>' + 
                            '<td>' + formatearFechaNacimiento(donante.fechaNacimiento) + '</td>' +
                            '<td>' + donante.edad + '</td>' + 
                            '<td>' + donante.grupoSanguineo + '</td>' + 
                            '<td>' + donante.ahijadosCompatibles + '</td>' +
                            '<td>' + donante.domicilio + '</td>' + 
                            '<td>' + donante.telefono + '</td>' +
                            '<td>' + donante.mail + '</td>' +
                            '<td><button class="boton-modificar" data-id ="' + donante.ID + '"><i class="bi bi-pencil-square"></i><span>Modificar</span></button></td>' +
                            '<td><button class="boton-eliminar" data-id = "' + donante.ID + '"><i class="bi bi-trash"></i><span>Eliminar</span></button></td>'
                            ;

            //Al subir al servidor, deberá utilizarse la siguiente ruta. USUARIO debe ser reemplazado por el nombre de usuario de Pythonanywhere
            //'<td><img src=https://www.pythonanywhere.com/user/USUARIO/files/home/USUARIO/mysite/static/imagenes/' + donante.imagen_url +' alt="Imagen del donante" style="width: 100px;"></td>' + '<td align="right">' + producto.proveedor + '</td>';

            //Una vez que se crea la fila con el contenido del donante, se agrega a la tabla utilizando el método appendChild del elemento tablaDonantes.
            tablaDonantes.appendChild(fila);
            contador ++;
        }

        //Muestra la cantidad total de donantes 
        document.getElementById('cantidad').textContent = contador.toString();


        //BOTON MOSTRAR FORMULARIO
        let botonModificar = document.getElementsByClassName('boton-modificar');
        const contenidoTexto = document.querySelector('.contenido-texto');

        for (let boton of botonModificar) {
            boton.addEventListener('click', function() {
                //vuelve visible el formulario con los datos a modificar
                contenidoTexto.style.display = 'grid';

                // Obtener el ID del donante
                let donanteID = this.getAttribute('data-id');
                console.log('Modificar donante con ID:', donanteID);

                mostrarFormulario(donanteID);
                IDDonanteSeleccionado = donanteID;
            });
        }


        //BOTON ELIMNAR DONANTE(ID)
        let botonEliminar = document.getElementsByClassName('boton-eliminar');
        for (let boton of botonEliminar){
            boton.addEventListener('click', function(){
                let donanteID = this.getAttribute('data-id');

                eliminarDonante(donanteID)
            })
        }
        
    })

    //Captura y maneja errores, mostrando una alerta en caso de error al obtener los donantes.
    .catch(function (error) {
        // Código para manejar errores
        alert('❌ Error al obtener el listado de donantes.', error);
    });

}mostrarListadoDonante();



//-------------------------- DONANTE SELECCIONADO POR ID --------------------------//
//Muestra lso datos del donante seleccionado por su ID
function mostrarFormulario(donanteID) {
    fetch(URL + 'donantes/' + donanteID)
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al obtener los datos del donante.');
        }
    })
    .then(data => {
        dni = data.dni;
        nombre = data.nombre;
        apellido = data.apellido;
        fechaNacimiento = formatearFechaNacimiento(data.fechaNacimiento);
        domicilio = data.domicilio;
        telefono = data.telefono;
        mail = data.mail;
        grupoSanguineo = data.grupoSanguineo;
        ahijadoCompatible = data.ahijadoCompatible;

        // Llenar los campos del formulario con los datos del donante
        document.getElementById('nuevo_dni').value = dni;
        document.getElementById('nuevo_nombre').value = nombre;
        document.getElementById('nuevo_apellido').value = apellido;
        document.getElementById('nueva_fechaNacimiento').value = fechaNacimiento;
        document.getElementById('nuevo_grupoSanguineo').value = grupoSanguineo;
        document.getElementById('nuevo_ahijadoCompatible').value = ahijadoCompatible;
        document.getElementById('nuevo_domicilio').value = domicilio;
        document.getElementById('nuevo_telefono').value = telefono;
        document.getElementById('nuevo_mail').value = mail;

        console.log("\n------------------------")
        console.log("Donante seleccionado: " + data.nombre)
        console.log("------------------------\n")
        
    })

    .catch(error => {
        console.error('Error al obtener los datos del donante:', error);
        alert('❌ Error al obtener los datos del donante.');
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



//-------------------------- MODIFICAR DATOS DEL DONANTE SELECCIONADO --------------------------//
// FORMULARIO PARA MODIFICAR LOS DATOS DE UN DONANTE.
document.getElementById('formulario-modificar').addEventListener('submit', function (event){
    event.preventDefault(); // Evitamos que se envie el form

    const formData = new FormData();
    formData.append('ID', IDDonanteSeleccionado);
    formData.append('dni', document.getElementById('nuevo_dni').value);
    formData.append('nombre', document.getElementById('nuevo_nombre').value);
    formData.append('apellido', document.getElementById('nuevo_apellido').value);
    formData.append('fechaNacimiento', document.getElementById('nueva_fechaNacimiento').value);
    formData.append('domicilio', document.getElementById('nuevo_domicilio').value);
    formData.append('grupoSanguineo', document.getElementById('nuevo_grupoSanguineo').value);
    formData.append('telefono', document.getElementById('nuevo_telefono').value);
    formData.append('mail', document.getElementById('nuevo_mail').value);
    formData.append('ahijadoCompatible', document.getElementById('nuevo_ahijadoCompatible').value);

    // Realizamos la solicitud PUT al servidor
    fetch(URL + 'donantes/' + IDDonanteSeleccionado ,{
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
                throw new Error('Error al guardar las modificaciones del donante.');
            }
        })

        //Respuesta OK, muestra una alerta informando que el donante se agregó correctamente y limpia los campos del formulario para que puedan ser utilizados para un nuevo donante.
        .then(function (data) {
            alert('✅ Donante modificado correctamente.', data);
            console.log('Donante modificado correctamente.');
            limpiarFormulario();
        })

        // En caso de error, mostramos una alerta con un mensaje de error.
        .catch(function (error) {
            console.log("Hubo un problema con la petición Fetch:", error.message);
            console.error("Error al dar modificar donante:", error);

            alert('❌ Ocurrió un error al intentar modificar el donante.');
            document.getElementById("mensaje-error").style.color = "#C21518";
        })


})




// Restablece todas las variables relacionadas con el formulario a sus valores iniciales, lo que efectivamente "limpia" el formulario.
function limpiarFormulario() {
    document.getElementById('nuevo_dni').value = '';
    document.getElementById('nuevo_nombre').value = '';
    document.getElementById('nuevo_apellido').value = '';
    document.getElementById('nueva_fechaNacimiento').value = '';
    document.getElementById('nuevo_domicilio').value = '';
    document.getElementById('nuevo_grupoSanguineo').value = '';
    document.getElementById('nuevo_telefono').value = '';
    document.getElementById('nuevo_mail').value = '';
    document.getElementById('nuevo_ahijadoCompatible').value = '';

    IDDonanteSeleccionado = null;
    dni = '';
    nombre = '';
    apellido = '';
    fechaNacimiento = '';
    domicilio = '';
    telefono = '';
    mail = '';
    grupoSanguineo = '';
    ahijadoCompatible = '';
    document.querySelector('.contenido-texto').style.display = 'none';

    console.clear();
    console.log('Se modifico correctamente el donante.')
}



//-------------------------- ELIMINAR DONANTE --------------------------//
// Se utiliza para eliminar un donante
function eliminarDonante(donanteID) {
    // Se muestra un diálogo de confirmación. Si el usuario confirma, se realiza una solicitud DELETE al servidor a través de fetch(URL + 'donantes/${codigo}', {method: 'DELETE' }).
    if (confirm('¿Estás seguro de que quieres eliminar este donante?')) {
        fetch(URL + `donantes/${donanteID}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    // Si es exitosa (response.ok), elimina el donante y da mensaje de ok.
                    mostrarListadoDonante(); // Vuelve a obtener la lista de donantes para actualizar la tabla.
                    alert('✅ Donante eliminado correctamente.');
                }
            })
            // En caso de error, mostramos una alerta con un mensaje de error.
            .catch(error => {
                console.log(error.message);
                alert('❌ Ocurrió un error al intentar eliminar donante.');
            });
    }
}





