module.exports = {
    apps: [
      {
        name: 'metall-app',
        script: 'npm',
        args: 'run start',
        watch: false,
        env: {
          NODE_ENV: 'production',
          PORT: 4030
        }
      }
    ]
  };
  