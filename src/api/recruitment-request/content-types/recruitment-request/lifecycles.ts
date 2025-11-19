import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('afterCreate lifecycle сработал', result);

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: 'info@interimjob.ru',
        subject: 'Новая заявка с сайта Interimjob',
        html: `
          <h2>Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${result.name}</p>
          <p><strong>Email:</strong> ${result.email}</p>
          <p><strong>Телефон:</strong> ${result.phone}</p>
          <p><strong>Должность:</strong> ${result.role}</p>
        `,
      });

      strapi.log.info(`Email отправлен на info@interimjob.ru`);

    } catch (err) {
      strapi.log.error('Ошибка отправки email:', err);
    }
  },
};
