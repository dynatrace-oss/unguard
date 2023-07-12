<?php

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
        $host = getenv('UNGUARD_MARIADB_SERVICE_HOST', false);
        $port = getenv('UNGUARD_MARIADB_SERVICE_PORT_MYSQL', false);
        $rootuser = 'root';
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
