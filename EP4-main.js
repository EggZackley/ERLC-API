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
const { QuickDB } = require('quick.db');
const db = new QuickDB();

client.once("ready", async () => {
    const guild = client.guilds.cache.get(guildID);
    const channel = guild.channels.cache.get(channelID);
    const embed = new EmbedBuilder();
    setInterval(async () => {
        const response = await fetch(url + '/server/joinlogs', {
            method: 'GET',
            headers: {"Server-Key": api},
        });
        const data = await response.json();
        Object.values(data).forEach(async value => {
            var join = value["Join"];
            var timeStamp = value["Timestamp"];
            var player = value["Player"];
            if(join) {
                embed.setColor("Green");
                embed.setDescription(`**${player} Joined**`);
            } else {
                embed.setColor("Red");
                embed.setDescription(`**${player} Left**`);
            }
            embed.setTimestamp();
            var check;
            if((await db.has(`${player}_true`)) || (await db.has(`${player}_false`))) {
                (await db.get(`${player}_${join}`).forEach(async dat => {
                    if(parseInt(dat) === timeStamp) {
                        check = true;
                        return;
                    }
                }));
            }
            if(!check) {
                await db.push(`${player}_${join}`, `${timeStamp}`);
                channel.send({embeds: [embed]});
            }
        });
    }, 6000);
})

client.login(token);
