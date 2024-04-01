FROM node:20-alpine AS base


# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app


# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile;
  

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn run build


FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js

COPY package.json ./
RUN yarn --frozen-lockfile --prod && yarn cache clean


CMD ["node", "server.js"]