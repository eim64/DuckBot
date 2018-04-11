const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

var images = {'na': 'NORTH AMERICA :flag_us::flag_mx::flag_ca:', 'eu': "EUROPE :flag_eu:", 'anz':'UPSIDE DOWN :flag_au::flag_nz:'};
var regions = Object.keys(images);
    

client.on('message', message => {
    if(message.content.startsWith("!matchmake")){
       if(message.deletable)
          message.delete();
       console.log(message.channel.id+": name = "+message.channel.name);
        
       var params = message.content.split(' ');
       if(params.length < 3 || regions.indexOf(params[1].toLowerCase()) < 0 || !params[2].startsWith("steam://joinlobby/312530/")) {invalidSyntax(message); return;}
       
       var maxWait = "and did not specify for how long he was gonna have and open lobby";
       if(params.length > 3) maxWait = "and is prepared to wait a staggering "+(params.splice(3,params.length-3).join(' '))+" before he closes the lobby";
       message.reply("Wants to get his ass handed to him:\n"+params[2]+"\n"+maxWait+"\nRegion: "+(images[params[1].toLowerCase()]));
    }
});

function invalidSyntax(message){
    message.reply("invalid syntax!\n!matchmake <"+regions.join()+"> <invite link> <optional: max wait message>");
}

client.login(process.env.BOT_TOKEN);
