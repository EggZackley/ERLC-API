const { Client, EmbedBuilder, GatewayIntentBits } = require("discord.js");
const { token, api, url, guildID, channelID } = require('./config.json')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

client.on('messageCreate', async (msg) => {
    const guild = client.guilds.cache.get(guildID);
    const channel = guild.channels.cache.get(channelID);
    const role = guild.roles.cache.get("PUT YOUR ROLE ID HERE");
    const embed = new EmbedBuilder();
    var msgContent = msg.content;
    if(!msg.content.startsWith(":")) {
        msgContent = ":" + msgContent;
    }

    if(msg.channel !== channel) {
        return;
    } else {
        msg.member.roles.cache.forEach(async (r) => {
            if(/*msg.member.user.id === "PUT THE USER ID HERE" || */r === role) {
                const response = await fetch(url + '/server/command', {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                      "Server-Key": api,
                    },
                    body: JSON.stringify({command: msgContent}),
                });
                const data = await response.json();
            }
        })
    }
})

client.login(token);
