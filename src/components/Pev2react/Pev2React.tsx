import React, { useRef, useState } from 'react';
import classNames from 'classnames';

// @ts-ignore
import { VueWrapper } from 'vuera';
import '@fortawesome/fontawesome-free/css/all.css';

// @ts-ignore
import Pev2 from 'pev2/dist/components/pev2.common';

interface Pev2ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  query: string;
  plan: string;
  showDiagram?: boolean;
}

const Pev2React = ({
  query, plan, showDiagram = false, className, ...divAttrs
}: Pev2ReactProps) => {
  const [rendered, setRendered] = useState(true);
  const renderTimeout = useRef<number>();

  React.useEffect(() => {
    clearTimeout(renderTimeout.current);
    setRendered(false);
    if (query && plan) {
      renderTimeout.current = window.setTimeout(() => {
        setRendered(true);
      });
    }
  }, [query, plan]);

  React.useEffect(() => () => clearTimeout(renderTimeout.current), []);

  if (!rendered || !query || !plan) {
    return null;
  }

  return (
    <div
      className={classNames('Pev2React', className)}
      {...divAttrs}
    >
      <VueWrapper
        component={Pev2}
        plan-source={plan}
        plan-query={query}
        show-diagram={showDiagram}
      />
    </div>
  );
};

export { Pev2React };
