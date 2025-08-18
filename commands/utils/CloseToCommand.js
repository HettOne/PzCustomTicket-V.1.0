const { ApplicationCommandType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const moment = require('moment');
const db = require('../../db');  // Certifique-se de que o módulo db está configurado corretamente para acessar o banco

module.exports = {
    name: 'close',
    description: '(🔒) Fecha o ticket atual',
    type: ApplicationCommandType.ChatInput,
    execute: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply('❌ Você não tem permissão para usar este comando.');
        }

        const ticketCategoryID = '1247404144004956201';
        if (interaction.channel.parentId !== ticketCategoryID) {
            return interaction.reply('⚠️ Este comando só pode ser usado em canais de tickets.');
        }

        const channel = interaction.channel;
        const user = interaction.user;
        const logChannelID = '1312829897521107014'; // Substitua pelo ID do seu canal de logs
        const logChannel = await client.channels.fetch(logChannelID);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🔒 Fechamento do Ticket: ${channel.name}`)
                    .setDescription('Você deseja receber a transcrição do ticket antes do fechamento?')
                    .setColor('Blue')
                    .setTimestamp()
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('transcription_yes')
                        .setLabel('📄 Sim, quero a transcrição')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('transcription_no')
                        .setLabel('❌ Não, pode fechar')
                        .setStyle(ButtonStyle.Danger)
                )
            ]
        });

        const filter = i => i.user.id === interaction.user.id;
        const collector = channel.createMessageComponentCollector({ filter, time: 30000, max: 1 });

        collector.on('collect', async i => {
            if (i.customId === 'transcription_yes') {
                await i.update({ content: '📄 Gerando a transcrição do ticket...', components: [] });

                // 📜 Gera a transcrição
                const messages = await channel.messages.fetch({ limit: 100 });
                const sortedMessages = messages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
                let transcript = `📑 **Transcrição do ticket:** ${channel.name}\n\n`;

                sortedMessages.forEach(msg => {
                    const time = moment(msg.createdAt).format('DD/MM/YYYY HH:mm:ss');
                    transcript += `[${time}] ${msg.author.tag}: ${msg.content}\n`;
                });

                // 📂 Envia a transcrição para o dono do ticket (executante)
                await user.send({
                    content: '📁 Aqui está a transcrição do ticket:',
                    files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `${channel.name}_transcricao.txt` }]
                });

                // 📝 Envia a transcrição também para o canal de logs
                if (logChannel) {
                    await logChannel.send({
                        content: `📑 Transcrição do  **${channel.name}** (fechado por ${user.tag}):`,
                        files: [{ attachment: Buffer.from(transcript, 'utf-8'), name: `${channel.name}_transcricao.txt` }]
                    });
                }

                await channel.send('✅ O ticket será fechado em 5 segundos...');
            } else {
                await i.update({ content: '❌ Você optou por não receber a transcrição. O ticket será fechado em 5 segundos...', components: [] });
            }

            // ⏳ Fecha o ticket após 5 segundos
            setTimeout(async () => {
                try {
                    // Obter o ticket_id do banco de dados com base no canal (channel.id)
                    const ticket = await db.getTicketByChannelId(channel.id);  // Aqui você precisa ter uma função que faça essa consulta

                    if (ticket && ticket.ticket_id) {
                        const ticketId = ticket.ticket_id;
                        console.log(`Tentando excluir o ticket com ticket_id ${ticketId} do banco de dados...`);

                        // Remover o ticket do banco de dados
                        await db.deleteTicketByTicketId(ticketId); 

                        // Deletar o canal do ticket
                        console.log(`Deletando o canal ${channel.id}...`);
                        await channel.delete();
                        console.log(`Canal ${channel.id} deletado com sucesso.`);
                    } else {
                        console.log('❌ Não foi encontrado o ticket associado a esse canal.');
                    }
                } catch (error) {
                    console.error('❌ Erro ao deletar o canal ou excluir o ticket do banco:', error);
                }
            }, 5000);
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await channel.send('⏰ Tempo expirado. O ticket será fechado em 5 segundos...');
                setTimeout(async () => {
                    try {
                        // Obter o ticket_id do banco de dados com base no canal (channel.id)
                        const ticket = await db.getTicketByChannelId(channel.id);  // Aqui você precisa ter uma função que faça essa consulta

                        if (ticket && ticket.ticket_id) {
                            const ticketId = ticket.ticket_id;
                            console.log(`Tentando excluir o ticket com ticket_id ${ticketId} do banco de dados...`);

                            // Remover o ticket do banco de dados
                            await db.deleteTicketByTicketId(ticketId); 

                            // Deletar o canal do ticket
                            console.log(`Deletando o canal ${channel.id}...`);
                            await channel.delete();
                            console.log(`Canal ${channel.id} deletado com sucesso.`);
                        } else {
                            console.log('❌ Não foi encontrado o ticket associado a esse canal.');
                        }
                    } catch (error) {
                        console.error('❌ Erro ao deletar o canal ou excluir o ticket do banco:', error);
                    }
                }, 5000);
            }
        });
    }
};
