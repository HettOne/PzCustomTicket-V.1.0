const { ApplicationCommandType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'add',
    description: '(➕) Adiciona um usuário ao ticket atual',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            description: 'Usuário que você deseja adicionar ao ticket',
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

        // 🔧 Tentativa direta de acesso ao usuário
        const userToAdd = interaction.options.getUser('user');
        if (!userToAdd) {
            return interaction.reply({ content: '❌ Usuário inválido ou não encontrado.', ephemeral: true });
        }

        try {
            await interaction.channel.permissionOverwrites.edit(userToAdd.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true,
                AttachFiles: true,
                EmbedLinks: true
            });

            await interaction.reply(`✅ ${userToAdd} foi adicionado com sucesso ao ticket!`);

            try {
                await userToAdd.send(`📩 Você foi adicionado ao ticket **${interaction.channel.name}** por ${interaction.user.tag}.`);
            } catch (dmError) {
                console.warn(`⚠️ Não foi possível enviar DM para ${userToAdd.tag}.`);
            }
        } catch (error) {
            console.error('❌ Erro ao adicionar o usuário ao ticket:', error);
            await interaction.reply({ content: '❌ Ocorreu um erro ao tentar adicionar o usuário.', ephemeral: true });
        }
    }
};
