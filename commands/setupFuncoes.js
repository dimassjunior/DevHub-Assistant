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
    .setName('setup-funcoes')
    .setDescription('📌 Envia o painel de seleção de funções')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(COR_PRINCIPAL)
      .setTitle('</> DevHub — 💼 Funções')
      .setDescription(
        '## Qual é a sua área?\n\n' +
        'Selecione no menu abaixo sua(s) área(s) de atuação ou interesse.\n\n' +
        '> ✅ Pode selecionar **mais de uma**.\n' +
        '> 🔄 Para **remover** um cargo, abra o menu e **desmarque** a função.\n\n' +
        '─────────────────────────────────'
      )
      .setFooter({ text: '</> DevHub • Painel de Funções' })
      .setTimestamp();

    const menu = new StringSelectMenuBuilder()
      .setCustomId('painel_funcoes')
      .setPlaceholder('💼 Selecione sua(s) área(s)...')
      .setMinValues(0)
      .setMaxValues(23)
      .addOptions([
        { label: 'Front-End',          value: 'frontend',   emoji: '🎨' },
        { label: 'Back-End',           value: 'backend',    emoji: '⚙️' },
        { label: 'Full Stack',         value: 'fullstack',  emoji: '🔀' },
        { label: 'Mobile',             value: 'mobile',     emoji: '📱' },
        { label: 'Game Dev',           value: 'gamedev',    emoji: '🕹️' },
        { label: 'DevOps',             value: 'devops',     emoji: '☁️' },
        { label: 'QA / Tester',        value: 'qa',         emoji: '🧪' },
        { label: 'UI Designer',        value: 'ui_design',  emoji: '🖌️' },
        { label: 'UX Designer',        value: 'ux_design',  emoji: '🧩' },
        { label: 'Product Manager',    value: 'pm',         emoji: '📋' },
        { label: 'Data Analyst',       value: 'data_ana',   emoji: '📊' },
        { label: 'Data Scientist',     value: 'data_sci',   emoji: '📈' },
        { label: 'AI Engineer',        value: 'ai_eng',     emoji: '🤖' },
        { label: 'CyberSecurity',      value: 'cyber',      emoji: '🔒' },
        { label: 'Cloud Engineer',     value: 'cloud',      emoji: '🌩️' },
        { label: 'DBA',                value: 'dba',        emoji: '🗄️' },
        { label: 'Suporte TI',         value: 'suporte_ti', emoji: '🛠️' },
        { label: 'Networking',         value: 'networking', emoji: '🌐' },
        { label: 'Freelancer',         value: 'freelancer', emoji: '💻' },
        { label: 'Estudante',          value: 'estudante',  emoji: '📚' },
        { label: 'Recruiter / RH',     value: 'recruiter',  emoji: '🤝' },
        { label: 'Criador de Conteúdo',value: 'conteudo',   emoji: '🎬' },
        { label: 'Outro',              value: 'outro_f',    emoji: '📌' },
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: '✅ Painel de funções enviado!', ephemeral: true });
  },
};