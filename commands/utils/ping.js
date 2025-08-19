// commands/utils/ping.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com a latência do bot e da API do Discord'),
  
  async execute(interaction) {
    // Envia uma resposta inicial para calcular o tempo de latência
    const message = await interaction.deferReply({ fetchReply: true });

    // Cria o embed com as informações de latência
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🏓 Pong!')
      .setDescription('Aqui estão as latências:')
      .addFields(
        { name: 'Latência do bot', value: `${message.createdTimestamp - interaction.createdTimestamp}ms`, inline: true },
        { name: 'Latência da API', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Comando executado com sucesso!' });

    // Envia o embed como resposta
    await interaction.editReply({ embeds: [embed] });
  },
};
