import React from 'react';
import { ReactNode } from 'react';

import ColorRegionExample from "../../../lib/ColorRegionExample";

interface Props {
  region: string,
  children: ReactNode
}

export default function ColorRegionWrapper({ region, children }) {
  return (
    <div className="vm-styleguide__component-example__color-region">
      <ColorRegionExample region={region}>{children}</ColorRegionExample>
    </div>
  );
}