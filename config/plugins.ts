export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'mail.interimjob.ru'), // правильный хост
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', '[info@interimjob.ru](mailto:info@interimjob.ru)'),
          pass: env('SMTP_PASSWORD'), // пароль от почты
        },
        // secure: false, // можно добавить, если TLS
      },
      settings: {
        defaultFrom: env('SMTP_FROM', '[info@interimjob.ru](mailto:info@interimjob.ru)'),
        defaultReplyTo: env('SMTP_FROM', '[info@interimjob.ru](mailto:info@interimjob.ru)'),
      },
    },
  },
});
