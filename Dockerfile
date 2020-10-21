FROM ruby:2.5.1-alpine

ENV BUNDLER_VERSION=2.1.4

RUN apk add --update --no-cache \
      binutils-gold \
      build-base \
      curl \
      file \
      g++ \
      gcc \
      git \
      less \
      libstdc++ \
      libffi-dev \
      libc-dev \ 
      linux-headers \
      libxml2-dev \
      libxslt-dev \
      libgcrypt-dev \
      make \
      netcat-openbsd \
      nodejs \
      openssl \
      pkgconfig \
      postgresql-dev \
      python \
      tzdata \
      yarn 

RUN mkdir ./code
WORKDIR /code
COPY . .
RUN ls -a

RUN gem install bundler -v ${BUNDLER_VERSION}
RUN bundle install

# RUN bundle config build.nokogiri --use-system-libraries

# RUN bundle check || bundle install 

# COPY package.json yarn.lock ./

# RUN yarn install --check-files

# COPY . ./ 

# ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]
CMD [ "rackup" ]