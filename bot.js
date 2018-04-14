const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});
var images = {'na': 'https://cdn.discordapp.com/attachments/429801984460062720/433673377270726657/Uplink_-_World_Map_NA.gif', 
              'eu': "https://cdn.discordapp.com/attachments/429801984460062720/433673470614831134/Uplink_-_World_Map_EU.gif", 
              'anz':'https://cdn.discordapp.com/attachments/429801984460062720/433673374934368276/Uplink_-_World_Map_ANZ.gif'};
var regions = Object.keys(images);


var openLobbies = new Map();

var commands = new Map();

var MMRole;

client.on('message', message => {
    if(message.channel.name === "matchmaking"){
        
        var params = message.content.toLowerCase().split(' ');
        if(!commands.has(params[0])) return;
        
        MMRole = message.guild.roles.find("name", "WaitingForAMatch");
        if(message.deletable) message.delete().catch();
        commands.get(params[0])(message,params.splice(1,params.length-1));
    }
});

commands.set("!matchmake",function(message,params){
   if(openLobbies.has(message.author.id)) {
       message.reply("You supposedly already have a lobby open! Type ***!closelobby*** to remove previous message");
       return;
   }
            
   var userRegion, inviteLink, waitTime,linkParams;
            
   if(params.length < 3 ||                                                 //not enough parameters
   regions.indexOf((userRegion = params[0].toLowerCase())) < 0 ||          //is not a valid region
   !(inviteLink = params[1]).startsWith("steam://joinlobby/312530/")||     //invite link is not valid
   (waitTime = parseInt(params[2])) == NaN||                               //wait time is not a number
   (linkParams = inviteLink.split('/')).length != 6) {                     //invite link lacks lobbyID/userID
                
        invalidSyntax(message); 
        return;
   }
            
   var waitMilliseconds = waitTime*60000;
            
   message.channel.send("Hey "+MMRole+", "+message.author+" Wants to get his ass handed to him:\n"+params[1]+"\nHe will supposedly close his lobby in "+waitTime+" minutes.",{files:[images[params[0].toLowerCase()]]})
    .then(sent=>{
         openLobbies.set(message.author.id,sent);
         sent.delete(waitMilliseconds).then(setTimeout(function(){
              openLobbies.delete(message.author.id);
         },waitMilliseconds),function(err){});
    }); 
});

commands.set("!closelobby",function(message,params){
   if(!openLobbies.has(message.author.id)) {console.log("user not found!"); return;}
            
   var msg = openLobbies.get(message.author.id);
   msg.delete().catch();
   openLobbies.delete(message.author.id); 
});



function joinmm(message,params){
 if(message.member.roles.has(MMRole.id)) return;
            
 message.reply('Is now waiting for matches');
 message.member.addRole(MMRole);   
}

function leavemm(message,params){
    if(!message.member.roles.has(MMRole.id)) return;
            
    message.reply('is no longer waiting for a match');
    message.member.removeRole(MMRole);
}

commands.set("!joinmm",joinmm);
commands.set("!joinmatchmaking",joinmm);
commands.set("!leavemm",leavemm);
commands.set("!leavematchmaking",leavemm);




function invalidSyntax(message){
    message.reply("invalid syntax!\n!matchmake <"+regions.join()+"> <invite link> <time until close (minutes)>");
}

client.login(process.env.BOT_TOKEN);
