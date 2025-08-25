module.exports = {
  apps: [
    {
      name: 'carjunk',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: 'C:/carjunk/CAR_JUNK', // <-- set to your project directory
      env: {
        NODE_ENV: 'production'
        // add other environment variables if needed, e.g. MONGODB_URL, etc.
      }
    }
  ]
};












