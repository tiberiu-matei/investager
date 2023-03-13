FROM node:18-alpine
ARG CACHEBUST=1
RUN echo "$CACHEBUST"
ADD https://google.com cache_bust
RUN apk add --no-cache wget
ENV NODE_ENV=development
WORKDIR /temp
COPY /package.json ./
COPY /package-lock.json ./
RUN npm i
RUN ls -ltr
COPY /temp/node_modules/@prisma /prismabin/@prisma
COPY /temp/node_modules/prisma /prismabin/prisma

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
