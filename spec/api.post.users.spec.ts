describe("Post /api/users", () => {

  const frisby = require('frisby');
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ.VekQNE0AcAraBKzv1j-6PXhZz3F7eyW00x3fUbYhEBc';

  beforeAll(() => {

    frisby.globalSetup({
      request: {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }
    });
  });

  it("Create user with initial data", function(doneFn) {
    frisby.post('http://127.0.0.1:8080/api/users',
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
    frisby.post('http://127.0.0.1:8080/api/users',
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
        frisby.del('http://127.0.0.1:8080/api/users/user')
          .expect('status', 204)
          .done(doneFn);
      });
  });

  it("User 'test' already exists", function(doneFn) {
    frisby.post('http://127.0.0.1:8080/api/users',
      { user: { username: 'test', email: 'test@mail.com', password: 'password' } })
      .expect('status', 201)
      .then(() => {
        frisby.post('http://127.0.0.1:8080/api/users',
          { user: { username: 'test', email: 'test@mail.com', password: 'password' } })
          .expect('status', 422)
          .expect('json', {
            errors: {
              username: 'is already taken.',
              email: 'is already taken.'
            }
          })
          .then(() => {
            frisby.del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          });
      });
  });

  it("Invalid user has invalid mail", function(doneFn) {
    frisby.post('http://127.0.0.1:8080/api/users',
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
});
