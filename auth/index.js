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
    const {username,email,password}=req.body;
            let salt=await bcrypt.genSalt(10);
            let hash=await bcrypt.hash(password,salt);
            let u=await user.create({"username":username,"email":email,"password":hash});
            res.send(u);
})

app.get('/login',async (req,res)=>{
    const users=await user.find();
    res.render("login",{users:users});
})

app.post('/login',async(req,res)=>{
    const {username,email,password}=req.body;
    const u=await user.findOne({"email":email});
    if(!u)res.send("Something is wrong with you")
    else{
        const result=await bcrypt.compare(password,u.password);
        if(!result)res.send("Something is wrong with you");
        else{
            let token=jwt.sign({"username":u.username},"secret");
            res.cookie("token",token);
            res.send("Login Successfull");
        }
    }
})

app.get('/dashboard',(req,res)=>{
    try{
        const data=jwt.verify(req.cookies.token,"secret");
    if(!data)res.send("Something is wrong with you");
    else res.send("Welcome to dashboard");
    }
    catch{
        res.send("Something wrong")
    }
})

app.get('/read',async (req,res)=>{
    const u=await user.find();
    res.send(u);
})





app.listen(3000,()=>{
    console.log("Server Listening");
})