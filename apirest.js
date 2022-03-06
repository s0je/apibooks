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
        
        connection.query(sql, params, function(error, results, fields) {
            
            if (error) throw error;
            
            if (results.length > 0) {
                console.log(results.length)
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }			
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.use(function(req,res,next)
        {
            respuesta = {error: true, codigo: 404, mensaje: 'URL no encontrada'};
            res.status(404).send(respuesta);
        })



app.listen(3000);