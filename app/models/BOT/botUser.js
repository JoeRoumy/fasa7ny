var mongoose = require('mongoose');

var botUserSchema = mongoose.Schema({
  facebookID: String,
  firstName:String,
  lastName:String,
  location : {
    lat:Number,
    long:Number
  },
  gender: Boolean, //true -> male
  language :{type:String,default:"english"}
})

var BotUser = mongoose.model("botUser", botUserSchema);

module.exports = BotUser;
