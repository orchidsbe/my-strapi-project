export default {
  async afterCreate(event: any) {
    const { result } = event;

    if (!result.email) return;

    try {
      await strapi.plugin('email').service('email').send({
        to: result.email,
        from: 'no-reply@yourdomain.com',
        subject: 'Спасибо за вашу заявку',
        text: `Здравствуйте, ${result.name || ''}! Ваша заявка принята.`,
        html: `<p>Здравствуйте, <strong>${result.name || ''}</strong>! Ваша заявка принята.</p>`,
      });

      strapi.log.info(`Email успешно отправлен на ${result.email}`);
    } catch (err) {
      strapi.log.error('Ошибка при отправке email:', err);
    }
  },
};
