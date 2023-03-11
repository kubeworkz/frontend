import React from 'react';
import { AdminUser } from '../../api/internal';
import { Badge } from '../../components/Badge/Badge';

import './UserPreview.css';

interface UserPreviewProps {
  data: AdminUser;
}

export const UserPreview = ({ data }: UserPreviewProps) => {
  if (!data) {
    return null;
  }

  return (
    <div className="UserPreview">
      <table>
        <tr>
          <th>id:</th>
          <td>
            {data.id}
          </td>
        </tr>
        <tr>
          <th>email:</th>
          <td>
            {data.email}
          </td>
        </tr>
        {data.admin && (
          <tr>
            <th />
            <td>
              <Badge>Admin</Badge>
            </td>
          </tr>

        )}
      </table>
    </div>
  );
};
