var conn = require('./database');
var constant = require('./constant');
var middleware = require('../middleware/validators');
var nodemailer = require('nodemailer');
const {default: localizify} = require('localizify');
const { t } = require('localizify');

var common = {

    // Response
    response: function (req, res, code, message, data) {

        this.getMessage(req.lang,message,function(translated_message){

            var response = {
                code: code,
                message: translated_message,
                data: data
            };
    
            if (code == 0) {
                res.status(401).send(response);
                
            } else {
                res.status(200).send(response);
            }

        })
        
    },

    //get translated message
    getMessage: function(language,message,callback){
        callback(t(message.keyword,message.content));
    },

    checkEmail: function (email, callback) {

        var q = `select id from tbl_users where email = ? and is_active = 1 and is_deleted = 0;`

        conn.query(q, email, function (error, result) {
            if (!error && result.length > 0) {
                callback(true);
            }
            else {
                callback(false);
            }
        })

    },

    //Generate Random Token
    generateToken:(length = 10)=>{
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var token = '';
        for(var i = 0; i < length; i++) {
            token += chars[Math.floor(Math.random() * chars.length)];
        }
        return token;
    },
};


module.exports = common;