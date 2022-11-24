var mongoose = require("mongoose");

// trim every string fields of complete document
mongoose.Schema.Types.String.set("trim", true);

var PortSchema = new mongoose.Schema({
    lastPort:{
        type:Number,
        // required:true,
    },
});

PortSchema.set("timestamps", true);

module.exports = mongoose.model("Ports",PortSchema);