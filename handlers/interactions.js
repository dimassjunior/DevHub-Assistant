const { EmbedBuilder, MessageFlags } = require('discord.js');
const { COR_PRINCIPAL, COR_SUCESSO, COR_ERRO, CARGOS } = require('../config');

function getCargo(guild, id) {
  return guild.roles.cache.get(id) ?? null;
}

async function sincronizarCargos(interaction, mapaChaveId, selecionados) {
  const guild  = interaction.guild;
  const member = interaction.member;

  const adicionados = [];
  const removidos   = [];
  const erros       = [];

  for (const [chave, id] of Object.entries(mapaChaveId)) {
    const role = getCargo(guild, id);
    if (!role) { erros.push(id); continue; }

    const temCargo   = member.roles.cache.has(role.id);
    const foiMarcado = selecionados.includes(chave);

    try {
      if (foiMarcado && !temCargo) {
        await member.roles.add(role);
        adicionados.push(role.name);
      } else if (!foiMarcado && temCargo) {
        await member.roles.remove(role);
        removidos.push(role.name);
      }
    } catch (err) {
      erros.push(role.name);
    }
  }

  let desc = '';
  if (adicionados.length) desc += `✅ **Adicionados:**\n${adicionados.map(n => `> \`${n}\``).join('\n')}\n\n`;
  if (removidos.length)   desc += `🗑️ **Removidos:**\n${removidos.map(n => `> \`${n}\``).join('\n')}\n\n`;
  if (erros.length)       desc += `❌ **Erros:** verifique os IDs no \`config.js\`\n`;
  if (!desc)              desc  = 'Nenhuma alteração feita.';

  return interaction.reply({
    embeds: [new EmbedBuilder()
      .setColor(adicionados.length ? COR_SUCESSO : COR_PRINCIPAL)
      .setTitle('🏷️  Cargos atualizados!')
      .setDescription(desc.trim())
      .setFooter({ text: '</> DevHub • Cargos' })
      .setTimestamp()],
    flags: MessageFlags.Ephemeral,
  });
}

module.exports = async (interaction) => {

  // ── Verificação ───────────────────────────────────────────────────────────
  if (interaction.isButton() && interaction.customId === 'btn_verificar') {
    const membroRole = getCargo(interaction.guild, CARGOS.membro);

    if (!membroRole) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COR_ERRO)
          .setDescription('❌ Cargo Membro não encontrado. Verifique o ID no `config.js`.')],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (interaction.member.roles.cache.has(membroRole.id)) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COR_PRINCIPAL)
          .setDescription('✅ Você já está verificado!')],
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await interaction.member.roles.add(membroRole);
      return interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COR_SUCESSO)
          .setTitle('✅  Verificação concluída!')
          .setDescription(
            `Bem-vindo(a) ao **</> DevHub**, ${interaction.member}! 🎉\n\n` +
            `> Cargo **${membroRole.name}** atribuído!\n\n` +
            'Agora acesse o canal de **tags** para personalizar seus cargos.'
          )
          .setFooter({ text: '</> DevHub • Verificação concluída' })
          .setTimestamp()],
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COR_ERRO)
          .setDescription(`❌ Erro: \`${err.message}\``)],
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  // ── Painel de Cursos ──────────────────────────────────────────────────────
  if (interaction.isStringSelectMenu() && interaction.customId === 'painel_cursos') {
    const membroRole = getCargo(interaction.guild, CARGOS.membro);
    if (membroRole && !interaction.member.roles.cache.has(membroRole.id)) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COR_ERRO)
          .setDescription('❌ Você precisa se **verificar** primeiro!')],
        flags: MessageFlags.Ephemeral,
      });
    }
    return sincronizarCargos(interaction, CARGOS.cursos, interaction.values);
  }

  // ── Painel de Funções ─────────────────────────────────────────────────────
  if (interaction.isStringSelectMenu() && interaction.customId === 'painel_funcoes') {
    const membroRole = getCargo(interaction.guild, CARGOS.membro);
    if (membroRole && !interaction.member.roles.cache.has(membroRole.id)) {
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor(COR_ERRO)
          .setDescription('❌ Você precisa se **verificar** primeiro!')],
        flags: MessageFlags.Ephemeral,
      });
    }
    return sincronizarCargos(interaction, CARGOS.funcoes, interaction.values);
  }

  // ── Slash commands ────────────────────────────────────────────────────────
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands?.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(`Erro no comando /${interaction.commandName}:`, err);
      const reply = { content: '❌ Erro ao executar este comando.', flags: MessageFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) await interaction.followUp(reply);
      else await interaction.reply(reply);
    }
  }
};