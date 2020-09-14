const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storyschema = new Schema({
  title : {
    type:String,
    required:true
  },
  storydes : {
    type:String,
    required:true
  },
  storycontent: {
    type:String,
    required:true
  },
  seq : {
    type:Number,
  },
},{timestamps:true});

const Storys =  mongoose.model('story',storyschema);
module.exports = Storys;
