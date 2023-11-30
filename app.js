const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.static('public'));
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Lv++2023+',
    database: 'project_vespa'
});

connection.connect(function(error){
    if(error) {
        return console.error(`error: ${error.message}`)
    }
    console.log('Conectado correctamente a MySQL');
});

// Función para controlar los error de MySQL
function handleSQLError(response, error, result, callback) {
    if (error) {
        response.status(400).send(`error ${error.message}`);
        return;
    }
    callback(result);
}

// ===========>>>>> Z O N A  E N D P O I N T <<<<================ \\

//==========>>>> ENDOPOINT CARRUSEL

app.get(`/carrusel`, function(request, response){
    connection.query("SELECT * FROM carrusel", function(error, result, fields){
        handleSQLError(response, error, result, function(result){
            let carrusel = [];

            for (let i = 0; i < result.length; i++){
                carrusel[i] = result[i];
                console.log(result[i].id);
            }
            response.send(carrusel);
        })
    })
})


//==========>>>> ENDOPOINT PRODUCTOS

                //==========>>>> OBTENER TODOS LOS PRODUCTOS
app.get('/productos', function(request, response){
    connection.query("SELECT * FROM productos", function(error, result, fields){
        handleSQLError(response, error, result, function(result){
            let productos = [];

            for (let i = 0; i < result.length; i++){
                productos[i] = result[i];
               console.log(result[i].id);
            }
            response.send(productos);
        })
    })
})

                //==========>>>> OBTENER DETALLE DE UN PRODUCTOS
app.get('/productos/:id', function(request, response){
    const productoId = request.params.id;

    connection.query(`SELECT * FROM productos where id = "${productoId}"`, function(error, result, fields){
        handleSQLError(response, error, result, function(result){
            if (result.length == 0){
                response.send({});
            }
            else {
                response.send(result[0]);
            };
        });
    });
});

                //==========>>>> OBTENER UN PRODUCTO POR SU NOMBRE
app.get('/nombreproducto/:id', function(request, response){
    const nombreProducto = request.params.id;

    connection.query(`SELECT nombre FROM productos WHERE id = "${nombreProducto}"`, function(error, result, fields){
        handleSQLError(response, error, result, function(result){
            if (result.length == 0) {
                response.send({});
            }
            else {
                response.send(result[0]);
            }
        })
    })
})

                //==========>>>> OBTENER PRECIO DE UN PRODUCTO
app.get('/precioproducto/:id', function(request, response){
    const precioProducto = request.params.id;
    
    connection.query(`SELECT precio FROM productos WHERE id = "${precioProducto}"`, function(error, result, fields){
        handleSQLError(response, error, result, function(result){
            if (result.length == 0) {
                response.send({});
            }
            else {
                response.send(result[0]);
    }
        })
    })

})



//==========>>>> ENDOPOINT COMPRA
                //==========>>>>OBTENER COMPRA DESDE DB
app.get('/compras/:id', function(request, response) {
const compraId = request.params.id;
                
connection.query('SELECT * FROM compras WHERE id = ?', [compraId], function(error, result, fields) {
 handleSQLError(response, error, result, function(result) {
    if (result.length === 0) {
    response.send({});
    } else {
    response.send(result[0]);
    }
 });
 });
});
                

                //==========>>>>OBTENER RESUMEN TOTAL COMPRA DESDE DB
app.get('/compratotal', function(request, response){
    connection.query(`SELECT compra_id, SUM(total) AS total_precio FROM compra_productos WHERE compra_id = 1 GROUP BY compra_id`,
        function(error, result, fields){
            handleSQLError(response, error, result, function(result){
                if (result.length > 0) {
                    let totalPrecio = parseInt(result[0].total_precio);                    
                    response.send({ total: totalPrecio });
                    console.log(totalPrecio);
                } else {
                    response.send({ total: 0 });
                    console.log("No hay resultados para la compra especificada");
                }
            });
        }
    );
});


//==========>>>> ENDOPOINT TARJETAS DE CREDITO
                                //==========>>>>OBTENER DATOS DE TARJETAS




                                //==========>>>>OBTENER TARJETAS DE CRÉDITO POR ID
app.get('/tarjetas', function(request, response){
    connection.query(`SELECT * FROM metodo_pago`, function(error, result, fields){
        handleSQLError(response, error, result, function(result){
         let tarjetas = [];
         for (let i = 0; i < result.length; i++){
            tarjetas[i] = result[i];
         }
         response.send(tarjetas);
        })
    })
})

                                //==========>>>>REGISTRAR NUEVA TARJETA
app.post('/nueva_tarjeta', function(request, response){
    const nueva_tarjeta = request.body.nueva_tarjeta;
    const nuevo_titular = request.body.nuevo_titular;
    const tipo_tarjeta = request.body.tipo_tarjeta;
    const caducidad = request.body.caducidad;
    const cvv = request.body.cvv;

    connection.query('INSERT INTO metodo_pago (numero_tarjeta, titular, tipo, caducidad, cvv) VALUES (?, ?, ?, ?, ?)',
    [nueva_tarjeta, nuevo_titular, tipo_tarjeta, caducidad, cvv], function(error, result, fields){
        if(error){
            console.error('Error al introducir nueva tarjeta', error);
            response.status(500).send({message: 'Error al registrar nueva tarjeta'});
            return;
        }
        console.log('Tarjeta registrada correctamente');
    });
});



//==========>>>> AGREGAR UN PRODUCTO AL CARRITO. METODO POST. RUTA CARRITO/AGREGAR. FUNCION agregarAlCarrito

//==========>>>> VER CONTENIDO DEL CARRITO. METODO GET. RUTA CARRITO/. FUNCION verCarrito

//==========>>>> ELIMINAR PRODUCTO DEL CARRITO. METODO DELETE. RUTA CARRITO/:ID_PRODUCTO. FUNCION eliminarDelCarrito

//==========>>>> REALIZAR COMPRA. METODO POST. RUTA COMPRA/REALIZAR. FUNCION realizarCompra



/*  SEGUN ANOTACIONES DE ANA, HAY QUE CREAR:
ENDPOINT finalizar comrpa. Get/finalizarcompras/:id que devuelve la forma de pago de un usurio

INTERFAZ DE USUARIO
Crear un archivo finalizarcompra.js y definir las funciones al cargar al pagina. 


*/

// PARA GUARDAR TARJETA EN UN LOCALSTORAGE Y USAR EN PÁGINA SIGUIENTE;

// En página pasarela de pago
// function seleccionarTarjeta (numerotarjeta) {
// localStorage.setItem("numeroTarjeta", numerotarjeta);
// };

// En página realizar compra.html
// function mostrarTarjeta() {
//     const numeroTarjeta = localStorage.getItem(localStorage, "numeroTarjeta");
// };

// CIERRA EXPLICACION DE FUNCIONES PARA GUARDAR LOCAL STORAGE TARJETA

app.listen(8000, function(){
    console.log('Server is UP and RUNNING!!!!')
});
