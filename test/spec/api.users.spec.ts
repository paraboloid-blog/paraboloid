const frisby = require('frisby');

describe("tests/api.users.spec.ts", () => {

  beforeEach(() => {

    frisby.addExpectHandler('isUser1', function(response: any) {
      let json = response._body;
      expect(json.user.username).toBe('test');
      expect(json.user.email).toBe('test@mail.com');
    });

  });

  it("Post /api/users", function(doneFn) {

    frisby.post('http://127.0.0.1:8080/api/users',
      { username: 'test', email: 'test@mail.com', password: 'password' },
      { headers: { json: true, 'Content-Type': 'application/json' } })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('isUser1')
      .done(doneFn);

  });

  it("Delete /api/users/test", function(doneFn) {

    frisby.del('http://127.0.0.1:8080/api/users/test')
      .expect('status', 204)
      .done(doneFn);

  });

  afterEach(() => {
    frisby.removeExpectHandler('isUser1');
  });
});
