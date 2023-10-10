FROM php:8.0-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

RUN apt update

RUN apt -y install git zip

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY . /var/www

ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions && \
    install-php-extensions opentelemetry-1.0.0RC1

#This is faster https://github.com/composer/composer/issues/8205#issuecomment-507256979
RUN php /usr/bin/composer config --global repos.packagist composer https://packagist.org

RUN php /usr/bin/composer update --no-cache

RUN php /usr/bin/composer install

EXPOSE 8000
#Fixes error while connecting since laravel requires a key
RUN php artisan --env=local key:generate

#Fixes error while accessing enviroment variables
RUN php artisan config:clear

#MySqlDriver
RUN docker-php-ext-install mysqli pdo pdo_mysql;

RUN php artisan --env=local optimize:clear

RUN php /usr/bin/composer dump-autoload

RUN php /usr/bin/composer clear-cache

CMD php artisan --env=local make:database && php artisan migrate:fresh --force && php -S 0.0.0.0:8000 -t public
