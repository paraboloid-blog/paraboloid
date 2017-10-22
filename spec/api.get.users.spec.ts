describe("Get /api/users/user", () => {

  const frisby = require('frisby');
  const token_id = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZWM5Y2Q5ZDlkODZjNzY4N2NiYTcxYyJ9.Iqxjp9zj9bmgzCYhhGYhV-o5_HwxAOWwZK0uiNdEO0Q';
  const token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.FILrByQNl1Mx00RSZonmT3p5waGlFaymZJ3e3a5VBac';
  const token_invalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ==.vSRUKiX6KVqh+YMpxfzkgXOS/M7SWobEPv0jpBW3n8M=';

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + token_invalid } }
      })
      .get('http://127.0.0.1:8080/api/users/user')
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
        request: { headers: { 'Authorization': 'Bearer ' + token_user } }
      })
      .get('http://127.0.0.1:8080/api/users/user')
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
        request: { headers: { 'Authorization': 'Bearer ' + token_id } }
      })
      .get('http://127.0.0.1:8080/api/users/user')
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        errors: {
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Retrieve user 'test'", function(doneFn) {
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
      .then((res: any) => {
        frisby
          .setup({
            request: {
              headers: { 'Authorization': 'Bearer ' + res._body.user.token }
            }
          })
          .get('http://127.0.0.1:8080/api/users/user')
          .expect('status', 200)
          .expect('json', {
            user: {
              username: 'test', email: 'test@mail.com',
              bio: 'My life', image: 'img.png'
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
