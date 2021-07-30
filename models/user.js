const mongoose=require('mongoose')
const Schema=mongoose.Schema  //check this if there problems
const passportLocalMongoose=require('passport-local-mongoose')

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',userSchema)