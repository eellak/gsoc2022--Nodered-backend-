var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var UserSchema = new mongoose.Schema({
    // user_name: {
    //     type: String,
    //     unique: true,
    //     required:true,
    // },
    username:{
        type:String,
        unique:true,
    },
    port:{
        type:String,
        unique:true,
        trim: true,
        // required:true,
    }
    ,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    toc:{
        type: String,
        
    },
    instances: [
        {annotation:{
            type:String
        },
        accessibility:{
            type:String
        },
        
        }
    ]

    

});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model("User",UserSchema);