import appConfig from '../app.json';

const { file, spawnSync, which } = globalThis.Bun;
const usage = 'Usage: bun run android:usb [path/to/development.apk]';

const args = process.argv.slice(2);
if (args[0] === '--help' || args[0] === '-h') {
  console.log(usage);
  process.exit(0);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function adb(...command) {
  const result = spawnSync(['adb', '-d', ...command], { stdout: 'inherit', stderr: 'inherit' });
  if (!result.success) fail(`ADB failed: adb -d ${command.join(' ')}`);
}

async function fetchLocal(url, name) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (response.ok) return response;
    fail(`${name} returned HTTP ${response.status} at ${url}.`);
  } catch {
    fail(`${name} is not reachable at ${url}. Start it on the Mac and retry.`);
  }
}

if (args.length > 1 || (args[0] && !args[0].toLowerCase().endsWith('.apk'))) fail(usage);
if (!which('adb')) fail('Add Android SDK Platform Tools to PATH so this script can run adb.');

const state = spawnSync(['adb', '-d', 'get-state']);
if (!state.success || state.stdout.toString().trim() !== 'device') {
  if (state.stderr.length) console.error(state.stderr.toString().trim());
  fail('Connect one Android device over USB, unlock it, and accept the USB debugging prompt.');
}

const [apk] = args;
if (apk && !(await file(apk).exists())) fail(`APK not found: ${apk}`);

const metroPort = Number(process.env.METRO_PORT ?? '8081');
if (!Number.isInteger(metroPort) || metroPort < 1 || metroPort > 65535) fail('METRO_PORT must be a valid TCP port.');
const metro = `http://127.0.0.1:${metroPort}`;
const metroStatus = await fetchLocal(`${metro}/status`, 'Metro');
if ((await metroStatus.text()).trim() !== 'packager-status:running') fail(`No Metro packager found at ${metro}.`);

const reversePorts = new Set([metroPort]);
for (const key of ['EXPO_PUBLIC_COMPANY_ORIGIN', 'EXPO_PUBLIC_PERSONAL_ORIGIN']) {
  const value = process.env[key];
  if (!value) fail(`Set ${key} in .env.local or in the shell used for Metro and this script.`);
  const origin = URL.parse(value);
  if (!origin || !['http:', 'https:'].includes(origin.protocol)) fail(`Invalid HTTP origin in ${key}.`);
  if (!['localhost', '127.0.0.1'].includes(origin.hostname)) continue;

  const port = Number(origin.port || (origin.protocol === 'https:' ? 443 : 80));
  await fetchLocal(new URL('/api/content', origin), key);
  reversePorts.add(port);
}

const { android, slug } = appConfig.expo;
if (apk) adb('install', '-r', apk);
const installed = spawnSync(['adb', '-d', 'shell', 'pm', 'path', android.package]);
if (!installed.success || !installed.stdout.toString().includes('package:')) {
  fail('Install the EAS development APK first by passing its path to this script.');
}

for (const port of reversePorts) adb('reverse', `tcp:${port}`, `tcp:${port}`);
const scheme = `exp+${slug.replace(/[^A-Za-z0-9+\-.]/g, '').toLowerCase()}`;
const link = `${scheme}://?__expo_url=${encodeURIComponent(metro)}`;
adb('shell', 'am', 'start', '-W', '-a', 'android.intent.action.VIEW', '-d', link, '-p', android.package);
console.log(`Requested Tech Bizz launch over USB with Metro at ${metro}. Unlock the phone and check the app screen.`);
