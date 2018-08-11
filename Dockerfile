FROM node:8-alpine

# Make /app/
RUN mkdir /app/
WORKDIR /app/

# Add our fancy /app/
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
ADD tsconfig.json /app/tsconfig.json
ADD LICENSE /app/LICENSE
ADD src/ /app/src

# Install all the package
RUN yarn

# And run the command
ENV "HOST" 0.0.0.0
ENV "PORT" 3000
EXPOSE 3000
CMD [ "yarn", "serveprod" ]