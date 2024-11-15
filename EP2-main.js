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

client.once("ready", async () => {
    const response = await fetch(url + '/server/players', {
        method: 'GET',
        headers: {"Server-Key": api},
    });
    const data = await response.json(); 
    const embed = new EmbedBuilder();
    embed.setDescription("Player List");
    Object.values(data).forEach(player => {
        let callSign = player["Callsign"];
        if(callSign == null) {
            callSign = "N/A"
        }
        embed.addFields({name: `${player["Player"]} (${player["Permission"]})`, value: `${player["Team"]} (${callSign})`});
    });
    embed.setTimestamp();
    client.guilds.cache.get(guildID).channels.cache.get(channelID).send({embeds: [embed]});
})

client.login(token); 
