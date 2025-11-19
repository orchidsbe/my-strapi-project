export default {
  info: {
    singularName: 'recruitment-request',
    pluralName: 'recruitment-requests',
    displayName: 'Recruitment Request',
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    position: { type: 'string', required: true },
    message: { type: 'text' },
  },
};
