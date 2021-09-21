const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { MessageEmbed, Interaction } = require('discord.js');
const {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  PlayerSubscription,
  NoSubscriberBehavior,
  entersState,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const {} = require('@discordjs/voice');
const yt = require('youtube-search-without-api-key');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a video from YouTube.')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Video search query or URL.')
        .setRequired(true),
    ),
  /**
   *
   * @param {Interaction} interaction
   * @returns
   */
  async execute(interaction) {
    var timeout;
    await interaction.deferReply();
    let memberChannel = interaction.member.voice.channel;
    if (!memberChannel)
      return await interaction.editReply("You're not in a voice channel!");
    if (interaction.guild.me.voice.channel) {
      if (
        interaction.member.voice.channel !== interaction.guild.me.voice.channel
      )
        return await interaction.editReply("You're not in my voice channel!");
    }
    let results = await yt.search(interaction.options.getString('query'));
    // console.log(results[0].url);
    if (!results[0])
      return await interaction.editReply('No search results found.');
    let video = results[0];
    let moreInfo = await ytdl.getBasicInfo(video.url);
    let embed = new MessageEmbed({
      color: 'GREEN',
      title: 'Now Playing',
      url: video.url,
      description: `**▶ ${video.title}** - ${moreInfo.videoDetails.author.name}\n**Duration:** ${moreInfo.videoDetails.lengthSeconds}s\n**Requested by:** ${interaction.member}`,
    });
    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Stop },
    });
    // const res = createAudioResource(__dirname + '/../audio.mp3');
    // const res = ytdl(video.url, { filter: 'audioonly' });
    let res = createAudioResource(
      await ytdl(video.url, {
        filter: (filter) => filter.audioBitrate < '64000',
      }),
      { inlineVolume: true },
    );
    const conn = await joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: true,
    });
    conn.on('error', console.error);
    player.on('error', console.error);
    player.on(AudioPlayerStatus.Playing, () => {
      console.log('playing');
      clearTimeout(timeout);
    });
    player.on(AudioPlayerStatus.Idle, () => {
      console.log('idle');
      timeout = setTimeout(() => {
        player.stop();
        conn.destroy();
      }, 10 * 1000);
    });
    // player.play(res);
    res.volume.setVolume(0.175);
    await player.play(res);
    conn.subscribe(player);
    await interaction.editReply({ embeds: [embed] });
  },
};
