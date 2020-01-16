const { Router } = require('express');
const DevController = require('./controllers/DevController');

const routes = Router();


//Métodos Http: GET, POST, PUT, DELETE
//Tipos de parâmetros
//Query Params: ?name=Joey => req.query (filtros, paginação)
//Route Params: (PUT?DELETE) /:id => req.params
//Body: (POST/PUT) req.body

routes.get('/devs', DevController.index );
routes.post('/devs', DevController.store );


module.exports = routes;