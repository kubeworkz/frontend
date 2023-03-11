import React from 'react';
import ReactModal from 'react-modal';

import { Button } from '../../../components/Button/Button';
import { SvgIcon } from '../../../components/SvgIcon/SvgIcon';
import { BillingRoutes } from '../../../routes/routes';
import { AnalyticsAction, useAnalytics } from '../../../utils/analytics';
import styles from './EnrollToProPromoModal.module.css';

interface EnrollToProPromoModalProps extends Pick<ReactModal.Props, 'isOpen' | 'onRequestClose'> {}

const PRO_PERKS = [
  'Project sharing',
  'Up to 96 compute units',
  'Unlimited branches',
  'Unlimited branch size',
  'Unlimited networking',
  'Unlimited storage',
];

export const EnrollToProPromoModal = ({ onRequestClose, ...props }: EnrollToProPromoModalProps) => {
  const { trackUiInteraction } = useAnalytics();

  const handleClose: ReactModal.Props['onRequestClose'] = React.useCallback((e) => {
    trackUiInteraction(AnalyticsAction.ProPromoModalDismissed);
    if (onRequestClose) {
      onRequestClose(e);
    }
  }, [onRequestClose, trackUiInteraction]);

  return (
    <ReactModal
      appElement={document.body}
      {...props}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick={false}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.container}>
        <h1 className={styles.header}>
          <span className={styles.title}>Go Pro, starting from</span>
          <br />
          <span className={styles.price}>$20</span>
          <br />
          <span className={styles.period}>per month</span>
        </h1>
        <ul className={styles.perks}>
          {PRO_PERKS.map((item) => (
            <li className={styles.item} key={item}>
              <SvgIcon name="check-24" className={styles.itemIcon} />
              <span className={styles.itemLabel}>
                {item}
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button
            wide
            appearance="secondary"
            onClick={handleClose}
          >
            Maybe later
          </Button>
          <Button
            wide
            as="a"
            href={BillingRoutes.StripeSessionSetup}
            appearance="cloudrock"
            icon="cloudrock_20"
            onClick={() => trackUiInteraction(AnalyticsAction.ProPromoModalGoProClicked)}
          >
            Go Pro
          </Button>
        </div>
      </div>
    </ReactModal>
  );
};
