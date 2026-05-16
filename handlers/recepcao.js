const { EmbedBuilder, Events } = require('discord.js');
const { CANAL_RECEPCAO } = require('../config');

async function getCanal(guild) {
  try {
    return await guild.channels.fetch(CANAL_RECEPCAO);
  } catch {
    console.error('[Recepção] ❌ Canal não encontrado. Verifique CANAL_RECEPCAO no config.js');
    return null;
  }
}

function registerRecepcaoEvents(client) {

  // ── Entrada ───────────────────────────────────────────────────────────────
  client.on(Events.GuildMemberAdd, async (member) => {
    const canal = await getCanal(member.guild);
    if (!canal) return;

    const contagem = member.guild.memberCount;
    const criacao  = `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`;

    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('👋  Novo membro chegou!')
      .setDescription(
        `Seja muito bem-vindo(a) ao **</> DevHub**, ${member}! 🎉\n\n` +
        `> Acesse o canal de verificação para liberar seu acesso.`
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👤 Usuário',         value: `\`${member.user.tag}\``,  inline: true },
        { name: '🪪 ID',              value: `\`${member.user.id}\``,   inline: true },
        { name: '📅 Conta criada',    value: criacao,                   inline: true },
        { name: '👥 Membro nº',       value: `\`#${contagem}\``,        inline: true },
      )
      .setFooter({ text: '</> DevHub • Recepção' })
      .setTimestamp();

    canal.send({ embeds: [embed] });
  });

  // ── Saída ─────────────────────────────────────────────────────────────────
  client.on(Events.GuildMemberRemove, async (member) => {
    const canal = await getCanal(member.guild);
    if (!canal) return;

    const entrada = member.joinedTimestamp
      ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
      : 'Desconhecido';

    // Cargos que o membro tinha (exceto @everyone)
    const cargos = member.roles.cache
      .filter(r => r.id !== member.guild.id)
      .map(r => r.toString())
      .join(' ') || 'Nenhum';

    const embed = new EmbedBuilder()
      .setColor(0xef4444)
      .setTitle('🚪  Membro saiu')
      .setDescription(`**${member.user.tag}** deixou o servidor.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👤 Usuário',      value: `\`${member.user.tag}\``, inline: true },
        { name: '🪪 ID',           value: `\`${member.user.id}\``,  inline: true },
        { name: '📅 Entrou',       value: entrada,                  inline: true },
        { name: '🏷️ Cargos',       value: cargos.slice(0, 1024),   inline: false },
      )
      .setFooter({ text: '</> DevHub • Recepção' })
      .setTimestamp();

    canal.send({ embeds: [embed] });
  });

  console.log('✅  Sistema de recepção registrado\n');
}

module.exports = { registerRecepcaoEvents };