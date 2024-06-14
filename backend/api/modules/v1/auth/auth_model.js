var conn = require("../../../config/database");
var common = require("../../../config/common");
var constant = require("../../../config/constant");
var md5 = require('md5');
var asyncLoop = require('node-async-loop');

var auth_model = {

    //Login
    login: function (request, callback) {

        var login = `select * from tbl_users where email = ? and password = ? and is_active = 1 and is_deleted = 0;`
        var condition = [request.email, md5(request.password)]

        conn.query(login, condition, function (error, result) {
            if (error) {
                callback('0', { keyword: 'sql_error', content: { error: "login" } }, error);
            } else {

                if (result.length > 0) {
                    var token = common.generateToken()
                    var update_token = `update tbl_users set token = '${token}' where id = ${result[0].id}`

                    conn.query(update_token, function (error, updateToken) {
                        if (!error && updateToken.affectedRows > 0) {
                            var data = {
                                name : result[0].name,
                                username : result[0].username,
                                token : token,
                                profile_image : result[0].profile_image
                            }
                            callback('1', { keyword: 'successfully_login', content: {} }, [data]);
                        } else {
                            callback('0', { keyword: 'sql_error', content: { error: "login" } }, error);
                        }
                    })

                } else {
                    callback('0', { keyword: 'Invalid_credential', content: {} }, result);
                }

            }
        })

    },

    //Signup
    signup: function (request, callback) {
        var queryData = {
            name: request.name,
            username : request.username,
            email: request.email,
            password: md5(request.password),
            profile_image : request.profile_image,
            token: common.generateToken()
        }

        common.checkEmail(request.email, function (response) {

            if (response) {
                callback('0', { keyword: 'email_exist', content: {} }, []);
            } else {

                var signup = `INSERT INTO tbl_users SET ?;`

                conn.query(signup, queryData, function (error, userData) {
                    if (error) {
                        callback('0', { keyword: 'sql_error', content: { error: "signup" } }, error);
                    } else {

                        var user = `Select name,username,token,profile_image from tbl_users where id = ${userData.insertId} and is_active = 1 and is_deleted = 0;`

                        conn.query(user, function (error, result) {
                            if (!error && result.length > 0) {
                                callback('1', { keyword: 'success_signup', content: {} }, result);
                            } else {
                                callback('0', { keyword: 'sql_error', content: { error: "get user data" } }, error);
                            }
                        })

                    }
                })
            }
        });
    },

    verifyToken: function (request, callback) {
        var user = `Select * from tbl_users where token = ${request.token} and is_active = 1 and is_deleted = 0;`
        conn.query(user, function (error, result) {
            if (!error && result.length > 0) {
                callback('1', { keyword: 'token_verify', content: {} }, result);
            } else {
                callback('0', { keyword: 'sql_error', content: { error: "token" } }, error);
            }
        })
    }

}

module.exports = auth_model