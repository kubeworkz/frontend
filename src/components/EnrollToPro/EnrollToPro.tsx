import React, { MouseEventHandler, PropsWithChildren } from 'react';
import { AsProps, ReplaceProps } from '../../types/Props';
import { useEnrollToPro } from '../../components/EnrollToPro/enrollToProContext';

type ClickableElement = React.ElementType<{ onClick?: MouseEventHandler }> | 'button';

interface EnrollToProPropsPure<As extends ClickableElement = ClickableElement>
  extends AsProps<As> {
  onClick?: MouseEventHandler;
  className?: string;
}

type EnrollToProProps<As extends ClickableElement = ClickableElement> = ReplaceProps<
As, PropsWithChildren<EnrollToProPropsPure<As>>
>;

function EnrollToPro<As extends ClickableElement>({
  as,
  children,
  onClick,
  className,
  ...props
}: EnrollToProProps<As>) {
  const { setIsPromoVisible } = useEnrollToPro();

  const Component = (as || 'button') as ClickableElement;

  const onTriggerClick = React.useCallback((e) => {
    if (onClick) {
      onClick(e);
    }
    setIsPromoVisible(true);
  }, [onClick]);

  return (
    <>
      <Component
        onClick={onTriggerClick}
        {...props}
      >
        {children || 'Upgrade to Pro'}
      </Component>
    </>
  );
}

export function EnrollToProConditional<As extends ClickableElement>(props: EnrollToProProps<As>) {
  const { enrollToProAvailable } = useEnrollToPro();

  if (!enrollToProAvailable) {
    return null;
  }

  return (
    <EnrollToPro {...props} />
  );
}
