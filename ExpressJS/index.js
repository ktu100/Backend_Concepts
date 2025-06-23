// const express=require('express');

// const app=express();

// app.use(express.json());
// app.use(express.urlencoded({extended:true}));

// app.use((req,res,next)=>{
//     console.log("Middleware 1");
//     next();
// })

// app.use((req,res,next)=>{
//     console.log("Middleware 2");
//     next();
// })


// app.get("/",(req,res)=>{
//     res.send("Hello Everyone");
// })

// app.get("/about",(req,res)=>{
//     // let f=Math.floor(Math.random()*2);
//     // if(f==1)res.send("This is the about page");
//     // else return next(new Error("Error Handler"));
//     res.send("This is the about page");
// })

// app.use((req,res,next)=>{
//     // console.error(err.stack);
//     res.status(404).send("Page Not Found");
// })

// app.use((err,req,res,next)=>{
//     console.error(err.stack);
//     res.status(500).send("You got an error young man");
// })

// app.listen(3000,()=>{
//     console.log("Server is Listening");
// })

const express=require('express');
const app=express();
const fs=require('fs');

const path=require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));



app.get('/',(req,res)=>{
    const file=[];
    let count=0;
    fs.readdir('./files',(err,files)=>{
        files.forEach((val)=>{
            fs.readFile(`./files/${val}`,'utf-8',(err,data)=>{
                file.push({name:`${val}`,content:data});
                count++;
                if(count===files.length)res.render("test",{files:file})
            })
        })
    })
    
})

app.post('/create',(req,res)=>{
    const name=req.body.title.split(' ').join('');
    const data=req.body.Query;
    fs.writeFile(`./files/${name}.txt`,`${data}`,(err)=>{
        res.redirect('/');
    })
})

app.get('/file/:filename',(req,res)=>{
  const filepath = path.join(__dirname, 'files', req.params.filename);

    fs.readFile(filepath,"utf-8",(err,data)=>{
        res.send(data);
    })
})

app.get('/edit/:filename',(req,res)=>{
    res.render('edit',{filename:req.params.filename});
})

app.post('/edit/:filename',(req,res)=>{
    const old=path.join(__dirname,'files',req.params.filename);
    const newp=path.join(__dirname,'files',req.body.name);
    fs.rename(old,newp,()=>{
        res.redirect('/');
    })
})

app.get('/profile/:username/:age',(req,res)=>{
    const username=req.params.username;
    const age=req.params.age;
    res.send(`Hi ${username}, I know you are ${age} years old`);
})

app.listen(3000,()=>{
    console.log("Server Listening");
})