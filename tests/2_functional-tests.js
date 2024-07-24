/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let book1 = {
  title: "Moby Dick"
};

suite('Functional Tests', function() {
  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  /*test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });*/
  /*
  * ----[END of EXAMPLE TEST]----
  */
  suite('Routing tests', function() {
    
    suite('POST /api/books with title => create book object/expect book object', function() {
    
      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .send(book1)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.hasAllKeys(res.body, ["_id", "title", "commentcount", "comments", "__v"]);
          assert.equal(res.body.commentcount, 0);
          book1['commentcount'] = res.body.commentcount;
          assert.equal(res.body.title, book1['title']);
          book1['_id'] = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, "missing required field title");
          done();
        });
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          for (let i in res.body) {
            assert.hasAllDeepKeys(res.body[i], ["_id", "title", "commentcount"]);
          }
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get('/api/books/' + book1['_id'] + '1234')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
        .request(server)
        .keepOpen()
        .get('/api/books/' + book1['_id'])
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          const elem = res.body[0];
          assert.hasAllKeys(elem, ["_id", "title", "comments"]);
          assert.equal(elem.title, book1['title']);
          assert.isArray(elem.comments);
          assert.isEmpty(elem.comments);
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/books/' + book1['_id'])
        .send({
          comment: 'here is a comment'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.hasAllKeys(res.body, ["_id", "title", "commentcount", "comments", "__v"]);
          assert.equal(res.body.commentcount, 1);
          assert.equal(res.body.title, book1['title']);
          assert.isArray(res.body.comments);
          assert.equal(res.body.comments[res.body.commentcount - 1], 'here is a comment');
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/books/' + book1['_id'])
        .send({
          comment: ''
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'missing required field comment');
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .post('/api/books/' + book1['_id'] + '1234')
        .send({
          comment: 'here is a comment'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete('/api/books/' + book1['_id'])
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'delete successful');
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .keepOpen()
        .delete('/api/books/' + book1['_id'])
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isString(res.body);
          assert.equal(res.body, 'no book exists to delete');
          done();
        });
      });
    });

  });

});
