/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useFindAndModify: false });

  const Schema = mongoose.Schema;
  const bookSchema = new Schema({
    title: {type: String, required: true},
    comments: {type: Array, required: false},
    commentcount: {type: Number, required: false, default: 0}
  });
  
  const Book = mongoose.model('Library', bookSchema);


//{"comments":["here is a comment"],"_id":"66a011e61437920013869532","title":"Mody Dick","commentcount":1,"__v":1}

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        res.send({error: 'missing required field title'});
        return;
      }

      const book = new Book({
        title: title
      });

      book.save(function(err, data) {
        if (err) {
          return;
        }

        res.send(book);
      })
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
