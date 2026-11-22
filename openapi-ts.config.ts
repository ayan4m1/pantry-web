import { existsSync } from 'node:fs';
import { defineConfig } from '@hey-api/openapi-ts';

const services = ['identity', 'inventory', 'shopping'] as const;

export default defineConfig(
  services.map((service) => {
    const name = `${service[0].toUpperCase()}${service.slice(1)}`;
    // Docker builds copy specs into ./openapi; locally, read them from each API's build output
    const localSpec = `./openapi/${name}.json`;
    const input = existsSync(localSpec)
      ? localSpec
      : `../${service}/bin/Debug/net10.0/openapi/${name}.json`;

    return {
      input,
      output: {
        path: `./src/client/${service}`,
        postProcess: ['prettier']
      },
      plugins: [
        {
          name: '@hey-api/client-fetch',
          runtimeConfigPath: `./src/utils/clients/${service}`
        },
        '@hey-api/typescript',
        '@hey-api/sdk',
        '@tanstack/react-query'
      ]
    };
  })
);
