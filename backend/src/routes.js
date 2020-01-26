const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();


//Methods Http: GET, POST, PUT, DELETE
//Parameters Types
//Query Params: ?name=Joey => req.query (filters, pagination)
//Route Params: (PUT?DELETE) /:id => req.params
//Body: (POST/PUT) req.body

routes.get('/devs', DevController.index );
routes.post('/devs', DevController.store );
routes.get('/search',  SearchController.index);


module.exports = routes;
