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
var previousLobbies = [];

client.on('message', message => {
    if(message.channel.name === "matchmaking"){
        var loweredContent = message.content.toLowerCase();
        
        var MMRole = message.guild.roles.find("name", "WaitingForAMatch");
        if( loweredContent.startsWith("!matchmake")){
            if(message.deletable) message.delete();
       
            if(openLobbies.has(message.author.id)) {
                message.reply("You supposedly already have a lobby open! Type ***!closelobby*** to remove previous message");
            }
            
            var params = message.content.split(' ');
            var userRegion, inviteLink, waitTime,linkParams;
            
            if(params.length < 4 ||                                                 //not enough parameters
            regions.indexOf((userRegion = params[1].toLowerCase())) < 0 ||          //is not a valid region
            !(inviteLink = params[2]).startsWith("steam://joinlobby/312530/")||     //invite link is not valid
            (waitTime = parseInt(params[3])) == NaN||                               //wait time is not a number
            (linkParams = inviteLink.split('/')).length != 6) {                     //invite link lacks lobbyID/userID
                
                invalidSyntax(message); 
                return;
            }
            
            if(previousLobbies.indexOF(linkParams[4]) < 0){
                previousLobbies.push(linkParams[4]);        
            }else return;                                   //already used lobbyID
            
            var waitMilliseconds = waitTime*60000;
            openLobbies.set(message.author.id,message);
            message.send("Hey @WaitingForAMatch, @"+message.author.username+" Wants to get his ass handed to him:\n"+params[2]+"\nHe will supposedly close his lobby in "+waitTime+" minutes.",{files:[images[params[1].toLowerCase()]]})
                .then(sent=>{
                    if(openLobbies.remove(message.author.id)) sent.delete(waitMilliseconds);
                });
        
        }else if(loweredContent.startsWith("!joinmm")){
            if(message.deletable) message.delete();
            
            if(message.member.roles.has(MMRole.id)) return;
            
            message.reply('Is now waiting for matches');
            message.member.addRole(MMRole);
        
        }else if(loweredContent.startsWith("!leavemm")){
            if(message.deletable) message.delete();
            
            if(!message.member.roles.has(MMRole.id)) return;
            
            message.reply('is no longer waiting for a match');
            message.member.removeRole(MMRole);
            
        }else if(loweredContent.startsWith("!closelobby")){
            if(message.deletable) message.delete();
            
            if(!openLobbies.has(message.author.id)) return;
            
            var msg = openLobbies.get(message.author.id);
            msg.delete();
            openLobbies.remove(message.author.id);
        }
    }
});

function invalidSyntax(message){
    message.reply("invalid syntax!\n!matchmake <"+regions.join()+"> <invite link> <time until close (minutes)>");
}

client.login(process.env.BOT_TOKEN);
