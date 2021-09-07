using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using OpenTelemetry.Exporter;
using Flurl;

namespace AdService
{
    public class Startup
    {
        private readonly string _ApiPath = Environment.GetEnvironmentVariable("API_PATH");
        public IConfiguration Configuration { get; set; }
        
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            if (string.IsNullOrEmpty(_ApiPath) || _ApiPath == "/")
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
                            .AddPageRoute("/ad", _ApiPath)
                            .AddPageRoute("/ad", Url.Combine(_ApiPath, "/ad"))
                            .AddPageRoute("/ads", Url.Combine(_ApiPath, "/ads"))
                            .AddPageRoute("/ads/upload", Url.Combine(_ApiPath, "/ads/upload"))
                            .AddPageRoute("/ads/delete", Url.Combine(_ApiPath, "/ads/delete"))
                    );
            }

            services.AddOpenTelemetryTracing(
                (builder) => builder
                    .SetResourceBuilder(ResourceBuilder
                        .CreateDefault()
                        .AddService(Environment.GetEnvironmentVariable("JAEGER_SERVICE_NAME"))
                    )
                    .AddAspNetCoreInstrumentation()
                    .AddJaegerExporter()
            );
            services.Configure<JaegerExporterOptions>(options =>
            {
                options.AgentHost = Environment.GetEnvironmentVariable("JAEGER_AGENT_HOST");
            });
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

            if (!string.IsNullOrEmpty(_ApiPath) && _ApiPath != "/")
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(env.ContentRootPath, "wwwroot")), RequestPath = Url.Combine("/", _ApiPath)
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