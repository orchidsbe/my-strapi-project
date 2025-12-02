import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('afterCreate triggered for ID:', result.id);

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
          <h2>Новая заявка на подбор персонала</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 4px; border: 1px solid #ccc;"><strong>Имя</strong></td>
              <td style="padding: 4px; border: 1px solid #ccc;">${result.name}</td>
            </tr>
            <tr>
              <td style="padding: 4px; border: 1px solid #ccc;"><strong>Email</strong></td>
              <td style="padding: 4px; border: 1px solid #ccc;">${result.email}</td>
            </tr>
            <tr>
              <td style="padding: 4px; border: 1px solid #ccc;"><strong>Телефон</strong></td>
              <td style="padding: 4px; border: 1px solid #ccc;">${result.phone}</td>
            </tr>
            <tr>
              <td style="padding: 4px; border: 1px solid #ccc;"><strong>Должность</strong></td>
              <td style="padding: 4px; border: 1px solid #ccc;">${result.position}</td>
            </tr>
            <tr>
             <td style="padding: 4px; border: 1px solid #ccc;"><strong>Требования к кандидату</strong></td>
             <td>${result.message ? JSON.stringify(result.message) : '-'}</td>
            </tr>
            <tr>
              <td style="padding: 4px; border: 1px solid #ccc;"><strong>Согласие на обработку данных</strong></td>
              <td style="padding: 4px; border: 1px solid #ccc;">${result.consent ? 'Да' : 'Нет'}</td>
            </tr>
          </table>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: 'info@interimjob.ru',
          subject: 'Новая заявка на подбор персонала',
          html: mailHtml,
        });

        await strapi.db.query('api::application-request.application-request').update({
          where: { id: result.id },
          data: { emailSent: true },
        });

        strapi.log.info(`Email отправлен на info@interimjob.ru`);
      } catch (err) {
        strapi.log.error('Ошибка отправки email:', err);
      }
    }
  },
};
