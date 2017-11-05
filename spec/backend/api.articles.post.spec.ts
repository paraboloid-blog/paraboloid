import * as d from './api.data';

describe("Post /api/articles", () => {

  const frisby = require('frisby');
  let token: string;

  beforeAll((doneFn) => {
    frisby
      .post('http://127.0.0.1:8080/api/users',
      {
        user: {
          username: d.username, email: d.email, password: d.password,
          bio: d.bio, image: d.image
        }
      })
      .expect('status', 201)
      .then((res_user: any) => {
        token = res_user._body.user.token;
        expect(token).toBeTruthy();
        doneFn();
      });
  });

  it("Missing jwt-token", function(doneFn) {
    frisby
      .post('http://127.0.0.1:8080/api/articles',
      {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { authorization: 'failed' } })
      .done(doneFn);
  });

  it("Invalid jwt-token", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + d.token_invalid }
        }
      })
      .post('http://127.0.0.1:8080/api/articles',
      {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { authorization: 'failed' } })
      .done(doneFn);
  });

  it("Missing ID in jwt-payload", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_user } }
      })
      .post('http://127.0.0.1:8080/api/articles',
      {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { user: 'not valid' } })
      .done(doneFn);
  });

  it("Create article with invalid user", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_id } }
      })
      .post('http://127.0.0.1:8080/api/articles',
      {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { user: 'not valid' } })
      .done(doneFn);
  });

  it("Create new article", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .post('http://127.0.0.1:8080/api/articles',
      {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .expect('status', 201)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          title: d.title, description: d.description,
          body: d.body, tagList: d.tags,
          author: {
            username: d.username.toLowerCase(), email: d.email.toLowerCase(),
            bio: d.bio, image: d.image
          }
        }
      })
      .then((res_article: any) => {

        let slug = res_article._body.article.slug;

        frisby
          .setup({
            request: {
              headers: { 'Authorization': 'Bearer ' + token }
            }
          })
          .del('http://127.0.0.1:8080/api/articles/' + slug)
          .expect('status', 204)
          .done(doneFn);
      })
  });

  afterAll((doneFn) => {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .del('http://127.0.0.1:8080/api/users/user')
      .expect('status', 204)
      .done(doneFn);
  });
});
