var Validator = require("Validator");
var conn = require('../config/database');

const {default: localizify} = require('localizify');
const { t } = require('localizify');

var en = require('../language/en');
var hi = require('../language/hi');

// var cryptoLib = require('cryptlib');
// var shakey = cryptoLib.getHashSha256(process.env.KEY, 32);
// var lodash = require('lodash');

var bypassMethods = new Array('login','signup','post-details','listing-comment');

var middleware = {

    checkValidationRules : function(res,request,rules,message){
         
        const v = Validator.make(request,rules,message);

        if(v.fails()){
            const errors = v.getErrors();
            
            var error = "";
            for(var key in errors){
                error = errors[key][0];
                break;
            }

            var response_data = {
                code : "0",
                message:error,
                data:[]
            }

            res.status(400);
            res.send(response_data);
            

            return false;
        }else{
            return true;
        }
    },

    // validateApiKey:function(req,res,callback){

    //     var api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != '') ? req.headers['api-key'] : '';
        
    //     if(api_key != ''){

    //         try {
    //             var api_dec = cryptoLib.decrypt(api_key, shakey, process.env.IV);

    //             if(api_dec == process.env.API_KEY){
    //                 callback()
    //             }else{
    //                 var response ={
    //                     code : "-1",
    //                     message : t('invalid_api_key')
    //                 }

    //                 middleware.encryption(response,function(response){
    //                     res.status(401);
    //                     res.send(response);
    //                 })
                    
    //             }

    //         } catch (error) {
    //             var response ={
    //                 code : "-1",
    //                 message : t('invalid_api_key')
    //             }

    //             middleware.encryption(response,function(response){
    //                 res.status(401);
    //                 res.send(response);
    //             })
    //         }

    //     }else{
    //         var response ={
    //             code : "-1",
    //             message : t('invalid_api_key')
    //         }

    //         middleware.encryption(response,function(response){
    //             res.status(401);
    //             res.send(response);
    //         })
    //     }

    // },

    validateHeaderToken: function(req,res,callback){

        var header_token = (req.headers['token'] != undefined && req.headers['token'] != '') ? req.headers['token'] : ''

        var path_data = req.path.split('/');
        if(bypassMethods.indexOf(path_data[4]) === -1){

            if(header_token != ''){

                try {
                    // header_token = cryptoLib.decrypt(header_token,shakey,process.env.IV);
                  conn.query(`select * from tbl_users where token = ?`,[header_token],function(error,result){
                    if(!error && result.length > 0 ){
                        req.user_id = result[0].id;
                        callback();
                    }else{
                        var response ={
                            code : "-1",
                            message : t('invalid_token')
                        }
            
                        res.status(401);
                        res.send(response);
                    }
                  });
                } catch (error) {
                    var response ={
                        code : "-1",
                        message : t('invalid_token')
                    }
        
                    res.status(401);
                    res.send(response);
                }

            }else{
                var response ={
                    code : "-1",
                    message : t('invalid_token')
                }
    
                res.status(401);
                res.send(response);
            }
        }else{
            callback();
        }

    },

    extractHeaderLanguage : function(req,res,callback){
        var headerLang = req.headers['accept-language'] || 'en'
        req.lang = headerLang;
        req.language = (headerLang == 'en') ? 'en' : 'hi' 

        localizify
        .add('en' , en)
        .add('hi', hi)
        .setLocale(headerLang);

        callback();
    },

    // decryption: function(req,res,callback){
        
    //     if(!lodash.isEmpty(req.body) && typeof req.body != undefined){
    //         try {
    //            req.body = JSON.parse(cryptoLib.decrypt(req.body,shakey,process.env.IV));
    //            callback(); 
    //         } catch (error) {
    //             var response = {
    //                 code : "0",
    //                 message : t('data_not_text')
    //             }
    //             middleware.encryption(response,function(response){
    //                 res.status(401);
    //                 res.send(response);
    //             })
                
    //         }
    //     }else{
    //         callback();

    //     }
    // },

    // encryption:function(response_data,callback){
    //     var response = cryptoLib.encrypt(JSON.stringify(response_data),shakey,process.env.IV);
    //     callback(response);
    // }


}

module.exports = middleware