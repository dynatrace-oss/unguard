/*
 * Copyright 2023 Dynatrace LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.dynatrace.ssrfservice.tracing;

import com.uber.jaeger.httpclient.TracingRequestInterceptor;
import io.opentracing.Span;
import io.opentracing.Tracer;
import io.opentracing.tag.Tags;
import org.apache.http.HttpRequest;
import org.apache.http.client.methods.HttpRequestWrapper;
import org.apache.http.protocol.HttpContext;


public class EnhancedTracingRequestInterceptor extends TracingRequestInterceptor {

    private final String COMPONENT_NAME = "apache-http-client";

    public EnhancedTracingRequestInterceptor(Tracer tracer) {
        super(tracer);
    }

    @Override
    protected void onSpanStarted(Span clientSpan, HttpRequest httpRequest, HttpContext httpContext) {
        // if http request has a original request, we get that to save the full URI
        if (httpRequest instanceof HttpRequestWrapper) {
            Tags.HTTP_URL.set(clientSpan, ((HttpRequestWrapper) httpRequest).getOriginal().getRequestLine().getUri());
        }

        Tags.COMPONENT.set(clientSpan, COMPONENT_NAME);
    }
}
