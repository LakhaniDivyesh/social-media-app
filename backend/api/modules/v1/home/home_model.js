var conn = require("../../../config/database");
var common = require("../../../config/common");
var constant = require("../../../config/constant");
// var md5 = require('md5');
var asyncLoop = require('node-async-loop');


var home_model = {

    //add new post
    addPost: function (request, callback) {

        var media_type = request.media_type.split("/");

        var queryData = {
            user_id: request.user_id,
            media: request.media,
            media_type: media_type[0],
            caption: request.caption || null,
        }

        var signup = `INSERT INTO tbl_post SET ?;`

        conn.query(signup, queryData, function (error, postData) {
            if (!error && postData.affectedRows > 0) {
                callback('1', { keyword: 'success_post', content: {} }, []);
            } else {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "post" } }, error);
            }
        })
    },

    listingPost: function (request, callback) {
        const post = `SELECT
                            p.*,CONCAT('${constant.IMAGE}',p.media) as media ,u.*, p.id AS post_id, u.id AS user_id,
                            IFNULL((
                              SELECT 
                                IF(l.user_id, '1','0') 
                              FROM tbl_post_like l 
                              WHERE l.post_id = p.id AND l.user_id = '${request.user_id}'), 
                            '0') AS is_like,
                            (
                              SELECT 
                                  (COUNT(id)) 
                              FROM 
                                  tbl_post_like l 
                              WHERE 
                                  l.post_id = p.id
                            ) AS total_likes, 
                            (
                              SELECT 
                                  (COUNT(id)) 
                              FROM 
                                  tbl_post_comment c 
                              WHERE 
                                  c.post_id = p.id AND c.is_active = 1 AND c.is_deleted = 0
                            ) AS total_comments 
                        FROM
                            tbl_post p
                        JOIN
                            tbl_users u
                        ON 
                            p.user_id = u.id
                        WHERE
                            u.is_active = 1 AND u.is_deleted = 0 AND p.is_active = 1 AND p.is_deleted = 0
                        ORDER BY 
                            p.created_at desc;`;
        conn.query(post, function (error, posts) {
            if (!error && posts.length > 0) {
                callback("1", { keyword: "post_success", content: "" }, posts);
            } else if (!error) {
                callback("2", { keyword: "no_data", content: "" }, []);
            } else {
                console.log(error);
                callback(
                    "0",
                    { keyword: "error", content: { error: "fetching the posts" } },
                    []
                );
            }
        });
    },

    // Like post
    likePost: function (request, callback) {
        const  post_id  = request.post_id;

        const likeData = {
            post_id: post_id,
            user_id: request.user_id,
        };

        const likeCheck = `SELECT 
                            * 
                        FROM
                            tbl_post_like 
                        WHERE 
                            post_id = '${post_id}' AND user_id = '${request.user_id}';`;

        const like = `INSERT INTO tbl_post_like SET ?;`;
        const removeLike = `DELETE FROM tbl_post_like WHERE id = ?;`;

        conn.query(likeCheck, function (error, checkLike) {
            if (!error && checkLike.length === 0) {
                conn.query(like, [likeData], function (error, liked) {
                    if (!error && liked.insertId > 0) {
                        callback("1", { keyword: "like_success", content: "" }, []);
                    } else {
                        console.log(error);
                        callback(
                            "0",
                            { keyword: "sql_error", content: { error: "liking the post" } },
                            []
                        );
                    }
                });
            } else if (!error && checkLike.length > 0) {
                conn.query(removeLike, [checkLike[0].id], function (error, removed) {
                    if (!error && removed.affectedRows > 0) {
                        callback("1", { keyword: "unlike_success", content: "" }, []);
                    } else {
                        callback(
                            "0",
                            { keyword: "sql_error", content: { error: "unliking the post" } },
                            []
                        );
                    }
                });
            } else {
                callback(
                    "0",
                    { keyword: "sql_error", content: { error: "checking the like status" } },
                    []
                );
            }
        });
    },

    postComment:function(request,callback){
        var queryData = {
            user_id: request.user_id,
            post_id : request.post_id,
            comment : request.comment
        }

        var comment = `INSERT INTO tbl_post_comment SET ?;`

        conn.query(comment, queryData, function (error, postData) {
            if (!error) {
                callback('1', { keyword: 'success_comment', content: {} }, []);
            } else {
                callback('0', { keyword: 'sql_error', content: { error: "comment" } }, []);
            }
        })
    },

    listingComment:function(request,callback){
        var comment = `Select c.*,u.* from tbl_post_comment c join tbl_users u on c.user_id = u.id where c.Post_id = ${request.post_id} order by c.created_at`

        conn.query(comment, function (error, result) {
            if (!error ) {
                callback('1', { keyword: 'success_comment_listing', content: {} }, result);
            } else {
                console.log(error);
                callback('0', { keyword: 'sql_error', content: { error: "listing comment" } }, []);
            }
        })
    },

    postDetails:function(request,callback){
        const post = `SELECT
                            p.*, CONCAT('${constant.IMAGE}',p.media) as media, u.*, p.id AS post_id, u.id AS user_id,
                            IFNULL((
                              SELECT 
                                IF(l.user_id, '1','0') 
                              FROM tbl_post_like l 
                              WHERE l.post_id = p.id AND l.user_id = '${0}'), 
                            '0') AS is_like,
                            (
                              SELECT 
                                  (COUNT(id)) 
                              FROM 
                                  tbl_post_like l 
                              WHERE 
                                  l.post_id = p.id
                            ) AS total_likes, 
                            (
                              SELECT 
                                  (COUNT(id)) 
                              FROM 
                                  tbl_post_comment c 
                              WHERE 
                                  c.post_id = p.id AND c.is_active = 1 AND c.is_deleted = 0
                            ) AS total_comments 
                        FROM
                            tbl_post p
                        JOIN
                            tbl_users u
                        ON 
                            p.user_id = u.id
                        WHERE
                            p.id = ${request.post_id} and u.is_active = 1 AND u.is_deleted = 0 AND p.is_active = 1 AND p.is_deleted = 0
                        ORDER BY 
                            p.created_at desc;`;
        conn.query(post, function (error, posts) {
            if (!error && posts.length > 0) {
                callback("1", { keyword: "post_success", content: "" }, posts);
            } else if (!error) {
                callback("2", { keyword: "no_data", content: "" }, []);
            } else {
                console.log(error);
                callback(
                    "0",
                    { keyword: "error", content: { error: "fetching the posts" } },
                    []
                );
            }
        });
    }
    // //Listing category
    // listingCategory: function (request, callback) {
    //     var category = `select id,name,image from tbl_category where parent_id IS NULL and is_active = 1 and is_deleted = 0`

    //     conn.query(category, function (error, result) {

    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing category" } }, error);
    //         } else {
    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },

    // //Listing sub-category
    // listingSubCategory: function (request, callback) {
    //     var sub_category = `select id,parent_id,name,image from tbl_category where parent_id = ${request.category_id} and is_active = 1 and is_deleted = 0`

    //     conn.query(sub_category, function (error, result) {
    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing sub-category" } }, error);
    //         } else {
    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },

    // //Listing multi sub-category
    // multiCate: function (request, callback) {

    //     var catData = (request.category_id == undefined || request.category_id == null || request.category_id.length == 0) ? [{ "value": 0 }] : request.category_id
    //     var sub_category = `select id,parent_id,name,image from tbl_category where parent_id IN (${catData
    //         .map((data) => `'${data.value}'`)
    //         .join(",")}) and is_active = 1 and is_deleted = 0`

    //     conn.query(sub_category, function (error, result) {
    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing sub-category" } }, error);
    //         } else {
    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },

    // //Listing sub-category
    // listingBoth: function (request, callback) {
    //     var both = `select id,name,image from tbl_category where parent_id IS NULL and is_active = 1 and is_deleted = 0;`

    //     conn.query(both, function (error, result) {

    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing category and sub category" } }, error);
    //         } else {

    //             if (result.length > 0) {
    //                 asyncLoop(
    //                     result,
    //                     function (item, next) {
    //                         const subCategory = `SELECT id, parent_id, name, image FROM tbl_category WHERE parent_id = '${item.id}' AND is_active = 1 AND is_deleted = 0;`;

    //                         conn.query(subCategory, function (error, subcategories) {
    //                             if (!error && subcategories.length > 0) {
    //                                 item.subcategories = subcategories;
    //                                 next();
    //                             } else if (!error) {
    //                                 next();
    //                             } else {
    //                                 next(error);
    //                             }
    //                         });
    //                     },
    //                     function (error) {
    //                         if (error) {
    //                             callback("0", { keyword: "sql_error", content: { error: "fetching the categories" }, }, null);
    //                         } else {
    //                             callback("1", { keyword: "list_success", content: "" }, result);
    //                         }
    //                     }
    //                 );
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }

    //         }
    //     })
    // },

    // //Listing product
    // listingProduct: function (request, callback) {

    //     var sub_id = ``;
    //     if (request.sub_category_id > 0) {
    //         sub_id = `category_id = ${request.sub_category_id} and `
    //     }

    //     var both = `select id,category_id,name,price,image from tbl_product where ${sub_id} is_active = 1 and is_deleted = 0;`

    //     conn.query(both, function (error, result) {

    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing product" } }, error);
    //         } else {

    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },

    // //filter
    // filterProduct: function (request, callback) {


    //     if (request.category_id == undefined || request.category_id == null || request.category_id.length == 0) {
    //         var cat_id = ``
    //     } else {
    //         var cat_id = `c.parent_id IN (${request.category_id
    //             .map((data) => `'${data.value}'`)
    //             .join(",")}) and`
    //     }

    //     if (request.sub_id == undefined || request.sub_id == null || request.sub_id.length == 0) {
    //         var sub_cat_id = ``
    //     } else {
    //         var sub_cat_id = `p.category_id IN (${request.sub_id
    //             .map((data) => `'${data.value}'`)
    //             .join(",")}) and`
    //     }


    //     var both = `select p.id,p.category_id,p.name,p.price,p.image from tbl_product p join tbl_category c on p.category_id = c.id where ${cat_id} ${sub_cat_id} p.is_active = 1 and p.is_deleted = 0;`

    //     conn.query(both, function (error, result) {

    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "filtering product" } }, error);
    //         } else {

    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },

    // //Listing product
    // listingProductDetails: function (request, callback) {
    //     var both = `select id,category_id,name,price,description,image from tbl_product where id = ${request.product_id} and is_active = 1 and is_deleted = 0;
    //     `

    //     conn.query(both, function (error, result) {

    //         if (error) {
    //             callback('0', { keyword: 'sql_error', content: { error: "listing product details" } }, error);
    //         } else {

    //             if (result.length > 0) {
    //                 callback('1', { keyword: 'data_found', content: {} }, result);
    //             } else {
    //                 callback('1', { keyword: 'data_not_found', content: {} }, result);
    //             }
    //         }
    //     })
    // },



}

module.exports = home_model