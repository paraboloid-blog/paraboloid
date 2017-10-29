import * as d from './api.data';

xdescribe("GET /api/articles", () => {

  const frisby = require('frisby');

  class Init {

    public res_user: any;
    public res_article: any;

    setUser(res_user: any) {
      res_user = res_user;
    }
    createUser(setUser:any): any {
      frisby
        .post('http://127.0.0.1:8080/api/users',
        {
          user: {
            username: d.username, email: d.email, password: d.password,
            bio: d.bio, image: d.image
          }
        })
        .then((res_user: any) => {
          setUser(res_user);
        });
    }
  }

  let userSpy: jasmine.Spy;
  let init = new Init();

  beforeEach(() => {
    userSpy = spyOn(init, 'setUser').and.callThrough();
    init.createUser(init.setUser);
  });

  it("Query articles", function(doneFn) {
    expect(userSpy).toHaveBeenCalled();
    doneFn();
  });

  afterEach(() => {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + init.res_user._body.user.token }
        }
      })
      .del('http://127.0.0.1:8080/api/users/user');
  })
});
