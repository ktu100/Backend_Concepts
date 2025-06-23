const express=require('express');
const app=express();

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const user = require('./modals/user');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render("index");
})

app.post('/create',async(req,res)=>{
    const {username,email,password,age}=req.body;
            let salt=await bcrypt.genSalt(10);
            let hash=await bcrypt.hash(password,salt);
            let u=await user.create({"username":username,"email":email,"password":hash,"age":age});
            res.send(u);
})

app.get('/login',async (req,res)=>{
    const users=await user.find();
    res.render("login",{users:users});
})

app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    const u=await user.findOne({"username":username});
    if(!u)res.send("Something is wrong with you")
    else{
        const result=await bcrypt.compare(password,u.password);
        if(!result)res.send("Something is wrong with you");
        else{
            let token=jwt.sign({"username":u.username,"email":u.email},"secret");
            res.cookie("token",token);
            res.send("Login Successfull");
        }
    }
})



const isLoggedIn=(req,res,next)=>{
    const token = req.cookies.token;
  if (!token) return res.send("You must log in first");
     try {
    const data = jwt.verify(req.cookies.token, "secret");
    req.user = data; // attach user info to request
    next();
  } catch (err) {
    return res.send("Invalid or expired token");
  }
}

app.get('/dashboard',isLoggedIn,(req,res)=>{
    res.send(`Welcome to dashboard ${req.user.username}`);
})

app.get('/logout',(req,res)=>{
    res.clearCookie("token");
    res.send("You are Logged Out");
})





app.listen(3000,()=>{
    console.log("Server Listening");
})