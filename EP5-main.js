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

client.once('ready', async () => {
    setInterval(async () => {
        const response = await fetch(url + '/server/queue', {
            method: 'GET',
            headers: {"Server-Key": api},
        });
        const data = await response.json();
        const embed = new EmbedBuilder();
        embed.setColor("White");
        const guild = client.guilds.cache.get(guildID);
        const channel = client.channels.cache.get(channelID);
        embed.setTimestamp();
        if(Object.values(data).at(0) == null) return;
        Object.values(data).forEach(async v => {
            const getUser = await fetch(`https://users.roblox.com/v1/users/${v}`, {
                method: 'GET',
            });
            await getUser.json().then(u => {
                embed.setDescription(`**${u["name"]}:${u["id"]}** has joined the queue.`);
            });
            channel.send({embeds: [embed]});
        });
    }, 6000);
});

client.login(token);
