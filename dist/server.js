!function(e){function r(s){if(t[s])return t[s].exports;var o=t[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var t={};r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:s})},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=4)}([function(e,r){e.exports=require("debug")},function(e,r){e.exports=require("express")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(8);r.mongoURL=s.mongoURL;var o=t(9);r.ip=o.ip,r.port=o.port;var n=t(10);r.secret=n.secret},function(e,r){e.exports=require("mongoose")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(1),o=t(5),n=t(6),a=t(7),i=t(3),u=t(0),l=t(2),c=t(11),p=u("paraboloid:server");p(">>> express");var d=s();p(">>> bodyParser"),d.use(n.json()),d.use(n.urlencoded({extended:!1})),p(">>> session"),d.use(o({secret:l.secret,cookie:{maxAge:6e4},resave:!1,saveUninitialized:!1})),p(">>> mongoose"),i.Promise=global.Promise,i.connect(l.mongoURL,{useMongoClient:!0}),p(">>> extra logging"),"development"===d.get("env")&&(d.use(a("dev")),i.set("debug",!0)),p(">>> api routes"),d.use(c.api),p(">>> dummy route"),d.use(function(e,r,t){r.status(404),t(new Error("Not Found"))}),p(">>> error handler"),d.use(function(e,r,t,s){p("Error %o: %o",t.statusCode,e.message),t.status(t.statusCode||500).json({errors:{message:e.message}})}),p(">>> listener");var g=d.listen(l.port,l.ip,function(){console.log("Listening on "+g.address().address+":"+g.address().port)})},function(e,r){e.exports=require("express-session")},function(e,r){e.exports=require("body-parser")},function(e,r){e.exports=require("morgan")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(0),o=s("paraboloid:server:mongo"),n=process.env.OPENSHIFT_MONGODB_DB_URL||process.env.MONGO_URL||"mongodb://localhost/paraboloid";if(r.mongoURL=n,o("original mongoURL %o",n),void 0===n&&process.env.DATABASE_SERVICE_NAME){var a=process.env.DATABASE_SERVICE_NAME;a&&a.toUpperCase();var i=process.env[a+"_SERVICE_HOST"],u=process.env[a+"_SERVICE_PORT"],l=process.env[a+"_DATABASE"],c=process.env[a+"_USER"],p=process.env[a+"_PASSWORD"];i&&u&&l&&(r.mongoURL=n="mongodb://",c&&p&&(r.mongoURL=n+=c+":"+p+"@"),r.mongoURL=n+=i+":"+u+"/"+l)}o("new mongoURL %o",n)},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(0),o=s("paraboloid:server:address");r.ip=process.env.IP||process.env.OPENSHIFT_NODEJS_IP||"0.0.0.0",o("ip %o",r.ip),r.port=parseInt(process.env.PORT||process.env.OPENSHIFT_NODEJS_PORT||"8080"),o("port %o",r.port)},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(0),o=s("paraboloid:server:secret");r.secret=process.env.SECRET||"secret",o("secret %o",r.secret)},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(12);r.api=s.api,s.api.use("/api",s.api)},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(1),o=t(0),n=t(13),a=t(21),i=t(22),u=o("paraboloid:server:API"),l=s.Router();r.api=l,l.use("/users",n.users),l.use("/articles",a.articles),l.use("/tags",i.tags),l.use(function(e,r,t,s){if("ValidationError"===e.name)return u("%o: %o",e.name,e.message),t.status(422).json({errors:Object.keys(e.errors).reduce(function(r,t){return r[t]=e.errors[t].message,r},{})});s(e)})},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(1),o=t(0),n=t(14),a=t(16),i=o("paraboloid:server:API:users"),u=s.Router();r.users=u,u.post("/",function(e,r,t){i(">>> post /api/users/ with %o",e.body);var s=new a.UserModel;s.username=e.body.username,s.email=e.body.email,s.setPassword(e.body.password),s.save().then(function(){return i("user %o successfully saved",s.username),r.status(201).json({user:s.toAuthJSON()})}).catch(t)}),u.post("/login",function(e,r){r.status(200),r.json({path:e.originalUrl})}),u.put("/:user",n.auth.required,function(e,r){r.status(200),r.json({path:e.originalUrl,user:e.params.user})}),u.get("/:user",n.auth.required,function(e,r,t){r.status(200),r.json({path:e.originalUrl,user:e.params.user})})},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(15),o=t(0),n=t(2),a=function(){function e(){this.log=o("paraboloid:server:authorization")}return e.prototype.getTokenFromHeader=function(e){this.log("authorization header: %o",e.headers.authorization);var r=e.headers.authorization[0];if("Token"===r.split(" ")[0]||"Bearer"===r.split(" ")[0]){var t=r.split(" ")[1];return this.log("token %o",t),t}return null},Object.defineProperty(e.prototype,"required",{get:function(){return this.log("authorization required"),s({secret:n.secret,userProperty:"payload",getToken:this.getTokenFromHeader})},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"optional",{get:function(){return this.log("authorization optional"),s({secret:n.secret,userProperty:"payload",credentialsRequired:!1,getToken:this.getTokenFromHeader})},enumerable:!0,configurable:!0}),e}(),i=new a;r.auth=i},function(e,r){e.exports=require("express-jwt")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(17);r.UserModel=s.UserModel},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(3),o=t(18),n=t(19),a=t(20),i=t(0),u=t(2),l=i("paraboloid:server:models:user"),c=new s.Schema({username:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/^[a-zA-Z0-9]+$/,"is invalid"],index:!0},email:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/\S+@\S+\.\S+/,"is invalid"],index:!0},bio:String,image:String,hash:{type:String,required:[!0,"can't be blank"]},salt:{type:String,required:[!0,"can't be blank"]}},{timestamps:!0});c.plugin(o,{message:"is already taken."}),c.methods.validPassword=function(e){if(l("password %o",e),e){var r=n.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex");return l("hash %o is compared to user hash %o",r,this.hash),this.hash===r}return!1},c.methods.setPassword=function(e){l("password %o",e),e&&(this.salt=n.randomBytes(16).toString("hex"),this.hash=n.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex"),l("hash %o and salt %o generated",this.hash,this.salt))},c.methods.generateJWT=function(){var e=new Date,r=new Date(e);return r.setDate(e.getDate()+60),l("JWT generated for %o until %o",this.username,r),a.sign({id:this._id,username:this.username,exp:r.getTime()/1e3},u.secret)},c.methods.toAuthJSON=function(){var e={username:this.username,email:this.email,token:this.generateJWT(),bio:this.bio,image:this.image};return l("JWT token: %o",e),e},r.UserModel=s.model("User",c)},function(e,r){e.exports=require("mongoose-unique-validator")},function(e,r){e.exports=require("crypto")},function(e,r){e.exports=require("jsonwebtoken")},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(1),o=s.Router();r.articles=o,o.get("/",function(e,r){r.status(200),r.json({path:e.originalUrl,tag:e.query.tag,author:e.query.author,limit:e.query.limit,offset:e.query.offset})}),o.post("/",function(e,r){r.status(201),r.json({path:e.originalUrl})}),o.get("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.put("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.delete("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.post("/:slug/comments",function(e,r){r.status(201),r.json({path:e.originalUrl,slug:e.params.slug})}),o.get("/:slug/comments",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.delete("/:slug/comments/:id",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug,id:e.params.id})})},function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s=t(1),o=s.Router();r.tags=o,o.get("/",function(e,r){r.json({path:e.originalUrl})})}]);