import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('Event registration afterCreate triggered for ID:', result.id);

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
            ${result.participationFormat ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Формат участия</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.participationFormat}</td></tr>` : ''}
            ${result.comment ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Комментарий</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.comment}</td></tr>` : ''}
            ${result.eventTitle ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Название события</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.eventTitle}</td></tr>` : ''}
            ${result.eventDate ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Дата события</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.eventDate}</td></tr>` : ''}
          </table>
        `;

                await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: 'info@interimjob.ru',
                    subject: `Новая заявка: ${result.formName}`,
                    html: mailHtml,
                });

                await strapi.db
                    .query('api::event-registration.event-registration')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (event-registration)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (event-registration):', err);
            }
        }
    },
};
