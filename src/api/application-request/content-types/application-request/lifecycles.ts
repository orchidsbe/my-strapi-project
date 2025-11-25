import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('Application afterCreate triggered for ID:', result.id);

    if (!result.emailSent) {
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

        const mailHtml = `
          <h2>Новая заявка: ${result.formName}</h2>
          <table style="border-collapse: collapse; width: 100%;">
            ${result.name ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Имя</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.name}</td></tr>` : ''}
            ${result.email ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Email</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.email}</td></tr>` : ''}
            ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Телефон</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.phone}</td></tr>` : ''}
            ${result.company ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Компания</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.company}</td></tr>` : ''}
            ${result.position ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Должность</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.position}</td></tr>` : ''}
            ${result.message ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Сообщение</strong></td><td style="border:1px solid #ccc;padding:4px;">${JSON.stringify(result.message)}</td></tr>` : ''}
            ${typeof result.consent !== 'undefined' ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Согласие</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.consent ? 'Да' : 'Нет'}</td></tr>` : ''}
          </table>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: 'info@interimjob.ru',
          subject: `Новая заявка: ${result.formName}`,
          html: mailHtml,
        });

        await strapi.db
          .query('api::application-request.application-request')
          .update({
            where: { id: result.id },
            data: { emailSent: true },
          });

        strapi.log.info(`Email отправлен (application-request)`);
      } catch (err) {
        strapi.log.error('Ошибка отправки email (application-request):', err);
      }
    }
  },
};
