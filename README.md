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
List blog posts:
```
$ curl http://localhost:3000/posts 
```
Add new author:
```
$ curl -d 'firstName=João&lastName=Silva' http://localhost:3000/authors 
```
### Endpoints
```
/posts [GET, POST]
/posts?offset={n}&limit={n} [GET]
/posts/{id} [GET, PUT, DELETE]
/posts/permalink/{permalink} [GET]

/posts/{id}/comments [GET, POST]
/posts/{id}/comments?offset={n}&limit={n}&q={query} [GET]
/comments/{id} [GET, PUT, DELETE]

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
