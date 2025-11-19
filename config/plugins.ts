module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'smtp',  // <- изменено
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.interimjob.ru'),
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', 'info@interimjob.ru'),
          pass: env('SMTP_PASSWORD'),
        },
        // secure: false, // включить, если TLS не нужен
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'info@interimjob.ru'),
        defaultReplyTo: env('SMTP_FROM', 'info@interimjob.ru'),
      },
    },
  },
});
