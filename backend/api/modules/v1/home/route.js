var express = require('express');
var router = express.Router();
var home_model = require("./home_model");
var common = require("../../../config/common");
const middleware = require('../../../middleware/validators');
const { t } = require('localizify');


//APIs
const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        var image = `${Date.now()}-Social-Media-${file.originalname}`
        req.body.media_name = image;
        cb(null, image)
        
    }
});

var upload = multer({
    storage: storage
});

// add new post
router.post("/add-post",upload.single('media'), function (req, res) {
    var request = req.body
    var rules = {
        media:"required",
    }

    var message = {
        required: t('required')
    }

    request.media = request.media_name
    request.media_type = req.file.mimetype
    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.addPost(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

//list post details
router.post("/listing-post", function (req, res) {
    var request = req.body

    request.user_id = req.user_id
    
    home_model.listingPost(request, function (code, message, data) {
        common.response(req, res, code, message, data);
    })

});


// like post
router.post("/like-post", function (req, res) {
    var request = req.body

    var rules = {
        post_id : "required"
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.likePost(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});


router.post("/post-comment", function (req, res) {
    var request = req.body

    var rules = {
        post_id : "required",
        comment: "required"
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.postComment(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

router.post("/listing-comment", function (req, res) {
    var request = req.body

    var rules = {
        post_id : "required",
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.listingComment(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

router.post("/post-details", function (req, res) {
    var request = req.body
    var rules = {
        post_id : "required",
    }

    var message = {
        required: t('required')
    }

    request.user_id = req.user_id
    if (middleware.checkValidationRules(res, request, rules, message)) {
        home_model.postDetails(request, function (code, message, data) {
            common.response(req, res, code, message, data);
        })
    }

});

module.exports = router