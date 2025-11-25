import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('JobApplication afterCreate triggered for ID:', result.id);

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
            ${result.desiredRole ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Желаемая должность</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.desiredRole}</td></tr>` : ''}
            ${result.experienceSummary ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Опыт работы</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.experienceSummary}</td></tr>` : ''}
          </table>
        `;

                await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: 'info@interimjob.ru',
                    subject: `Новая заявка: ${result.formName}`,
                    html: mailHtml,
                });

                await strapi.db
                    .query('api::job-application.job-application')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (JobApplication)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (JobApplication):', err);
            }
        }
    },
};
