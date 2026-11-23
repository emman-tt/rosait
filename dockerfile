# ---------- Stage 1: dependencies ----------
FROM node:24-alpine AS dependencer

# Install pnpm directly via npm, no Corepack needed
RUN npm install -g pnpm@11.9.0 && pnpm --version

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

# Use the store path corresponding to pnpm 11 (note: the cache mount path has changed)
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- Stage 2: builder ----------
FROM node:24-alpine AS builder

WORKDIR /app

COPY --from=dependencer /app/node_modules ./node_modules
COPY . .

# No need to enable Corepack, call pnpm directly
RUN pnpm run build

# ---------- Stage 3: runtime ----------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=node:node /app/public ./public

RUN mkdir .next && chown node:node .next

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3005
CMD ["node", "server.js"]