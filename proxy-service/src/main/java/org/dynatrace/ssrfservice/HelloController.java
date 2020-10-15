package org.dynatrace.ssrfservice;


import com.uber.jaeger.httpclient.Constants;
import com.uber.jaeger.httpclient.TracingInterceptors;
import io.jaegertracing.Configuration;
import io.opentracing.Span;
import io.opentracing.Tracer;
import io.opentracing.tag.Tags;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.protocol.BasicHttpContext;
import org.apache.http.protocol.HttpContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;

@RestController
public class HelloController {

    CloseableHttpClient httpclient;
    Tracer tracer;
    Logger logger = LoggerFactory.getLogger(HelloController.class);

    public HelloController() {
        tracer = Configuration.fromEnv().getTracer();
        HttpClientBuilder clientBuilder = HttpClients.custom();
        httpclient = TracingInterceptors
                .addTo(clientBuilder, tracer)
                .build();
    }

    @RequestMapping("/")
    public String callService(@RequestParam String url, @RequestParam String header) throws IOException {

        /* can add additional headers by sending something like "1\u560d\u560aX-But-Not-This-One: oh no!"
           in the header field */
        logger.info(url);

        CloseableHttpResponse execute = null;
        HttpContext httpContext = new BasicHttpContext();
        try {
            HttpGet httpget = new HttpGet(url);
            httpget.addHeader("X-I-Expect-This-Header", header);

            execute = httpclient.execute(httpget, httpContext);
            InputStream content = execute.getEntity().getContent();
            String s = IOUtils.toString(content, Charset.defaultCharset());
            execute.close();
            return s;
        } catch (Exception e) {
            finishCurrentSpanWithError(httpContext, e);

            return e.getMessage();
        } finally {
            if (execute != null) {
                execute.close();
            }
        }
    }

    private void finishCurrentSpanWithError(HttpContext httpContext, Exception e) {
        try {
            Span clientSpan = (Span) httpContext.getAttribute(Constants.CURRENT_SPAN_CONTEXT_KEY);
            if (clientSpan != null) {
                Tags.ERROR.set(clientSpan, true);
                clientSpan.log(e.getMessage());
                clientSpan.finish();
            } else {
                logger.warn(
                        "The ResponseInterceptor did not find a clientSpan. "
                                + "Verify that the RequestInterceptor is correctly set up.");
            }
        } catch (Exception ex) {
            logger.error("Could not finish errored client tracing span.", ex);
        }
    }

    @PostMapping("/curl")
    public String curl(@RequestBody() String url) throws IOException, InterruptedException {
        // VULVERABLE CODE BELOW
        // it's never a good idea to not sanitize a user controlled URL
        Span curlSpan = tracer.buildSpan("/curl").withTag("url", url).start();

        String[] command = {"curl", "--silent", "-S", url, "--max-time", "10"};
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(new File("/home/"));
        Process process = processBuilder.start();
        BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder responseString = new StringBuilder();
        String line;
        while ((line = in.readLine()) != null) {
            logger.debug(line);
            responseString.append(line).append("\n");
        }

        BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String errline;
        while ((errline = err.readLine()) != null) {
            logger.info("ERR:" + errline);
        }

        // close the buffered readers
        in.close();
        err.close();

        /*
         * wait until process completes, this should be always after the
         * input_stream of ProcessBuilder is read to avoid deadlock
         * situations
         */
        process.waitFor();
        /* exit code can be obtained only after process completes, 0
         * indicates a successful completion
         */
        int exitCode = process.exitValue();
        logger.info("curl exit code: " + exitCode);
        curlSpan.log("curl exit code: " + exitCode);

        // finally destroy the process
        process.destroy();
        curlSpan.finish();

        return responseString.toString();
    }

}
