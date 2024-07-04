const { execSync } = require('child_process');
const fs = require('fs-extra');

const buildExpo = () => {
  console.log('Building Expo app...');
  execSync('npx expo export', { stdio: 'inherit', cwd: 'The-Optometrists-Companion' });
};

const buildGatsby = () => {
  console.log('Building Gatsby app...');
  execSync('gatsby build', { stdio: 'inherit', cwd: 'optometrists-companion-web-homepage' });
};

const combineBuilds = () => {
  console.log('Combining builds...');
  // Ensure the directory for the Gatsby build exists
  fs.ensureDirSync('web-build/gatsby');
  // Move the Gatsby build into the web-build directory
  fs.moveSync('public', 'web-build/gatsby', { overwrite: true });
  // Create a directory for the Expo app within the Gatsby build
  fs.ensureDirSync('web-build/gatsby/expo-app');
  // Move the Expo build into the newly created directory
  fs.moveSync('dist', 'web-build/gatsby/expo-app', { overwrite: true });
};

const runBuilds = async () => {
  buildExpo();
  buildGatsby();
  combineBuilds();
  console.log('Build process completed.');
};

runBuilds().catch(console.error);