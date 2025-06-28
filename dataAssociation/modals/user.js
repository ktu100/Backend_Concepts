const mongoose=require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/practiceproj`);

const uSchema=mongoose.Schema({
    username:String,
    email:String,
    password:String,
    age:Number,
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'post'
        }
    ],
    profile:{
        type:String,
        default:"default.png"
    }
})

module.exports=mongoose.model("user",uSchema);