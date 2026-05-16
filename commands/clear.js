const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Apaga um número específico de mensagens no canal.')
    .addIntegerOption(option =>
      option.setName('quantidade')
        .setDescription('Número de mensagens a serem apagadas (1 a 100)')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Verifica se o usuário tem permissão de gerenciar mensagens
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({
        content: '❌ Você não tem permissão para usar este comando.',
        flags: 64  // ephemeral corrigido
      });
    }

    const quantidade = interaction.options.getInteger('quantidade');

    if (quantidade < 1 || quantidade > 100) {
      return interaction.reply({
        content: '❌ Você pode apagar de **1 a 100** mensagens por vez.',
        flags: 64
      });
    }

    try {
      const messages = await interaction.channel.bulkDelete(quantidade, true);
      await interaction.reply({
        content: `✅ **${messages.size}** mensagens foram apagadas com sucesso!`,
        flags: 64
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Ocorreu um erro ao tentar apagar as mensagens. Mensagens com mais de 14 dias não podem ser apagadas em massa.',
        flags: 64
      });
    }
  }
};