import type { CreateClientConfig } from '../../client/shopping/client.gen';
import { createServiceConfig } from '../api';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...createServiceConfig('shopping')
});
