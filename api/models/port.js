var mongoose = require("mongoose");


var PortSchema = new mongoose.Schema({
    lastPort:{
        type:Number,
        trim: true,
        // required:true,
    },
});

module.exports = mongoose.model("Ports",PortSchema);