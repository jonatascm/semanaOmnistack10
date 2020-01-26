const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringasArray');
const { findConnections, sendMessage } = require('../websocket');
//index, show, store, update, destroy
module.exports = {

    async index(req, res)  {
        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res)  {
        const { github_username, techs, latitude, longitude} = req.body;

        let dev = await Dev.findOne({github_username});

        if(!dev){
            const apiResponse = await axios.get(`http://api.github.com/users/${github_username}`);

            const {name = login, avatar_url, bio} = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            //Filter conections - max 10km distance and techs
            const sendSocketMessageTo = findConnections(
              { latitude, longitude},
              techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }


        return res.json(dev);
    },

    //Fazer quando der
    async update (req, res){
        return res.json({devs: []});
    },

    async destroy (req, res){
        return res.json({devs: []});
    },

}
