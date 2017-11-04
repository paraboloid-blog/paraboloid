!function(e){function t(s){if(r[s])return r[s].exports;var o=r[s]={i:s,l:!1,exports:{}};return e[s].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,s){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:s})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=8)}([function(e,t){e.exports=require("debug")},function(e,t){e.exports=require("express")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(11);t.mongoURL=s.mongoURL;const o=r(12);t.ip=o.ip,t.port=o.port;const a=r(13);t.secret=a.secret;const i=r(14);t.register=i.register},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(18);t.UserModel=s.UserModel;const o=r(21);t.ArticleModel=o.ArticleModel},function(e,t){e.exports=require("mongoose")},function(e,t){e.exports=require("passport")},function(e,t){e.exports=require("mongoose-unique-validator")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(23),o=r(0),a=r(2);let i=o("paraboloid:server:API:auth");class n{getTokenFromHeader(e){if(i("authorization header: %o",e.headers.authorization),e.headers.authorization){let t=e.headers.authorization.toString();if("Token"===t.split(" ")[0]||"Bearer"===t.split(" ")[0])return t.split(" ")[1]}return null}get required(){return s({secret:a.secret,userProperty:"payload",getToken:this.getTokenFromHeader})}get optional(){return s({secret:a.secret,userProperty:"payload",getToken:this.getTokenFromHeader})}}t.Authorization=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(1),o=r(9),a=r(10),i=r(4),n=r(0),u=r(2),l=r(15);let d=n("paraboloid:server");d(">>> express");let c=s();d(">>> bodyParser"),c.use(o.json()),c.use(o.urlencoded({extended:!1})),d(">>> mongoose"),i.Promise=global.Promise,i.connect(u.mongoURL,{useMongoClient:!0}),d(">>> extra logging"),"development"===c.get("env")&&(c.use(a("dev")),i.set("debug",!0)),d(">>> api routes"),c.use(l.api),d(">>> dummy route"),c.use(function(e,t,r){t.status(404).send("Not Found")}),d(">>> error handler"),c.use(function(e,t,r,s){d("Error %o (%o): %o",r.statusCode,e.name,e.message),r.status(r.statusCode||500).send({errors:{message:e.message}})}),d(">>> listener");let p=c.listen(u.port,u.ip,function(){console.log("Listening on "+p.address().address+":"+p.address().port)})},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("morgan")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=r(0)("paraboloid:server:config:mongo"),o=process.env.OPENSHIFT_MONGODB_DB_URL||process.env.MONGO_URL||"mongodb://localhost/paraboloid";if(t.mongoURL=o,s("original mongoURL %o",o),void 0===o&&process.env.DATABASE_SERVICE_NAME){let e=process.env.DATABASE_SERVICE_NAME;e&&e.toUpperCase();let r=process.env[e+"_SERVICE_HOST"],s=process.env[e+"_SERVICE_PORT"],a=process.env[e+"_DATABASE"],i=process.env[e+"_USER"],n=process.env[e+"_PASSWORD"];r&&s&&a&&(t.mongoURL=o="mongodb://",i&&n&&(t.mongoURL=o+=i+":"+n+"@"),t.mongoURL=o+=r+":"+s+"/"+a)}s("new mongoURL %o",o)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=r(0)("paraboloid:server:config:address");t.ip=process.env.IP||process.env.OPENSHIFT_NODEJS_IP||"0.0.0.0",s("ip %o",t.ip),t.port=parseInt(process.env.PORT||process.env.OPENSHIFT_NODEJS_PORT||"8080"),s("port %o",t.port)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=r(0)("paraboloid:server:config:secret");t.secret=process.env.SECRET||"secret",s("secret %o",t.secret)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=r(0)("paraboloid:server:config:register");t.register=process.env.REGISTER||!1,s("Registration allowed: %o",t.register)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(16);t.api=s.api,s.api.use("/api",s.api)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(1),o=r(5),a=r(17),i=r(24),n=r(25),u=r(26),l=r(27);o.use(l.strategy);let d=s.Router();t.api=d,d.use("/users",a.users),d.use("/articles",i.articles),d.use("/tags",n.tags),d.use(u.errors)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(1),o=r(5),a=r(0),i=r(2),n=r(3),u=r(7);let l=a("paraboloid:server:API:users"),d=s.Router();t.users=d;let c=new u.Authorization;d.post("/",(e,t,r)=>{if(l(">>> post /api/users/ with body %o",e.body),!i.register)return l("Registration is not allowed"),t.status(405).send({errors:{registration:"not allowed"}});let s=new n.UserModel(e.body.user);e.body.user.password&&s.setPassword(e.body.user.password),s.save().then(()=>{let e=s.getAuthJSON();return l("User successfully saved: %o",e),t.status(201).json({user:e})}).catch(r)}),d.post("/login",(e,t,r)=>{l(">>> post /api/users/login with body %o",e.body);let s=e.body.user;return s?s.email?s.password?void o.authenticate("local",{session:!1},(e,s,o)=>{if(e)return l("Error occured: %o",e),r(e);if(s){let e=s.getAuthJSON();return l("User found: %o",e),t.json({user:e})}return l("Information: %o",o),t.status(422).json({errors:o})})(e,t,r):(l("No password for user %o found",s.username),t.status(422).json({errors:{password:"can't be blank"}})):(l("No email for user %o found",s.username),t.status(422).json({errors:{email:"can't be blank"}})):(l("No user found"),t.status(422).json({errors:{user:"not found"}}))}),d.put("/user",c.required,(e,t,r)=>{l(">>> put /api/users/user with body %o/payload %o",e.body,e.payload),n.UserModel.findById(e.payload.id).then(s=>{let o=e.body.user;if(!s)return l("User not valid"),t.status(401).send({errors:{user:"not valid"}});l("User %o will be updated",s.username),o&&(o.username&&(s.username=o.username),o.email&&(s.email=o.email),o.bio&&(s.bio=o.bio),o.image&&(s.image=o.image),o.password&&s.setPassword(o.password.substr(100))),s.save().then(()=>{let e=s.getAuthJSON();return l("User was updated: %o",e),t.status(200).json({user:e})}).catch(r)}).catch(e=>(l("User not valid"),t.status(401).send({errors:{user:"not valid"}})))}),d.get("/user",c.required,(e,t,r)=>{l(">>> get /api/users/user with payload %o",e.payload),n.UserModel.findById(e.payload.id).then(e=>{if(e){let r=e.getAuthJSON();return l("User was read: %o",r),t.status(200).json({user:r})}return l("User not valid"),t.status(401).send({errors:{user:"not valid"}})}).catch(e=>(l("User not valid"),t.status(401).send({errors:{user:"not valid"}})))}),d.delete("/user",c.required,(e,t,r)=>{l(">>> delete /api/users/user with payload %o",e.payload),n.UserModel.findById(e.payload.id).then(e=>{if(!e)return l("User not valid"),t.status(401).send({errors:{user:"not valid"}});l("User %o will be deleted",e.username),e.remove().then(()=>(l("User %o was deleted",e.username),t.sendStatus(204))).catch(r)}).catch(e=>(l("User not valid"),t.status(401).send({errors:{user:"not valid"}})))})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(6),o=r(19),a=r(20),i=r(0),n=r(2),u=r(4);let l=i("paraboloid:server:models:user"),d=new u.Schema({username:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/^[a-zA-Z0-9]+$/,"is invalid"],index:!0,maxlength:30},email:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/^\S+@\S+\.\S+$/,"is invalid"],index:!0,maxlength:50},bio:{type:String,maxlength:1e4},image:{type:String,maxlength:200,match:[/^\S+\.\S+$/,"is invalid"]},hash:{type:String,required:[!0,"can't be blank"]},salt:{type:String,required:[!0,"can't be blank"]}},{timestamps:!0});d.plugin(s,{message:"is already taken."}),d.pre("save",function(e){let t=new Date;l("UpdatedAt from %o to %o",this.updatedAt,t),this.updatedAt=t,e()}),d.methods.validPassword=function(e){if(l("Password %o is checked",e),e){let t=o.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex");return l("Comparision of user and password hashes succeeded: %o",t===this.hash),this.hash===t}return!1},d.methods.setPassword=function(e){l("password %o",e),e&&(this.salt=o.randomBytes(16).toString("hex"),this.hash=o.pbkdf2Sync(e,this.salt,1e4,512,"sha512").toString("hex"),l("hash %o and salt %o generated",this.hash,this.salt))},d.methods.generateJWT=function(){let e=new Date,t=new Date(e);return t.setDate(e.getDate()+60),l("JWT generated for %o until %o",this.username,t),a.sign({id:this._id,username:this.username,exp:t.getTime()/1e3},n.secret)},d.methods.getAuthJSON=function(){let e={username:this.username,email:this.email,token:this.generateJWT(),bio:this.bio,image:this.image};return l("JWT token: %o",e),e},d.methods.getProfileJSON=function(){let e={username:this.username,email:this.email,bio:this.bio,image:this.image};return l("User profile: %o",e),e},t.UserModel=u.model("User",d)},function(e,t){e.exports=require("crypto")},function(e,t){e.exports=require("jsonwebtoken")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(6),o=r(22),a=r(0),i=r(4);let n=a("paraboloid:server:models:article"),u=new i.Schema({slug:{type:String,lowercase:!0,unique:!0,required:[!0,"can't be blank"],match:[/^\S+$/,"is invalid"],index:!0,maxlength:100},title:{type:String,required:[!0,"can't be blank"],maxlength:100},description:{type:String,required:[!0,"can't be blank"],maxlength:1e3},body:{type:String,required:[!0,"can't be blank"],maxlength:1e5},tagList:[{type:String,required:[!0,"can't be blank"],match:[/^\S+$/,"is invalid"],maxlength:30}],author:{type:i.Schema.Types.ObjectId,required:[!0,"can't be blank"],ref:"User"}},{timestamps:!0});t.ArticleSchema=u,u.plugin(s,{message:"is already taken."}),u.pre("validate",function(e){this.slug||(this.slug=o(this.title),n("Slug: %o",this.slug)),e()}),u.pre("save",function(e){let t=new Date;n("UpdatedAt from %o to %o",this.updatedAt,t),this.updatedAt=t,e()}),u.methods.getArticleJSON=function(){let e={slug:this.slug,title:this.title,description:this.description,body:this.body,tagList:this.tagList,author:this.author.getProfileJSON(),createdAt:this.createdAt,updatedAt:this.updatedAt};return n("Article: %o",e),e},t.ArticleModel=i.model("Article",u)},function(e,t){e.exports=require("slug")},function(e,t){e.exports=require("express-jwt")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(1),o=r(0),a=r(7),i=r(3);let n=o("paraboloid:server:API:articles"),u=s.Router();t.articles=u;let l=new a.Authorization;u.param("slug",(e,t,r,s)=>{n(">>> parameter slug %o determined",s),i.ArticleModel.findOne({slug:s}).populate("author").then(o=>o?(n("Article %o found",s),e.article=o,r()):(n("Article %o not found",s),t.status(404).send({errors:{article:"not valid"}}))).catch(e=>(n("Parameter slug could not be determined"),t.status(404).send({errors:{article:"not valid"}})))}),u.get("/",(e,t,r)=>{n(">>> get /api/articles with query %o",e.query);new Promise((t,r)=>{e.query.author?i.UserModel.findOne({username:e.query.author.toLowerCase()}).exec((e,r)=>t(r||null)):t(null)}).then(r=>{let s=e.query.limit?Number(e.query.limit):20,o=e.query.offset?Number(e.query.offset):0,a={};e.query.tag&&(a.tagList={$in:[e.query.tag]}),e.query.author&&(a.author=r._id),n("Query articles regarding %o (limit %o, offset %o)",a,s,o);let u=[i.ArticleModel.find(a).limit(s).skip(o).sort({updatedAt:"desc"}).populate("author").exec(),i.ArticleModel.count(a).exec()];Promise.all(u).then(e=>{let r=e[0],s=e[1],o={articles:r.map(e=>e.toJSON()),articlesCount:s};return n("Articles found: %o",o),t.status(200).json({article:o})}).catch(e=>{return n("No articles found"),t.status(404).json({article:{articles:[],articlesCount:0}})})}).catch(e=>{return n("No articles found"),t.status(404).json({article:{articles:[],articlesCount:0}})})}),u.post("/",l.required,(e,t,r)=>{n(">>> post /api/articles with body %o/payload %o",e.body,e.payload),i.UserModel.findById(e.payload.id).then(s=>{if(!s)return n("User not valid"),t.status(401).send({errors:{user:"not valid"}});{let o=new i.ArticleModel(e.body.article);o.author=s,o.save().then(e=>{let r=o.getArticleJSON();return n("Article was created: %o",r),t.status(201).json({article:r})}).catch(r)}}).catch(e=>(n("User not valid"),t.status(401).send({errors:{user:"not valid"}})))}),u.get("/:slug",(e,t,r)=>{n(">>> get /api/articles/:slug with payload %o",e.payload);let s=e.article.toJSON();return n("Article found: %o",s),t.status(200).json({article:s})}),u.put("/:slug",l.required,(e,t,r)=>{n(">>> put /api/articles/:slug with payload %o",e.payload),i.UserModel.findById(e.payload.id).then(function(s){if(!s)return n("User not valid"),t.status(401).send({errors:{user:"not valid"}});if(e.article.author._id.toString()!==e.payload.id.toString())return n("User %o may not update article %o",s.username,e.article.slug),t.status(403).send({errors:{article:"may not be updated"}});let o=e.body.article;o&&(o.title&&(e.article.title=o.title),o.description&&(e.article.description=o.description),o.body&&(e.article.body=o.body),o.tagList&&(e.article.tagList=o.tagList)),e.article.save().then(function(e){let r=e.toJSON();return n("Article updated: %o",r),t.status(200).json({article:r})}).catch(r)}).catch(e=>(n("User not valid"),t.status(401).send({errors:{user:"not valid"}})))}),u.delete("/:slug",l.required,(e,t,r)=>{n(">>> delete /api/articles/:slug with payload %o",e.payload),i.UserModel.findById(e.payload.id).then(s=>s?e.article.author._id.toString()!==e.payload.id.toString()?(n("Article %o may not be deleted by %o",e.article.slug,s.username),t.status(403).send({errors:{article:"may not be deleted"}})):void e.article.remove().then(()=>{n("Article %o was deleted",e.article.slug),t.sendStatus(204)}).catch(r):(n("User not valid"),t.status(401).send({errors:{user:"not valid"}}))).catch(e=>(n("User not valid"),t.status(401).send({errors:{user:"not valid"}})))}),u.post("/:slug/comments",(e,t)=>{t.status(201),t.json({path:e.originalUrl,slug:e.params.slug})}),u.get("/:slug/comments",(e,t)=>{t.status(200),t.json({path:e.originalUrl,slug:e.params.slug})}),u.delete("/:slug/comments/:id",(e,t)=>{t.status(200),t.json({path:e.originalUrl,slug:e.params.slug,id:e.params.id})})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(1),o=r(0),a=r(3);let i=o("paraboloid:server:API:tags"),n=s.Router();t.tags=n,n.get("/",function(e,t,r){i(">>> get /api/tags"),a.ArticleModel.find().distinct("tagList").then(e=>(i("Tags %o found",e),t.status(200).json({tags:e}))).catch(r)})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=r(0)("paraboloid:server:API:errors");t.errors=((e,t,r,o)=>(s("%o: %o",e.name,e.message),"ValidationError"===e.name?(s("%o is handled",e.name),r.status(422).json({errors:Object.keys(e.errors).reduce(function(t,r){return t[r]=e.errors[r].message,t},{})})):"UnauthorizedError"===e.name?(s("%o is handled",e.name),r.status(401).send({errors:{authorization:"failed"}})):void o(e)))},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r(0),o=r(28),a=r(3);let i=s("paraboloid:server:API:strategy");t.strategy=new o.Strategy({usernameField:"user[email]",passwordField:"user[password]"},(e,t,r)=>{i("Login with email %o and password %o",e,t),a.UserModel.findOne({email:e.toLowerCase()}).then(e=>e&&e.validPassword(t)?(i("Valid credentials for user %o found",e.username),r(null,e)):(i("Credentials are not valid"),r(null,!1,{message:"email or password is invalid"}))).catch(r)})},function(e,t){e.exports=require("passport-local")}]);