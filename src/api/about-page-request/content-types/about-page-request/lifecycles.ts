import nodemailer from 'nodemailer';

export default {
async afterCreate(event) {
const { result } = event;

strapi.log.info('afterCreate triggered for ID:', result.id);

// Проверка, отправлялось ли уже письмо
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

    // Формируем письмо динамически по доступным полям
    const mailHtml = `
      <h2>Новая заявка: ${result.formName}</h2>
      <table style="border-collapse: collapse; width: 100%;">
        ${result.name ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Имя</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.name}</td></tr>` : ''}
        ${result.email ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Email</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.email}</td></tr>` : ''}
        ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Телефон</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.phone}</td></tr>` : ''}
        ${result.role ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Должность</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.role}</td></tr>` : ''}
        ${result.company ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Компания</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.company}</td></tr>` : ''}
        ${result.message ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Сообщение</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.message}</td></tr>` : ''}
        ${typeof result.agreed !== 'undefined' ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Согласие</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.agreed ? 'Да' : 'Нет'}</td></tr>` : ''}
      </table>
    `;

    // Отправка письма
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'info@interimjob.ru',
      subject: `Новая заявка: ${result.formName}`,
      html: mailHtml,
    });

    // Обновляем запись, чтобы не отправлять повторно
    await strapi.db
      .query(result.uid || 'api::about-page-request.about-page-request')
      .update({
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
