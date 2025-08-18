const { ApplicationCommandType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'remuser',
    description: '(➖) Remove um usuário do ticket atual',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Usuário que você deseja remover do ticket',
            type: 6, // 6 = USER (tipo direto suportado)
            required: true
        }
    ],
    execute: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: '❌ Você não tem permissão para usar este comando.', ephemeral: true });
        }

        const ticketCategoryID = '1247404144004956201';
        if (interaction.channel.parentId !== ticketCategoryID) {
            return interaction.reply({ content: '⚠️ Este comando só pode ser usado em canais de tickets.', ephemeral: true });
        }

        const userToRemove = interaction.options.getUser('user');
        if (!userToRemove) {
            return interaction.reply({ content: '❌ Usuário inválido ou não encontrado.', ephemeral: true });
        }

        try {
            // ❌ Removendo permissões do usuário no canal
            await interaction.channel.permissionOverwrites.edit(userToRemove.id, {
                ViewChannel: false,
                SendMessages: false,
                ReadMessageHistory: false,
                AttachFiles: false,
                EmbedLinks: false
            });

            await interaction.reply(`✅ ${userToRemove} foi removido com sucesso do ticket!`);

            // 📩 Tenta enviar DM para o usuário removido
            try {
                await userToRemove.send(`📤 Você foi removido do ticket **${interaction.channel.name}** por ${interaction.user.tag}.`);
            } catch (dmError) {
                console.warn(`⚠️ Não foi possível enviar DM para ${userToRemove.tag}.`);
            }
        } catch (error) {
            console.error('❌ Erro ao remover o usuário do ticket:', error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao tentar remover o usuário.', ephemeral: true });
        }
    }
};
