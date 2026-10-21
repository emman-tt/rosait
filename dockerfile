#Install pnpm dependencies 
FROM node:lts-alpine AS dependencer

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package.json  pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./


RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    corepack enable pnpm && pnpm install --frozen-lockfile; 



#Arrange the app from dependencer
FROM node:lts-alpine AS builder

WORKDIR /app


# Copy project dependencies from dependencies stage
COPY --from=dependencer /app/node_modules ./node_modules

COPY . .

RUN  corepack enable &&  pnpm run  build



FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

# 1. Copy public folder (images, fonts)
COPY --from=builder --chown=node:node /app/public ./public

# 2. Create the .next cache directory and give ownership to 'node'
RUN mkdir .next && chown node:node .next

# 3. Copy the standalone output (includes server.js and minimal node_modules)
COPY --from=builder --chown=node:node /app/.next/standalone ./

# 4. Copy the static assets into the .next folder
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# 5. Switch to the built-in non-root user
USER node

USER node
EXPOSE 3005
CMD ["node", "server.js"]

