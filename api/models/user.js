var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

// trim every string fields of complete document
mongoose.Schema.Types.String.set("trim", true);

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
        // required:true,
    },
    occupied:{
        type:Boolean,
        default:false
    }
    ,
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    // password: {
    //     type: String,
    //     required: true,
    // },
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
        flows:{type:Object},
        nodes:{type:Object}
        }
    ]

    

});

// It will create createdAt and updatedAt field automatically and 
// also update their values on every time on performing create and update operation
UserSchema.set("timestamps", true);

// UserSchema.methods.comparePassword = function(password) {
//     return bcrypt.compareSync(password, this.password);
// }

module.exports = mongoose.model("User",UserSchema);