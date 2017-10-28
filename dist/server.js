/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __webpack_require__(11);
exports.mongoURL = db_1.mongoURL;
const address_1 = __webpack_require__(12);
exports.ip = address_1.ip;
exports.port = address_1.port;
const secret_1 = __webpack_require__(13);
exports.secret = secret_1.secret;
const register_1 = __webpack_require__(14);
exports.register = register_1.register;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __webpack_require__(18);
exports.UserModel = userModel_1.UserModel;
const articleModel_1 = __webpack_require__(21);
exports.ArticleModel = articleModel_1.ArticleModel;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("passport");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("mongoose-unique-validator");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __webpack_require__(23);
const debug = __webpack_require__(0);
const config = __webpack_require__(2);
let log = debug('paraboloid:server:API:auth');
class Authorization {
    getTokenFromHeader(req) {
        log("authorization header: %o", req.headers.authorization);
        if (req.headers.authorization) {
            let auth = req.headers.authorization.toString();
            if (auth.split(' ')[0] === 'Token' || auth.split(' ')[0] === 'Bearer')
                return auth.split(' ')[1];
        }
        return null;
    }
    get required() {
        return jwt({
            secret: config.secret,
            userProperty: 'payload',
            getToken: this.getTokenFromHeader
        });
    }
    get optional() {
        return jwt({
            secret: config.secret,
            userProperty: 'payload',
            getToken: this.getTokenFromHeader
        });
    }
}
exports.Authorization = Authorization;
;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(1);
const bodyParser = __webpack_require__(9);
const morgan = __webpack_require__(10);
const mongoose = __webpack_require__(4);
const debug = __webpack_require__(0);
const config = __webpack_require__(2);
const routes = __webpack_require__(15);
let log = debug('paraboloid:server');
log('>>> express');
let app = express();
log('>>> bodyParser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
log('>>> mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, { useMongoClient: true });
log('>>> extra logging');
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    mongoose.set('debug', true);
}
log('>>> api routes');
app.use(routes.api);
log('>>> dummy route');
app.use(function (req, res, next) {
    res.status(404).send('Not Found');
});
log('>>> error handler');
app.use(function (err, req, res, next) {
    log('Error %o (%o): %o', res.statusCode, err.name, err.message);
    res.status(res.statusCode || 500).send(err.message);
});
log('>>> listener');
let server = app.listen(config.port, config.ip, function () {
    console.log('Listening on ' +
        server.address().address + ':' + server.address().port);
});


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
let log = debug('paraboloid:server:config:mongo');
let mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL ||
    process.env.MONGO_URL ||
    'mongodb://localhost/paraboloid';
exports.mongoURL = mongoURL;
log('original mongoURL %o', mongoURL);
if (mongoURL === undefined && process.env.DATABASE_SERVICE_NAME) {
    let mongoServiceName = process.env.DATABASE_SERVICE_NAME;
    if (mongoServiceName)
        mongoServiceName.toUpperCase();
    let mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    let mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    let mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    let mongoUser = process.env[mongoServiceName + '_USER'];
    let mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    if (mongoHost && mongoPort && mongoDatabase) {
        exports.mongoURL = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword)
            exports.mongoURL = mongoURL += mongoUser + ':' + mongoPassword + '@';
        exports.mongoURL = mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
}
log('new mongoURL %o', mongoURL);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
let log = debug('paraboloid:server:config:address');
exports.ip = process.env.IP ||
    process.env.OPENSHIFT_NODEJS_IP ||
    '0.0.0.0';
log('ip %o', exports.ip);
exports.port = parseInt(process.env.PORT ||
    process.env.OPENSHIFT_NODEJS_PORT ||
    '8080');
log('port %o', exports.port);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
let log = debug('paraboloid:server:config:secret');
exports.secret = process.env.SECRET || 'secret';
log('secret %o', exports.secret);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
let log = debug('paraboloid:server:config:register');
exports.register = process.env.REGISTER || false;
log('Registration allowed: %o', exports.register);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __webpack_require__(16);
exports.api = api_1.api;
api_1.api.use('/api', api_1.api);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(1);
const passport = __webpack_require__(5);
const users_1 = __webpack_require__(17);
const articles_1 = __webpack_require__(24);
const tags_1 = __webpack_require__(25);
const errors_1 = __webpack_require__(26);
const strategy_1 = __webpack_require__(27);
passport.use(strategy_1.strategy);
let api = express.Router();
exports.api = api;
api.use('/users', users_1.users);
api.use('/articles', articles_1.articles);
api.use('/tags', tags_1.tags);
api.use(errors_1.errors);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(1);
const passport = __webpack_require__(5);
const debug = __webpack_require__(0);
const config = __webpack_require__(2);
const models_1 = __webpack_require__(3);
const Authorization_1 = __webpack_require__(7);
let log = debug('paraboloid:server:API:users');
let router = express.Router();
exports.users = router;
let auth = new Authorization_1.Authorization();
router.post('/', (req, res, next) => {
    log('>>> post /api/users/ with body %o', req.body);
    if (!config.register) {
        log('Registration is not allowed');
        return res.status(405).send({ errors: { registration: 'not allowed' } });
    }
    let user = new models_1.UserModel(req.body.user);
    if (req.body.user.password)
        user.setPassword(req.body.user.password);
    user.save().then(() => {
        let json = user.getAuthJSON();
        log('User successfully saved: %o', json);
        return res.status(201).json({ user: json });
    }).catch(next);
});
router.post('/login', (req, res, next) => {
    log('>>> post /api/users/login with body %o', req.body);
    let bodyUser = req.body.user;
    if (!bodyUser) {
        log('No user found');
        return res.status(422).json({ errors: { user: 'not found' } });
    }
    if (!bodyUser.email) {
        log('No email for user %o found', bodyUser.username);
        return res.status(422).json({ errors: { email: "can't be blank" } });
    }
    if (!bodyUser.password) {
        log('No password for user %o found', bodyUser.username);
        return res.status(422).json({ errors: { password: "can't be blank" } });
    }
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            log('Error occured: %o', err);
            return next(err);
        }
        if (user) {
            let json = user.getAuthJSON();
            log('User found: %o', json);
            return res.json({ user: json });
        }
        else {
            log('Information: %o', info);
            return res.status(422).json({ errors: info });
        }
    })(req, res, next);
});
router.put('/user', auth.required, (req, res, next) => {
    log('>>> put /api/users/user with body %o/payload %o', req.body, req.payload);
    models_1.UserModel.findById(req.payload.id).then((user) => {
        let bodyUser = req.body.user;
        if (user) {
            log('User %o will be updated', user.username);
            if (bodyUser) {
                if (bodyUser.username)
                    user.username = bodyUser.username;
                if (bodyUser.email)
                    user.email = bodyUser.email;
                if (bodyUser.bio)
                    user.bio = bodyUser.bio;
                if (bodyUser.image)
                    user.image = bodyUser.image;
                if (bodyUser.password)
                    user.setPassword(bodyUser.password.substr(100));
            }
            user.save().then(() => {
                let json = user.getAuthJSON();
                log('User was updated: %o', json);
                return res.status(200).json({ user: json });
            }).catch(next);
        }
        else {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
    }).catch(next);
});
router.get('/user', auth.required, (req, res, next) => {
    log('>>> get /api/users/user with payload %o', req.payload);
    models_1.UserModel.findById(req.payload.id).then((user) => {
        if (user) {
            let json = user.getAuthJSON();
            log('User was read: %o', json);
            return res.status(200).json({ user: json });
        }
        else {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
    }).catch(next);
});
router.delete('/user', auth.required, (req, res, next) => {
    log('>>> delete /api/users/user with payload %o', req.payload);
    models_1.UserModel.findById(req.payload.id).then((user) => {
        if (user) {
            log('User %o will be deleted', user.username);
            user.remove().then(() => {
                log('User %o was deleted', user.username);
                return res.sendStatus(204);
            }).catch(next);
        }
        else {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
    }).catch(next);
});


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const uniqueValidator = __webpack_require__(6);
const crypto = __webpack_require__(19);
const jwt = __webpack_require__(20);
const debug = __webpack_require__(0);
const config = __webpack_require__(2);
const mongoose_1 = __webpack_require__(4);
let log = debug('paraboloid:server:models:user');
let UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        index: true,
        maxlength: 30
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^\S+@\S+\.\S+$/, 'is invalid'],
        index: true,
        maxlength: 50
    },
    bio: {
        type: String,
        maxlength: 10000
    },
    image: {
        type: String,
        maxlength: 200,
        match: [/^\S+\.\S+$/, 'is invalid'],
    },
    hash: {
        type: String,
        required: [true, "can't be blank"]
    },
    salt: {
        type: String,
        required: [true, "can't be blank"],
    }
}, { timestamps: true });
UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });
UserSchema.pre('save', function (next) {
    let now = new Date();
    log('UpdatedAt from %o to %o', this.updatedAt, now);
    this.updatedAt = now;
    next();
});
UserSchema.methods.validPassword = function (password) {
    log('Password %o is checked', password);
    if (password) {
        let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        log('Comparision of user and password hashes succeeded: %o', hash === this.hash);
        return this.hash === hash;
    }
    else
        return false;
};
UserSchema.methods.setPassword = function (password) {
    log('password %o', password);
    if (password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        log('hash %o and salt %o generated', this.hash, this.salt);
    }
};
UserSchema.methods.generateJWT = function () {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    log('JWT generated for %o until %o', this.username, exp);
    return jwt.sign({
        id: this._id,
        username: this.username,
        exp: exp.getTime() / 1000,
    }, config.secret);
};
UserSchema.methods.getAuthJSON = function () {
    let token = {
        username: this.username,
        email: this.email,
        token: this.generateJWT(),
        bio: this.bio,
        image: this.image
    };
    log('JWT token: %o', token);
    return token;
};
UserSchema.methods.getProfileJSON = function () {
    let profile = {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image
    };
    log('User profile: %o', profile);
    return profile;
};
exports.UserModel = mongoose_1.model('User', UserSchema);


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const uniqueValidator = __webpack_require__(6);
const slug = __webpack_require__(22);
const debug = __webpack_require__(0);
const mongoose_1 = __webpack_require__(4);
let log = debug('paraboloid:server:models:article');
let ArticleSchema = new mongoose_1.Schema({
    slug: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "can't be blank"],
        match: [/^\S+$/, 'is invalid'],
        index: true,
        maxlength: 100
    },
    title: {
        type: String,
        required: [true, "can't be blank"],
        maxlength: 100
    },
    description: {
        type: String,
        required: [true, "can't be blank"],
        maxlength: 1000
    },
    body: {
        type: String,
        required: [true, "can't be blank"],
        maxlength: 100000
    },
    tagList: [{
            type: String,
            required: [true, "can't be blank"],
            match: [/^\S+$/, 'is invalid'],
            maxlength: 30
        }],
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "can't be blank"],
        ref: 'User'
    },
    comments: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
}, { timestamps: true });
exports.ArticleSchema = ArticleSchema;
ArticleSchema.plugin(uniqueValidator, { message: 'is already taken.' });
ArticleSchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slug = slug(this.title);
        log('Slug: %o', this.slug);
    }
    next();
});
ArticleSchema.pre('save', function (next) {
    let now = new Date();
    log('UpdatedAt from %o to %o', this.updatedAt, now);
    this.updatedAt = now;
    next();
});
ArticleSchema.methods.getArticleJSON = function () {
    let article = {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList,
        author: this.author.getProfileJSON(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
    log('Article: %o', article);
    return article;
};
exports.ArticleModel = mongoose_1.model('Article', ArticleSchema);


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("slug");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(1);
const debug = __webpack_require__(0);
const Authorization_1 = __webpack_require__(7);
const models_1 = __webpack_require__(3);
let log = debug('paraboloid:server:API:articles');
let router = express.Router();
exports.articles = router;
let auth = new Authorization_1.Authorization();
router.param('slug', (req, res, next, slug) => {
    log('>>> parameter slug %o determined', slug);
    models_1.ArticleModel
        .findOne({ slug: slug })
        .populate('author')
        .then((article) => {
        if (article) {
            log('Article %o found', slug);
            req.article = article;
            return next();
        }
        else {
            log('Article %o not found', slug);
            return res.status(404).send({ errors: { article: 'not valid' } });
        }
    }).catch(next);
});
router.get('/', (req, res) => {
    res.status(200);
    res.json({
        path: req.originalUrl,
        tag: req.query.tag,
        author: req.query.author,
        limit: req.query.limit,
        offset: req.query.offset
    });
});
router.post('/', auth.required, (req, res, next) => {
    log('>>> post /api/articles with body %o/payload %o', req.body, req.payload);
    models_1.UserModel.findById(req.payload.id).then((user) => {
        if (user) {
            let article = new models_1.ArticleModel(req.body.article);
            article.author = user;
            article.save().then(() => {
                let json = article.getArticleJSON();
                log('Article was created: %o', json);
                return res.status(201).json({ article: json });
            }).catch(next);
            ;
        }
        else {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
    }).catch(next);
});
router.get('/:slug', auth.optional, (req, res, next) => {
    log('>>> get /api/articles/:slug with payload %o', req.payload);
    req.article
        .populate('author').execPopulate()
        .then((results) => {
        let json = req.article.toJSON();
        log("Article found: %o", json);
        return res.status(200).json({ article: json });
    }).catch(next);
});
router.put('/:slug', auth.required, (req, res, next) => {
    log('>>> put /api/articles/:slug with payload %o', req.payload);
    models_1.UserModel.findById(req.payload.id).then(function (user) {
        if (!user) {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
        if (req.article.author._id.toString() !== req.payload.id.toString()) {
            log('User %o may not update article %o', user.username, req.article.slug);
            return res.status(403).send({
                errors: { article: 'may not be updated' }
            });
        }
        let bodyArticle = req.body.article;
        if (bodyArticle) {
            if (bodyArticle.title)
                req.article.title = bodyArticle.title;
            if (bodyArticle.description)
                req.article.description = bodyArticle.description;
            if (bodyArticle.body)
                req.article.body = bodyArticle.body;
            if (bodyArticle.tagList)
                req.article.tagList = bodyArticle.tagList;
        }
        req.article.save().then(function (article) {
            let json = article.toJSON();
            log('Article updated: %o', json);
            return res.status(200).json({ article: json });
        }).catch(next);
    }).catch(next);
});
router.delete('/:slug', auth.required, (req, res, next) => {
    log('>>> delete /api/articles/:slug with payload %o', req.payload);
    models_1.UserModel.findById(req.payload.id).then((user) => {
        if (!user) {
            log('User not valid');
            return res.status(401).send({ errors: { user: 'not valid' } });
        }
        if (req.article.author._id.toString() === req.payload.id.toString()) {
            req.article.remove().then(() => {
                log('Article %o was deleted', req.article.slug);
                res.sendStatus(204);
            });
        }
        else {
            log('Article %o may not be deleted by %o', req.article.slug, user.username);
            return res.status(403).send({
                errors: { article: 'may not be deleted' }
            });
        }
    }).catch(next);
});
router.post('/:slug/comments', (req, res) => {
    res.status(201);
    res.json({
        path: req.originalUrl,
        slug: req.params.slug
    });
});
router.get('/:slug/comments', (req, res) => {
    res.status(200);
    res.json({
        path: req.originalUrl,
        slug: req.params.slug
    });
});
router.delete('/:slug/comments/:id', (req, res) => {
    res.status(200);
    res.json({
        path: req.originalUrl,
        slug: req.params.slug,
        id: req.params.id
    });
});


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(1);
const debug = __webpack_require__(0);
const models_1 = __webpack_require__(3);
let log = debug('paraboloid:server:API:tags');
let router = express.Router();
exports.tags = router;
router.get('/', function (req, res, next) {
    log('>>> get /api/tags');
    models_1.ArticleModel.find().distinct('tagList').then((tags) => {
        log('Tags %o found', tags);
        return res.status(200).json({ tags: tags });
    }).catch(next);
});


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
let log = debug('paraboloid:server:API:errors');
exports.errors = (err, req, res, next) => {
    if (err.name === 'ValidationError') {
        log('%o: %o', err.name, err.message);
        return res.status(422).json({
            errors: Object.keys(err.errors).reduce(function (errors, key) {
                errors[key] = err.errors[key].message;
                return errors;
            }, {})
        });
    }
    else if (err.name = 'UnauthorizedError') {
        res.status(401).send({ errors: { authorization: 'failed' } });
    }
    else
        next(err);
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const debug = __webpack_require__(0);
const passport_local_1 = __webpack_require__(28);
const models_1 = __webpack_require__(3);
let log = debug('paraboloid:server:API:strategy');
exports.strategy = new passport_local_1.Strategy({
    usernameField: 'user[email]',
    passwordField: 'user[password]'
}, (email, password, done) => {
    log('Login with email %o and password %o', email, password);
    models_1.UserModel.findOne({ email: email.toLowerCase() }).then((user) => {
        if (!user || !user.validPassword(password)) {
            log('Credentials are not valid');
            return done(null, false, { message: 'email or password is invalid' });
        }
        log('Valid credentials for user %o found', user.username);
        return done(null, user);
    }).catch(done);
});


/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ })
/******/ ]);