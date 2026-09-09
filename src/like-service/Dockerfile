FROM php:8.0-cli

COPY --from=composer:2.6.5 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www


# bullseye's live security repo was decommissioned at EOL; pin apt to a frozen
# snapshot instead of bumping php:8.0-cli, since Unguard intentionally stays on
# old, vulnerable runtimes for security training.
RUN printf 'deb https://snapshot.debian.org/archive/debian/20260831T000000Z bullseye main\ndeb https://snapshot.debian.org/archive/debian-security/20260831T000000Z bullseye-security main\n' > /etc/apt/sources.list \
    && apt-get -o Acquire::Check-Valid-Until=false update \
    && apt-get install -y --no-install-recommends git zip

ENV COMPOSER_ALLOW_SUPERUSER=1

COPY . /var/www

RUN pecl install opentelemetry-1.0.0RC1 && docker-php-ext-enable opentelemetry

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
