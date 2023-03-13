FROM node:18-alpine
COPY ["package.json", "package-lock.json", "./"]
RUN npm i
WORKDIR /prismabin
COPY /node_modules/@prisma ./@prisma
COPY /node_modules/prisma ./prisma

FROM node:18-alpine
ARG DBLIB=db
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --chown=nodejs:nodejs --from=0 /prismabin/@prisma ./node_modules
COPY --chown=nodejs:nodejs --from=0 /prismabin/prisma ./node_modules
COPY --chown=nodejs:nodejs /libs/${DBLIB}/prisma ./

USER nodejs

CMD node node_modules/prisma/build/index.js deploy --schema=prisma/schema.prisma
