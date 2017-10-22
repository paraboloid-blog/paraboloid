describe("Put /api/users/user", () => {

  const frisby = require('frisby');
  const token_test = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ.VekQNE0AcAraBKzv1j-6PXhZz3F7eyW00x3fUbYhEBc';
  const token_id = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlgifQ.sqx-AMQVHq2dgwMVqxqlUuAMGiZoC9k41Xg_MGhSBr0';
  const token_invalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ==.vSRUKiX6KVqh+YMpxfzkgXOS/M7SWobEPv0jpBW3n8M=';

  beforeAll(() => {
    frisby.globalSetup({
      request: {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token_test
        }
      }
    });
  });

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: {
            'Authorization': 'Bearer ' + token_invalid
          }
        }
      })
      .put('http://127.0.0.1:8080/api/users/user')
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
        request: {
          headers: {
            'Authorization': 'Bearer ' + token_id
          }
        }
      })
      .put('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Update non existing user 'test'", function(doneFn) {
    frisby.put('http://127.0.0.1:8080/api/users/user',
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
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Change mail, bio and image of user 'test'", function(doneFn) {
    frisby.post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: 'test', email: 'test@mail.com', password: 'password',
          bio: 'My life', image: 'img.png'
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json',
      {
        user: {
          username: 'test', email: 'test@mail.com',
          bio: 'My life', image: 'img.png'
        }
      })
      .then(() => {
        frisby.put('http://127.0.0.1:8080/api/users/user',
          {
            user: {
              username: 'test', email: 'test@mail.de',
              bio: 'My life!', image: 'image.png'
            }
          })
          .expect('status', 200)
          .expect('header', 'Content-Type', 'application/json; charset=utf-8')
          .expect('json', {
            user: {
              username: 'test', email: 'test@mail.de',
              bio: 'My life!', image: 'image.png'
            }
          })
          .then(() => {
            frisby.del('http://127.0.0.1:8080/api/users/user')
              .expect('status', 204)
              .done(doneFn);
          });
      });
  });
});
