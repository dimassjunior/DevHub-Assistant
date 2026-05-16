require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  Events,
  REST,
  Routes,
  ActivityType,
} = require('discord.js');

const { TOKEN, CLIENT_ID, GUILD_ID } = require('./config');
const { startVagasScheduler }        = require('./jobs/vagasSchedulerNew');
const { registerLogEvents }          = require('./handlers/logs');
const { registerRecepcaoEvents }     = require('./handlers/recepcao');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.User,
  ],
});

client.commands = new Collection();

// ── Carrega comandos ──────────────────────────────────────────────────────────
const setupCommand = require('./commands/setupVerificacao');
const clearCommand = require('./commands/clear');
const setupCursos  = require('./commands/setupCursos');
const setupFuncoes = require('./commands/setupFuncoes');

client.commands.set(setupCommand.data.name, setupCommand);
client.commands.set(clearCommand.data.name, clearCommand);
client.commands.set(setupCursos.data.name,  setupCursos);
client.commands.set(setupFuncoes.data.name, setupFuncoes);

client.once(Events.ClientReady, async () => {
  console.log(`✅  </> DevHub online como ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('📡  Registrando slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      {
        body: [
          setupCommand.data.toJSON(),
          clearCommand.data.toJSON(),
          setupCursos.data.toJSON(),
          setupFuncoes.data.toJSON(),
        ],
      }
    );
    console.log('✅  Slash commands registrados!\n');
  } catch (err) {
    console.error('❌  Erro ao registrar comandos:', err);
  }

  console.log('[Vagas] 🚀 Iniciando sistema de vagas...');
  startVagasScheduler(client);
  registerLogEvents(client);
  registerRecepcaoEvents(client);

  // ── Rich Presence ─────────────────────────────────────────────────────────
  const atividades = [
    { name: '👑 Desenvolvido por Dimas Júnior', type: ActivityType.Playing  },
    { name: '⌚ 24/7 ativo',                    type: ActivityType.Playing  },
    { name: '💼 Vagas de TI',                   type: ActivityType.Watching },
    { name: '🚀 DevHub',                        type: ActivityType.Playing  },
    { name: '🔍 Buscando novas vagas...',        type: ActivityType.Watching },
    { name: '📡 100+ vagas por hora',            type: ActivityType.Playing  },
    { name: '🌐 Vagas Nacionais',               type: ActivityType.Watching },
    { name: '🌐 Vagas Internacionais',          type: ActivityType.Watching },
  ];

  let index = 0;
  function setStatus() {
    const atividade = atividades[index % atividades.length];
    client.user.setPresence({
      activities: [{ name: atividade.name, type: atividade.type }],
      status: 'online',
    });
    index++;
  }
  setStatus();
  setInterval(setStatus, 15000);
});

client.on(Events.InteractionCreate, require('./handlers/interactions'));

process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err?.message ?? err);
});
process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err?.message ?? err);
});

client.login(TOKEN);