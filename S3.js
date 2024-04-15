const express = require('express');
const AWS = require('aws-sdk');
const axios = require('axios')

const router = express.Router();

let imagenes = 0;


AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
})

const s3 = new AWS.S3({
    endpoint: process.env.AWS_ENDPOINT,
    s3ForcePathStyle: true,
    region:'BHS'
});


router.post('/', async (req, res) => {

    console.log("AAA")
    console.log(process.env.AWS_KEY_ID)
    if(!req.files) return res.status(500).send("no hay imagen")
    const image = req.files[0]
    console.log("image")
    if(!image) return res.status(500).send("no hay imagen2")
    console.log("image2")
    try {
        //const optImage = await sharp(image).jpeg({ quality: 30 })

        imagenes ++;

        const nombreImg = `feli${imagenes}.jpg`

        const uploadParams = {
            Bucket: 'raul',
            Key: nombreImg,
            Body: image.buffer,
            ContentType: 'image/jpeg',
        };

        console.log("upload")

        s3.upload(uploadParams, (err, data) => {
            if(err) return res.sendStatus(500);

            const url = `https://storage.bhs.cloud.ovh.net/v1/AUTH_f7c9c8c2c4b8407bac8be6ce0d8db86d/raul/${nombreImg}`;
            console.log("validar caras")
            axios({
                url: 'http://127.0.0.1:8001/validar/caras',
                method: 'POST',
                data: {
                    img: url
                },
                timeout:1000 * 30
            }).then(response => {
                if(response.data.NumeroCaras != null) {
                    res.send({url, numero_caras: response.data.NumeroCaras})
                } else {
                    console.log(response)
                    res.send({url}) 
                }
            }).catch(err => {
                console.log(err)
                res.send({url})
            })
        })
    }
    catch (e) {
        console.log(e)
        res.status(500).send("error en catch")
    }
})

module.exports = router;