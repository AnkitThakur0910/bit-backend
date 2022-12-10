const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// const axios = require('axios');
// const circularjson = require('circular-json');
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const url = "mongodb+srv://ankit0910:Ankit0910%40@cluster0.rnadpz6.mongodb.net/crypto";

function verifytoken(req,res,next){
  

  if(!req.headers.authorization)
  {
    return res.status(401).send('ankit')
  }
  console.log(req.headers.authorization)
  let token = req.headers.authorization.split(" ")[1];
  console.log(token)
  if(token===null)
  {
    return res.status(401).send('kumar')
  }
  console.log(process.env.JWT_KEY)
  let payload = jwt.verify(token, process.env.JWT_KEY)
  if(!payload)
  {
    return res.status(401).send('thakur')
  }
  next()
}

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
  
 
});
const productschema = new mongoose.Schema({username:String,password:String});
const productsmodels  = mongoose.model('userinfos',productschema);

app.post('/register',async (req,res)=>{
    // const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    // const str = circularjson.stringify(response.data);
    // res.send(JSON.parse(str));
    // res.end();
   
 productsmodels.find({username:req.body.username},async (err,user)=>{
   console.log(user)
    if(err)
    {
        throw err;
    }
    else if(user.length!=0){
      console.log(user);
        res.status(401).send('invalid usernmae');
    }
    else{
    const data = new productsmodels({username:req.body.username,password:req.body.password});
    let ans = await data.save();
    console.log(ans);
    var token = jwt.sign(req.body.username, process.env.JWT_KEY);
    res.status(200).send({token});
    
 }});   
})

app.post('/login',async(req,res)=>{
  const result =  productsmodels.find({username:req.body.username},(err,user)=>{
    console.log(user)
    if(err)
    {
      throw err;
    }
    else if(!user.length)
    {
    res.status(401).send('invalid user');
    }
    else if(user[0].password!=req.body.password)
    {
      res.status(401).send('invalid password');
    }
    else{
      let payload = req.body.username;
      var token = jwt.sign(payload, process.env.JWT_KEY);
      console.log(token)
      res.status(201).send({token});
    }

  })

});

app.get('/landing',verifytoken,(req,res)=>{
  
  res.status(201).send('nice')
})

port = process.env.port||8000;
app.listen(port);
console.log(port);