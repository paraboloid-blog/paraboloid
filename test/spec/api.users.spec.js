var frisby = require('frisby');
describe("tests/api.users.spec.ts", function () {
    it("Post /api/users", function (doneFn) {
        frisby.post('http://127.0.0.1:8080/api/users', { username: 'Test', email: 'test@mail.com', password: 'password' }, { headers: { json: true, 'Content-Type': 'application/json' } })
            .expect('status', 201)
            .done(doneFn);
    });
});
