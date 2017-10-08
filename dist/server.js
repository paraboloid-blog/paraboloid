!function(e){function s(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,s),r.l=!0,r.exports}var t={};s.m=e,s.c=t,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,s){return Object.prototype.hasOwnProperty.call(e,s)},s.p="",s(s.s=1)}([function(e,s){e.exports=require("express")},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(0),r=t(2),n=t(3),u=t(4),a=t(5),i=t(6),l=t(11),p=t(12),c=o();c.use(n.json()),c.use(n.urlencoded({extended:!1})),c.use(r({secret:"paraboloid",cookie:{maxAge:6e4},resave:!1,saveUninitialized:!1})),a.connect(l.mongoURL),"development"===c.get("env")&&(c.use(u("dev")),a.set("debug",!0)),c.use(i.api),c.use(function(e,s,t){s.sendStatus(404)}),c.use(function(e,s,t,o){t.sendStatus(e.status||500)});var g=c.listen(p.port,p.ip,function(){console.log("Listening on "+g.address().address+":"+g.address().port)})},function(e,s){e.exports=require("express-session")},function(e,s){e.exports=require("body-parser")},function(e,s){e.exports=require("morgan")},function(e,s){e.exports=require("mongoose")},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(7);s.api=o.api,o.api.use("/api",o.api)},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(0),r=t(8),n=t(9),u=t(10),a=o.Router();s.api=a,a.use("/users",r.users),a.use("/articles",n.articles),a.use("/tags",u.tags)},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(0),r=o.Router();s.users=r,r.post("/",function(e,s){s.status(201),s.json({path:e.originalUrl})}),r.post("/login",function(e,s){s.status(200),s.json({path:e.originalUrl})}),r.put("/:user",function(e,s){s.status(200),s.json({path:e.originalUrl,user:e.params.user})}),r.get("/:user",function(e,s){s.status(200),s.json({path:e.originalUrl,user:e.params.user})})},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(0),r=o.Router();s.articles=r,r.get("/",function(e,s){s.status(200),s.json({path:e.originalUrl,tag:e.query.tag,author:e.query.author,limit:e.query.limit,offset:e.query.offset})}),r.post("/",function(e,s){s.status(201),s.json({path:e.originalUrl})}),r.get("/:slug",function(e,s){s.status(200),s.json({path:e.originalUrl,slug:e.params.slug})}),r.put("/:slug",function(e,s){s.status(200),s.json({path:e.originalUrl,slug:e.params.slug})}),r.delete("/:slug",function(e,s){s.status(200),s.json({path:e.originalUrl,slug:e.params.slug})}),r.post("/:slug/comments",function(e,s){s.status(201),s.json({path:e.originalUrl,slug:e.params.slug})}),r.get("/:slug/comments",function(e,s){s.status(200),s.json({path:e.originalUrl,slug:e.params.slug})}),r.delete("/:slug/comments/:id",function(e,s){s.status(200),s.json({path:e.originalUrl,slug:e.params.slug,id:e.params.id})})},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=t(0),r=o.Router();s.tags=r,r.get("/",function(e,s){s.json({path:e.originalUrl})})},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=process.env.OPENSHIFT_MONGODB_DB_URL||process.env.MONGO_URL||"mongodb://localhost/paraboloid";if(s.mongoURL=o,void 0===o&&process.env.DATABASE_SERVICE_NAME){var r=process.env.DATABASE_SERVICE_NAME;r&&r.toUpperCase();var n=process.env[r+"_SERVICE_HOST"],u=process.env[r+"_SERVICE_PORT"],a=process.env[r+"_DATABASE"],i=process.env[r+"_USER"],l=process.env[r+"_PASSWORD"];n&&u&&a&&(s.mongoURL=o="mongodb://",i&&l&&(s.mongoURL=o+=i+":"+l+"@"),s.mongoURL=o+=n+":"+u+"/"+a)}},function(e,s,t){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var o=process.env.IP||process.env.OPENSHIFT_NODEJS_IP||"0.0.0.0";s.ip=o;var r=parseInt(process.env.PORT||process.env.OPENSHIFT_NODEJS_PORT||"8080");s.port=r}]);