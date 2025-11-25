import nodemailer from 'nodemailer';

export default {
    async afterCreate(event) {
        const { result } = event;

        strapi.log.info('ReviewsSubmission afterCreate triggered for ID:', result.id);

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
            ${result.author ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Автор</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.author}</td></tr>` : ''}
            ${result.rating ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Рейтинг</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.rating}</td></tr>` : ''}
            ${result.review_text ? `<tr><td style="border:1px solid #ccc;padding:4px;"><strong>Отзыв</strong></td><td style="border:1px solid #ccc;padding:4px;">${result.review_text}</td></tr>` : ''}
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
                    .query('api::reviews-submission.reviews-submission')
                    .update({
                        where: { id: result.id },
                        data: { emailSent: true },
                    });

                strapi.log.info(`Email отправлен (ReviewsSubmission)`);
            } catch (err) {
                strapi.log.error('Ошибка отправки email (ReviewsSubmission):', err);
            }
        }
    },
};
