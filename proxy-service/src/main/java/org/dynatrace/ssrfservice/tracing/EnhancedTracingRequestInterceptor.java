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
