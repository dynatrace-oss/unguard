FROM php:8.0-cli

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /var/www

WORKDIR /var/www

ENV COMPOSER_ALLOW_SUPERUSER=1

RUN php /usr/bin/composer install

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000

