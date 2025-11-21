module.exports = {
  apps: [
    {
      name: 'strapi',
      script: 'npm',
      args: 'start',
      cwd: '/home/interim/backend/my-strapi-project',
      env: {
        NODE_ENV: 'production',
        SMTP_HOST: 'mail.netangels.ru',
        SMTP_PORT: 587,
        SMTP_USERNAME: 'info@interimjob.ru',
        SMTP_PASSWORD: '3tGF69v72xxbqcIt',
        SMTP_FROM: 'info@interimjob.ru'
      }
    }
  ]
};
