import * as d from './api.data';

describe("Get /api/articles/:slug", () => {

  const frisby = require('frisby');
  let token: string
  let slug: string;
  let slug_new: string;

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

  it("Query existing article", function(doneFn) {
    frisby
      .get(
      'http://127.0.0.1:8080/api/articles/' + slug
      )
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          slug: slug, title: d.title, description: d.description,
          body: d.body, tagList: d.tags
        }
      })
      .done(doneFn);
  });

  it("Query not existing article", function(doneFn) {
    frisby
      .get(
      'http://127.0.0.1:8080/api/articles/' + d.slug_invalid
      )
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
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
      .del('http://127.0.0.1:8080/api/articles/' + slug)
      .expect('status', 204)
      .then(() => {
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
});
