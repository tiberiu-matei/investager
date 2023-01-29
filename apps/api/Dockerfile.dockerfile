FROM node:18-alpine
ARG APP=api
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs /dist/apps/${APP} ./
RUN npm install --omit=dev

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV APP_PATH=./main.js
ENV PORT=3000

CMD node $APP_PATH
