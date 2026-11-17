import type { CreateClientConfig } from '../../client/identity/client.gen';
import { createServiceConfig } from '../api';

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  ...createServiceConfig('identity')
});
