FROM node:16-alpine

# create www-data
RUN set -x ; \
  addgroup -g 82 -S www-data ; \
  adduser -u 82 -D -S -G www-data www-data && exit 0 ; exit 1

# Make /app/
RUN mkdir /app/ && mkdir /app/server

# Add our fancy /app/
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD tsconfig.json /app/tsconfig.json
ADD LICENSE /app/LICENSE
ADD src/ /app/src

ADD server/package.json /app/server/package.json
ADD server/yarn.lock /app/server/yarn.lock
ADD server/src/ /app/server/src

# Install all the package
WORKDIR /app/
RUN yarn --frozen-lockfile && cd server && yarn --frozen-lockfile

# And run the command
ENV "HOST" 0.0.0.0
ENV "PORT" 3000
EXPOSE 3000

WORKDIR /app/server/
USER www-data:www-data
CMD [ "yarn", "serveprod" ]