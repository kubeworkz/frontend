import SwaggerUI, { SwaggerUIOptions } from 'swagger-ui';

import 'swagger-ui/dist/swagger-ui.css';

import { getCSRFToken } from '../utils/getCSRFToken';

const url: string | undefined = document.querySelector<HTMLMetaElement>("[name='api-spec-url']")?.content;
const serverUrl: string | undefined = document.querySelector<HTMLMetaElement>("[name='api-server-url']")?.content;

const swaggerOpts: SwaggerUIOptions = {
  dom_id: '#swagger',
  filter: true,
  deepLinking: true,
  requestInterceptor(req) {
    req.headers['X-CSRF-Token'] = getCSRFToken();
    return req;
  },
};

if (!url) {
  SwaggerUI({
    ...swaggerOpts,
    url,
  });
}

window.fetch(url as string)
  .then((res) => res.json())
  .then((spec) => {
    SwaggerUI({
      ...swaggerOpts,
      spec: serverUrl ? {
        ...spec,
        servers: [
          {
            url: serverUrl,
          },
        ],
      } : spec,
    });
  });
