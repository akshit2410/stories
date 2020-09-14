const express = require('express');
const app = express();
const Detail = require('./models/details');
const Story = require('./models/storyz');
const Arr = require('./models/array');
const D = require('./models/delete');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT||3000;
//connect to mongodb
let userid;
const dbUri="mongodb+srv://stories:stories123@stories.gltdd.mongodb.net/login?retryWrites=true&w=majority";

mongoose.connect(dbUri,{useNewUrlParser:true ,useUnifiedTopology:true})
.then((result)=>{
app.listen(PORT,()=>console.log('listening to 3000'))
}
)
.catch((err)=> console.log(err));
app.set('view engine','ejs');
////////////////////
app.use(function(req, res, next) {
    if (!req.user) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next();
});

app.use(express.static('public'));
app.get('/',(req,res)=>{
  res.render('index')
});
app.get('/register',(req,res)=>{
  res.render('register')
});
app.get('/login',(req,res)=>{

  res.render('login')
});


app.get('/story/:id',(req,res)=>{
  console.log(userid)
  const val=req.params.id;
  const deldata =new D({
    userid: userid,
    storyid:val,
  })
  D.create(deldata)
  const data = new Arr({
    storyid : userid,
    seen:[val]
  })

  Arr.findOne({storyid:userid})
  .then(user=>{
    if(user){
      let flag=false;
      console.log(user.seen);
      user.seen.forEach((item, i) => {
        if(item==val){
          flag=true;
        }
      }
    );
    if(flag==false){
      Arr.findOneAndUpdate({storyid: userid }, { $push: { seen: [val] }}, function(err, counte) {
          if (err) throw err;
       });
      Story.findOneAndUpdate({_id: val }, { $inc: { seq: 1 }}, function(err, counte) {
          if (err) throw err;
       });
    }
  }else {
    Arr.create(data);
      Story.findOneAndUpdate({_id: val }, { $inc: { seq: 1 }}, function(err, counte) {
          if (err) throw err;
       });

  }

  });

  Story.findById(val)
  .then(result =>{
    D.countDocuments(function (err, count) {
    res.render('story',{
      store:result,
      count:count
    })
    })
      });
  });

app.get('/homepage',function(req, res) {

  D.countDocuments(function (err, count) {
    if (!err && count != 0) {
      D.findOne({userid:userid}, function (err, doc) {
          if (err) {
              // handle error
          }

          doc.deleteOne(); //Removes the document
      })
    }
});


    // mongoose operations are asynchronous, so you need to wait
    Story.find({}, function(err, data) {
      console.log(data);
        // note that data is an array of objects, not a single object!
        res.render('homepage', {
            stories:data, val:userid
        });
    });
});

app.get('/logout',(req,res)=>{
  D.countDocuments(function (err, count) {
    if (!err && count != 0) {
      D.findOne({userid:userid}, function (err, doc) {
          if (err) {
              // handle error
          }
          doc.deleteOne(); //Removes the document
      })
    }
});
res.render('logout')
});

app.get('/createstory',(req,res)=>{
  D.countDocuments(function (err, count) {
    if (!err && count != 0) {
      D.findOne({userid:userid}, function (err, doc) {
          if (err) {
              // handle error
          }

          doc.deleteOne(); //Removes the document
      })
    }
});
  res.render('createstory')
});
//////////////////////
//register
app.post('/login',(req,res)=>{
  const data = new Detail({
    name:req.body.name,
    password : req.body.password,
    email : req.body.email,
    username : req.body.username
  });
  Detail.findOne({email:req.body.email})
  .then(user=>{
    if(!user){
      Detail.create(data)
      .then(user => {

        res.render('login');
      })
    }else {
      res.render("userexist");
    }
  })

});

//login
app.post('/homepage',(req,res)=>{
Detail.findOne({
  username: req.body.username
}).then(user =>{
  if (user){
  const buf1 = Buffer.from(user.password);
  const buf2 = Buffer.from(req.body.password);
  userid=user._id;
    if(Buffer.compare(buf1,buf2)==0){
      Story.find({}, function(err, data) {
        console.log(user);
          res.render('homepage', {
              stories:data,val:userid
          });
      });
    }else{
      res.render("wrongpass");
    }
  }else {
    res.render("notuser");
  }
})
});


/// for stories creation

app.post('/createstory',(req,res)=>{
  const info = new Story({
    title:req.body.title,
    storydes : req.body.storydes,
    storycontent : req.body.storycontent,
  });
  console.log(req.body);
  Story.findOne({storycontent:req.body.storycontent})
  .then(user=>{
    if(!user){
      Story.create(info)
      .then(user => {
        res.render('created');
      })
    }else {
      res.render("plagiarism");
    }
  })
});
