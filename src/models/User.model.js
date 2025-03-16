import mongoose,{Schema} from "mongoose"; 

export const UserSchema = new Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        lowercase:true,
        unique:true,
        index:true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true
    },
    device : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
   
    password : {
        type : String,
        required : [true, 'Password is required ']
    },

})

const UserModel = mongoose.model("User",UserSchema)

export default UserModel