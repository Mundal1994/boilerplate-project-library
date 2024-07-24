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

  app.route('/api/books')
    .get(function (req, res){
      Book.find({})
        .then(data => {
          let library = [];
          for (let indx in data) {
            library.push({
              "_id": data[indx]._id, 
              "title": data[indx].title, 
              "commentcount": data[indx].commentcount});
          }
          res.json(library);
      });
    })
    
    .post(function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.json('missing required field title');
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
      Book.deleteMany({}, (err, elem) => {
        if (err) {
          return;
        }

        res.json("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.json('missing required field id');
      }

      if (!mongoose.isValidObjectId(bookid)) {
        return res.json('no book exists');
      }

      Book.findById(bookid, function(err, data) {
        if (err || !data) {
          return res.json('no book exists');
        }

        let library = {
          _id: data._id, 
          title: data.title, 
          comments: data.comments
        };
        res.json(library);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.json('missing required field comment');
      }
      
      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (err, elem) => {
        if (err || !elem) {
          return res.json('no book exists');
        }

        elem.commentcount++;
        res.send(elem);
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.json('missing required field _id');
      }
      
      Book.findByIdAndDelete(bookid, (err, elem) => {
        if (err || !elem) {
          return res.json('no book exists');
        }

        elem.commentcount++;
        res.json('delete successful');
      })
    });

};
