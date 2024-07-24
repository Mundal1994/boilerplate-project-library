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
      Book.deleteMany({}, (err, res) => {
        if (err) {
          return;
        }

        res.send({result: "complete delete successful"});
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.send({error: 'missing required field id'});
      }

      if (!mongoose.isValidObjectId(bookid)) {
        return res.json({error: 'no book exists'});
      }

      Book.findById(bookid, function(err, data) {
        if (err || !data) {
          return res.json({error: 'no book exists'});
        }

        let library = [{
          _id: data._id, 
          title: data.title, 
          comments: data.comments
        }];
        res.json(library);
      });
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (!comment) {
        return res.send({error: 'missing required field comment'});
      }
      
      Book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (err, elem) => {
        if (err || !elem) {
          return res.send({error: 'no book exists'});
        }

        elem.commentcount++;
        res.send(elem);
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      if (!bookid) {
        return res.send({error: 'missing required field _id'});
      }
      
      Book.findByIdAndDelete(bookid, (err, elem) => {
        if (err || !elem) {
          return res.send({error: 'no book exists to delete'});
        }

        elem.commentcount++;
        res.send({result: 'delete successful'});
      })
    });
  
};
