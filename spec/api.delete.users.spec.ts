describe("Delete /api/users/user", () => {

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
        request: {
          headers: {
            'Authorization': 'Bearer ' + token_id
          }
        }
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
    frisby.del('http://127.0.0.1:8080/api/users/user')
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
    frisby.post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: 'test', email: 'test@mail.com', password: 'password'
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .then(() => {
        frisby.del('http://127.0.0.1:8080/api/users/user')
          .expect('status', 204)
          .done(doneFn);
      });
  });
});
