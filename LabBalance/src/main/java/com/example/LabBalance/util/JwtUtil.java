package com.example.LabBalance.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import static io.jsonwebtoken.Jwts.builder;

@Component
public class JwtUtil {

    // The SECRET key should be kept safe and should not be exposed in your source code for production applications.
    public static final String SECRET = "U3VwZXJTZWNyZXRLZXlGb3JKV1QhMTIzNDU2Nzg5MH4kQEAjJQ==";

    // This method creates a JWT token for a given user.
    public String createToken(Map<String, Object> claims, String userName) {
        String token = builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() +1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, getSignKey())
                .compact();
        System.out.println("Generated JWT: " + token); // Log the generated token
        return token;
    }

    // This method converts the SECRET into a signing key for HS256.
    private Key getSignKey(){
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String userName){
        Map<String,Object> claims=new HashMap<>();
        return createToken(claims,userName);

    }

    private Claims extractAllClaims(String token) {
        System.out.println("Received JWT: " + token); // Log the received token
        return Jwts.parser()
                .setSigningKey(getSignKey())
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Date extractExpiration(String token){
        return extractClaim(token,Claims::getExpiration);
    }
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }
    public boolean isTokenExpired(String token){
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
