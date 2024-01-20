# Seperate image for building the application
FROM node:20.9-slim as build

WORKDIR /app
# Enable corepack for version manager
RUN corepack enable
# Copy required files
COPY .yarn /.yarn
COPY .yarnrc.yml package.json yarn.lock ./
# Install dependencies
RUN yarn
# Copy source files
COPY . .
# Build
RUN yarn build
# Allow container to set environment variables
RUN yarn add @import-meta-env/cli
RUN npx pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js \
  -t node18-alpine-x64 \
  -o import-meta-env-alpine

# Use an nginx image to serve the application
FROM nginx:1.25.2-alpine

COPY .env.example start.sh /usr/share/nginx/html/
COPY --from=build /app/import-meta-env-alpine /usr/share/nginx/html/
COPY --from=build /app/dist /usr/share/nginx/html

WORKDIR /usr/share/nginx/html/

CMD ["sh", "start.sh"]
