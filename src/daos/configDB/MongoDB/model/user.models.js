import mongoose from "mongoose";

const userCollecction = "users";

const userSchema = new mongoose.Schema({
    //definimos las propiedades del documento user
    nombre:{
        type:String,
        required:true
    },
    apellido:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
},
{
    timestamps:true
});

export const UserModel = mongoose.model(userCollecction, userSchema);