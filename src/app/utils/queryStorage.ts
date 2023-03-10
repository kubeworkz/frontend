import store from 'store2';
import { Project } from '#api_client/publicv2';
import { Keys } from '../services/store';

interface QueryStorageData {
  [projectId: string]: string
}

const isObject = (value: any): boolean => typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeQueryStorageData = (data: any): QueryStorageData => {
  if (!isObject(data)) {
    return {};
  }

  return Object.entries(data).reduce((acc, [projectId, query]) => {
    if (typeof query === 'string') {
      acc[projectId] = query;
    }
    return acc;
  }, {} as QueryStorageData);
};

const getParsedQueryStorageData = (): QueryStorageData => {
  const data = store.get(Keys.LastQuery);

  try {
    return sanitizeQueryStorageData(JSON.parse(data));
  } catch (e) {
    return {};
  }
};

export const getQueryFromStore = (cId: Project['id']): string => getParsedQueryStorageData()[cId] || '';
export const saveQueryToStore = (cId: Project['id'], q: string) => {
  const data = getParsedQueryStorageData();
  data[cId] = q;
  store.set(Keys.LastQuery, JSON.stringify(data));
};
