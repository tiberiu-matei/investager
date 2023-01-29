FROM node:18-alpine
ARG APP=ui
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs /dist/apps/${APP}/.next/standalone ./
COPY --chown=nextjs:nodejs /dist/apps/${APP}/.next/static ./dist/apps/${APP}/.next/static
COPY --chown=nextjs:nodejs /dist/apps/${APP}/public ./apps/${APP}/public

USER nextjs

EXPOSE 3001

ENV NODE_ENV=production
ENV APP_PATH=apps/${APP}/server.js
ENV PORT=3001

CMD node $APP_PATH
