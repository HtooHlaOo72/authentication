require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const ejs=require('ejs');
const encrypt=require('mongoose-encryption');
const app=express();

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded(
    {extended:true}
));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true}
});

var secret =process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret ,encryptedFields:['password'] });


const User=mongoose.model('User',userSchema);


app.route('/')
.get((req,res)=>{
    res.render('home');
})


app.route('/register')
.post((req,res)=>{
    const registeredUser=new User({
        name:req.body.username,
        password:req.body.password
    });
    registeredUser.save((err)=>{
        if(err){
            res.send(err);
        }else{
            
            res.render('secrets');
        }
    })
    
})
.get((req,res)=>{
    res.render('register');
})


app.route('/login')
.get((req,res)=>{
    res.render('login')
})
.post((req,res)=>{
    const reqUserName=req.body.username;
    const reqPassword=req.body.password;
    
    User.findOne({name:reqUserName},(err,foundUser)=>{
        (!err)?
            (!foundUser)?
            res.send('email is invalid')
            :(foundUser.password!==reqPassword)?
                res.send('password don\'t match.')    
                :res.render('secrets')

        :res.status(404);
    })
});

app.listen(process.env.PORT||3000,()=>{
    console.log('Server is running at port 3000');
})