const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const multer = require('multer');
const axios = require('axios');
const https = require('https');


const bodyParser = require('body-parser')

const app = express();

const key = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCiSp9QSulJmQsy
Q6Fk9Tv0uRW82vBqCj/LySC+viGHFAm2DPbCVi4hY9EDNMNw4TExdSZ65dF6AnBN
Wol4KoXlAe85TEFyIrIacLTUSpcnu3kp0elW0q6bvZ7GnRXrE1d+c4m7hICuNTqU
Qp7rLTgaG1ggru2AuN/aXl97OFPrRmNH7gxSwi2pJMaTjhdDyF//YXgiJsewf3q/
nIobIM1JkMdSGnCfZ3A2tuh268tgXbzIwtUMDgmQ8lg9K+pU46WtxGHJHIe35D/9
owaWiL/KDmHUVZWs9aY7Bq4k4VTry5IcJMXNrBQYEaW1EqTR88x+AvvsHpjJX9fS
ns/6tN3BAgMBAAECggEACvTEtT6evy7gzZ+OiWqbherqJ8S+uY9APU6yXON9ufPF
Wrqcp1lQEJr/ekWZSB6RG/NPtLjydQKDIwW7WsHBe54E0LZwLfdfqgn1JeZ0i+R2
dTdMQbtEDxQ0YC4sqPZg+r1sDUe7CYe4ZlfqXfAV5dVLaXFwa+HkjYZqJb8TaJei
sMGfdBlbg1qIN8ohdY0vap+DXKE3cBvZFRko7VajGZgUWluVjwGnuSJhZjHvUg+g
l33bCCpqp29YIoU6V4UWvAb/9FiGMP5AjU7GYm6MLlf20iImcp9Jt/PfTunkYW6z
I1eLtzsSv6Lj95MTXJ95tWeRNivB0ca83qTcfptMkQKBgQDRjc/gMkm8Hgv+zp4C
Qo4e4z/fi3HJBpspGdJj3YdzrPo7Xyo+7oJKlc34/SV61DDuukPBtFdHFmOhcpXa
4nrGefn2KuuvaBvMsW7rO6sPWY5O9MV69gme2rBaZXuplugMj70fJTLGIcDagjYK
z7vYjtg93oBq4uqU+s/q9oHE5QKBgQDGQx3VFIX3kWuf7CXhEDId8OSrHZGZRVmc
8sBKx8xb2ts2YnX+qUiWqgbbk5S8XRkJR+1jRJMC8gXgXP6CR1Xl1JW1lXvcVQDk
WLiqtI5Eb9/sBeheLOED7eQS0dzd7DFZ9PDgask7caPZMZEnST5lGYF/3ewZttMn
GuemxMGjrQKBgFCZYeYSkYe4atazs9ScsrswnuWlZbtzPgSd+O0OTMXyN0DUxpPz
+ssjOVjWTS8kJDn+DIeZjKQ7+VAkmXzZ9W0Xh0vmkEYkHeUqLcZuacn6oSC/RqGX
tnWSGZh7RgghkdkbBBvRm+jXHK0uvgiEg/S0ZHnPdccmxiFNIuF1tM39AoGBAJ4/
eBJZ3UxrwDHXtaxc1wPbAUorwclK92o0wJNvwogWuh5AnNn1mMDZWbvtoixvSsqD
pNE1LPqO323kDClEcyWNdymG9WQ6XQnmXw+yKlQpz9t+I6j3vWr7eK4k4FwqaIHa
5mDaG2DdJeD4lVl8NtdPcnPzWL51lTiDWx9bsQvJAoGAEu9thtJ8Ku9Q8O0j/tNq
VmwqEcKcLq7gA9BcJJFRjTJl9JYxgNgAvRZL8BO4tIXZmyg9zICTizRBkHvaw52B
fmqsa1UceJnePXgFBlYFDDQdr4V+U45ahWU2uOkxccTlUS0bfzBgmPU251f3R8T7
+7ZHGN8ZlTphn7e4KYHQsYk=
-----END PRIVATE KEY-----`

const cert = `-----BEGIN CERTIFICATE-----
MIIEFTCCAv2gAwIBAgIUTJEePHPjMOIvvTW5cnW5qwDB4UcwDQYJKoZIhvcNAQEL
BQAwgagxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQH
Ew1TYW4gRnJhbmNpc2NvMRkwFwYDVQQKExBDbG91ZGZsYXJlLCBJbmMuMRswGQYD
VQQLExJ3d3cuY2xvdWRmbGFyZS5jb20xNDAyBgNVBAMTK01hbmFnZWQgQ0EgODU5
MzBmNjE2MjExNzBiZTZmNjA3NGZiYmEwYzBlN2QwHhcNMjMwMjEzMDIwMzAwWhcN
MzMwMjEwMDIwMzAwWjAiMQswCQYDVQQGEwJVUzETMBEGA1UEAxMKQ2xvdWRmbGFy
ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKJKn1BK6UmZCzJDoWT1
O/S5Fbza8GoKP8vJIL6+IYcUCbYM9sJWLiFj0QM0w3DhMTF1Jnrl0XoCcE1aiXgq
heUB7zlMQXIishpwtNRKlye7eSnR6VbSrpu9nsadFesTV35zibuEgK41OpRCnust
OBobWCCu7YC439peX3s4U+tGY0fuDFLCLakkxpOOF0PIX/9heCImx7B/er+cihsg
zUmQx1IacJ9ncDa26Hbry2BdvMjC1QwOCZDyWD0r6lTjpa3EYckch7fkP/2jBpaI
v8oOYdRVlaz1pjsGriThVOvLkhwkxc2sFBgRpbUSpNHzzH4C++wemMlf19Kez/q0
3cECAwEAAaOBuzCBuDATBgNVHSUEDDAKBggrBgEFBQcDAjAMBgNVHRMBAf8EAjAA
MB0GA1UdDgQWBBSI63FtZXkg5AxT+4DaiiH2EcseMTAfBgNVHSMEGDAWgBS6rsqY
cig4HrdnWspq+H7lVMr3rDBTBgNVHR8ETDBKMEigRqBEhkJodHRwOi8vY3JsLmNs
b3VkZmxhcmUuY29tLzYwZGE1MDliLWU2YjUtNDQ2My1hNjI0LTA5ZWZhMzZkNGRh
Yy5jcmwwDQYJKoZIhvcNAQELBQADggEBAGc5SdyVytUpLHEbFoPxCB0Z55salByM
i98NtA3E2h74tDuu+mLASeM+F6ju6vhe/jLUaFDOA0Yv4u7b376Lphcn5TnG42o9
+DC/ypPNXIqoj6s3g+2wSu5DsPMup61/HOFwous/RXiiduX27pUJrR0pvGgrfRtw
qjNgVNEiCfCFaItT79iStdELeZRYG//tWyX3zfZloqRh3frqJ0fqWNSwAbwse8cG
Vz+/e+XLaK4KDHPtpIRtlZMlDV3a+EZFElcL7pyN0nZfWuJBBVOcBnp/ZLfaD1RT
woSP9WusWQn3OGt5ZAM5WOz91gE62JKuaQ7mE0FmTr7/fc2AvatpRL8=
-----END CERTIFICATE-----`

const httpsServer = https.createServer({
    key,
    cert
}, app);

app.use(multer({}).any())
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.set('PORT', process.env.PORT || 3001);

app.use('/s3', require('./S3.js'))

app.get('', (req, res) => {
    res.send("hola")
})
app.post('/analisis-imagen', (req, res) => {


    if(!req.files) return res.status(500).send("no hay imagenes")
    //console.log(req.files)

    axios({
        url: `http://localhost:${process.env.PORT}/s3`,
        method: 'POST',
        haders: {
            'Content-Type': 'application/json'
        },
        data: {
            buffer: req.files[0].buffer
        }
    }).then(res => {
        console.log(res.data)
    }).catch(err => console.log("err"))

    res.send("hola")
})


httpsServer.listen(app.get('PORT'), () => console.log(`Escuchando servidor en puerto ${app.get('PORT')}...`))

