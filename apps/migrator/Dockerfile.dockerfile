FROM node:18-alpine
ARG DBLIB=db
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs /node_modules/@prisma ./node_modules
COPY --chown=nodejs:nodejs /node_modules/prisma ./node_modules
COPY --chown=nodejs:nodejs /libs/${DBLIB}/prisma ./

USER nodejs

CMD node node_modules/prisma/build/index.js deploy --schema=prisma/schema.prisma
