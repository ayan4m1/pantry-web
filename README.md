# pantry-web

The web frontend for Pantry.

## Development

This repo must be checked out as the `web` submodule of [pantry-compose](https://github.com/ayan4m1/pantry-compose), next to the `identity` and `inventory` services.

### Generating the API client

The typed API client in `src/client/` is generated from the OpenAPI specs of the backend services. Neither the specs (`openapi/`) nor the client are committed, so generate them after cloning and whenever a service's API changes.

Building each service writes its spec to `web/openapi/`:

```sh
dotnet build ../identity/Identity.csproj
dotnet build ../inventory/Inventory.csproj
```

Then install dependencies and generate the client from those specs:

```sh
yarn install
yarn generate:api
```

### Running

```sh
yarn start
```
