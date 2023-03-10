import React from 'react';
import { EnrollToProPromoModal } from '#shared/components/EnrollToPro/EnrollToProPromoModal/EnrollToProPromoModal';
import { useEnrollToPro } from '#shared/components/EnrollToPro/enrollToProContext';

export const EnrollToProContainer = () => {
  const { isPromoVisible, setIsPromoVisible } = useEnrollToPro();
  return (
    <EnrollToProPromoModal
      isOpen={isPromoVisible}
      onRequestClose={() => setIsPromoVisible(false)}
    />
  );
};
