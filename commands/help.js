const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get bot help!'),
  async execute(interaction) {
    let embed = new MessageEmbed({
      title: 'SlashMusic Help',
      color: 'FUCHSIA',
      footer: {
        iconURL: 'https://cdn.cnnd.co.uk/pfp_small.png',
        text: 'Made with ❤ by cnnd#0001',
      },
      fields: [
        {
          name: 'About',
          value:
            'SlashMusic is a Discord music bot created in response to all the bot takedowns. Many famous bots such as Groovy and Rythm have been taken offline due to YouTube not liking them profiting from monetized YouTube videos. View the source code [here](https://example.org).',
        },
        {
          name: 'Commands',
          value:
            'This bot is (unsurprisingly) powered by slash commands. Valid commands are:\n```/play [song url or search query]\n/stop\n/queue\n/volume [int 1-100]\n/help\n/credits\n/ping```',
        },
      ],
    });
    await interaction.reply({ embeds: [embed] });
  },
};
