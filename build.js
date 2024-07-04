const { execSync } = require('child_process');
const fs = require('fs-extra');

const installDependencies = (cwd) => {
  console.log(`Installing dependencies in ${cwd}...`);
  execSync('npm install', { stdio: 'inherit', cwd });
};

const buildExpo = () => {
  console.log('Building Expo app...');
  installDependencies('The-Optometrists-Companion');
  execSync('npx expo export', { stdio: 'inherit', cwd: 'The-Optometrists-Companion' });
};

const buildGatsby = () => {
  console.log('Building Gatsby app...');
  installDependencies('optometrists-companion-web-homepage');
  execSync('gatsby build', { stdio: 'inherit', cwd: 'optometrists-companion-web-homepage' });
};

const combineBuilds = () => {
  console.log('Combining builds...');
  // Ensure the target directory exists
  fs.ensureDirSync('web-build/gatsby');
  // Use fs-extra's copySync to copy the Gatsby 'public' directory, then remove the original
  try {
    fs.copySync('optometrists-companion-web-homepage/public', 'web-build/gatsby', { overwrite: true });
    fs.removeSync('optometrists-companion-web-homepage/public');
  } catch (error) {
    console.error('Error copying Gatsby build:', error);
    throw error; // Rethrow to be caught by the calling function
  }
  // Ensure the target directory for the Expo app exists within the Gatsby directory
  fs.ensureDirSync('web-build/gatsby/expo-app');
  // Use fs-extra's copySync to copy the Expo 'dist' directory, then remove the original
  try {
    fs.copySync('The-Optometrists-Companion/dist', 'web-build/gatsby/expo-app', { overwrite: true });
    fs.removeSync('The-Optometrists-Companion/dist');
  } catch (error) {
    console.error('Error copying Expo build:', error);
    throw error; // Rethrow to be caught by the calling function
  }
};

const runBuilds = async () => {
  try {
    buildExpo();
    buildGatsby();
    combineBuilds();
    console.log('Build process completed.');
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
};

runBuilds().catch(console.error);