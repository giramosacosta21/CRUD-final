console.log("-----------------------")
console.log("Formulario de Contacto")
console.log("-----------------------")

document.getElementById("enviar").addEventListener("click",function(e){

    // Prevenir el envío del formulario por defecto
    e.preventDefault();

    // Declarar variables y obtener los valores de los campos de entrada
    let inputNombre = document.getElementById("Nombre").value;
    let inputApellido = document.getElementById("Apellido").value;
    let inputTelefono = document.getElementById("Telefono").value;
    let inputEmail = document.getElementById("E-mail").value;
    let medioSeleccionado = document.getElementById("Medio").value;
    let horariosSeleccionados = document.querySelectorAll('input[name="Horario"]:checked');
    let inputConsulta = document.getElementById("Consulta").value;
    
    
    // Verificar si el campo de nombre está vacío
    if (inputNombre.trim() === "") {
        // Mostrar el mensaje de error
        document.getElementById("mensaje-error").style.color = "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese nombre";

        // Mostrar un mensaje de error por consola
        console.log("Nombre no ingresado");
        // Evitar que se envíe el formulario
        return false; 
        //devolver false si no se ingresó nombre
    
    }
    //Obtener el valor del campo de apellido
    //Verificar si el campo de apellido está vacío
    if (inputApellido.trim() === "") {
        document.getElementById("mensaje-error").style.color = "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese apellido";
        console.log("Apellido no ingresado");
        return false;
    }
    //Verificar si el campo de teléfono está vacío
    if (inputTelefono.trim() === ""){
        document.getElementById("mensaje-error").style.color = "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese teléfono";
        console.log("Teléfono no ingresado");
        return false;
    }
    //Obtener el valor del campo de E-mail
    //Verificar si el campo de E-mail está vacío
    let regex =/.+@(gmail|hotmail|yahoo|live)\.com/;
    if (!regex.test(inputEmail)){
        document.getElementById("mensaje-error").style.color = "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese E-mail";
        console.log("E-mail no ingresado");
        return false;
    }
    //Verificar medio seleccionado
    if (medioSeleccionado === "") {
        document.getElementById('mensaje-error').style.color= "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese un medio";
        console.log("Medio no ingresado")
    }
    //Verificar horario
    if (horariosSeleccionados.length === 0) {
        document.getElementById('mensaje-error').style.color= "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese un horario";
        console.log ("Horario no ingresado")
        return false;
    }
    //Verificar si el campo de Consulta está vacio
    if(inputConsulta.trim() ===""){
        document.getElementById("mensaje-error").style.color = "red";
        document.getElementById("mensaje-error").textContent = "*Ingrese consulta";
        console.log("Consulta no ingresada");
        return false;
    }
    else{
        console.log("-----------------------")
        console.log("Formulario de Contacto enviado con exito!")
        console.log("Datos enviados:")

        // Si el campo de nombre no está vacío, ocultar el mensaje de error
        document.getElementById("mensaje-error").style.color = " #FBDD7B";
        //el nombre ingresado se mostrara por consola
        console.log("El nombre ingresado: " + inputNombre);

        //Si el campo de apellido no está vacío
        console.log("El apellido ingresado: " + inputApellido)

        //Si el campo de teléfono no está vacío
        console.log("El teléfono ingresado: " + inputTelefono);

        //Si el campo de E-mail no está vacio
        console.log("El E-mail ingresado: " + inputEmail);

        //Si el campo de medio esta seleccionao
        console.log("El medio ingresado: " + medioSeleccionado);

        // Aquí puedes hacer lo que necesites con los horarios seleccionados
        console.log("Horarios seleccionados:");
        horariosSeleccionados.forEach(function(horario) {
            console.log(horario.value);
        });

        //Si el campo consulta no está vacío
        console.log("La consulta ingresada: " + inputConsulta);

        document.getElementById("formulario").reset();//Cuando el formulario se envia se resetea los campos 
    };


})


