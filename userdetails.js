const mongoose = require('mongoose');
const userDetailsSchema= new mongoose.Schema(
    {      
        nameofuser : String,
        email: {type: String, unique:true},
        password: String
    },
    {
        collection: "userInfo"
    },
    {
        timestamps: true
    }
)

mongoose.model("userInfo",userDetailsSchema);