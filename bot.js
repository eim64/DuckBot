const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

var images = {'na': 'https://cdn.discordapp.com/attachments/429801984460062720/433673377270726657/Uplink_-_World_Map_NA.gif', 
              'eu': "https://cdn.discordapp.com/attachments/429801984460062720/433673470614831134/Uplink_-_World_Map_EU.gif", 
              'anz':'https://cdn.discordapp.com/attachments/429801984460062720/433673374934368276/Uplink_-_World_Map_ANZ.gif'};
var regions = Object.keys(images);
    

client.on('message', message => {
    if(message.channel.name === "matchmaking"){
        var loweredContent = message.content.toLowerCase();
        
        console.log(Object.values(message.member.roles));
        
        if( loweredContent.startsWith("!matchmake")){
            if(message.deletable) message.delete();
       
            var params = message.content.split(' ');
            if(params.length < 3 || regions.indexOf(params[1].toLowerCase()) < 0 || !params[2].startsWith("steam://joinlobby/312530/")) {invalidSyntax(message); return;}
       
            var maxWait = "and did not specify for how long he was gonna have an open lobby";
            if(params.length > 3) maxWait = "and is prepared to wait a staggering "+(params.splice(3,params.length-3).join(' '))+" before he closes the lobby";
            message.reply("@Wants to get his ass handed to him:\n"+params[2]+"\n"+maxWait,{files:[images[params[1].toLowerCase()]]});
        
        }else if(loweredContent.startsWith("!joinmm")){
            if(message.deleteable) message.delete();
            message.reply('Is now waiting for matches');
            message.member.addRole('WaitingForAMatch');
        
        }else if(loweredContent.startsWith("!leavemm")){
            if(message.deleteable) message.delete();
            //if(message.member.roles.find("name", "WaitingForAMatch"))){
                message.reply('is no longer waiting for a match');
                message.member.removeRole('WaitingForAMatch');
            //}
            
        }
    }
});

function invalidSyntax(message){
    message.reply("invalid syntax!\n!matchmake <"+regions.join()+"> <invite link> <optional: max wait message>");
}

client.login(process.env.BOT_TOKEN);
