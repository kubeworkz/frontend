import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

import { Text } from '../../../components/Text/Text';

import { useFormFieldContext } from '../../../components/Form/FormField/formFieldContext';
import { AsProps, ReplaceProps } from '../../../types/Props';
import styles from './FormLabel.module.css';

interface FormLabelProps<As extends React.ElementType = React.ElementType> extends
  AsProps<As> {}

export function FormLabel<As extends React.ElementType>(
  {
    children,
    // @ts-ignore
    as = 'label',
    ...labelAttrs
  }: ReplaceProps<As, PropsWithChildren<FormLabelProps<As>>>,
) {
  const { id } = useFormFieldContext();

  return (
    <Text
      as={as}
      htmlFor={as === 'label' ? id : undefined}
      {...labelAttrs}
      className={classNames(labelAttrs.className, styles.root)}
    >
      {children}
    </Text>
  );
}
