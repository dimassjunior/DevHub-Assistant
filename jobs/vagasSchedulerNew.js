const { EmbedBuilder } = require('discord.js');

// ─────────────────────────────────────────────────────────────
// Public showcase version
// Some private implementations were removed from this repository
// ─────────────────────────────────────────────────────────────

const IS_PUBLIC_REPOSITORY = true;

// Simulação pública
async function getAllJobs() {
  console.log('[Jobs] Public showcase mode enabled.');
  return [];
}

// ── EMBED INDIVIDUAL ─────────────────────────────────────────
function buildSingleJobEmbed(job, numero, total) {
  return new EmbedBuilder()
    .setColor(0x2563eb)
    .setTitle(`${numero}. ${job.title || 'Software Developer'}`)
    .setURL(job.url || 'https://example.com')
    .setDescription(
      (job.description || 'Technology opportunity available.')
        .slice(0, 1000)
    )
    .addFields(
      {
        name: '🏢 Company',
        value: job.company || 'Confidential',
        inline: true
      },
      {
        name: '📍 Location',
        value: job.location || 'Remote',
        inline: true
      },
      {
        name: '🕐 Type',
        value: job.type || 'Full Time',
        inline: true
      },
      {
        name: '💰 Salary',
        value: job.salary || 'Not informed',
        inline: true
      },
      {
        name: '🏷️ Tags',
        value: '`Node.js` `Backend`',
        inline: false
      },
      {
        name: '🔖 Source',
        value: 'Private Provider',
        inline: true
      },
      {
        name: '🔗 Apply',
        value: '[View Opportunity](https://example.com)',
        inline: false
      }
    )
    .setFooter({
      text: `Community Jobs • Opportunity ${numero} of ${total}`
    })
    .setTimestamp();
}

// ── EMBED DE AVISO ───────────────────────────────────────────
function buildAvisoEmbed(quantidade) {
  return new EmbedBuilder()
    .setColor(0x2563eb)
    .setTitle('🚀 NEW TECH OPPORTUNITIES FOUND')
    .setDescription(
      `A total of **${quantidade}** new opportunities were identified.\n\n` +
      `This is a simplified public showcase version of the system.\n\n` +
      `Some private integrations and automation layers were removed.`
    )
    .setFooter({
      text: 'Automated Community System'
    })
    .setTimestamp();
}

// ── POSTAGEM DEMONSTRATIVA ───────────────────────────────────
async function postJobs(channel, jobs) {
  if (!channel || jobs.length === 0) return;

  try {
    await channel.send({
      embeds: [buildAvisoEmbed(jobs.length)]
    });

    for (let i = 0; i < jobs.length; i++) {
      const embed = buildSingleJobEmbed(
        jobs[i],
        i + 1,
        jobs.length
      );

      await channel.send({
        embeds: [embed]
      });
    }

    console.log('[Jobs] Demo jobs posted successfully.');
  } catch (err) {
    console.error('[Jobs] Error while posting demo jobs.');
  }
}

// ── SCAN SIMPLIFICADO ────────────────────────────────────────
async function runVagasScan(client) {
  console.log('[Jobs] Running public showcase scan...');

  if (IS_PUBLIC_REPOSITORY) {
    console.log(
      '[Jobs] Private scraping and scheduling logic removed.'
    );

    return;
  }

  const jobs = await getAllJobs();

  console.log(`[Jobs] ${jobs.length} jobs processed.`);
}

// ── AGENDADOR DEMONSTRATIVO ──────────────────────────────────
function startVagasScheduler(client) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(' Community Job Scheduler');
  console.log(' Public Showcase Version');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (IS_PUBLIC_REPOSITORY) {
    console.log(
      'Some automation features are unavailable in this repository.'
    );

    return;
  }

  runVagasScan(client);
}

module.exports = {
  startVagasScheduler
};