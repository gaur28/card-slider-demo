
const { render } = require("ejs");
const express = require("express");
const mongodb = require("mongodb");

const db = require("../data/database");
const ObjectId = mongodb.ObjectId;

const routes = express.Router();
routes.post('/createNewBook', async function(req,res){
  const bookInfo = {
    title: req.body.title,
    summary:req.body.summary,
    name:req.body.name,
    email:req.body.email
  };
  console.log(bookInfo);
  const book = await db.getDb().collection('book').insertOne(bookInfo);
  console.log(book);
  res.json(book);


});

routes.get("/", async function (req, res) {
  const books = await db
    .getDb()
    .collection("book")
    .find({}, { _id: 1, title: 1, name: 1, summary: 1,class:1 })
    .toArray();
  console.log(books);
  res.render("index", { books: books });
});
routes.post('/searchResults', async function(req,res){
  const bookTitle = req.body.searchResult;
  console.log(bookTitle)
  const book = await db.getDb().collection('book').find({title: bookTitle}, {title:1, name:0, summary:0, email:0}).toArray(); 
  console.log(book)
  
  res.render('searchResult', {book:book});
  
  });


routes.get("/bookInfo/:id", async function (req, res) {
  const bookId = req.params.id;
  const book = await db
    .getDb()
    .collection("book")
    .findOne(
      { _id: new ObjectId(bookId) },
      { _id:1, title: 0, author: 0, summary: 0 }
    );
  console.log(book);
  res.render("bookInfo", { book: book });
});

routes.get("/editBook/:id", async function (req, res) {
   const bookId = req.params.id;
   const book = await db.getDb().collection('book').findOne({_id: new ObjectId(bookId)},{title:0,name:0,summary:0})
    console.log(book)
  res.render('editBook', {book:book});
});

routes.post('/editBook/:id', async function(req,res){
    const bookId = req.params.id;
    const result = await db.getDb().collection('book').updateOne({_id : new ObjectId(bookId)}, {$set:{
        title: req.body.title,
        name: req.body.name,
        summary: req.body.summary,
        email:req.body.email

    }});
    res.json({message:'book Edited'});
});
routes.get('/searchResults', function(req,res){
  res.render('searchResult');
});



routes.get('/createNewBook', function(req,res){
  res.render('createNewBook');
});

routes.post('/deleteBook/:id', async function(req,res){
  const bookId = req.params.id;
  const result = await db.getDb().collection('book').deleteOne({_id: new ObjectId(bookId)});
  res.json(result);
});



module.exports = routes;
