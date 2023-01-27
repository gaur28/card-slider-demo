
const { render } = require("ejs");
const express = require("express");
const bcrypt = require('bcryptjs');
const mongodb = require("mongodb");
const db = require("../data/database");
const { default: swal } = require("sweetalert2");
const ObjectId = mongodb.ObjectId;

const routes = express.Router();
routes.get('/signup', function(req,res){
  let sessionInputData = req.session.inputData;

  if(!sessionInputData){
    sessionInputData = {
      hasError:false,
      email: '',
      confirmEmail: '',
      password: '',
    };
  }req.session.inputData = null;

  res.render('signup');
});
routes.get('/login', function(req,res){

  let sessionInputData = req.session.inputData;

  if(!sessionInputData){
    sessionInputData = {
      hasError:false,
      email: '',
      password: '',
    };
  }req.session.inputData = null;

  res.render("login");
});

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
  if(!req.session.isAuthenticated){
    return res.status(401).render('401');
  }
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

  if(!req.session.isAuthenticated){
    return res.status(401).render('401');
  }
  res.render('createNewBook');
});

routes.post('/deleteBook/:id', async function(req,res){
  const bookId = req.params.id;
  const result = await db.getDb().collection('book').deleteOne({_id: new ObjectId(bookId)});
  res.json(result);
});

routes.post('/signup',async function(req,res){
  const userData = req.body;
  const email = userData.email;
  const confirmEmail = userData['confirm-email'];
  const password = userData.password;

  if(!email|| !confirmEmail|| !password|| password.trim()<6|| email !== confirmEmail){
    req.session.inputData = {
      hasError: true,
      message: 'invalid inputs- please check your credentials',
      email: email,
      confirmEmail:confirmEmail,
      password: password
    };

    req.session.save(function(){
      res.redirect('/signup');
    })
    return
  }

  const existingUser = await db.getDb().collection('users').findOne({email: email});

  if(existingUser){
   console.log('already user');
  return res.redirect('/signup');
  }

  const hashPassword = await bcrypt.hash(password,12);
  const user = {
    email: email,
    password: hashPassword
  }
  await db.getDb().collection('users').insertOne(user)
  res.redirect('/login');
});
routes.post('/login', async function(req,res){
  const userData = req.body;
  const email = userData.email;
  const password = userData.password;
  const user = {
    email: email,
    password:password
  }
  
  const existingUser = await db.getDb().collection('users').findOne({email: email});

  if(!existingUser){
    console.log("Not a user! create a account first");
    return res.redirect('/login');
  }


  const equalPassword = await bcrypt.compare(password,existingUser.password);

  if(!equalPassword){
    console.log('wrong Password');
    return res.redirect('/login');
  }
  req.session.user = {id: existingUser._id, email: existingUser.email,};
  req.session.isAuthenticated = true;
  req.session.save(function(){
    res.redirect('/');
  });
  
});

routes.post('/logout', function(req,res){
  req.session.user = null;
  req.session.isAuthenticated = false;

  res.redirect('/');
});



module.exports = routes;
