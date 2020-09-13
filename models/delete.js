const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const delchema = new Schema({
  userid : {
    type:String,
    required:true
  },
  storyid: {
    type:String,
    required:true
  },
},{timestamps:true});

const Dels =  mongoose.model('del',delchema);
module.exports = Dels;
