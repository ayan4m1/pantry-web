import { defineConfig } from '@hey-api/openapi-ts';

const services = ['identity', 'inventory'] as const;

export default defineConfig(
  services.map((service) => ({
    input: `./openapi/${service[0].toUpperCase()}${service.slice(1)}.json`,
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
  }))
);
