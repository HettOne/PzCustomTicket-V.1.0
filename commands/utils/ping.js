const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../database/db'); // seu arquivo de pool e funções

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra latência do bot e informações de tickets do banco de dados'),

  async execute(interaction) {
    await interaction.deferReply({ fetchReply: true });

    // Latência do bot
    const botLatency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    // Buscar tickets do usuário
    let userTickets = [];
    try {
      userTickets = await db.getTicketByUserAndStatus(interaction.user.id, 'Aberto');
    } catch (err) {
      console.error('Erro ao buscar tickets do usuário:', err);
    }

    // Buscar tickets pendentes gerais
    let allTickets = [];
    try {
      allTickets = await db.getAllTickets();
    } catch (err) {
      console.error('Erro ao buscar todos os tickets:', err);
    }

    // Criando embed
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setTitle('🏓 Ping & Info de Tickets')
      .addFields(
        { name: 'Latência do Bot', value: `${botLatency}ms`, inline: true },
        { name: 'Latência da API', value: `${apiLatency}ms`, inline: true },
        { name: 'Seus Tickets Abertos', value: `${userTickets.length}`, inline: true },
        { name: 'Tickets Totais no Servidor', value: `${allTickets.length}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Informações atualizadas em tempo real' });

    await interaction.editReply({ embeds: [embed] });
  }
};
