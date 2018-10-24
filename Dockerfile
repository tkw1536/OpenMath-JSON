FROM node:8-alpine

# Make /app/
RUN mkdir /app/ && mkdir /app/server

# Add our fancy /app/
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD tsconfig.json /app/tsconfig.json
ADD LICENSE /app/LICENSE
ADD src/ /app/src

ADD server/package.json /app/server/package.json
ADD server/src/ /app/server/src

# Install all the package
WORKDIR /app/
RUN yarn && cd server && yarn

# And run the command
ENV "HOST" 0.0.0.0
ENV "PORT" 3000
EXPOSE 3000

WORKDIR /app/server/
CMD [ "yarn", "serveprod" ]