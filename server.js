const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')

const app = express();

const dotenv = require('dotenv');
dotenv.config();



// (async () => {

//     const usersReq = require("./dbo/user");

//     const [users] = await usersReq.SelecionaUsuarios()

//     console.log(users[0]);
// })();
const client = redis.createClient(6379)


client.on('error', err => {
    console.log('Error: ' + err)
})

app.get('/photos', (req, res) => {

    // Chave para armazenar resultados no Redis store
    const photosRedisKey = 'user:photos';
    const id = req.params.id

    return client.get(photosRedisKey, (err, photos) => {

        //Verifica se ja nao existe a chave no Redis
        if (photos) {
            return res.json({
                source: 'cache',
                data: JSON.parse(photos)
            });
        } else {
            fetch('https://jsonplaceholder.typicode.com/photos')
                .then(response => response.json())
                .then(photos => {
                    //Salva o retorno da API no Redis e expira em 3600 segundos
                    client.setex(photosRedisKey, 3600, JSON.stringify(photos));
                    return res.json({
                        source: 'api',
                        data: photos
                    });
                })
                .catch(error => {

                    console.log(error);

                    return res.json(error.toString());

                })

        }

    })

})


// app.get('/photo/:id', (req, res) => {

//     // Chave para armazenar resultados no Redis store
//     const idPhoto = req.params.id
//     const photosRedisKey = 'user:photo:' + idPhoto;


//     return client.get(photosRedisKey, (err, photos) => {

//         //Verifica se ja nao existe a chave no Redis
//         if (photos) {
//             return res.json({
//                 source: 'cache',
//                 data: JSON.parse(photos)
//             });
//         } else {
//             fetch('https://jsonplaceholder.typicode.com/photos/' + idPhoto)
//                 .then(response => response.json())
//                 .then(photos => {
//                     //Salva o retorno da API no Redis e expira em 3600 segundos
//                     client.setex(photosRedisKey, 3600, JSON.stringify(photos));
//                     return res.json({
//                         source: 'api',
//                         data: photos
//                     });
//                 })
//                 .catch(error => {

//                     console.log(error);

//                     return res.json(error.toString());

//                 })

//         }

//     })

// })

app.listen(3000, () => {
    console.log('Server listening on port: ', 3000);
})