package org.dynatrace.microblog.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;

public class JwtTokensUtils {

    public static Claims decodeTokenClaims(String token) {
        String[] splitToken = token.split("\\.");
        String unsignedToken = splitToken[0] + "." + splitToken[1] + ".";

        Jwt<Header,Claims> untrusted = Jwts.parser().parseClaimsJwt(unsignedToken);

        Claims claims = (Claims) untrusted.getBody();
        return claims;
    }
}
