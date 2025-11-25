import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;

    const mailSubjectName = result.formName || 'Обучение INTERIM';

    const timestamp = new Date().toISOString();
    strapi.log.info(`[${timestamp}] afterCreate triggered for application-for-training ID: ${result.id}`);

    if (!result.emailSent) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        const mailHtml = `
          <h2>Новая заявка: ${mailSubjectName}</h2>
          <p>ID заявки: ${result.id}</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Источник формы</td><td style="border:1px solid #ccc;padding:8px;">${mailSubjectName}</td></tr>
            ${result.trainingTitle ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Программа</td><td style="border:1px solid #ccc;padding:8px;">${result.trainingTitle}</td></tr>` : ''}
            ${result.tariff ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Тариф</td><td style="border:1px solid #ccc;padding:8px;">${result.tariff}</td></tr>` : ''}
            ${result.trainingPrice ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Цена</td><td style="border:1px solid #ccc;padding:8px;">${result.trainingPrice}</td></tr>` : ''}
            ${result.name ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Имя</td><td style="border:1px solid #ccc;padding:8px;">${result.name}</td></tr>` : ''}
            ${result.email ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Email</td><td style="border:1px solid #ccc;padding:8px;">${result.email}</td></tr>` : ''}
            ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Телефон</td><td style="border:1px solid #ccc;padding:8px;">${result.phone}</td></tr>` : ''}
            ${result.source ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Источник (Source)</td><td style="border:1px solid #ccc;padding:8px;">${result.source}</td></tr>` : ''}
            ${result.comment ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Комментарий</td><td style="border:1px solid #ccc;padding:8px;">${result.comment}</td></tr>` : ''}
          </table>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: process.env.MAIL_TO_ADDRESS || 'info@interimjob.ru',
          subject: `Новая заявка: ${mailSubjectName}`,
          html: mailHtml,
        });

        await strapi.db
          .query('api::application-for-training.application-for-training')
          .update({
            where: { id: result.id },
            data: { emailSent: true },
          });

        strapi.log.info(`[${timestamp}] Email успешно отправлен для ID: ${result.id}`);

      } catch (err) {
        strapi.log.error(`[${timestamp}] Ошибка отправки email для application-for-training ID ${result.id}:`, err);
      }
    } else {
      strapi.log.info(`[${timestamp}] Email для ID ${result.id} уже был отправлен.`);
    }
  },
};