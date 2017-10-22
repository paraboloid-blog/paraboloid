import * as d from './api.data';

describe("Delete /api/users/user", () => {

  const frisby = require('frisby');

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_invalid } }
      })
      .del('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          message: 'Invalid authorization token'
        }
      })
      .done(doneFn);
  });

  it("Missing ID in jwt-payload", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_user } }
      })
      .del('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Delete non existing user 'test'", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_id } }
      })
      .del('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Delete user 'test'", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: d.username, email: d.email, password: d.password
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .then((res: any) => {
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
