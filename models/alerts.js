const mongoose = require('mongoose');
let alertSchema = new mongoose.Schema({
    status:String
});

module.exports=mongoose.model('alert',alertSchema)