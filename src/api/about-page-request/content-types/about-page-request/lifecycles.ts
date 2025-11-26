import nodemailer from 'nodemailer';

export default {
  async afterCreate(event) {
    const { result } = event;
    const mailSubjectName = result.formName || 'О нас';
    const timestamp = new Date().toISOString();

    strapi.log.info(`[${timestamp}] afterCreate triggered for about-page-request ID: ${result.id}`);

    if (!result.emailSent) {
      try {
        const transporter = nodemailer.createTransporter({  // ← Маленький апдейт: используй createTransporter для consistency
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
            ${result.name ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Имя</td><td style="border:1px solid #ccc;padding:8px;">${result.name}</td></tr>` : ''}
            ${result.email ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Email</td><td style="border:1px solid #ccc;padding:8px;">${result.email}</td></tr>` : ''}
            ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Телефон</td><td style="border:1px solid #ccc;padding:8px;">${result.phone}</td></tr>` : ''}
            ${result.company ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Компания</td><td style="border:1px solid #ccc;padding:8px;">${result.company}</td></tr>` : ''}
            ${result.message ? `<tr><td style="border:1px solid #ccc;padding:8px;font-weight:bold;">Сообщение</td><td style="border:1px solid #ccc;padding:8px;">${result.message}</td></tr>` : ''}
          </table>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: process.env.MAIL_TO_ADDRESS || 'info@interimjob.ru',
          subject: `Новая заявка: ${mailSubjectName}`,
          html: mailHtml,
        });

        // ← ФИКС: Используем entityService + НЕ возвращаем результат явно
        await strapi.entityService.update('api::about-page-request.about-page-request', result.id, {
          data: { emailSent: true },
        });
        // Результат обновления игнорируется, потому что дальше return;

        strapi.log.info(`[${timestamp}] Email успешно отправлен и флаг обновлён для ID: ${result.id}`);

      } catch (err) {
        strapi.log.error(`[${timestamp}] Ошибка отправки email для ID ${result.id}:`, err);
        // ← Здесь НЕ throw — клиент не узнает об ошибке письма
      }
    } else {
      strapi.log.info(`[${timestamp}] Email для ID ${result.id} уже был отправлен.`);
    }

    // ← КЛЮЧЕВОЙ ФИКС: Явно ничего не возвращаем
    return;
  },
};