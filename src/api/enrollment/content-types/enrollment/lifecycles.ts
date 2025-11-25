import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('Enrollment afterCreate triggered for ID:', result.id);

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
            ${result.company ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Компания</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.company}</td></tr>` : ''}
            ${result.contactPerson ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Контактное лицо</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.contactPerson}</td></tr>` : ''}
            ${result.email ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Email</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.email}</td></tr>` : ''}
            ${result.phone ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Телефон</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.phone}</td></tr>` : ''}
            ${result.subject ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Тема</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.subject}</td></tr>` : ''}
            ${result.format ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Формат</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.format}</td></tr>` : ''}
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
                    .query('api::enrollment.enrollment')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (enrollment)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (enrollment):', err);
            }
        }
    },
};
