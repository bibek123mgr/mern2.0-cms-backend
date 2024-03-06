const mongoose=require('mongoose')
const {Schema}=mongoose

const bookschema=new Schema({
   name:{
    type:String
   },
   price:{
      type:Number
   },
   isbn:{
    type:String,
    unique:true
   },
   author:{
    type:String
   },
   publication:{
    type:String
   },
   publishAt:{
    type:String
   },
   imageUrl:{
    type:String
   }
})

module.exports=mongoose.model('Book',bookschema)