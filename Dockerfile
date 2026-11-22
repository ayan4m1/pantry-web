FROM node:lts AS build

RUN echo "deb http://deb.debian.org/debian bookworm contrib non-free" > /etc/apt/sources.list.d/contrib.list && \
    apt-get update && \
    apt-get dist-upgrade -y

COPY . /usr/share/pantry-web

WORKDIR /usr/share/pantry-web

COPY --from=identity-spec /app/openapi/Identity.json ./openapi/
COPY --from=inventory-spec /app/openapi/Inventory.json ./openapi/
COPY --from=shopping-spec /app/openapi/Shopping.json ./openapi/

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN npm install --global corepack@latest && \
    corepack enable

RUN yarn install --immutable

RUN yarn run build

FROM nginx:alpine

COPY --from=build /usr/share/pantry-web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]