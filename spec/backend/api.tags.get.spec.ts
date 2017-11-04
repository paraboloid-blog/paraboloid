import * as d from './api.data';

describe("Get /api/tags", () => {

  const frisby = require('frisby');

  it("Get empty tag list", function(doneFn) {
    frisby
      .get('http://127.0.0.1:8080/api/tags')
      .expect('status', 200)
      .expect('header', 'Content-Type', 'application/json; charset=utf-8')
      .expect('json', { tags: [] })
      .done(doneFn);
  });

  it("Query all tags", function(doneFn) {
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
        let token = res_user._body.user.token;
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
            let slug = res_article._body.article.slug;
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
                let slug_new = res_article_new._body.article.slug;
                expect(token).toBeTruthy();
                expect(slug).toBeTruthy();
                expect(slug_new).toBeTruthy();
                frisby
                  .get('http://127.0.0.1:8080/api/tags')
                  .expect('status', 200)
                  .expect('header', 'Content-Type', 'application/json; charset=utf-8')
                  .expect('json', {
                    tags:
                    d.tags.concat(d.tags_new).filter(
                      (elem: any, index: any, self: any) => {
                        return index == self.indexOf(elem);
                      })
                  })
                  .then((res_article_new: any) => {
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
                          });
                      });
                  });
              });
          });
      });
  });
});
