import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('Event afterCreate triggered for ID:', result.id);

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
            ${result.title ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Название</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.title}</td></tr>` : ''}
            ${result.type ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Тип</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.type}</td></tr>` : ''}
            ${result.format ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Формат</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.format}</td></tr>` : ''}
            ${result.city ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Город</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.city}</td></tr>` : ''}
            ${result.tz ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Часовой пояс</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.tz}</td></tr>` : ''}
            ${result.start ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Начало</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.start}</td></tr>` : ''}
            ${result.end ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Конец</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.end}</td></tr>` : ''}
            ${result.price ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Цена</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.price}</td></tr>` : ''}
            ${result.venue ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Место</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.venue}</td></tr>` : ''}
            ${result.regUrl ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Ссылка регистрации</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.regUrl}</td></tr>` : ''}
          </table>
        `;

                await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: 'info@interimjob.ru',
                    subject: `Новая заявка: ${result.formName}`,
                    html: mailHtml,
                });

                await strapi.db
                    .query('api::event.event')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (event)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (event):', err);
            }
        }
    },
};
