const express=require('express')
const bodyparser= require('body-parser')
const app=express()
app.use(bodyparser.urlencoded({extended:true}))
const ejs=require('ejs')
const pg = require('pg')
var quiz
var question 
var isOver=false
var correct
var score=0
var ans
var min
var sec
var startingminutes=10
var time=startingminutes*60

const db= new pg.Client({
  //  order matters or serial matter
    user: "postgres",
    host: "localhost",
    database: "world",
    password: "vaibhav",
    port: 5432,
});
db.connect();
db.query('SELECT * FROM capitals', (err,res)=>
{
  if(err){
    console.log(err)
  }else{
    quiz=res.rows

  }

  db.end();

});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.post('/play',(req,res)=>
{
  ans =req.body.ans
  if(ans.toLowerCase()==correct)
  {
    score=score+1
    askques();
    res.redirect('/play')
  }
  else{
    isOver=true
    res.redirect('/oops')
  }
})

app.get('/oops',(req,res)=>
{ 
  res.render('oops',{score:score})
  score=0
 
})
app.get('/play',async(req,res)=>
{
 
  await askques();
  res.locals.score=0
  res.render('index',{quest:question.country,score:score})
})

 async function askques()
 {
  question = quiz[Math.floor(Math.random()*151)];
  correct=question.capital.toLowerCase()
 }

 app.get('/',(req,res)=>
{
  res.render('start');
})

app.listen(3000)
