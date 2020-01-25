let express = require('express'); 
let morgan = require('morgan');
let uuid = require('uuid');
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let app = express(); 

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
        return res.send(204);
    }
    next(); //aqui se puede evitar el next(),  
    //se usa cuando en lugar de app.use haces una funcion como middleware
});
let comentarios = [
    {
        id: uuid.v4(),
        titulo: "My first comment",
        contenido: "Contenido de un comentario, Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
        autor: "RockStar4523",
        fecha: new Date("2015-03-25")
    },
    {
        id: uuid.v4(),
        titulo: "My second comment",
        contenido: "Comentario, Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
        autor: "RockStar4523",
        fecha: new Date("2015-03-25")
    },
    {
        id: uuid.v4(),
        titulo: "Another comment",
        contenido: "Contenido de otro comentario, Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada libero, sit amet commodo magna eros quis urna.Nunc viverra imperdiet enim. Fusce est. Vivamus a tellus.",
        autor: "CatLover_4Ever",
        fecha: new Date("2015-03-25")
    }
];

//Endoint #1 GET blog-api/comentarios
app.get('/blog-api/comentarios', (req, res) => { 
    return res.status(200).json(comentarios);
});  

//Endpoint #2 GET /blog-api/comentarios-por-autor?autor=valor
app.get('/blog-api/comentarios-por-autor', (req, res) => {
    let autor = req.query.autor;
    let result = [];
    if (autor && autor !== '') {
        for (elements of comentarios) {
            if (elements.autor == autor) {
                result.push(elements);
            }
        }
        if (result.length>0)
            return res.status(200).json(result);
        else {
            res.statusMessage ="No existe el autor";
            return res.status(404).send();
        }
    }
    else {
        res.statusMessage ="Autor no proporcionado";
        return res.status(406).send();
    }
});  

//Endpoint  #3 POST /blog-api/nuevo-comentario
app.post('/blog-api/nuevo-comentario',jsonParser, (req, res) => {
    let autor = req.body.autor;
    let titulo= req.body.titulo;
    let contenido = req.body.contenido;
    if (contenido && contenido !== ''
        && titulo && titulo !== ''
        && autor && autor !== '') {
        let comm = {
            id: uuid.v4(),
            titulo: `${titulo}`,
            contenido: `${contenido}`,
            autor: `${autor}`,
            fecha: new Date()
        };
        comentarios.push(comm);
        console.log(comentarios);
        return res.status(201).json(comm);
    }
    else {
        res.statusMessage = "Campos incompletos";
        return res.status(406).send();
    }
});

//Endpoint #4 DELETE /blog-api/remover-comentario/:id
app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let id = req.params.id;
    let result = false;
    for (let i = 0; i < comentarios.length && !result; i++) {
        if (comentarios[i].id == id) {
            comentarios.splice(i, 1);
            result = true;
        }
    }
    if (result)
        return res.status(200).json({});
    else {
        res.statusMessage = 'Id not found';
        return res.status(404).send();
    }  
});


//Endpoint #5 PUT /blog-api/actualizar-comentario/:id
app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    let idP = req.params.id;
    let id = req.body.id;
    let titulo = req.body.titulo;
    let contenido = req.body.contenido;
    let autor = req.body.autor;
    let objSend = {};
    console.log(id);
    if (id && id !== '') {
        if (id === idP) {
            if ((contenido && contenido !== '')
                || (titulo && titulo !== '')
                || (autor && autor !== '')) {
                let exist = comentarios.find((elemento) => {
                    if (elemento.id == id) {
                        if (titulo)
                            elemento.titulo = titulo;
                        if (autor)
                            elemento.autor = autor;
                        if (contenido)
                            elemento.contenido = contenido;
                        objSend = elemento;
                        return true;
                    }
                });
                if (!exist) {
                    res.statusMessage = 'ID no existe en comentarios';
                    return res.status(404).send();
                }
                else {
                    console.log(objSend);
                    return res.status(202).json({ objSend });
                }
            }
            else {
                res.statusMessage = "No hay campo a modificar";
                return res.status(406).send();
            }
        }
        else {
            res.statusMessage = "No coinciden ids";
            return res.status(409).send();
        }
    }
    else {
        res.statusMessage = "Id no en body";
        return res.status(406).send();
    }
});

app.listen(8081, () => { 
    console.log("servidor en 8081")
}); 