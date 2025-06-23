const express=require('express');
const user = require('./modals/user');
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render("index");
})

// app.get('/create', async(req,res)=>{
//     const u=await user.create({
//         name:"Tony Soprano",
//         show:"The Sopranos",
//         image:"https://sopranos.fandom.com/wiki/Tony_Soprano"
//     })
//     res.send(u);
// })

app.post('/create',async(req,res)=>{
    const {id,name,show,image}=req.body;
    const data=await user.create({
        id:id,
        name:name,
        show:show,
        image:image
    })
    res.redirect('/read');
})

app.get('/read',async(req,res)=>{
    const data=await user.find();
    res.render("read",{data:data});
})

app.get('/delete/:id',async(req,res)=>{
    const id=req.params.id;
    const u=await user.findOneAndDelete({"id":id});
    res.redirect('/read');
})

app.get('/edit/:id',async(req,res)=>{
    const id=req.params.id;
    const data=await user.findOne({"id":id});
    res.render("edit",{data:data});
})

app.post('/edit/:id',async(req,res)=>{
    const {id,name,show,image} = req.body;
    const u=await user.findOneAndUpdate({"id":id},{id,name,show,image},{new:true});
    res.redirect('/read');
})

app.listen(3000,()=>{
    console.log("Server Listenting");
})