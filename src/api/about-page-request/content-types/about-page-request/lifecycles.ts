// src/api/about-page-request/lifecycles.js

import nodemailer from 'nodemailer';

export default {
  // ----------------------------------------------------------------------
  // Оборачиваем ВСЮ функцию в try...catch для ПРЕДОТВРАЩЕНИЯ ошибки 500
  // ----------------------------------------------------------------------
  async afterCreate(event) {
    const { result } = event;
    const mailSubjectName = result.formName || 'О нас';
    const timestamp = new Date().toISOString();

    try {
      // Логирование до блока if
      strapi.log.info(`[${timestamp}] afterCreate triggered for ${event.model.uid} ID: ${result.id}`);

      if (!result.emailSent) {

        // Корректно определяем secure: true ТОЛЬКО для порта 465. Для 587 secure: false (STARTTLS).
        const isSecure = parseInt(process.env.SMTP_PORT, 10) === 465;

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: isSecure, // Используем вычисленное значение
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

        // Используем универсальный event.model.uid
        await strapi.db
          .query(event.model.uid)
          .update({
            where: { id: result.id },
            data: { emailSent: true },
          });

        strapi.log.info(`[${timestamp}] Email успешно отправлен для ID: ${result.id}`);

      } else {
        strapi.log.info(`[${timestamp}] Email для ID ${result.id} уже был отправлен.`);
      }

    } catch (err) {
      // Логгируем ошибку, но не перебрасываем ее, чтобы не блокировать успешный HTTP-ответ.
      strapi.log.error(`[${timestamp}] КРИТИЧЕСКАЯ ОШИБКА в afterCreate для ID ${result.id}:`, err);
    }
  },
};