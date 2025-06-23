const mongoose=require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/practice`);
// mongodb://127.0.0.1:27017/mongotut

const uSchema=mongoose.Schema({
    id:Number,
    name:String,
    show:String,
    image:String
})

module.exports=mongoose.model("tvshows",uSchema);