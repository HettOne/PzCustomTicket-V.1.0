const { Colors, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../settings/config');
const db = require('../../db');  // Banco de dados

module.exports = {
    name: 'interactionCreate',
    once: false,
    execute: async (interaction, client) => {
        if (interaction.isStringSelectMenu() && interaction.customId === 'category') {
            const categoria = interaction.values[0];

            // Verificar se o usuário já tem um ticket aberto no banco (excluindo tickets fechados)
            const ticketAberto = await db.getTicketByUserAndStatus(interaction.user.id, 'aberto');
            if (ticketAberto.length > 0) {
                return interaction.reply({
                    content: ":x: | Você já tem um ticket aberto!",
                    ephemeral: true
                });
            }


            await interaction.deferUpdate(); // Agora correto
            await createTicket(interaction, categoria);
        }

        // Lidar com a interação do botão de fechamento
        if (interaction.isButton() && interaction.customId === 'close_ticket') {
            const canalTicket = interaction.channel;

            // Buscar o ticket no banco de dados para verificar o dono
            const ticket = await db.getTicketByChannelId(canalTicket.id);

            // Verificar se o usuário que clicou no botão é o dono do ticket
            if (!ticket || ticket.user_id !== interaction.user.id) {
                return interaction.reply({
                    content: ":x: | Você não tem permissão para fechar este ticket!",
                    ephemeral: true
                });
            }

            // Atualizar o status do ticket no banco (opcional)
            await db.updateTicketStatus(canalTicket.id, 'fechado');

            // Enviar mensagem informando que o ticket foi fechado
            await interaction.reply({
                content: ":lock: | O ticket foi fechado com sucesso.",
                ephemeral: true
            });

            // Apagar o canal do ticket
            await canalTicket.delete();
        }
    }
};

// Função para criar o ticket
async function createTicket(interaction, categoria) {
    // Criar o canal do ticket
    const canalTicket = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: config.ticket_category,
        permissionOverwrites: [
            {
                id: interaction.user.id,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
            },
            {
                id: interaction.guild.id,
                deny: [PermissionFlagsBits.ViewChannel]
            }
        ]
    });

    // Registrar o ticket no banco de dados
    await db.createTicket({
        userId: interaction.user.id,
        ticketId: canalTicket.id,
        categoria: categoria,
        status: 'aberto',
        createdAt: new Date()
    });

    // Armazenar o canal do ticket no banco
    await db.updateTicketStatus(canalTicket.id, 'aberto'); // Asegure-se de ter a função para salvar ou atualizar no banco de dados

    // Embed do ticket
    const embedTicket = new EmbedBuilder()
        .setTitle('🎫 | Ticket Aberto')
        .setDescription(`Olá ${interaction.user}, obrigado por abrir um ticket!\n\nCategoria: **${formatCategory(categoria)}**\n\nAguarde que nossa equipe irá te atender em breve.`)
        .setColor(Colors.Blurple)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setFooter({ text: `ID do usuário: ${interaction.user.id}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp();

    // BOTÃO para fechar o ticket
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('close_ticket')
                .setLabel('🔒 Fechar Ticket')
                .setStyle(ButtonStyle.Danger)
        );

    // Enviar embed + botão no canal do ticket
    await canalTicket.send({
        content: `${interaction.user}`,
        embeds: [embedTicket],
        components: [row]
    });

    // Tentar mandar uma DM avisando
    try {
        await interaction.user.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('📩 Novo Ticket Criado!')
                    .setDescription(`Seu ticket foi criado na categoria **${formatCategory(categoria)}**.\n\nAcesse: ${canalTicket}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
            ]
        });
    } catch (error) {
        console.error('Erro ao enviar DM:', error);
    }
}

// Função de formatação da categoria
function formatCategory(value) {
    switch (value) {
        case 'comprar': return '🛒 Comprar';
        case 'suporte': return '🛠️ Suporte';
        case 'padrao': return '📂 Ticket Padrão';
        default: return '❓ Desconhecido';
    }
}
