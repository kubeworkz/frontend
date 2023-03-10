export type PgConnectionParams = {
  role?: string;
  database?: string;
  password?: string;
  host: string;
};
export const CONN_DATA_PLACEHOLDER = {
  role: '<% ROLE_NAME %>',
  database: '<% DATABASE_NAME %>',
  projectName: '<% PROJECT_ID %>',
  password: '<% PASSWORD %>',
  host: '<% HOST %>',
};
export const pgConnectionString = ({
  role, database, password, host,
}: PgConnectionParams) => {
  const encodedRole = role ? encodeURIComponent(role) : CONN_DATA_PLACEHOLDER.role;
  const encodedDb = database
    ? encodeURIComponent(database)
    : CONN_DATA_PLACEHOLDER.database;

  return `postgres://${encodedRole}${password ? `:${password}` : ''}@${host}/${encodedDb}`;
};
