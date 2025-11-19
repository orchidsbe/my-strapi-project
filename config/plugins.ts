module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'smtp',
      providerOptions: {
        host: env('SMTP_HOST', 'mail.interimjob.ru'), // <-- новый сервер
        port: env('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME', 'info@interimjob.ru'),
          pass: env('SMTP_PASSWORD'),
        },
        // secure: false, // оставляем false для STARTTLS на 587
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'info@interimjob.ru'),
        defaultReplyTo: env('SMTP_FROM', 'info@interimjob.ru'),
      },
    },
  },
});
