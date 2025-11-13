const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Expo Metro config
const config = getDefaultConfig(__dirname);

// Find the workspace root (large-event directory)
const workspaceRoot = path.resolve(__dirname, '../..');

// Add workspace root to watchFolders for monorepo support
config.watchFolders = [workspaceRoot];

// Configure resolver to look in workspace node_modules
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  // Exclude workspace package node_modules to prevent version conflicts
  blockList: [
    /shared\/.*\/node_modules\/.*/,
    /teams\/.*\/node_modules\/.*/,
  ],
};

module.exports = config;
