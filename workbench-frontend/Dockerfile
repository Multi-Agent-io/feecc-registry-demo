FROM node:14-alpine
RUN mkdir -p /home/feecc-hub-frontend
WORKDIR /home/feecc-hub-frontend
COPY package.json ./
RUN npm install
COPY . .


ARG APPLICATION_SOCKET=http://localhost:5000
ARG INTERFACE_LANGUAGE=ru
ARG DEV_SHOW_REDUCERS=false
ARG SHOW_TEST_SCHEMAS=false
ARG USE_DEVTOOLS=false

ENV APPLICATION_SOCKET=$APPLICATION_SOCKET
ENV INTERFACE_LANGUAGE=$INTERFACE_LANGUAGE
ENV DEV_SHOW_REDUCERS=$DEV_SHOW_REDUCERS
ENV SHOW_TEST_SCHEMAS=$SHOW_TEST_SCHEMAS
ENV USE_DEVTOOLS=$USE_DEVTOOLS

RUN npm run build

EXPOSE 3000

HEALTHCHECK --interval=1m --timeout=3s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

ENTRYPOINT [ "node", "nodeServer.js" ]
