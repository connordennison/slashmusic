const Discord = require('discord.js');
const fs = require('fs');
const { token, clientId, guildId } = require('./config.json');

const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES'],
  disableMentions: 'everyone',
  presence: {
    activities: [{ name: '/help', type: 'LISTENING' }],
    status: 'online',
  },
});

client.commands = new Discord.Collection();
const cfiles = fs.readdirSync('./commands').filter((f) => f.endsWith('.js'));
for (const file of cfiles) {
  try {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    console.log(`loaded ${file}`);
  } catch (err) {
    console.log(`failed to load ${file}`);
    console.error(err);
  }
}

client.on('ready', () => {
  console.log('ready');
  client.user.setActivity({ name: '/help', type: 'LISTENING' });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: 'There was an error executing this command.',
      ephemeral: true,
    });
  }
});

client.login(token);
