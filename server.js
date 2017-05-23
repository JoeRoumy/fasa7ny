//add dependencies
var express= require('express');
var app=express();
// require('run-middleware')(app)
var bodyParser= require('body-parser');
var mongoose = require('mongoose');
var DB_URI_LOCAL="mongodb://localhost:27017/protoflio";
var DB_URI =  "mongodb://admin:admin@ds147920.mlab.com:47920/fasa7ny";
var passport = require('passport');
var schedule = require('node-schedule');
var globalCTRL = require('./app/controllers/globalCTRL');
var expressValidator = require('express-validator');
var request = require('request')

// import {Bot, Elements, Buttons,QuickReplies} from 'facebook-messenger-bot';
// const bot = new Bot('EAAGSyhSPqgYBAHZBt1qMRQheLU8IkKg0wcsswCMz2P3q3iEUZALSs1lWCim9nCiNaycA9YVvmEKVJSFHpgdB2VrUKf9uC35lAt4V5ieLL9tRx1oLaDM17hGhH6N0snExBoIFPdKMV5jKE2uTGq2MZCogCRXaANL2z2vBT2IpQZDZD',
// 'fasa7ny_kotomoto_se_2017_fb_bot_platform_MEANstack');
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

/////////////////start bot////////////////////////////
// app.use('/fb_bot', bot.router());
//
// let BotUser = require('./app/models/BOT/botUser.js');
// let ActiveUser = require('./app/models/BOT/activeUser.js');
// let Scenario = require('./app/models/BOT/scenario.js');
//
//
//
// bot.on('message', async message => {
//     const {sender} = message;
//     console.log("message----------------------------------------------------") ;
//     console.log(message);
//
//     const out = new Elements();
//
//     await sender.fetch('first_name,last_name');
//     //checking if this user is already in our users database or not;
//     BotUser.findOne({facebookID: sender.id},async function(err,botUser){
//       if(err)
//         console.log(err)
//       else{
//
//         if(botUser == undefined || botUser == null){//if not, save it
//           let botuser= new BotUser();
//           botuser.firstName= sender.first_name;
//           botuser.facebookID=sender.id;
//           botuser.lastName= sender.last_name;
//
//           botuser.save(function(err,user){
//             if(err)
//               console.log(err);
//             else{// adding user to active users;
//               let activeuser = new ActiveUser();
//               activeuser.botUser= user.id;
//               activeuser.save(function(err){
//                 if(err)
//                   console.log(err);
//               });
//             }
//           });
//         }
//
//         //if it was saved as a bot user before check if it's an active user
//         //if it's not an active user add it as a new active user;
//         //if it's already an active user update lastResponseAt
//         var query = {botUser:botUser._id},
//         update = {botUser:botUser._id , lastResponseAt: new Date() },
//         options = { upsert: true, new: true, setDefaultsOnInsert: true };
//
//         ActiveUser.findOneAndUpdate(query, update, options,async function(error, activeUser) {
//           if (error)
//             console.log(error);
//           else{
//             var i = activeUser.NextScenarioMessage;
//             if(activeUser.currentScenario == undefined || activeUser.currentScenario == null){ //if no scenario at all then choose the welcoming scenario
//               Scenario.findOne({title:"welcome"},async function(err,scenario){
//                   // let buttons = new Buttons();
//                   let replies = new QuickReplies();
//
//                   if(scenario.buttons && scenario.buttons.length !=0){
//                      for(var i =0;i<scenario.buttons.length;i++)
//                         replies.add({text: scenario.buttons[i].text,event: scenario.buttons[i].event});
//
//                     out.setQuickReplies(replies);
//                     //   buttons.add({text: scenario.buttons[i].text, event: scenario.buttons[i].event});
//                     //
//                     // out.add({buttons });
//                   }
//                   out.add({text: scenario.messages[0]});
//                   ActiveUser.update({_id:activeUser._id},{$set:{'currentScenario':scenario._id,'NextScenarioMessage':1}}).exec();
//                   await bot.send(sender.id, out);
//               })
//             }
//           }
//         });
//       }
//     })
//
//
//
//     // out.add({text: `hello ${sender.first_name} , how are you!`});
//     // await bot.send(sender.id, out);
//
//
// });
//
//
// bot.on('postback', async (event, message, data) => {
//     const {sender} = message;
//     const {text} = message;
//     console.log(event);
//     console.log(data);
//     console.log(message);
//     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
//
//     // app.runMiddleware('/search_for_activities/'+text+'/_/',{method:'get'},function(responseCode,body,headers){
//     //
//     // });
//     const out = new Elements();
//     out.add({text: event});
//     out.add({text: "please tell us which activity are you looking for.."});
//     await bot.send(sender.id, out);
// });

//setting greeting message ..
// (async function () {
//   console.log(await bot.setGreeting('Hi, shaklak 3yz tetfasa7 enahrda... 3amel 7esabak 3ala kam kda ?'));
//   console.log(await bot.setGetStarted({data: {action: 'GET_STARTED'}}));
// })();




///////////end bot////////////////

//start the server
app.listen(process.env.PORT ||8080,function(){
  console.log("the app is listening on port 8080");
});
