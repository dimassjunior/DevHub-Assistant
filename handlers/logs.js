const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { CANAL_LOGS } = require('../config');

// Helper para buscar o canal de logs
async function getLogChannel(guild) {
  try {
    return await guild.channels.fetch(CANAL_LOGS);
  } catch {
    console.error('[Logs] Canal de logs não encontrado. Verifique CANAL_LOGS no config.js');
    return null;
  }
}

// ── Mensagem apagada ──────────────────────────────────────────────────────────
async function onMessageDelete(message) {
  if (!message.guild)        return;
  if (message.author?.bot)   return;
  if (!message.content && message.attachments.size === 0) return;

  const channel = await getLogChannel(message.guild);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(0xef4444)
    .setTitle('🗑️  Mensagem apagada')
    .addFields(
      { name: '👤 Autor',   value: message.author ? `${message.author} (\`${message.author.tag}\`)` : 'Desconhecido', inline: true },
      { name: '📍 Canal',   value: `${message.channel}`, inline: true },
    )
    .setTimestamp();

  if (message.content) {
    embed.addFields({ name: '💬 Conteúdo', value: message.content.slice(0, 1024) });
  }

  if (message.attachments.size > 0) {
    const nomes = message.attachments.map(a => `\`${a.name}\``).join(', ');
    embed.addFields({ name: '📎 Anexos removidos', value: nomes });
  }

  if (message.author?.displayAvatarURL) {
    embed.setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
  }

  channel.send({ embeds: [embed] });
}

// ── Entrada/saída de canal de voz ─────────────────────────────────────────────
async function onVoiceStateUpdate(oldState, newState) {
  const guild  = newState.guild ?? oldState.guild;
  const member = newState.member ?? oldState.member;
  if (!guild || member?.user?.bot) return;

  const channel = await getLogChannel(guild);
  if (!channel) return;

  const entrou = !oldState.channel && newState.channel;
  const saiu   = oldState.channel && !newState.channel;
  const moveu  = oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id;

  if (!entrou && !saiu && !moveu) return;

  let cor, titulo, desc;

  if (entrou) {
    cor    = 0x16a34a;
    titulo = '🎙️  Entrou em call';
    desc   = `${member} entrou em **${newState.channel.name}**`;
  } else if (saiu) {
    cor    = 0xef4444;
    titulo = '🔇  Saiu de call';
    desc   = `${member} saiu de **${oldState.channel.name}**`;
  } else {
    cor    = 0xf59e0b;
    titulo = '🔀  Mudou de call';
    desc   = `${member} saiu de **${oldState.channel.name}** e entrou em **${newState.channel.name}**`;
  }

  const embed = new EmbedBuilder()
    .setColor(cor)
    .setTitle(titulo)
    .setDescription(desc)
    .addFields({ name: '👤 Usuário', value: `\`${member.user.tag}\``, inline: true })
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  channel.send({ embeds: [embed] });
}

// ── Mudança de nick e avatar ──────────────────────────────────────────────────
async function onGuildMemberUpdate(oldMember, newMember) {
  if (newMember.user.bot) return;

  const channel = await getLogChannel(newMember.guild);
  if (!channel) return;

  // Mudança de nickname
  if (oldMember.nickname !== newMember.nickname) {
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle('✏️  Nickname alterado')
      .addFields(
        { name: '👤 Usuário',    value: `${newMember} (\`${newMember.user.tag}\`)`, inline: false },
        { name: '📝 Antes',      value: oldMember.nickname || `\`${oldMember.user.username}\``, inline: true },
        { name: '📝 Depois',     value: newMember.nickname || `\`${newMember.user.username}\``, inline: true },
      )
      .setThumbnail(newMember.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    channel.send({ embeds: [embed] });
  }
}

// ── Mudança de avatar ─────────────────────────────────────────────────────────
async function onUserUpdate(oldUser, newUser) {
  if (newUser.bot) return;
  if (oldUser.avatar === newUser.avatar) return;

  // Precisa do guild pra buscar o canal — varre todos os guilds que o bot conhece
  // (será chamado pelo client mais abaixo)
  return { oldUser, newUser };
}

// ── Registra todos os eventos no client ──────────────────────────────────────
function registerLogEvents(client) {
  const { Events } = require('discord.js');

  // Mensagem apagada
  client.on(Events.MessageDelete, onMessageDelete);

  // Call de voz
  client.on(Events.VoiceStateUpdate, onVoiceStateUpdate);

  // Nickname
  client.on(Events.GuildMemberUpdate, onGuildMemberUpdate);

  // Avatar — dispara em todos os guilds compartilhados
  client.on(Events.UserUpdate, async (oldUser, newUser) => {
    if (newUser.bot) return;
    if (oldUser.avatar === newUser.avatar) return;

    const avatarAntigo = oldUser.displayAvatarURL({ dynamic: true, size: 256 });
    const avatarNovo   = newUser.displayAvatarURL({ dynamic: true, size: 256 });

    const embed = new EmbedBuilder()
      .setColor(0x9333ea)
      .setTitle('🖼️  Avatar alterado')
      .setDescription(`**${newUser.tag}** trocou o avatar.`)
      .addFields(
        { name: '🖼️ Antes', value: `[Ver avatar antigo](${avatarAntigo})`, inline: true },
        { name: '🖼️ Depois', value: `[Ver avatar novo](${avatarNovo})`,   inline: true },
      )
      .setThumbnail(avatarNovo)
      .setTimestamp();

    // Posta no canal de logs de todos os guilds que o usuário está
    for (const guild of client.guilds.cache.values()) {
      try {
        const member = await guild.members.fetch(newUser.id).catch(() => null);
        if (!member) continue;
        const logChannel = await getLogChannel(guild);
        if (!logChannel) continue;
        logChannel.send({ embeds: [embed] });
        break; // só posta uma vez (pega o primeiro guild)
      } catch {}
    }
  });

  console.log('✅  Sistema de logs registrado\n');
}

module.exports = { registerLogEvents };