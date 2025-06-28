const express=require('express');
const app=express();

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const user = require('./modals/user');
const post = require('./modals/post');
const multer=require('multer');
const crypto=require('crypto');
const path=require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))

app.set('view engine','ejs');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(15,(err,bytes)=>{
        const fn=bytes.toString("hex")+path.extname(file.originalname);
    cb(null, fn)
    })
  }
})

const upload = multer({ storage: storage })


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

app.get('/profile',isLoggedIn,async (req,res)=>{
    const u=await user.findOne({"username":req.user.username}).populate("posts");
    res.render("profile",{user:u});
})

app.post('/create/post',isLoggedIn,async (req,res)=>{
    const u=await user.findOne({"username":req.user.username});
    const newpost=await  post.create({
        content:req.body.post,
        userId:u._id
    })

    u.posts.push(newpost._id);
    u.save();
    res.redirect('/profile');
})

app.get('/like/:id',isLoggedIn,async (req,res)=>{
    const id=req.params.id;
    const p=await post.findOne({_id:id});
    if(p.likes.indexOf(req.user._id)==-1){
        p.likes.push(req.user._id);
    }
    else {
        p.likes.splice(p.likes.indexOf(req.user._id),1);
    }
    await p.save();
    res.redirect('/profile');
})

app.get('/edit/:id',isLoggedIn,async (req,res)=>{
    const id=req.params.id;
    const p=await post.findOne({_id:id});
    res.render("edit",{user:req.user,post:p});
})

app.post('/edit/:id',isLoggedIn,async (req,res)=>{
    const u=await user.findOne({"username":req.user.username});
    const id=req.params.id;
    const p=await post.findOne({_id:id});
    await post.findOneAndUpdate({
        _id:id,
    },
    {content:req.body.content},
)
    res.redirect('/profile');
})

app.get('/upload',isLoggedIn,async(req,res)=>{
    res.render("upload");
})

app.post('/upload',isLoggedIn,upload.single('image'),async (req,res)=>{
    const u=await user.findOne({"username":req.user.username});
    u.profile=req.file.filename;
    await u.save();
    res.redirect('/profile');
})

app.get('/logout',(req,res)=>{
    res.clearCookie("token");
    res.send("You are Logged Out");
})





app.listen(3000,()=>{
    console.log("Server Listening");
})