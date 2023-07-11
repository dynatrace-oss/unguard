FROM php:8.0-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

RUN apt update

RUN apt -y install git

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY . /var/www

#This is faster because reasons https://github.com/composer/composer/issues/8205#issuecomment-507256979
RUN php /usr/bin/composer config --global repos.packagist composer https://packagist.org

RUN php /usr/bin/composer install

EXPOSE 8000

#Fixes error while connecting since laravel requires a key
RUN php artisan key:generate

CMD php artisan serve --host=0.0.0.0 --port=8000

#Fixes error while accessing enviroment variables
RUN php artisan config:clear
