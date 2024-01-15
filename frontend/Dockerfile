# Seperate image for building the application
FROM node:20.9-slim as build

ARG VITE_API_BASE_URL

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

# Use an nginx image to serve the application
FROM nginx:1.25.2

COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx","-g","daemon off;"]
