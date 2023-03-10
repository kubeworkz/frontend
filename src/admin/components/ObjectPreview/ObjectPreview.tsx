import React from 'react';
import { CacheDataId } from '../../utils/caches';

function ObjectPreview<D extends { id: CacheDataId }>({ data }: { data: D }) {
  return (
    <table>
      <tbody>
        {Object.entries(data).map(([key, val]) => (
          <tr key={`${data.id as string}_${key}`}>
            <th align="right">
              {key}
              :
            </th>
            <td>{val}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export { ObjectPreview };
