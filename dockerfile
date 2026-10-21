FROM node:lts-alpine AS builder

RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

# Copy lockfile first (best caching)
COPY pnpm-lock.yaml pnpm-workspace.yaml  ./
RUN --mount=type=cache,target=/pnpm/store pnpm fetch

# Copy package.json and install
COPY package.json ./
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Run as non-root
RUN addgroup -S app && adduser -S app -G app


FROM nginx:alpine
COPY --from=builder /app/.next/static /usr/share/nginx/html

USER app
CMD ["nginx", "-g",  "daemon off;"]

