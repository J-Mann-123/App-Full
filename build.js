const { execSync } = require('child_process');
const fs = require('fs-extra');

const buildExpo = () => {
  console.log('Building Expo app...');
  execSync('expo export', { stdio: 'inherit' });
};

const buildGatsby = () => {
  console.log('Building Gatsby app...');
  execSync('gatsby build', { stdio: 'inherit' });
};

const combineBuilds = () => {
  console.log('Combining builds...');
  fs.ensureDirSync('web-build/gatsby');
  fs.moveSync('public', 'web-build/gatsby', { overwrite: true });
};

const runBuilds = async () => {
  buildExpo();
  buildGatsby();
  combineBuilds();
  console.log('Build process completed.');
};

runBuilds().catch(console.error);