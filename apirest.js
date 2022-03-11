let express = require("express");
let mysql = require("mysql2");
let app = express();
let cors = require('cors');

let connection = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Xopsuey2086_",
        database: "appbooks"
    });

connection.connect(function(error){
    if(error){
        console.log(error);
    }else{
        console.log('Conexion correcta.');
    }
});

app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

///POST REGISTRO / POST LOGIN

app.post("/registro", 
            function(request,response )
            {
                let nombre = request.body.nombre;
                let apellidos= request.body.apellidos;
                let correo = request.body.correo;
                let foto = request.body.foto;
                let password = request.body.password;
                let params = [nombre,apellidos,correo,foto,password]
                let sql = "INSERT INTO usuario (nombre, apellidos, correo, foto, password) VALUE (?);"
                console.log(params);
                connection.query(sql,[params], function (err, result)
                {
                    if (err) 
                    console.log(err);
                    else 
                    {
                        if (err) 
                            console.log(err);
                        else 
                        {
                            console.log(result);
                            if(result.insertId)
                                response.send(String(result.insertId));
                            else
                                response.send("-1")
                        }
                    }
                })
            })

app.post('/login', function(request, response) {
    let correo = request.body.correo;
    let password = request.body.password;
    let params = [correo,password]
    let sql = 'SELECT * FROM usuario WHERE correo = ? AND password = ?;';
    if (correo && password) {
        
        connection.query(sql, params, function(error, results) {
            
            if (results.length > 0) {
                
                response.send(results)
                
            } else {
                response.send('Correo o Contraseña incorrecto!');
            }			
            response.end();
        });
    } else {
        response.send('Por favor, introduzca correo y contraseña.');
        response.end();
    }
    
});

///GET LIBROS

app.get("/libros", 
        function(request,response)
        {
            let id = request.query.id;
            let idUser= request.query.id_usuario;
            let params= []
            let sql;

            if(id)
            {
                let sql = "SELECT * FROM libro WHERE id_libro = ? AND id_usuario= ?";
                params = [id, idUser];
                connection.query(sql,params, function (err, result) 
                {
                    if (err) 
                        console.log(err);
                    else 
                    {
                        response.send(result);
                        console.log(result)
                    }
                })
            }
            else
            {
                sql = 'SELECT * FROM libro WHERE id_usuario= ?;';
                params = [idUser]
                connection.query(sql,params, function (err, result) 
                {
                    if (err) 
                        console.log(err);
                    else 
                    {
                        response.send(result);
                    }
                })
            } 
        })

app.post("/libros",
        function(request,response)
        {
            let params = [request.body.id_usuario, request.body.titulo, request.body.tipo, request.body.autor, request.body.precio, request.body.foto];
            let sql = "INSERT INTO libro (id_usuario, titulo, tipo, autor, precio, foto) VALUES (?);";
            connection.query(sql,[params], function(err, result)
            {
                if (err) 
                    console.log(err);
                else 
                {
                    
                    console.log(result);
                    if(result.insertId)
                        response.send(String(result.insertId));
                    else
                        response.send("-1");
                }
            })
        })

app.put("/libros",
        function(request,response)
        {
            let id_libro = request.body.id_libro;
            let id_usuario = request.body.id_usuario;
            let titulo = request.body.titulo;
            let tipo = request.body.tipo;
            let autor = request.body.autor;
            let precio = request.body.precio;
            let foto = request.body.foto;
            let params = [id_usuario, titulo, tipo, autor, precio, foto, id_libro];
            let sql = `UPDATE libro SET id_usuario = COALESCE (?, id_usuario),
                        titulo = COALESCE (?, titulo),
                        tipo = COALESCE (?, tipo),
                        autor = COALESCE (?, autor),
                        precio = COALESCE (?, precio),
                        foto = COALESCE (?, foto)
                        WHERE id_libro = ?`;
            connection.query(sql,params, function (err, result) 
            {
                
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                    if(result.insertId)
                    {
                        console.log(result.insertId);
                        response.send(String(result.insertId));
                    }
                    else
                        response.send("-1")
                }
            })
        })

app.delete("/libros", 
            function(request,response)
            {
                let params = [request.query.id];
                console.log(request.query.id)
                let sql = 'DELETE FROM libro WHERE id_libro = ?;';
                connection.query(sql,params, function (err, result) 
                {
                if (err) 
                    console.log(err);
                else 
                {
                    console.log(result);
                        if(result.insertId)
                            response.send(String(result.insertId));
                        else
                            response.send("-1")
                }
                })
            })

app.use(function(req,res,next)
        {
            respuesta = {error: true, codigo: 404, mensaje: 'URL no encontrada'};
            res.status(404).send(respuesta);
        })



app.listen(3000);