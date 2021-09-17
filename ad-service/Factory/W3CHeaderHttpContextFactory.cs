using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace AdService.Factory
{
    /// <summary>
    /// A factory for creating <see cref="HttpContext" /> instances.
    /// Additionally injects W3C Trace-Context into header if Jaeger Trace-Context header is sent.
    /// (JAEGER) uber-trace-id header: $`{ trace-id }:{ span-id }:{ parent-span-id }:{ trace-flags }`
    /// (W3C)    traceparent header:   $`{ version-format }-{ trace-id }-{ parent-id (i.e. span-id) }-{ trace-flags }`
    /// https://www.jaegertracing.io/docs/1.26/client-libraries/#propagation-format
    /// </summary>
    public class W3CHeaderHttpContextFactory : IHttpContextFactory
    {
        private readonly DefaultHttpContextFactory _defaultHttpContextFactory;

        public W3CHeaderHttpContextFactory(IServiceProvider serviceProvider)
        {
            this._defaultHttpContextFactory = new DefaultHttpContextFactory(serviceProvider);
        }

        /// <summary>
        /// Create an <see cref="HttpContext"/> instance given an <paramref name="featureCollection" />.
        /// Additionally inject a W3C Trace-Context header, if a JAEGER Trace-Context header is found.
        /// </summary>
        /// <param name="featureCollection"></param>
        /// <returns>An initialized <see cref="HttpContext"/> object.</returns>
        public HttpContext Create(IFeatureCollection featureCollection)
        {
            var httpContext = this._defaultHttpContextFactory.Create(featureCollection);
            
            // inject W3C Trace-Context into header
            if (httpContext.Request.Headers.TryGetValue("uber-trace-id", out var uberTraceId)
                && !httpContext.Request.Headers.ContainsKey("traceparent"))
            {
                SetTraceParentHeader(httpContext.Request, uberTraceId[0]);
            }
            
            return httpContext;
        }

        /// <summary>
        /// Add or overwrite the traceparent header based on the uber-trace-id (JAEGER-default) header.
        /// </summary>
        private void SetTraceParentHeader(HttpRequest request, string uberTraceId)
        {
            var uberTraceIdParts = uberTraceId.Split(":"); 
            var traceId = uberTraceIdParts[0];
            var spanId = uberTraceIdParts[1];
            var traceFlags = uberTraceIdParts[3];
            
            // convert traceId according to W3C trace context 16 byte standard
            // note: leading zeros won't be send to JAEGER for compatibility reason but 16 byte (as hex-string encoded)
            //       is necessary for W3C context initialization
            traceId.PadLeft(32, '0');

            // same with traceFlags as with traceId, W3C context defines 8 bit field
            traceFlags.PadLeft(2, '0');

            var traceparentHeader = $"00-{traceId}-{spanId}-{traceFlags}";
            request.Headers.Remove("traceparent");
            request.Headers.Add("traceparent", traceparentHeader);
        }

        /// <summary>
        /// Clears the current <see cref="HttpContext" />.
        /// </summary>
        public void Dispose(HttpContext httpContext)
        {
            this._defaultHttpContextFactory.Dispose(httpContext);
        }
    }
}