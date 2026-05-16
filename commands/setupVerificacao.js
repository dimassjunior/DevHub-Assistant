const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const { COR_PRINCIPAL } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-verificacao')
    .setDescription('📌 Envia o painel de verificação no canal atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COR_PRINCIPAL)
      .setTitle('</> DevHub — Acesso ao Servidor')
      .setDescription(
        '## Bem-vindo(a)! 👋\n\n' +
        'Para ter acesso completo ao servidor, basta clicar em **Verificar** abaixo.\n\n' +
        '> 🏷️ Você receberá o cargo de **Membro** instantaneamente.\n\n' +
        '> 🎓 Após entrar, acesse o canal de **tags** para selecionar seu curso e suas áreas.\n\n' +
        '─────────────────────────────────\n' +
        '**Um clique e você já está dentro! ↓**'
      )
      .setFooter({ text: '</> DevHub • Verificação' })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId('btn_verificar')
      .setLabel('✅  Verificar')
      .setStyle(ButtonStyle.Primary);

    await interaction.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(button)],
    });

    await interaction.reply({ content: '✅ Painel de verificação enviado!', ephemeral: true });
  },
};