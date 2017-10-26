import * as d from './api.data';

describe("Put /api/users/user", () => {

  const frisby = require('frisby');

  it("Missing jwt-token", function(doneFn) {
    frisby
      .put('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          authorization: 'failed'
        }
      })
      .done(doneFn);
  });

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_invalid } }
      })
      .put('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          authorization: 'failed'
        }
      })
      .done(doneFn);
  });

  it("Missing ID in jwt-payload", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_user } }
      })
      .put('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          user: 'not valid'
        }
      })
      .done(doneFn);
  });

  it("Update non existing user 'test'", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_id } }
      })
      .put('http://127.0.0.1:8080/api/users/user',
      {
        user: {
          username: 'test', email: 'test@mail.de',
          bio: 'My life!', image: 'image.png'
        }
      })
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          user: 'not valid'
        }
      })
      .done(doneFn);
  });

  it("Change mail, bio and image of user 'test'", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: d.username, email: d.email, password: d.password,
          bio: d.bio, image: d.image
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json',
      {
        user: {
          username: d.username.toLowerCase(), email: d.email.toLowerCase(),
          bio: d.bio, image: d.image
        }
      })
      .then((res: any) => {
        frisby
          .setup({
            request: {
              headers: { 'Authorization': 'Bearer ' + res._body.user.token }
            }
          })
          .put('http://127.0.0.1:8080/api/users/user',
          {
            user: {
              username: d.username, email: d.email_new,
              bio: d.bio_new, image: d.image_new
            }
          })
          .expect('status', 200)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', {
            user: {
              username: d.username.toLowerCase(), email: d.email_new.toLowerCase(),
              bio: d.bio_new, image: d.image_new
            }
          })
          .then(() => {
            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + res._body.user.token }
                }
              })
              .del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          });
      });
  });
});
