<?php
#
# Copyright 2023 Dynatrace LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use PDO;
use PDOException;

class CreateDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $host = getenv('DB_HOST', false);
        $port = getenv('DB_PORT', false);
        $rootuser = getenv('DB_USERNAME', false);
        $password = getenv('MARIADB_PASSWORD', false);
        $address = $host . ":" . $port;
        $dbName = getenv('DB_DATABASE', false);

        $connection = new PDO("mysql:host=$address", $rootuser, $password);
        try {
            $connection->exec("CREATE DATABASE $dbName");
        } catch (PDOException $e) {
            Log::notice("PDO-Exception, probably due to database $dbName already existing", [$e]);
        }
        return 0;
    }
}
