const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const cors = require('cors');
const multer = require('multer');


app.use(cors());

mongoose.connect("mongodb://localhost:27017/carRentalDb");
mongoose.connection.on('open', () => {
  console.log('Connected to mongodb server.');
  mongoose.connection.db.listCollections().toArray(function (err, names) {
    console.log(names);
   });
})

//this maintain our req.body 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
let upload = multer({ dest: 'uploads/' })

//creating model of user
const Users = mongoose.model('users', {
    name: String,
    user_id: Number,
    email: String,
    password: String,
    date_added: Date
   });

//creating model for admin
const Admins = mongoose.model('admins', {
  name: String,
  admin_id: Number,
  email: String,
  password: String,
  date_added: Date
 });

//creating model for cars
const Cars = mongoose.model('cars', {
  name: String,
  car_id: Number,
  path: String,
  price: String,
  date_added: Date
 });










//storing admoin panel to db 
app.post('/file', upload.single('file'), (req, res, next) => {
  const file = req.file;
  var body  = { name: req.body.name, path: req.file.path ,price : req.body.price };
  console.log("my front end data is  ",body);

  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
       
  try{
    const Car = new Cars(body);
    
    const result =  Car.save();
    res.send({
      message: 'Car saved succesfully  successful'
    });
    
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error in savings admin panel to db'}).status(401);
      };
    
})

//get all details of admin pannel 
app.get('/adminpanel', async (req, res) => {

  const allStudents = await Cars.find();
  console.log('allStudents', allStudents);

  res.send(allStudents);
});












//signup user func
app.post('/signup', async (req, res) => {
    const body = req.body;
    console.log('req.body', body)
      try{
    const User = new Users(body);
    
    const result = await User.save();
    res.send({
      message: 'user signup successful'
    });
    
      }
      catch(ex){
        console.log('ex',ex);
        res.send({message: 'Error'}).status(401);
      };

    });



    //user login function

    app.post('/login',  async (req, res) => {
      const body = req.body;
      console.log('req.body', body);
  
      const email = body.email;
  
      // lets check if email exists
  
      const result = await Users.findOne({"email":  email});
      if(!result) // this means result is null
      {
        res.status(401).send({
          Error: 'This user doesnot exists. Please signup first'
         });
      }
      else{
        // email did exist
        // so lets match password
  
        if(body.password === result.password){
  
          // great, allow this user access
  
          console.log('match');
          
  
          res.send({message: 'Successfully Logged in'});
        }
  
          else{
  
            console.log('password doesnot match');
  
            res.status(401).send({message: 'Wrong email or Password'});
          }
  
  
      }
  
    });     

//admin sign up function
app.post('/signupadmin', async (req, res) => {
  const body = req.body;
  console.log('req.body', body)
    try{
  const admin = new Admins(body);
  
  const result = await admin.save();
  res.send({
    message: 'Admin signup successful'
  });
  
    }
    catch(ex){
      console.log('ex',ex);
      res.send({message: 'Error'}).status(401);
    };

  });


     //admin Login sucsessFull

     app.post('/loginAdmin',  async (req, res) => {
      const body = req.body;
      console.log('req.body', body);
  
      const email = body.email;
  
      // lets check if email exists
  
      const result = await Admins.findOne({"email":  email});
      if(!result) // this means result is null
      {
        res.status(401).send({
          Error: 'This user doesnot exists. Please signup first'
         });
      }
      else{
        // email did exist
        // so lets match password
  
        if(body.password === result.password){
  
          // great, allow this user access
  
          console.log('match');
          
  
          res.send({message: 'Admin Successfully Logged in'});
        }
  
          else{
  
            console.log('password doesnot match');
  
            res.status(401).send({message: 'Wrong email or Password'});
          }
  
  
      }
  
    });     



    //app.get /
app.get('/', (req, res) => { 
    res.send('hello world');
  });


  app.get('/Users', (req, res) => { 
    res.send('Hello Users');
  });

app.listen(3000, () => {
  console.log('Express application running on localhost:3000');
});