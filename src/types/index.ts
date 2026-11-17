import { ApiError } from '../utils/api';

declare module '@tanstack/react-query' {
  interface Register {
    // the client error interceptors (utils/clients) wrap every failure in ApiError
    defaultError: ApiError;
  }
}
