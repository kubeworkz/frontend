import React from 'react';
import { BreadcrumbsConfig } from '../../components/Breadcrumbs/Breadcrumbs';

const SEPARATOR = '/';

const getParentPaths = (path: string) => {
  const result = [];
  const pathArr = path.replace(/^.*\/$/, '').split(SEPARATOR);
  while (pathArr.length) {
    result.unshift(pathArr.length > 1 ? pathArr.join(SEPARATOR) : pathArr + SEPARATOR);
    pathArr.pop();
  }
  return result;
};

export function createBreadcrumbs<T extends object>({
  routes,
  names,
}: {
  routes: T,
  names: Record<string, React.ReactNode>,
}) {
  const breadcrumbs: [string, BreadcrumbsConfig[]][] = Object.values(routes).map((path) => [
    path,
    getParentPaths(path).map((parentPath) => ({
      path: parentPath,
      label: names[parentPath],
    })).filter(({ label }) => !!label),
  ]);
  return Object.fromEntries(breadcrumbs);
}
