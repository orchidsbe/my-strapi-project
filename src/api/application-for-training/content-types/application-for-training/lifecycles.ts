import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;

    strapi.log.info('Training afterCreate triggered for ID:', result.id);

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

            ${result.trainingTitle ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Название тренинга</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.trainingTitle}</td></tr>` : ''}

            ${result.trainingPrice ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Цена</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.trainingPrice}</td></tr>` : ''}

            ${result.name ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Имя</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.name}</td></tr>` : ''}

            ${result.email ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Email</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.email}</td></tr>` : ''}

            ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Телефон</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.phone}</td></tr>` : ''}

            ${result.tariff ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Тариф</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.tariff}</td></tr>` : ''}

            ${result.comment ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Комментарий</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.comment}</td></tr>` : ''}

            ${result.source ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Источник</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.source}</td></tr>` : ''}

          </table>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: 'info@interimjob.ru',
          subject: `Новая заявка: ${result.formName}`,
          html: mailHtml,
        });

        await strapi.db
          .query('api::application-for-training.application-for-training')
          .update({
            where: { id: result.id },
            data: { emailSent: true },
          });

        strapi.log.info(`Email отправлен (training)`);
      } catch (err) {
        strapi.log.error('Ошибка отправки email (training):', err);
      }
    }
  },
};
