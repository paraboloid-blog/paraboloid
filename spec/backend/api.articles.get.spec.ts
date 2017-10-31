import * as d from './api.data';

describe("GET /api/articles", () => {

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
            frisby
              .setup({
                request: {
                  headers: { 'Authorization': 'Bearer ' + token }
                }
              })
              .post('http://127.0.0.1:8080/api/articles',
              {
                article: {
                  title: d.title_new, description: d.description_new,
                  body: d.body_new, tagList: d.tags_new
                }
              })
              .expect('status', 201)
              .then((res_article_new: any) => {
                slug_new = res_article_new._body.article.slug;
                doneFn();
              });
          });
      });
  });

  it("Query articles (invalid offset)", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get(
      'http://127.0.0.1:8080/api/articles' +
      '?author=' + d.username +
      '&offset=10'
      )
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [],
          articlesCount: 2
        }
      })
      .done(doneFn);
  });

  it("Query articles (invalid user)", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get(
      'http://127.0.0.1:8080/api/articles' +
      '?author=' + d.username_new
      )
      .expect('status', 404)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [],
          articlesCount: 0
        }
      })
      .done(doneFn);
  });

  it("Query articles (latest article found)", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get(
      'http://127.0.0.1:8080/api/articles' +
      '?author=' + d.username +
      '&limit=1'
      )
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [{
            slug: slug_new, title: d.title_new, description: d.description_new,
            body: d.body_new, tagList: d.tags_new
          }],
          articlesCount: 2
        }
      })
      .done(doneFn);
  });

  it("Query articles (oldest article found)", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get(
      'http://127.0.0.1:8080/api/articles' +
      '?limit=1' +
      '&offset=1' +
      '&author=' + d.username
      )
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [{
            slug: slug, title: d.title, description: d.description,
            body: d.body, tagList: d.tags
          }],
          articlesCount: 2
        }
      })
      .done(doneFn);
  });

  it("Query articles (special author)", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get(
      'http://127.0.0.1:8080/api/articles' +
      '?author=' + d.username +
      '&limit=2' +
      '&offset=0'
      )
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [{
            slug: slug, title: d.title, description: d.description,
            body: d.body, tagList: d.tags
          },
          {
            slug: slug_new, title: d.title_new, description: d.description_new,
            body: d.body_new, tagList: d.tags_new
          }],
          articlesCount: 2
        }
      })
      .done(doneFn);
  });

  it("Query all articles", function(doneFn) {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .get('http://127.0.0.1:8080/api/articles')
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', {
        article: {
          articles: [{
            slug: slug, title: d.title, description: d.description,
            body: d.body, tagList: d.tags
          },
          {
            slug: slug_new, title: d.title_new, description: d.description_new,
            body: d.body_new, tagList: d.tags_new
          }],
          articlesCount: 2
        }
      })
      .done(doneFn);
  });

  afterAll((doneFn) => {
    frisby
      .setup({
        request: {
          headers: { 'Authorization': 'Bearer ' + token }
        }
      })
      .del('http://127.0.0.1:8080/api/articles/' + slug_new)
      .expect('status', 204)
      .then(() => {
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
          })
      })
  })
});
