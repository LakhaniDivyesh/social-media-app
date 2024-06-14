require('dotenv').config();

var express = require('express');
var cors = require('cors');
let app = express();

// app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors())


// const bodyParser = require('body-parser')

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
app.use('/public/images', express.static(__dirname + '/public/images'));



app.use('/', require('./middleware/validators').extractHeaderLanguage);
// app.use('/', require('./middleware/validators').validateApiKey);
app.use('/', require('./middleware/validators').validateHeaderToken);
// app.use('/', require('./middleware/validators').decryption);

var auth = require("./modules/v1/auth/route");
app.use('/api/v1/auth', auth);

var home = require("./modules/v1/home/route");
app.use('/api/v1/home', home);

try {
    app.listen(process.env.PORT)
    console.log("Server⚡: " + process.env.PORT);
} catch (error) {
    console.log("failed" + error);
}