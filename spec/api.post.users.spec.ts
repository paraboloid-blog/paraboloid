import * as d from './api.data';

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
          username: d.username, email: d.email, password: d.password,
          bio: d.bio, image: d.image
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        user: {
          username: d.username, email: d.email,
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
          .del('http://127.0.0.1:8080/api/users/user')
          .expect('status', 204)
          .done(doneFn);
      });
  });

  it("User 'test' already exists", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      { user: { username: d.username, email: d.email, password: d.password } })
      .expect('status', 201)
      .then((res: any) => {
        frisby
          .post('http://127.0.0.1:8080/api/users',
          { user: { username: d.username, email: d.email, password: d.password } })
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

  it("Invalid user has invalid mail and picture", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: d.username_invalid, email: d.email_invalid,
          image: d.image_invalid, password: d.password
        }
      })
      .expect('status', 422)
      .expect('json')
      .expect('json', {
        errors: {
          username: 'is invalid',
          email: 'is invalid',
          image: 'is invalid'
        }
      })
      .done(doneFn);
  });

  it("Maximal length of data exceeded", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: d.username_long,
          email: d.email_long,
          bio: d.bio_long,
          image: d.image_long,
          password: d.password
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
