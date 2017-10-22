!function(e){function r(t){if(s[t])return s[t].exports;var o=s[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var s={};r.m=e,r.c=s,r.d=function(e,s,t){r.o(e,s)||Object.defineProperty(e,s,{configurable:!1,enumerable:!0,get:t})},r.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(s,"a",s),s},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=6)}([function(e,r){e.exports=require("debug")},function(e,r){e.exports=require("express")},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(10);r.mongoURL=t.mongoURL;var o=s(11);r.ip=o.ip,r.port=o.port;var n=s(12);r.secret=n.secret},function(e,r){e.exports=require("mongoose")},function(e,r){e.exports=require("passport")},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(16);r.UserModel=t.UserModel},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(1),o=s(7),n=s(8),a=s(9),i=s(3),u=s(0),d=s(2),l=s(13),c=u("paraboloid:server");c(">>> express");var p=t();c(">>> bodyParser"),p.use(n.json()),p.use(n.urlencoded({extended:!1})),c(">>> session"),p.use(o({secret:d.secret,cookie:{maxAge:6e4},resave:!1,saveUninitialized:!1})),c(">>> mongoose"),i.Promise=global.Promise,i.connect(d.mongoURL,{useMongoClient:!0}),c(">>> extra logging"),"development"===p.get("env")&&(p.use(a("dev")),i.set("debug",!0)),c(">>> api routes"),p.use(l.api),c(">>> dummy route"),p.use(function(e,r,s){r.status(404).send("Not Found")}),c(">>> error handler"),p.use(function(e,r,s,t){c("Error %o (%o): %o",s.statusCode,e.name,e.message),s.status(s.statusCode||500).send(e.message)}),c(">>> listener");var f=p.listen(d.port,d.ip,function(){console.log("Listening on "+f.address().address+":"+f.address().port)})},function(e,r){e.exports=require("express-session")},function(e,r){e.exports=require("body-parser")},function(e,r){e.exports=require("morgan")},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(0),o=t("paraboloid:server:mongo"),n=process.env.OPENSHIFT_MONGODB_DB_URL||process.env.MONGO_URL||"mongodb://localhost/paraboloid";if(r.mongoURL=n,o("original mongoURL %o",n),void 0===n&&process.env.DATABASE_SERVICE_NAME){var a=process.env.DATABASE_SERVICE_NAME;a&&a.toUpperCase();var i=process.env[a+"_SERVICE_HOST"],u=process.env[a+"_SERVICE_PORT"],d=process.env[a+"_DATABASE"],l=process.env[a+"_USER"],c=process.env[a+"_PASSWORD"];i&&u&&d&&(r.mongoURL=n="mongodb://",l&&c&&(r.mongoURL=n+=l+":"+c+"@"),r.mongoURL=n+=i+":"+u+"/"+d)}o("new mongoURL %o",n)},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(0),o=t("paraboloid:server:address");r.ip=process.env.IP||process.env.OPENSHIFT_NODEJS_IP||"0.0.0.0",o("ip %o",r.ip),r.port=parseInt(process.env.PORT||process.env.OPENSHIFT_NODEJS_PORT||"8080"),o("port %o",r.port)},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(0),o=t("paraboloid:server:secret");r.secret=process.env.SECRET||"secret",o("secret %o",r.secret)},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(14);r.api=t.api,t.api.use("/api",t.api)},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(1),o=s(4),n=s(15),a=s(22),i=s(23),u=s(24),d=s(25);o.use(d.strategy);var l=t.Router();r.api=l,l.use("/users",n.users),l.use("/articles",a.articles),l.use("/tags",i.tags),l.use(u.errors)},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(1),o=s(4),n=s(0),a=s(5),i=s(20),u=n("paraboloid:server:API:users"),d=t.Router();r.users=d;var l=new i.Authorization;d.post("/",function(e,r,s){u(">>> post /api/users/ with body %o",e.body);var t=new a.UserModel;e.body.user&&(t.username=e.body.user.username,t.email=e.body.user.email,t.bio=e.body.user.bio,t.image=e.body.user.image,t.setPassword(e.body.user.password)),t.save().then(function(){return u("user %o successfully saved",t.username),r.status(201).json({user:t.toAuthJSON()})}).catch(s)}),d.post("/login",function(e,r,s){var t=e.body.user;return t?t.email?t.password?void o.authenticate("local",{session:!1},function(e,t,o){return e?(u("Error occured: %o",e),s(e)):t?(u("User found: %o",t),r.json({user:t.toAuthJSON()})):(u("Information: %o",o),r.status(422).json({errors:o}))})(e,r,s):(u("No password for user %o found",t.username),r.status(422).json({errors:{password:"can't be blank"}})):(u("No email for user %o found",t.username),r.status(422).json({errors:{email:"can't be blank"}})):(u("No user found"),r.status(422).json({errors:{user:"not found"}}))}),d.put("/user",l.required,function(e,r,s){u(">>> put /api/users/user with body %o/payload %o",e.body,e.payload),a.UserModel.findById(e.payload.id).then(function(t){var o=e.body.user;t?(u("User %o will be updated",t.username),o&&(o.username&&(t.username=o.username),o.email&&(t.email=o.email),o.bio&&(t.bio=o.bio),o.image&&(t.image=o.image),o.password&&t.setPassword(o.password.substr(100))),t.save().then(function(){return u("User %o was updated",t.username),r.status(200).json({user:t.toAuthJSON()})}).catch(s)):(u("User not valid"),r.status(401).send({errors:{user:"not valid"}}))}).catch(s)}),d.get("/user",l.required,function(e,r,s){u(">>> get /api/users/user with payload %o",e.payload),a.UserModel.findById(e.payload.id).then(function(e){if(e)return u("User %o was read",e.username),r.status(200).json({user:e.toAuthJSON()});u("User not valid"),r.status(401).send({errors:{user:"not valid"}})}).catch(s)}),d.delete("/user",l.required,function(e,r,s){u(">>> delete /api/users/user with payload %o",e.payload),a.UserModel.findById(e.payload.id).then(function(e){e?(u("User %o will be deleted",e.username),e.remove().then(function(){return u("User %o was deleted",e.username),r.sendStatus(204)}).catch(s)):(u("User not valid"),r.status(401).send({errors:{user:"not valid"}}))}).catch(s)})},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(17),o=s(18),n=s(19),a=s(0),i=s(2),u=s(3),d=a("paraboloid:server:models:user"),l=new u.Schema({username:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/^[a-zA-Z0-9]+$/,"is invalid"],index:!0,maxlength:30},email:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/\S+@\S+\.\S+/,"is invalid"],index:!0,maxlength:50},bio:{type:String,maxlength:1e4},image:{type:String,maxlength:200,match:[/\S+\.\S+/,"is invalid"]},hash:{type:String,required:[!0,"can't be blank"]},salt:{type:String,required:[!0,"can't be blank"]}},{timestamps:!0});l.plugin(t,{message:"is already taken."}),l.methods.validPassword=function(e){if(d("Password %o is checked",e),e){var r=o.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex");return d("Comparision of user and password hashes succeeded: %o",r===this.hash),this.hash===r}return!1},l.methods.setPassword=function(e){d("password %o",e),e&&(this.salt=o.randomBytes(16).toString("hex"),this.hash=o.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex"),d("hash %o and salt %o generated",this.hash,this.salt))},l.methods.generateJWT=function(){var e=new Date,r=new Date(e);return r.setDate(e.getDate()+60),d("JWT generated for %o until %o",this.username,r),n.sign({id:this._id,username:this.username,exp:r.getTime()/1e3},i.secret)},l.methods.toAuthJSON=function(){var e={username:this.username,email:this.email,token:this.generateJWT(),bio:this.bio,image:this.image};return d("JWT token: %o",e),e},r.UserModel=u.model("User",l)},function(e,r){e.exports=require("mongoose-unique-validator")},function(e,r){e.exports=require("crypto")},function(e,r){e.exports=require("jsonwebtoken")},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(21),o=s(0),n=s(2),a=o("paraboloid:server:API:auth"),i=function(){function e(){}return e.prototype.getTokenFromHeader=function(e){if(a("authorization header: %o",e.headers.authorization),e.headers.authorization){var r=e.headers.authorization.toString();if("Token"===r.split(" ")[0]||"Bearer"===r.split(" ")[0])return r.split(" ")[1]}return null},Object.defineProperty(e.prototype,"required",{get:function(){return t({secret:n.secret,userProperty:"payload",getToken:this.getTokenFromHeader})},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"optional",{get:function(){return t({secret:n.secret,userProperty:"payload",credentialsRequired:!1,getToken:this.getTokenFromHeader})},enumerable:!0,configurable:!0}),e}();r.Authorization=i},function(e,r){e.exports=require("express-jwt")},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(1),o=t.Router();r.articles=o,o.get("/",function(e,r){r.status(200),r.json({path:e.originalUrl,tag:e.query.tag,author:e.query.author,limit:e.query.limit,offset:e.query.offset})}),o.post("/",function(e,r){r.status(201),r.json({path:e.originalUrl})}),o.get("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.put("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.delete("/:slug",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.post("/:slug/comments",function(e,r){r.status(201),r.json({path:e.originalUrl,slug:e.params.slug})}),o.get("/:slug/comments",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug})}),o.delete("/:slug/comments/:id",function(e,r){r.status(200),r.json({path:e.originalUrl,slug:e.params.slug,id:e.params.id})})},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(1),o=t.Router();r.tags=o,o.get("/",function(e,r){r.json({path:e.originalUrl})})},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(0),o=t("paraboloid:server:API:errors");r.errors=function(e,r,s,t){if("ValidationError"===e.name)return o("%o: %o",e.name,e.message),s.status(422).json({errors:Object.keys(e.errors).reduce(function(r,s){return r[s]=e.errors[s].message,r},{})});(e.name="UnauthorizedError")?s.status(401).send({errors:{authorization:"failed"}}):t(e)}},function(e,r,s){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var t=s(0),o=s(26),n=s(5),a=t("paraboloid:server:API:strategy");r.strategy=new o.Strategy({usernameField:"user[email]",passwordField:"user[password]"},function(e,r,s){a("Login with email %o and password %o",e,r),n.UserModel.findOne({email:e}).then(function(e){return e&&e.validPassword(r)?(a("Valid credentials for user %o found",e.username),s(null,e)):(a("Credentials are not valid"),s(null,!1,{message:"email or password is invalid"}))}).catch(s)})},function(e,r){e.exports=require("passport-local")}]);