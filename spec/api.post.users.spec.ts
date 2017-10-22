import * as crypto from 'crypto';

describe("Post /api/users", () => {

  const frisby = require('frisby');

  it("Create user with initial data", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      { user: { username: '', email: '', password: '' } })
      .expect('status', 422)
      .expect('json', {
        errors: {
          username: "can't be blank",
          email: "can't be blank",
          salt: "can't be blank",
          hash: "can't be blank"
        }
      })
      .done(doneFn);
  });

  it("Create new user 'test'", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: 'test', email: 'test@mail.com', password: 'password',
          bio: 'My life', image: 'img.png'
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        user: {
          username: 'test', email: 'test@mail.com',
          bio: 'My life', image: 'img.png'
        }
      })
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

  it("User 'test' already exists", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      { user: { username: 'test', email: 'test@mail.com', password: 'password' } })
      .expect('status', 201)
      .then((res: any) => {
        frisby
          .post('http://127.0.0.1:8080/api/users',
          { user: { username: 'test', email: 'test@mail.com', password: 'password' } })
          .expect('status', 422)
          .expect('json', {
            errors: {
              username: 'is already taken.',
              email: 'is already taken.'
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

  it("Invalid user has invalid mail", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      { user: { username: 'te-st', email: 'mail.com', password: 'password' } })
      .expect('status', 422)
      .expect('json')
      .expect('json', {
        errors: {
          username: 'is invalid',
          email: 'is invalid'
        }
      })
      .done(doneFn);
  });

  it("Maximal length of data exceeded", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: crypto.randomBytes(30).toString('hex'),
          email: crypto.randomBytes(50).toString('hex') + '@mail.com',
          bio: crypto.randomBytes(10000).toString('hex'),
          image: crypto.randomBytes(200).toString('hex'),
          password: 'password'
        }
      })
      .expect('status', 422)
      .expect('json')
      .then((json: any) => {
        let errors = json._body.errors;
        expect(errors.username).toContain('longer than the maximum allowed length');
        expect(errors.email).toContain('longer than the maximum allowed length');
        expect(errors.bio).toContain('longer than the maximum allowed length');
        expect(errors.image).toContain('longer than the maximum allowed length');
      })
      .done(doneFn);
  });
});
