import type { CreateClientConfig } from '../../client/inventory/client.gen';
import { createServiceConfig } from '../api';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...createServiceConfig('inventory')
});
