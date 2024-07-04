const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

const installDependencies = async (cwd) => {
  console.log(`Installing dependencies in ${cwd}...`);
  await execAsync('npm install', { stdio: 'inherit', cwd });
};

const buildExpo = async () => {
  console.log('Building Expo app...');
  await installDependencies(path.join(__dirname, 'The-Optometrists-Companion'));
  await execAsync('npx expo export -p web', { stdio: 'inherit', cwd: path.join(__dirname, 'The-Optometrists-Companion') });
};

const buildGatsby = async () => {
  console.log('Building Gatsby app...');
  await installDependencies(path.join(__dirname, 'optometrists-companion-web-homepage'));
  await execAsync('gatsby build', { stdio: 'inherit', cwd: path.join(__dirname, 'optometrists-companion-web-homepage') });
};

const combineBuilds = async () => {
  console.log('Combining builds...');
  const gatsbyTargetDir = path.join(__dirname, 'public'); // Changed from web-build/gatsby to web-build
  const expoTargetDir = path.join(__dirname, 'public/expo-app'); // Ensure Expo app is placed under /expo-app

  await fs.ensureDir(gatsbyTargetDir);
  await fs.copy(path.join(__dirname, 'optometrists-companion-web-homepage/public'), gatsbyTargetDir, { overwrite: true });
  await fs.remove(path.join(__dirname, 'optometrists-companion-web-homepage/public'));

  await fs.ensureDir(expoTargetDir);
  await fs.copy(path.join(__dirname, 'The-Optometrists-Companion/dist'), expoTargetDir, { overwrite: true });
  await fs.remove(path.join(__dirname, 'The-Optometrists-Companion/dist'));
};

const runBuilds = async () => {
  try {
    await buildExpo();
    await buildGatsby();
    await combineBuilds();
    console.log('Build process completed.');
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
};

runBuilds().catch(console.error);