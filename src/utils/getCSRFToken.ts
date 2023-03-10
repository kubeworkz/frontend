export const getCSRFToken: () => string = () => {
  const el = document.head.querySelector<HTMLMetaElement>('[name="csrf-token"]');
  if (!el) {
    return '';
  }

  return el.content || '';
};
