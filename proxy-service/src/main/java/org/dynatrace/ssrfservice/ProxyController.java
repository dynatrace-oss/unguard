package org.dynatrace.ssrfservice;


import com.uber.jaeger.httpclient.Constants;
import com.uber.jaeger.httpclient.TracingResponseInterceptor;
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
import org.dynatrace.ssrfservice.tracing.EnhancedTracingRequestInterceptor;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.util.Base64;

@RestController
public class ProxyController {

    CloseableHttpClient httpclient;
    private final Tracer tracer;
    private final Logger logger = LogManager.getLogger(ProxyController.class);

    @Autowired
    public ProxyController(Tracer tracer) {
        this.tracer = tracer;
        HttpClientBuilder clientBuilder = HttpClients.custom();

        httpclient = clientBuilder
                .addInterceptorFirst(new EnhancedTracingRequestInterceptor(tracer))
                .addInterceptorFirst(new TracingResponseInterceptor())
                .build();
    }

    @RequestMapping("/")
    public String proxyUrlWithHttpClient(@RequestHeader("Host") String host, @RequestParam String url, @RequestParam String header) throws IOException {

        /* can add additional headers by sending something like "1\u560d\u560aX-But-Not-This-One: oh no!"
           in the header field */
        logger.info(url);

        tracer.activeSpan().setTag("http.host", host);

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

    private static String encodeBase64(byte[] imageBytes) {
        String imageString = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream();

        try {
            Base64.Encoder encoder = Base64.getEncoder();
            imageString = encoder.encodeToString(imageBytes);

            bos.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imageString;
    }

    /**
     * Will fetch a jpg image from an URL and return the base64 image representation
     * WARNING: We never check if what we fetch is actually a valid image.
     *
     * @param url the URL to fetch data from
     * @return base64 jpg image
     * @throws IOException
     * @throws InterruptedException
     */
    @GetMapping(
            value = "/image",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public @ResponseBody
    String proxyUrlWithCurl(@RequestParam String url) throws IOException, InterruptedException {
        File temporaryJpgFile = new File(String.format("/tmp/img-%d.jpg", System.currentTimeMillis()));

        Span curlSpan = tracer.buildSpan("/image")
                .withTag("peer.address", url) // we use this instead of url because it technically does not need to be one
                .withTag(Tags.COMPONENT, "curl")
                .withTag(Tags.SPAN_KIND, Tags.SPAN_KIND_CLIENT)
                .start();

        /*
         * VULNERABLE CODE BELOW
         * it's never a good idea to not sanitize a user controlled URL
         */
        String[] command = {"curl", "--silent", "-S", url, "--max-time", "10", "--output", temporaryJpgFile.getAbsolutePath()};
        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.directory(new File("/home/"));
        Process process = processBuilder.start();
        BufferedReader in = new BufferedReader(new InputStreamReader(process.getInputStream()));

        BufferedReader err = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String errline;
        while ((errline = err.readLine()) != null) {
            logger.warn("ERR: {}", errline);
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
        logger.info("curl exit code: {}", exitCode);
        curlSpan.log("curl exit code: " + exitCode);

        // finally destroy the process
        process.destroy();
        if (exitCode != 0) {
            curlSpan.setTag(Tags.ERROR, true);
        }
        curlSpan.finish();

        FileInputStream fis = new FileInputStream(temporaryJpgFile);

        byte[] bytes = IOUtils.toByteArray(fis);

        String base64Image = encodeBase64(bytes);
        Files.deleteIfExists(temporaryJpgFile.toPath());

        return String.format("data:image/jpg;base64,%s", base64Image);
    }

}
