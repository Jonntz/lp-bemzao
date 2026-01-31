# 1. Base image (Atualizado para Node 20)
FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat openssl

# 2. Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa telemetria para o build ser mais rápido
ENV NEXT_TELEMETRY_DISABLED 1

# Agora o generate vai detectar o OpenSSL 3.0 corretamente
RUN npx prisma generate
RUN npm install -g pnpm && pnpm run build

# 4. Runner (Production)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Copia apenas o necessário do modo standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]