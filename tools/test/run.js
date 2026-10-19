// Run every tools/test/*.test.js file; exit 1 if any fails.   node tools/test/run.js   (npm test)
const fs = require('fs'), path = require('path'), cp = require('child_process');
const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort();
let failed = 0;
for (const f of files) {
  const r = cp.spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8' });
  const last = (r.stdout || '').trim().split('\n').pop();
  console.log(`${r.status === 0 ? 'PASS' : 'FAIL'}  ${f.padEnd(28)} ${last}`);
  if (r.status !== 0) { failed++; process.stdout.write(r.stdout + (r.stderr || '')); }
}
console.log(`\n${files.length - failed} of ${files.length} test files passed`);
process.exit(failed ? 1 : 0);
