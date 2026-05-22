/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
try {
  console.log("Building...");
  execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
  console.log("Success");
} catch (e) {
  require('fs').writeFileSync('build-errors.txt', e.stdout + '\n' + e.stderr);
  console.log("Failed, wrote to build-errors.txt");
}
