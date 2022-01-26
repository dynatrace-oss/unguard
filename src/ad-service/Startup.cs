using System;
using System.IO;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Flurl;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

using AdService.Factory;

namespace AdService
{
    public class Startup
    {
        private readonly string _apiPath = Environment.GetEnvironmentVariable("API_PATH");
        public IConfiguration Configuration { get; set; }
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // additional routes are neccessary for route / and for variable path due to kubernetes ingress
            AddRazorPagesWithAdditionalRoutes(services);

            // add tracing for unguard-jaeger
            AddOpenTelemetryTracing(services);
        }

        /// <summary>Init RazorPages(), make '/ad' available under root '/'
        /// and make all endpoints available with sub-url _apiPath</summary>
        ///
        private void AddRazorPagesWithAdditionalRoutes(IServiceCollection services)
        {
            if (string.IsNullOrEmpty(_apiPath) || _apiPath == "/")
            {
                services.AddRazorPages()
                    .AddRazorPagesOptions(options =>
                        options.Conventions
                            .AddPageRoute("/ad", "/")
                    );
            }
            else
            {
                services.AddRazorPages()
                    .AddRazorPagesOptions(options =>
                        options.Conventions
                            .AddPageRoute("/ad", "/")
                            .AddPageRoute("/ad", _apiPath)
                            .AddPageRoute("/ad", Url.Combine(_apiPath, "/ad"))
                            .AddPageRoute("/ads", Url.Combine(_apiPath, "/ads"))
                            .AddPageRoute("/ads/upload", Url.Combine(_apiPath, "/ads/upload"))
                            .AddPageRoute("/ads/delete", Url.Combine(_apiPath, "/ads/delete"))
                    );
            }
        }
        
        /// <summary>Add OpenTelemetryTracing capable of W3c and Jaeger Trace-Context</summary>
        ///
        private void AddOpenTelemetryTracing(IServiceCollection services)
        {
            // Injects W3C Trace-Context header if Jaeger Trace-Context header was send, since opentelemetry-dotnet
            // only supports W3C Propagators.
            services.AddSingleton<IHttpContextFactory>(serviceProvider => new W3CHeaderHttpContextFactory(serviceProvider));

            services.AddOpenTelemetryTracing(
                (builder) => builder
                    .SetResourceBuilder(ResourceBuilder
                        .CreateDefault()
                        .AddService(Environment.GetEnvironmentVariable("JAEGER_SERVICE_NAME"))
                        .AddEnvironmentVariableDetector()
                    )
                    // Add traces to incoming requests (e.g. from unguard-frontend)
                    // Jaeger Trace-Context header compatible through W3CHeaderHttpContextFactory
                    .AddAspNetCoreInstrumentation() 
                    // Add traces to outgoing requests (e.g. to unguard-user-auth-service)
                    .AddHttpClientInstrumentation(options => options.Enrich = ((activity, eventName, rawObject) =>
                        {
                            // Add JAEGER Trace-Context header before sending an request (i.d. OnStartActivity)
                            // This is necessary for creating compatibility with other services.
                            // For more info have a look at W3CHeaderHttpContextFactory.cs
                            if (eventName.Equals("OnStartActivity")
                                && rawObject is HttpRequestMessage request
                                && !request.Headers.Contains("uber-trace-id"))
                            {
                                string traceFlag = ((int) activity.ActivityTraceFlags).ToString();
                                if (traceFlag.Length == 1)
                                {
                                    traceFlag = "0" + traceFlag;
                                }
                                
                                var jaegerHeader = activity.Context.TraceId
                                                   + ":" + activity.Context.SpanId
                                                   + ":" + activity.ParentId
                                                   + ":" + traceFlag;
                                request.Headers.Add("uber-trace-id", jaegerHeader);
                            }
                        })

                    )
                    .AddJaegerExporter( options =>
                        options.AgentHost = Environment.GetEnvironmentVariable("JAEGER_AGENT_HOST")
                    )
            );
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseRouting();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            if (!string.IsNullOrEmpty(_apiPath) && _apiPath != "/")
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(env.ContentRootPath, "wwwroot")), RequestPath = Url.Combine("/", _apiPath)
                });
            }
            else
            {
                app.UseStaticFiles();
            }

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
            });
       
        }
    }
}