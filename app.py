#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify
# Instalar con pip install flask-cors
from flask_cors import CORS
# Instalar con pip install mysql-connector-python
import mysql.connector
# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename
# No es necesario instalar, es parte del sistema standard de Python
import os
import time
from datetime import date, datetime

# Instalar con pip install flask-mysql
# from flaskext.mysql import MySQL
# from flask_mysql import MySQL


#--------------------------------------------------------------------

app =Flask(__name__)#name variable de Python que da nombre al pqte que estamos ejecutando
CORS(app)#Habilita CORS para todas las rutas de Flask

class DonarEnVida:
#--------------------------------------------------------------------
#Constructor de la clase
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host = host,
            user = user,
            password = password
        )
        self.cursor = self.conn.cursor()
        #Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f'USE {database}')
        except mysql.connector.Error as err:
        #Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f'CREATE DATABASE {database}')
                self.conn.database = database
            else:
              raise err
#Establecida la base, creamos la tabla si no existe
        # Creamos la tabla de ahijados si no existe
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS ahijados(
            ID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR (100) NOT NULL,
            fechaNacimiento DATE NOT NULL,
            edad INT(2) NOT NULL,
            enfermedad VARCHAR(100) NOT NULL,
            imagen_url VARCHAR(255),
            domicilio VARCHAR(100) NOT NULL,
            grupoSanguineo VARCHAR (3) NOT NULL,
            donanteCompatible INT(4))
            ''')
        # Creamos la tabla de donantes si no existe
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS donantes(
            ID INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
            dni INT(8) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            apellido VARCHAR (100) NOT NULL,
            fechaNacimiento DATE NOT NULL,
            edad INT(2) NOT NULL,
            domicilio VARCHAR(100) NOT NULL,
            telefono VARCHAR(12) NOT NULL,
            mail VARCHAR(100) NOT NULL,
            grupoSanguineo VARCHAR (3) NOT NULL,
            ahijadoCompatible INT(4))
            ''')
        self.conn.commit()

    #Cerrar el cursor inicial y abrir un nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        



#Método para calcular edad:
#obtener la fecha de nacimiento de cada ahijado y luego calcular la edad en años
    def calcularEdad(self, fechaNacimiento):
        # Convertir fechaNacimiento a objeto date
        fechaNaObj = datetime.strptime(fechaNacimiento, '%Y-%m-%d')
        fechaActual = date.today()
        edad = fechaActual.year - fechaNaObj.year - ((fechaActual.month, fechaActual.day) < (fechaNaObj.month, fechaNaObj.day))
        return edad


#-------------------------------------------------------------
#AHIJADO:
#-------------------------------------------------------------

    def agregar_ahijado(self, nombre, apellido, fechaNacimiento, enfermedad, imagen, domicilio, grupoSanguineo, donanteCompatible): 
        # Para calcular la edad utilizando el método calcularEdad
        edad = self.calcularEdad(fechaNacimiento)

        sql = "INSERT INTO ahijados (nombre, apellido, fechaNacimiento, edad, enfermedad, imagen_url, domicilio, grupoSanguineo, donanteCompatible) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (nombre, apellido, fechaNacimiento, edad, enfermedad, imagen, domicilio, grupoSanguineo, donanteCompatible)
        
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid #último Id registrado de ahijado 

    def modificar_ahijado(self, ID, nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, nueva_enfermedad, nueva_imagen, nuevo_domicilio, nuevo_grupoSanguineo, nuevo_donanteCompatible):
        # Para calcular la edad utilizando el método calcularEdad
        edad = self.calcularEdad(nueva_fechaNacimiento)  # Calcular la edad
        
        sql = "UPDATE ahijados SET nombre = %s, apellido = %s, fechaNacimiento = %s, edad = %s, enfermedad = %s, imagen_url =%s, domicilio = %s, grupoSanguineo = %s, donanteCompatible = %s WHERE ID = %s"
        valores = (nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, edad, nueva_enfermedad, nueva_imagen, nuevo_domicilio, nuevo_grupoSanguineo, nuevo_donanteCompatible, ID)
        
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def consultar_ahijado(self, ID):
    #Consultamos un ahijado a partir de su ID
        self.cursor.execute(f"SELECT * FROM ahijados WHERE ID = {ID}")
        return self.cursor.fetchone()

    def listar_ahijados(self):
        self.cursor.execute("SELECT * FROM ahijados")
        ahijados = self.cursor.fetchall()
        return ahijados

    def mostrar_ahijado(self, ID):
    #Mostramos los datos de un ahijado a partir de su ID
        ahijado = self.consultar_ahijado(ID)
        if ahijado:        
            print("-" * 40)
            print(f"ID...............:{ahijado['ID']}")
            print(f"nombre...........:{ahijado['nombre']}")
            print(f"apellido.........:{ahijado['apellido']}")
            print(f"fechaNacimiento.........:{ahijado['fechaNacimiento']}")
            print(f"edad.............:{ahijado['edad']}")
            print(f"enfermedad........:{ahijado['enfermedad']}")
            print(f"imagen.......:{ahijado['imagen_url']}")
            print(f"domicilio........:{ahijado['domicilio']}")
            print(f"grupoSanguineo...:{ahijado['grupoSanguineo']}")
            print(f"donanteCompatible..........:{ahijado['donanteCompatible']}")
            print("-" * 40)
        else:
            print("Ahijado no encontrado.")

    def eliminar_ahijado(self, ID):
        # Eliminamos un ahijado de la tabla a partir de su ID
        self.cursor.execute(f"DELETE FROM ahijados WHERE ID ={ID}")
        self.conn.commit()
        return self.cursor.rowcount > 0



#-------------------------------------------------------------
#DONANTE:
#-------------------------------------------------------------
    def agregar_donante(self, dni, nombre, apellido, fechaNacimiento, domicilio, telefono, mail, grupoSanguineo, ahijadoCompatible): 
        # Para calcular la edad utilizando el método calcularEdad
        edad = self.calcularEdad(fechaNacimiento)

        sql = "INSERT INTO donantes (dni, nombre, apellido, fechaNacimiento, edad, domicilio, telefono, mail, grupoSanguineo, ahijadoCompatible) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (dni, nombre, apellido, fechaNacimiento, edad, domicilio, telefono, mail, grupoSanguineo, ahijadoCompatible)
        
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid #último Id registrado de donante 

    def modificar_donante(self, ID, nuevo_dni, nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, nuevo_domicilio, nuevo_telefono, nuevo_mail, nuevo_grupoSanguineo, nuevo_ahijadoCompatible):
        # Para calcular la edad utilizando el método calcularEdad
        edad = self.calcularEdad(nueva_fechaNacimiento)  # Calcular la edad
        
        sql = "UPDATE donantes SET dni = %s, nombre = %s, apellido = %s, fechaNacimiento = %s, edad = %s, domicilio = %s, telefono = %s, mail = %s,  grupoSanguineo = %s, ahijadoCompatible = %s WHERE ID = %s"
        valores = (nuevo_dni, nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, edad, nuevo_domicilio, nuevo_telefono, nuevo_mail, nuevo_grupoSanguineo, nuevo_ahijadoCompatible, ID)
        

        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    def consultar_donante(self, ID):
    #Consultamos un donante a partir de su ID
        self.cursor.execute(f"SELECT * FROM donantes WHERE ID = {ID}")
        return self.cursor.fetchone()

    def listar_donantes(self):
        self.cursor.execute("SELECT * FROM donantes")
        donantes = self.cursor.fetchall()
        return donantes

    def mostrar_donante(self, ID):
    #Mostramos los datos de un donante a partir de su ID
        donante = self.consultar_donante(ID)
        if donante:        
            print("-" * 40)
            # print(f"ID...............:{donante['ID']}")
            print(f"DNI..............:{donante['dni']}")
            print(f"nombre...........:{donante['nombre']}")
            print(f"apellido.........:{donante['apellido']}")
            print(f"fechaNacimiento.........:{donante['fechaNacimiento']}")
            print(f"edad.............:{donante['edad']}")
            print(f"domicilio........:{donante['domicilio']}")
            print(f"telefono.........:{donante['telefono']}")
            print(f"mail.............:{donante['mail']}")
            print(f"grupoSanguineo...:{donante['grupoSanguineo']}")
            print(f"ahijadoCompatible..........:{donante['ahijadoCompatible']}")
            print("-" * 40)
        else:
            print("donante no encontrado.")

    def eliminar_donante(self, ID):
        # Eliminamos un donante de la tabla a partir de su ID
        self.cursor.execute(f"DELETE FROM donantes WHERE ID ={ID}")
        self.conn.commit()
        return self.cursor.rowcount > 0


#-------------------------------------------------------------
#Cuerpo del programa
#-------------------------------------------------------------
#Crear una instancia de la clase DonarEnVida
donarEnVida = DonarEnVida(host='giramosacosta21.mysql.pythonanywhere-services.com',user='giramosacosta21', password='vic59176035', database='giramosacosta21$miapp')


#------------------------- Testeando Métodos ------------------------- 
#Agregar ahijado
                      #nombre, apellido, fechaNacimiento, enfermedad, imagen_url, domicilio, grupoSanguineo, donanteCompatible
# donarEnVida.agregar_ahijado('Maria Laura', 'Esquivel', '2016-05-04' , 'Leucemia', '', 'Arenales 658', 'A+', 3)
# donarEnVida.agregar_ahijado('Jose Jacinto', 'Juarez', '2023-01-13', '', '', '25 de mayo', 'B-', 0)

#modificar
# donarEnVida.mostrar_ahijado(2)
# donarEnVida.modificar_ahijado(2, 'Juanita', 'Salomon', '2021-12-18', 'Linfoma de Hodgkin', 'ahijado-1.jpg', '25 mayo 325', 'AB-', 1)

#eliminar
# donarEnVida.eliminar_ahijado(4)

# ahijados = donarEnVida.listar_ahijados()


#Consultamos un ahijado y lo mostramos
# id_ahij = int(input("Ingrese el ID del ahijado: "))
# ahijado = donarEnVida.consultar_ahijado(id_ahij)
# if ahijado:
#      print(f"Ahijado encontrado: {ahijado ['ID']} - {ahijado['nombre']}")
# else:

#     print(f'Ahijado {id_ahij} no encontrado.')








#------------------------- CRUD -------------------------

#Carpeta para guardar las imagenes
ruta_destino = '/home/giramosacosta21/mysite/static/imagenes/'


#-------------------------------------------------------------
# CRUD DE AHIJADO:
#-------------------------------------------------------------

#http://localhost:5000/ahijados
@app.route("/ahijados", methods=["GET"])#ruta decorador... (a la función)
def listar_ahijados():#...de la función
    ahijados = donarEnVida.listar_ahijados()#llamada de donarEnVida
    return jsonify(ahijados)#convierte en json este dicc.

#http://localhost:5000/ahijados/ID
@app.route("/ahijados/<int:ID>", methods=["GET"])#ruta decorador (a la función)
def mostrar_ahijado(ID):
    try:
        ahijado = donarEnVida.consultar_ahijado(ID)
        if ahijado:
            return jsonify(ahijado), 200
        else:
            return "ahijado no encontrado", 404
    except Exception as e:
        return f"Error al consultar el ahijado: {str(e)}", 500  # excepción con un mensaje de error y código 500
        


@app.route("/ahijados", methods=["POST"])
def agregar_ahijado():
    #Recojo los datos del form
    try:
        #Recojo los datos del form
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        fechaNacimiento = request.form['fechaNacimiento']
        enfermedad = request.form['enfermedad']
        imagen = request.files['imagen']
        domicilio = request.form['domicilio']
        grupoSanguineo = request.form['grupoSanguineo']
        donanteCompatible = request.form['donanteCompatible']
        nombre_imagen = ""

        # Genero el nombre de la imagen
        nombre_imagen = secure_filename(imagen.filename)#Sanitiza el nombre del archivo(caracter no permitido, espacio de más, ect)
        nombre_base, extension = os.path.splitext(nombre_imagen)#Separa el nombre del archivo de la extensión
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"#Genero un nuevo nombre

        #Llamo al método agregar_ahijado para generar una nueva inserción de ahijado 
        nuevo_ID = donarEnVida.agregar_ahijado(nombre, apellido, fechaNacimiento, enfermedad, nombre_imagen, domicilio, grupoSanguineo, donanteCompatible)
        if nuevo_ID:
            imagen.save(os.path.join(ruta_destino, nombre_imagen))#guardo el ahijado
            #rspta Json
            return jsonify({"mensaje": "Ahijado agregado correctamente.","ID": nuevo_ID, "imagen": nombre_imagen}), 201
        else:
            return jsonify({"mensaje": "Error al agregar el ahijado."}), 500
    
    except KeyError as e:
        # Mostrara el mensaje error por si falta algún parámetro en el formulario
        return jsonify({
            # "mensaje": f"Error en el formulario: falta el campo {str(e)}"
            "mensaje": f"Error en el formulario: falta campos por completar."
        }), 400  # 400: Bad Request

    except Exception as e:
        # Manejar cualquier otra excepción no prevista
        return jsonify({
            "mensaje": f"Error al procesar la solicitud: {str(e)}"
        }), 500  # 500: Internal Server Error



@app.route("/ahijados/<int:ID>", methods=["PUT"])
def modificar_ahijado(ID):
#Se recuperan los nuevos datos del formulario
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nueva_fechaNacimiento = request.form.get("fechaNacimiento")
    nueva_enfermedad = request.form.get("enfermedad")
    nuevo_domicilio = request.form.get("domicilio")
    nuevo_grupoSanguineo = request.form.get("grupoSanguineo")
    nuevo_donanteCompatible = request.form.get("donanteCompatible")
    nombre_imagen = ""

# Verifica si se proporcionó una nueva imagen
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        # Procesamiento de la imagen
        nombre_imagen = secure_filename(imagen.filename)
        nombre_base, extension = os.path.splitext(nombre_imagen)
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}"

        # Guardar la imagen en el servidor
        try:
            imagen.save(os.path.join(ruta_destino, nombre_imagen))#Si le dimos una nueva imagen
        except Exception as error:
            print(f"Error al guardar la imagen: {error}")
            return jsonify({"mensaje": "Error al guardar la imagen del ahijado"}), 500
        

        # Busco el ahijado guardado
        ahijado = donarEnVida.consultar_ahijado(ID)
        if ahijado: # Si existe el ahijado...
            imagen_vieja = ahijado['imagen_url']
            # Armo la ruta a la imagen
            ruta_imagen = os.path.join(ruta_destino, imagen_vieja)#Join une la ruta con la imagen vieja
            # Y si existe la borro.
            if os.path.exists(ruta_imagen):
                try:
                    os.remove(ruta_imagen)#la imagen vieja
                except Exception as e:
                    print(f"Error al eliminar la imagen vieja: {e}")

    else:
        #Si no se proporciona una nueva imagen, usa la existente del ahijado
        ahijado = donarEnVida.consultar_ahijado(ID)
        if ahijado:
            nombre_imagen = ahijado['imagen_url']

# Se llama al método modificar_ahijado pasando el codigo del ahijado
#y los nuevos datos.
    if donarEnVida.modificar_ahijado(ID, nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, nueva_enfermedad, nombre_imagen, nuevo_domicilio, nuevo_grupoSanguineo, nuevo_donanteCompatible ):
        #Si la actualizacion es exitosa,se devuelve una rspta JSON con un mje de éxito y un código de estado HTTP 200 (OK)
        return jsonify({"mensaje": "Ahijado modificado"}), 200
    else:
        return jsonify({"mensaje": "Ahijado no encontrado"}), 403



@app.route("/ahijados/<int:ID>", methods=["DELETE"])
def eliminar_ahijado(ID):
# Primero, obtiene la información del ahijado para encontrar la imagen
    ahijado = donarEnVida.consultar_ahijado(ID)
    if ahijado:
# Eliminar la imagen asociada si existe
        ruta_imagen = os.path.join(ruta_destino, ahijado['imagen_url'])

        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

# Luego, elimina el ahijado de DonarEnVida
        if donarEnVida.eliminar_ahijado(ID):#Llamo a la función eliminar ahijado dentro de la clase DonarEnVida que ejecuta la sentencia eliminación SQL
            return jsonify({"mensaje": "Ahijado eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el ahijado"}),500

    else:
        return jsonify({"mensaje": "Ahijado no encontrado"}), 404






#-------------------------------------------------------------
# CRUD DE DONANTE:
#-------------------------------------------------------------

#http://localhost:5000/donantes
@app.route("/donantes", methods=["GET"])#ruta decorador... (a la función)
def listar_donantes():#...de la función
    donantes = donarEnVida.listar_donantes()#llamada de donarEnVida
    return jsonify(donantes)#convierte en json este dicc.

#http://localhost:5000/donantes/ID
@app.route("/donantes/<int:ID>", methods=["GET"])#ruta decorador (a la función)
def mostrar_donante(ID):
    try:
        donante = donarEnVida.consultar_donante(ID)
        if donante:
            return jsonify(donante), 200
        else:
            return "donante no encontrado", 404
    except Exception as e:
        return f"Error al consultar el donante: {str(e)}", 500  # excepción con un mensaje de error y código 500
        


@app.route("/donantes", methods=["POST"])
def agregar_donante():
    #Recojo los datos del form
    try:
        #Recojo los datos del form
        dni = request.form['dni']
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        fechaNacimiento = request.form['fechaNacimiento']
        domicilio = request.form['domicilio']
        telefono = request.form['telefono']
        mail = request.form['mail']
        grupoSanguineo = request.form['grupoSanguineo']
        ahijadoCompatible = request.form['ahijadoCompatible']

        #Llamo al método agregar_donante para generar una nueva inserción de donante 
        nuevo_ID = donarEnVida.agregar_donante(dni, nombre, apellido, fechaNacimiento, domicilio, telefono, mail, grupoSanguineo, ahijadoCompatible)
        if nuevo_ID:
            #guardo el donante 
            #rspta Json
            return jsonify({"mensaje": "Donante agregado correctamente.","ID": nuevo_ID}), 201
        else:
            return jsonify({"mensaje": "Error al agregar el donante."}), 500
    
    except KeyError as e:
        # Mostrara el mensaje error por si falta algún parámetro en el formulario
        return jsonify({
            # "mensaje": f"Error en el formulario: falta el campo {str(e)}"
            "mensaje": f"Error en el formulario: falta campos por completar."
        }), 400  # 400: Bad Request

    except Exception as e:
        # Manejar cualquier otra excepción no prevista
        return jsonify({
            "mensaje": f"Error al procesar la solicitud: {str(e)}"
        }), 500  # 500: Internal Server Error



@app.route("/donantes/<int:ID>", methods=["PUT"])
def modificar_donante(ID):
#Se recuperan los nuevos datos del formulario
    nuevo_dni = request.form.get("dni")
    nuevo_nombre = request.form.get("nombre")
    nuevo_apellido = request.form.get("apellido")
    nueva_fechaNacimiento = request.form.get("fechaNacimiento")
    nuevo_domicilio = request.form.get("domicilio")
    nuevo_telefono = request.form.get("telefono")
    nuevo_mail = request.form.get("mail")
    nuevo_grupoSanguineo = request.form.get("grupoSanguineo")
    nuevo_ahijadoCompatible = request.form.get("ahijadoCompatible")

# Se llama al método modificar_donante pasando el codigo del donante
#y los nuevos datos.
    if donarEnVida.modificar_donante(ID, nuevo_dni, nuevo_nombre, nuevo_apellido, nueva_fechaNacimiento, nuevo_domicilio, nuevo_telefono, nuevo_mail, nuevo_grupoSanguineo, nuevo_ahijadoCompatible):
        #Si la actualizacion es exitosa,se devuelve una rspta JSON con un mje de éxito y un código de estado HTTP 200 (OK)
        return jsonify({"mensaje": "Donante modificado"}), 200
    else:
        return jsonify({"mensaje": "Donante no encontrado"}), 403



@app.route("/donantes/<int:ID>", methods=["DELETE"])
def eliminar_donante(ID):
# Primero, obtiene la información del donante
    donante = donarEnVida.consultar_donante(ID)
    if donante:
# elimina el donante de DonarEnVida
        if donarEnVida.eliminar_donante(ID):#Llamo a la función eliminar donante dentro de la clase DonarEnVida que ejecuta la sentencia eliminación SQL
            return jsonify({"mensaje": "Donante eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el donante"}),500

    else:
        return jsonify({"mensaje": "Donante no encontrado"}), 404










if __name__ == "__main__": #Ejecuta la aplicación
    app.run(debug=True) 

































