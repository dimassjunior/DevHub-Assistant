const {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const { COR_PRINCIPAL } = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup-cursos')
    .setDescription('📌 Envia o painel de seleção de cursos')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COR_PRINCIPAL)
      .setTitle('</> DevHub — 🎓 Faculdade / Curso')
      .setDescription(
        '## Qual é o seu curso?\n\n' +
        'Selecione no menu abaixo o(s) curso(s) que você faz.\n\n' +
        '> ✅ Pode selecionar **mais de um**.\n' +
        '> 🔄 Para **remover** um cargo, abra o menu e **desmarque** o curso.\n\n' +
        '─────────────────────────────────'
      )
      .setFooter({ text: '</> DevHub • Painel de Cursos' })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('painel_cursos')
      .setPlaceholder('🎓 Selecione seu(s) curso(s)...')
      .setMinValues(0)
      .setMaxValues(13)
      .addOptions([
        { label: 'ADS',                       value: 'ads',       emoji: '🖥️' },
        { label: 'Ciência da Computação',      value: 'cc',        emoji: '💻' },
        { label: 'Engenharia de Software',     value: 'eng_soft',  emoji: '⚙️' },
        { label: 'Sistemas de Informação',     value: 'si',        emoji: '📊' },
        { label: 'Engenharia da Computação',   value: 'eng_comp',  emoji: '🔧' },
        { label: 'Jogos Digitais',             value: 'jogos',     emoji: '🎮' },
        { label: 'Banco de Dados',             value: 'bd',        emoji: '🗄️' },
        { label: 'Redes de Computadores',      value: 'redes',     emoji: '🌐' },
        { label: 'Segurança da Informação',    value: 'seginfo',   emoji: '🔒' },
        { label: 'Ciência de Dados',           value: 'ciencia',   emoji: '📈' },
        { label: 'Inteligência Artificial',    value: 'ia',        emoji: '🤖' },
        { label: 'Gestão de TI',               value: 'gestao_ti', emoji: '📋' },
        { label: 'Outro',                      value: 'outro_c',   emoji: '📌' },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de cursos enviado!', ephemeral: true });
  },
};