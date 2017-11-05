import * as d from './api.data';

describe("Delete /api/articles/:slug", () => {

  const frisby = require('frisby');
  let token: string;
  let token_new: string;
  let slug: string;

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
        frisby
          .post('http://127.0.0.1:8080/api/users',
          {
            user: {
              username: d.username_new, email: d.email_new, password: d.password_new,
              bio: d.bio_new, image: d.image_new
            }
          })
          .expect('status', 201)
          .then((res_user_new: any) => {
            token_new = res_user_new._body.user.token;
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
              .then((res_article: any) => {
                slug = res_article._body.article.slug;
                expect(token).toBeTruthy();
                expect(slug).toBeTruthy();
                doneFn();
              });
          });
      });
  });

  it("Missing jwt-token", function(doneFn) {
    frisby
      .del('http://127.0.0.1:8080/api/articles/' + slug)
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
      .del('http://127.0.0.1:8080/api/articles/' + slug)
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
      .del('http://127.0.0.1:8080/api/articles/' + slug)
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { user: 'not valid' } })
      .done(doneFn);
  });

  it("Delete article with invalid user", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + d.token_id } }
      })
      .del('http://127.0.0.1:8080/api/articles/' + slug)
      .expect('status', 401)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { user: 'not valid' } })
      .done(doneFn);
  });

  it("Delete article with wrong user", function(doneFn) {
    frisby
      .setup({
        request: { headers: { 'Authorization': 'Bearer ' + token_new } }
      })
      .del('http://127.0.0.1:8080/api/articles/' + slug)
      .expect('status', 403)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { errors: { article: 'may not be deleted' } })
      .done(doneFn);
  });

  it("Delete existing article", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .del('http://127.0.0.1:8080/api/articles/' + slug)
      .expect('status', 204)
      .done(doneFn);
  });

  it("Delete non existing article", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .del('http://127.0.0.1:8080/api/articles/' + d.slug_invalid)
      .expect('status', 404)
      .expect('json', { errors: { article: 'not valid' } })
      .done(doneFn);
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
      .then(() => {
        frisby
          .setup({
            request: {
              headers: { 'Authorization': 'Bearer ' + token_new }
            }
          })
          .del('http://127.0.0.1:8080/api/users/user')
          .expect('status', 204)
          .done(doneFn);
      });
  });
});
