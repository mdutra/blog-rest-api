## Blog REST API

### Installation
Dependencies: Node.js, NPM and MongoDB.
```
$ npm install
```
### Usage
Store fake data on the database:
```
$ npm run populatedb
```
Start the MongoDB server and run:
```
$ npm run serve
```
### Examples
Get one blog post by permalink
```
$ curl http://localhost:3000/posts/permalink/Um-titulo-qualquer
```
Blog posts pagination (3 at a time):
```
$ curl "localhost:3000/posts?offset=0&limit=3" 
$ curl "localhost:3000/posts?offset=3&limit=3" 
$ curl "localhost:3000/posts?offset=6&limit=3" 
```
Add new author:
```
$ curl -d 'firstName=João&lastName=Silva' http://localhost:3000/authors 
```
### All endpoints
Blog posts:
```
/posts [GET, POST]
/posts?offset={n}&limit={n} [GET]
/posts/{id} [GET, PUT, DELETE]
/posts/permalink/{permalink} [GET]
```
Comments:
```
/posts/{id}/comments [GET, POST]
/posts/{id}/comments?offset={n}&limit={n}&q={query} [GET]
/comments/{id} [GET, PUT, DELETE]
```
Authors:
```
/authors [GET, POST]
/authors?offset={n}&limit={n} [GET]
/authors/{id} [GET, PUT, DELETE]
```
### Development scripts
```
$ DEBUG='blog-api:*' npm start
$ npm test
$ npm run lint
```
