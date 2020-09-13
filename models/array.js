const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const arrschema = new Schema({
  storyid : {
    type:String,
    required:true
  },
  seen : {
    type:[String],
    required:true
  },
},{timestamps:true});

const Arrs =  mongoose.model('array',arrschema);
module.exports = Arrs;
