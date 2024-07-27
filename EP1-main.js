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
    const response = await fetch(url + '/server', {
        method: 'GET',
        headers: {"Server-Key": api},
    });
    const data = await response.json();
    const embed = new EmbedBuilder();
    embed.setDescription("Server Status");
    embed.addFields({name: "Name:", value: data["Name"]});
    embed.addFields({name: "Owner ID:", value: data["OwnerId"].toString()});
    embed.addFields({name: "Players:", value: data["CurrentPlayers"].toString()});
    embed.addFields({name: "Max Players:", value: data["MaxPlayers"].toString()});
    embed.addFields({name: "Join Key:", value: data["JoinKey"].toString()});
    embed.addFields({name: "Account Verification:", value: data["AccVerifiedReq"].toString()});
    embed.addFields({name: "Balance Teams:", value: data["TeamBalance"].toString()});
    embed.setTimestamp();
    embed.setColor("Orange")
    client.guilds.cache.get(guildID).channels.cache.get(channelID).send({embeds: [embed]});
})

client.login(token); 
