!function(e){function t(o){if(r[o])return r[o].exports;var s=r[o]={i:o,l:!1,exports:{}};return e[o].call(s.exports,s,s.exports,t),s.l=!0,s.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t){e.exports=require("express")},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=r(2),n=r(3),u=r(4),i=r(5),c=r(6),a=o();a.use(u("dev")),a.use(n.json()),a.use(n.urlencoded({extended:!1})),a.use(s({secret:"paraboloid",cookie:{maxAge:6e4},resave:!1,saveUninitialized:!1})),a.use(c.router),a.use(function(e,t,r){r(new i.ExprError("Not Found",404))}),a.use(function(e,t,r,o){r.status(e.status||500),r.json({errors:{message:e.message,stack:e.stack}})});var p=a.listen(process.env.PORT||3e3,function(){console.log("Listening on port "+p.address().port)})},function(e,t){e.exports=require("express-session")},function(e,t){e.exports=require("body-parser")},function(e,t){e.exports=require("morgan")},function(e,t,r){"use strict";var o=this&&this.__extends||function(){var e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r])};return function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}}();Object.defineProperty(t,"__esModule",{value:!0});var s=function(e){function t(t,r){var o=e.call(this,t)||this;return o.m=t,o._status=r,o}return o(t,e),Object.defineProperty(t.prototype,"status",{get:function(){return this._status},enumerable:!0,configurable:!0}),t}(Error);t.ExprError=s},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(7);t.router=o.api,o.api.get("/api",o.api)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=o.Router();t.api=s;var n=r(8),u=r(9),i=r(10),c=r(11);s.use("/",n.users),s.use("/profiles",u.profiles),s.use("/articles",i.articles),s.use("/tags",c.tags)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=o.Router();t.users=s,s.post("/users",function(e,t,r){console.log("users")})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=o.Router();t.profiles=s,s.post("/users",function(e,t,r){console.log("profiles")})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=o.Router();t.articles=s,s.post("/users",function(e,t,r){console.log("articles")})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=r(0),s=o.Router();t.tags=s,s.post("/users",function(e,t,r){console.log("tags")})}]);