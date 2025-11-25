module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: '/home/interim/backend/my-strapi-project',
      script: 'node_modules/@strapi/strapi/bin/strapi.js',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=4096',
        SMTP_HOST: 'mail.netangels.ru',
        SMTP_PORT: '587',
        SMTP_USERNAME: 'info@interimjob.ru',
        SMTP_PASSWORD: '3tGF69v72xxbqcIt',
        SMTP_FROM: 'info@interimjob.ru',
      },
    },
  ],
};
