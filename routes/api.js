/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const bookList = require('../schema/schema')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const showBooks = []
      await bookList.find()
      .then((data)=>{
        if(data.length > 0){
          for(let i=0; i< data.length; i++) {
            showBooks.push( {"_id": data[i]._id, "title": data[i].title, "commentcount": data[i].comments.length } )

            // end of loop
            if(i+1 == data.length){
              res.json(showBooks)
            }
          }
        } else res.json([{_id:'', title: '', commentcount: 0}])       
      })
      .catch((err)=>{
        res.json([{_id:'', title: '', commentcount: 0}])
      })
      
    })
    
    .post(async function (req, res){      
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if(title){
        const addNewBook = new bookList({
          title: title
        })

        await addNewBook.save()
        .then((data)=>{
          if(data){
            res.json({ _id: data._id, title: data.title })
          } else {
            res.send("Unknown error in saving new book!")
          }
        })
        .catch((err)=>{
          res.send("Unknown error in saving new book!")
        })
      } else {
        res.send("missing required field title")
      }          
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      await bookList.deleteMany({})
      .then((data)=>{
        res.send('complete delete successful')
      })
      .catch((err)=>{
        res.send('can\'t delete books!')
      })
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      await bookList.findOne({ _id: bookid })
      .then((data)=>{
        if(data){
          res.json({"_id": data._id, "title": data.title, "comments": data.comments})
        } 
        else res.send('no book exists')
      })
      .catch((err)=>{
        res.send('no book exists')
      })
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      await bookList.findOne({ _id: bookid })
      .then(async (data)=>{        
        if(data){

          //check comment
          if(comment){
            data.comments.push( comment )
            
            await data.save()
            .then((result)=>{
              if(result){
                res.json({"_id": result._id, "title": result.title, "comments": result.comments})
              } else {
                res.send("can\'t save comment")
              }
            })
            .catch((err)=>{
              res.send("can\'t save comment")
            })
          }
          else {
            res.send('missing required field comment')
          }
          
        } 
        else res.send('no book exists')        
      })
      .catch((err)=>{
        res.send('no book exists')
      })
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      await bookList.findOne({ _id: bookid })
      .then(async (data)=>{
        if(data){
          await bookList.findByIdAndDelete(bookid)
          .then((result)=>{
            res.send('delete successful')
          })
          .catch((err)=>{
            res.send('delete incomplete')
          })
        } 
        else res.send('no book exists')
      })
      .catch((err)=>{
        res.send('no book exists')
      })
    });

};
