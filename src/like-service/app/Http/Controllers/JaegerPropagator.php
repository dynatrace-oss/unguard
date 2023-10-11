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

namespace app\Http\Controllers;

use OpenTelemetry\API\Trace\Propagation\TraceContextValidator;
use function count;
use function explode;
use function hexdec;
use OpenTelemetry\API\Trace\Span;
use OpenTelemetry\API\Trace\SpanContext;
use OpenTelemetry\API\Trace\SpanContextInterface;
use OpenTelemetry\API\Trace\SpanContextValidator;
use OpenTelemetry\API\Trace\TraceFlags;
use OpenTelemetry\Context\Context;
use OpenTelemetry\Context\ContextInterface;
use OpenTelemetry\Context\Propagation\ArrayAccessGetterSetter;
use OpenTelemetry\Context\Propagation\PropagationGetterInterface;
use OpenTelemetry\Context\Propagation\PropagationSetterInterface;
use OpenTelemetry\Context\Propagation\TextMapPropagatorInterface;

/**
 * There are different formats used for propagation (reading/transmitting trace and span data to identify
 * causal relationships between spans or, put differently, connect spans of different services)
 * The PHP OpenTelemetry library seemingly only supports the W3C Trace Context format
 * (https://www.w3.org/TR/trace-context/); that class is found here: OpenTelemetry\API\Trace\Propagation\TraceContextPropagator.
 * This class instead uses the Jaeger Format
 * (https://www.jaegertracing.io/docs/1.49/client-libraries/#propagation-format).
 *
 * The identifying data here is transmitted via an HTTP header called uber-trace-id, whereas
 * the W3C format has two headers, traceparent and tracestate, the latter of which being vendor-specific.
 * The W3C traceparent is structured like this:
 * version "-" trace-id "-" parent-id "-" trace-flags ------ version seems to always be 00, trace-id is a 32-digit hex string, parent-id is a 16-digit hex string, and trace-flags is a 2-digit hex string
 *
 *  The Jaeger uber-trace-id is structured thus:
 * trace-id ":" span-id ":" parent-span-id ":" flags  ------ trace-id is a 16- or 32-digit hex string, span-id is a 16-digit hex string, parent-span-id is a 16-digit hex string (and deprecated), flags is a 1- or 2-digit hex string
 *
 * The formats are very similar. Therefore, this class is mostly adapted from the official TraceContextPropagator class.
 */
final class JaegerPropagator implements TextMapPropagatorInterface
{
    public const UBERTRACEID = 'uber-trace-id';

    public const FIELDS = [
        self::UBERTRACEID
    ];

    private static ?self $instance = null;

    public static function getInstance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    /** {@inheritdoc} */
    public function fields(): array
    {
        return self::FIELDS;
    }

    /** {@inheritdoc} */
    public function inject(&$carrier, PropagationSetterInterface $setter = null, ContextInterface $context = null): void
    {
        $setter ??= ArrayAccessGetterSetter::getInstance();
        $context ??= Context::getCurrent();
        $spanContext = Span::fromContext($context)->getContext();

        if (!$spanContext->isValid()) {
            return;
        }

        // Build and inject the ubertraceid header
        $ubertraceid = $spanContext->getTraceId() . ':' . $spanContext->getSpanId() . ':' . $spanContext->getTraceId() . ':' . ($spanContext->isSampled() ? '01' : '00');
        $setter->set($carrier, self::UBERTRACEID, $ubertraceid);
    }

    /** {@inheritdoc} */
    public function extract($carrier, PropagationGetterInterface $getter = null, ContextInterface $context = null): ContextInterface
    {
        $getter ??= ArrayAccessGetterSetter::getInstance();
        $context ??= Context::getCurrent();

        $spanContext = self::extractImpl($carrier, $getter);
        if (!$spanContext->isValid()) {
            return $context;
        }

        return $context->withContextValue(Span::wrap($spanContext));
    }

    private static function extractImpl($carrier, PropagationGetterInterface $getter): SpanContextInterface
    {
        $ubertraceid = $getter->get($carrier, self::UBERTRACEID);
        if ($ubertraceid === null) {
            return SpanContext::getInvalid();
        }

        // ubertraceid = {trace-id}:{span-id}:{parent-span-id}:{flags}
        $pieces = explode(':', $ubertraceid);

        // If the header does not have at least 4 pieces, it is invalid -- restart the trace.
        if (count($pieces) < 4) {
            return SpanContext::getInvalid();
        }

        [$traceId_unpadded, $spanId_unpadded, $parentSpanId_ignored, $traceFlags_unpadded] = $pieces;

        // Pad in order to pass the Validators below
        $traceId = str_pad($traceId_unpadded, SpanContextValidator::TRACE_LENGTH, "0", STR_PAD_LEFT);
        $spanId = str_pad($spanId_unpadded, SpanContextValidator::SPAN_LENGTH, "0", STR_PAD_LEFT);
        $traceFlags = str_pad($traceFlags_unpadded, TraceContextValidator::TRACE_FLAG_LENGTH, "0", STR_PAD_LEFT);

        /**
         * Return invalid if:
         * Trace trace ID, span ID or trace flag are invalid
         */
        if (!SpanContextValidator::isValidTraceId($traceId)
            || !SpanContextValidator::isValidSpanId($spanId)
            || !TraceContextValidator::isValidTraceFlag($traceFlags)
        ) {
            return SpanContext::getInvalid();
        }

        // Only the sampled flag is extracted from the traceFlags (00000001)
        $convertedTraceFlags = hexdec($traceFlags);
        $isSampled = ($convertedTraceFlags & TraceFlags::SAMPLED) === TraceFlags::SAMPLED;

        return SpanContext::createFromRemoteParent(
            $traceId,
            $spanId,
            $isSampled ? TraceFlags::SAMPLED : TraceFlags::DEFAULT
        );
    }
}
