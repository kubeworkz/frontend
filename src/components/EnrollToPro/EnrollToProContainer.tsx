import React from 'react';
import { EnrollToProPromoModal } from '../../components/EnrollToPro/EnrollToProPromoModal/EnrollToProPromoModal';
import { useEnrollToPro } from '../../components/EnrollToPro/enrollToProContext';

export const EnrollToProContainer = () => {
  const { isPromoVisible, setIsPromoVisible } = useEnrollToPro();
  return (
    <EnrollToProPromoModal
      isOpen={isPromoVisible}
      onRequestClose={() => setIsPromoVisible(false)}
    />
  );
};
