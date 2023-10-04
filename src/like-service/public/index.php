<?php

use App\Http\Controllers\JaegerPropagator;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use OpenTelemetry\API\Globals;
use OpenTelemetry\API\Instrumentation\Configurator;
use OpenTelemetry\Contrib\Otlp\OtlpHttpTransportFactory;
use OpenTelemetry\Contrib\Otlp\SpanExporter;
use OpenTelemetry\Contrib\Otlp\ContentTypes;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\SDK\Common\Util\ShutdownHandler;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Trace\Sampler\AlwaysOnSampler;
use OpenTelemetry\SDK\Trace\Sampler\ParentBased;
use OpenTelemetry\SDK\Trace\SpanProcessor\SimpleSpanProcessor;
use OpenTelemetry\SDK\Trace\TracerProvider;
use OpenTelemetry\SemConv\ResourceAttributes;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is maintenance / demo mode via the "down" command we
| will require this file so that any prerendered template can be shown
| instead of starting the framework, which could cause an exception.
|
*/

if (file_exists(__DIR__.'/../storage/framework/maintenance.php')) {
    require __DIR__.'/../storage/framework/maintenance.php';
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request using
| the application's HTTP kernel. Then, we will send the response back
| to this client's browser, allowing them to enjoy our application.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

if (strtolower(getenv('JAEGER_DISABLED', false)) === "false") {
    Globals::registerInitializer(function (Configurator $configurator) {
        $propagator = JaegerPropagator::getInstance();
        $transport = (new OtlpHttpTransportFactory())->create('http://' . getenv('JAEGER_AGENT_HOST', false) . ':' . getenv('JAEGER_PORT', false) . '/v1/traces', ContentTypes::JSON);
        $exporter = new SpanExporter($transport);

        $resource = ResourceInfo::create(Attributes::create([
            ResourceAttributes::SERVICE_NAMESPACE => 'unguard',
            ResourceAttributes::SERVICE_NAME => getenv('SERVICE_NAME', false),
            ResourceAttributes::SERVICE_VERSION => '1.0',
            ResourceAttributes::DEPLOYMENT_ENVIRONMENT => 'development',
        ]));

        $tracerProvider = TracerProvider::builder()
        ->addSpanProcessor(
            new SimpleSpanProcessor($exporter)
        )
        ->setResource($resource)
        ->setSampler(new ParentBased(new AlwaysOnSampler()))
        ->build();

        ShutdownHandler::register([$tracerProvider, 'shutdown']);

        return $configurator
            ->withTracerProvider($tracerProvider)
            ->withPropagator($propagator);
    });
}


$kernel = $app->make(Kernel::class);

$response = tap($kernel->handle(
    $request = Request::capture()
))->send();


$kernel->terminate($request, $response);
