import * as d from './api.data';

describe("Post /api/users/login", () => {

  const frisby = require('frisby');

  it("Login successful", function(doneFn) {
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
      .expect('json', {
        user: {
          username: d.username.toLowerCase(), email: d.email.toLowerCase(),
          bio: d.bio, image: d.image
        }
      })
      .then((res_register: any) => {

        let token_register = res_register._body.user.token;
        expect(token_register).toBeTruthy();

        frisby
          .post('http://127.0.0.1:8080/api/users/login',
          { user: { email: d.email, password: d.password } })
          .expect('status', 200)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', {
            user: {
              username: d.username.toLowerCase(), email: d.email.toLowerCase(),
              bio: d.bio, image: d.image
            }
          })
          .then((res_login: any) => {

            let token_login = res_login._body.user.token;
            expect(token_login).toBeTruthy();
            expect(token_login).not.toBe(token_register);

            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + token_login }
                }
              })
              .del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          })
      });
  });

  it("Login failed (wrong password)", function(doneFn) {
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
      .expect('json', {
        user: {
          username: d.username.toLowerCase(), email: d.email.toLowerCase(),
          bio: d.bio, image: d.image
        }
      })
      .then((res_register: any) => {

        let token_register = res_register._body.user.token;
        expect(token_register).toBeTruthy();

        frisby
          .post('http://127.0.0.1:8080/api/users/login',
          { user: { email: d.email, password: d.password_new } })
          .expect('status', 422)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', { errors: { message: 'email or password is invalid' } })
          .then(() => {
            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + token_register }
                }
              })
              .del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          })
      });
  });

  it("Login failed (no email)", function(doneFn) {
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
      .expect('json', {
        user: {
          username: d.username.toLowerCase(), email: d.email.toLowerCase(),
          bio: d.bio, image: d.image
        }
      })
      .then((res_register: any) => {

        let token_register = res_register._body.user.token;
        expect(token_register).toBeTruthy();

        frisby
          .post('http://127.0.0.1:8080/api/users/login',
          { user: { email: '', password: '' } })
          .expect('status', 422)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', { errors: { email: "can't be blank" } })
          .then(() => {
            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + token_register }
                }
              })
              .del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          })
      });
  });

  it("Login failed (no password)", function(doneFn) {
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
      .expect('json', {
        user: {
          username: d.username.toLowerCase(), email: d.email.toLowerCase(),
          bio: d.bio, image: d.image
        }
      })
      .then((res_register: any) => {

        let token_register = res_register._body.user.token;
        expect(token_register).toBeTruthy();

        frisby
          .post('http://127.0.0.1:8080/api/users/login',
          { user: { email: d.email, password: '' } })
          .expect('status', 422)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', { errors: { password: "can't be blank" } })
          .then(() => {
            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + token_register }
                }
              })
              .del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          })
      });
  });

  it("Login failed (user not found)", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users/login',
      { user: { email: d.email, password: d.password } })
      .expect('status', 422)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { message: 'email or password is invalid' } })
      .done(doneFn);
  });
});
