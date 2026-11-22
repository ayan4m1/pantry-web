import { client as identityClient } from '../../client/identity/client.gen';
import { client as inventoryClient } from '../../client/inventory/client.gen';
import { client as shoppingClient } from '../../client/shopping/client.gen';
import { ApiError } from '../api';

/** Wraps failed responses in ApiError so callers can branch on the status code. */
export function setupClients() {
  for (const client of [identityClient, inventoryClient, shoppingClient]) {
    client.interceptors.error.use((error, response) =>
      response
        ? new ApiError(response.status, response.statusText, error)
        : error
    );
  }
}
