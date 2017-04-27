//add dependencies
var express= require('express');
var app=express();
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
var DB_URI_LOCAL="mongodb://localhost:27017/protoflio";
var DB_URI =  "mongodb://admin:admin@ds147920.mlab.com:47920/fasa7ny";
var passport = require('passport');
var schedule = require('node-schedule');
var globalCTRL = require('./app/controllers/globalCTRL');
var expressValidator = require('express-validator');
var request = require('request')
import {Bot, Elements} from 'facebook-messenger-bot';
const bot = new Bot('EAAGSyhSPqgYBAHZBt1qMRQheLU8IkKg0wcsswCMz2P3q3iEUZALSs1lWCim9nCiNaycA9YVvmEKVJSFHpgdB2VrUKf9uC35lAt4V5ieLL9tRx1oLaDM17hGhH6N0snExBoIFPdKMV5jKE2uTGq2MZCogCRXaANL2z2vBT2IpQZDZD',
'fasa7ny_kotomoto_se_2017_fb_bot_platform_MEANstack');
//access token
//EAAGSyhSPqgYBAHZBt1qMRQheLU8IkKg0wcsswCMz2P3q3iEUZALSs1lWCim9nCiNaycA9YVvmEKVJSFHpgdB2VrUKf9uC35lAt4V5ieLL9tRx1oLaDM17hGhH6N0snExBoIFPdKMV5jKE2uTGq2MZCogCRXaANL2z2vBT2IpQZDZD


//configure app
app.use(bodyParser.urlencoded({extended:false})); //this line must be on top of app config
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value);
    },
    gte: function(param, num) {
      return param >= num;
    }
  }
}));

var job1 = schedule.scheduleJob('59 23 * * *', globalCTRL.banDecrement);
var job2 = schedule.scheduleJob('59 23 * * 6', globalCTRL.sendNewsletter);
var job3 = schedule.scheduleJob('59 23 * * *', globalCTRL.overdueBookings);
// view engine setup
var cons = require('consolidate');
app.engine('html', cons.swig);//engine will render HTML
app.set('view engine', 'html');

var path = require('path');
app.use(require('serve-static')(path.resolve('public')));
//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'kotomotoos', resave: true, saveUninitialized: true , secure:true, expire:false}));
app.use(passport.initialize());
app.use(passport.session());
//connect to local if failed to connect to mlab
mongoose.connect(DB_URI,function(err){
  if(err){
    mongoose.connect(DB_URI_LOCAL);
    console.log("connecting to local db..");
  }else{
    console.log("connecting to global db..");
  }
});
require('./app/config/passport')(passport);
app.use(require('./app/routes')(passport));


// app.get('/fb_bot', function (req, res) {
//     if (req.query['hub.verify_token'] === 'fasa7ny_kotomoto_se_2017_fb_bot_platform_MEANstack') {
//         res.send(req.query['hub.challenge']);
//     }
//     else {
//       res.send('Error, wrong token');
//     }
// })
app.use('/fb_bot', bot.router());

bot.on('message', async message => {
    const {sender} = message;
    console.log(message);
    await sender.fetch('first_name');

    const out = new Elements();
    out.add({text: `hey ${sender.first_name}, how are you!`});

    await bot.send(sender.id, out);
});

//start the server
app.listen(process.env.PORT ||8080,function(){
  console.log("the app is listening on port 8080");
});





// API End Point - added by Stefan

// app.post('/fb_bot', function (req, res) {
//     messaging_events = req.body.entry[0].messaging
//     for (i = 0; i < messaging_events.length; i++) {
//         event = req.body.entry[0].messaging[i]
//         sender = event.sender.id
//         if (event.message && event.message.text) {
//             text = event.message.text
//             if (text === 'hi') {
//                 sendGenericMessage(sender)
//                 continue
//             }
//             sendTextMessage(sender, "parrot: " + text.substring(0, 200))
//         }
//         if (event.postback) {
//             text = JSON.stringify(event.postback)
//             sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
//             continue
//         }
//     }
//     res.sendStatus(200)
// })
//
// var token = "EAAGSyhSPqgYBAHZBt1qMRQheLU8IkKg0wcsswCMz2P3q3iEUZALSs1lWCim9nCiNaycA9YVvmEKVJSFHpgdB2VrUKf9uC35lAt4V5ieLL9tRx1oLaDM17hGhH6N0snExBoIFPdKMV5jKE2uTGq2MZCogCRXaANL2z2vBT2IpQZDZD"
//
// // function to echo back messages - added by Stefan
//
// function sendTextMessage(sender, text) {
//     messageData = {
//         text:text
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/...',
//         qs: {access_token:token},
//         method: 'POST',
//         json: {
//             recipient: {id:sender},
//             message: messageData,
//         }
//     }, function(error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }
//
//
// // Send an test message back as two cards.
//
// function sendGenericMessage(sender) {
//     messageData = {
//         "attachment": {
//             "type": "template",
//             "payload": {
//                 "template_type": "generic",
//                 "elements": [{
//                     "title": "Ai Chat Bot Communities",
//                     "subtitle": "Communities to Follow",
//                     "image_url": "http://1u88jj3r4db2x4txp44yqfj1.wpengine.netdna-cdn.com/...",
//                     "buttons": [{
//                         "type": "web_url",
//                         "url": "https://www.facebook.com/groups/aic...",
//                         "title": "FB Chatbot Group"
//                     }, {
//                         "type": "web_url",
//                         "url": "https://www.reddit.com/r/Chat_Bots/",
//                         "title": "Chatbots on Reddit"
//                     },{
//                         "type": "web_url",
//                         "url": "https://twitter.com/aichatbots",
//                         "title": "Chatbots on Twitter"
//                     }],
//                 }, {
//                     "title": "Chatbots FAQ",
//                     "subtitle": "Aking the Deep Questions",
//                     "image_url": "https://tctechcrunch2011.files.wordpress.com/...",
//                     "buttons": [{
//                         "type": "postback",
//                         "title": "What's the benefit?",
//                         "payload": "Chatbots make content interactive instead of static",
//                     },{
//                         "type": "postback",
//                         "title": "What can Chatbots do",
//                         "payload": "One day Chatbots will control the Internet of Things! You will be able to control your homes temperature with a text",
//                     }, {
//                         "type": "postback",
//                         "title": "The Future",
//                         "payload": "Chatbots are fun! One day your BFF might be a Chatbot",
//                     }],
//                 },  {
//                     "title": "Learning More",
//                     "subtitle": "Aking the Deep Questions",
//                     "image_url": "http://www.brandknewmag.com/wp-cont...",
//                     "buttons": [{
//                         "type": "postback",
//                         "title": "AIML",
//                         "payload": "Checkout Artificial Intelligence Mark Up Language. Its easier than you think!",
//                     },{
//                         "type": "postback",
//                         "title": "Machine Learning",
//                         "payload": "Use python to teach your maching in 16D space in 15min",
//                     }, {
//                         "type": "postback",
//                         "title": "Communities",
//                         "payload": "Online communities & Meetups are the best way to stay ahead of the curve!",
//                     }],
//                 }]
//             }
//         }
//     }
//     request({
//         url: 'https://graph.facebook.com/v2.6/me/...',
//         qs: {access_token:token},
//         method: 'POST',
//         json: {
//             recipient: {id:sender},
//             message: messageData,
//         }
//     }, function(error, response, body) {
//         if (error) {
//             console.log('Error sending messages: ', error)
//         } else if (response.body.error) {
//             console.log('Error: ', response.body.error)
//         }
//     })
// }
