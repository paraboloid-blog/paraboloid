# Paraboloid-Blog

Source Code of Paraboloid-Blog

This is the repository for the blog software **Paraboloid** with a MEAN stack, i.e.
 it consists of mongo (database), express (routing), angular2 (frontend) and node.

The backend offers the following restful services:

User specific services:
- POST /api/users: Creation of a new user
- POST /api/users/login: Login to application
- PUT /api/users/user: Changing the current user
- GET /api/users/user: Read current user
- DELETE /api/users/user: Delete current user
Article specific services:
- POST /api/articles: Creation of a new article
- DELETE /api/articles/:slug: Deletion of article *:slug*
- GET /api/tags: Read available tags assigned to article
