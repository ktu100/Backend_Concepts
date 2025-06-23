const mongoose=require('mongoose');

const pSchema=mongoose.Schema({
    content:String,
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})

module.exports=mongoose.model('post',pSchema);