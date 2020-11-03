package org.dynatrace.ssrfservice;


import com.uber.jaeger.httpclient.Constants;
import com.uber.jaeger.httpclient.TracingInterceptors;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;

@RestController
public class ProxyController {

    CloseableHttpClient httpclient;
    private final Tracer tracer;
    Logger logger = LoggerFactory.getLogger(ProxyController.class);

    @Autowired
    public ProxyController(Tracer tracer) {
        this.tracer = tracer;
        HttpClientBuilder clientBuilder = HttpClients.custom();
        httpclient = TracingInterceptors
                .addTo(clientBuilder, this.tracer)
                .build();
    }

    @RequestMapping("/")
    public String proxyUrlWithHttpClient(@RequestParam String url, @RequestParam String header) throws IOException {

        /* can add additional headers by sending something like "1\u560d\u560aX-But-Not-This-One: oh no!"
           in the header field */
        logger.info(url);

        CloseableHttpResponse execute = null;
        HttpContext httpContext = new BasicHttpContext();
        try {
            HttpGet httpget = new HttpGet(url);
            // let the user chose their own language here
            httpget.addHeader("Accept-Language", header);

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
                logger.warn("The ResponseInterceptor did not find a clientSpan.");
            }
        } catch (Exception ex) {
            logger.error("Could not finish client tracing span with error.", ex);
        }
    }

    @PostMapping("/curl")
    public String proxyUrlWithCurl(@RequestBody() String url) throws IOException, InterruptedException {
        /*
         VULNERABLE CODE BELOW
         it's never a good idea to not sanitize a user controlled URL
        */
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
