describe("Put /api/users/user", () => {

  const frisby = require('frisby');
  const token_id = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZWM5Y2Q5ZDlkODZjNzY4N2NiYTcxYyJ9.Iqxjp9zj9bmgzCYhhGYhV-o5_HwxAOWwZK0uiNdEO0Q';
  const token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.FILrByQNl1Mx00RSZonmT3p5waGlFaymZJ3e3a5VBac';
  const token_invalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ==.vSRUKiX6KVqh+YMpxfzkgXOS/M7SWobEPv0jpBW3n8M=';

  //   beforeAll(() => {
  //     frisby.globalSetup({
  //       request: {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': 'Bearer ' + token_test
  //         }
  //       }
  //     });
  //   });

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + token_invalid } }
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
        request: { headers: { 'Authorization': 'Bearer ' + token_user } }
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
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + token_id } }
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
          message: 'User not valid'
        }
      })
      .done(doneFn);
  });

  it("Change mail, bio and image of user 'test'", function(doneFn) {
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
      .expect('json',
      {
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
          .put('http://127.0.0.1:8080/api/users/user',
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
