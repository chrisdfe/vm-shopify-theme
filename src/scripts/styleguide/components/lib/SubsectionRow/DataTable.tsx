import React from 'react';

export type DataRow = {
  title: string,
  value: string,
};

interface Props {
  dataRows: DataRow[]
}

export default function DataTable({ dataRows }: Props) {
  return (
    <table className="vm-styleguide__subsection-row-data-table">
      <tbody>
        {dataRows.map(({ title, value }) => (
          <tr key={title}>
            <td>
              <h5 className="vm-styleguide__subsection-row-data-table__title">
                {title}
              </h5>
            </td>
            <td>
              <h5 className="vm-styleguide__subsection-row-data-table__value">
                {value}
              </h5>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}