# Paraboloid-Blog

This is the repository of the blog software **Paraboloid** using a MEAN stack, i.e.
 it consists of *mongo* (database), *express* (routing), *angular2* (frontend) and *node*.
The blog software is mainly written in *typescript* and built by *gulp*.
All backend services are tested with *jasmine* and *frisby* furthermore.

The backend offers the following restful services:

User specific services:
- *POST /api/users:* Creation of a new user
- *POST /api/users/login:* Login to application
- *PUT /api/users/user:* Changing the current user
- *GET /api/users/user:* Reading current user
- *DELETE /api/users/user:* Deletion of current user

Article specific services:
- *POST /api/articles:* Creation of a new article
- *DELETE /api/articles/:slug:* Deletion of article *:slug*
- *GET /api/tags:* Reading available tags assigned to article
