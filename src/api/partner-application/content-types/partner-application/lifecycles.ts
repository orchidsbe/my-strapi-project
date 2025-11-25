import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('Partner Application afterCreate triggered for ID:', result.id);

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
            ${result.website ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Вебсайт</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.website}</td></tr>` : ''}
            ${result.partnershipType ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Тип партнёрства</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.partnershipType}</td></tr>` : ''}
            ${result.collaborationIdea ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Идея сотрудничества</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.collaborationIdea}</td></tr>` : ''}
          </table>
        `;

                await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: 'info@interimjob.ru',
                    subject: `Новая заявка: ${result.formName}`,
                    html: mailHtml,
                });

                await strapi.db
                    .query('api::partner-application.partner-application')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (Partner Application)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (Partner Application):', err);
            }
        }
    },
};
