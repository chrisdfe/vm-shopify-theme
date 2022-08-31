import React, { ReactNode } from 'react';

import StyleguideSubsectionRow from "../../lib/SubsectionRow";

interface Props {
  title: string;
  size: number;
  lineHeight: number;
  spacing: number;
  children?: ReactNode;
  uses?: ReactNode[];
  avoids?: ReactNode[];
}

const calculateLineHeight = (lineHeight, fontSize) => Math.round((lineHeight * fontSize) * 100) / 100;

export default function TypeStyleSubsectionRow({ title, size, lineHeight, spacing, uses, avoids, children }: Props) {
  return (
    <StyleguideSubsectionRow
      title={title}
      uses={uses}
      avoids={avoids}
      dataRows={
        [
          { title: "size", value: `${size}px` },
          { title: "line height", value: `${lineHeight} (${calculateLineHeight(lineHeight, size)})` },
          { title: "spacing", value: `${spacing} (${spacing / 1000}em)` },
        ]}
    >
      {children}
    </StyleguideSubsectionRow>
  );
}