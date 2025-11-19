export default ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.interimjob.ru'), 
        port: env('SMTP_PORT', 587), 
        auth: {
          user: env('SMTP_USERNAME', 'info@interimjob.ru'), 
          pass: env('SMTP_PASSWORD'), 
        },
      },
      settings: {
        defaultFrom: env('SMTP_FROM', 'info@interimjob.ru'),
        defaultReplyTo: env('SMTP_FROM', 'info@interimjob.ru'),
      },
    },
  },
});
