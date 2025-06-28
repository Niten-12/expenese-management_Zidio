//JwtService.java
package com.expense.backend.service;

import java.security.Key;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final Key SECRET_KEY;
    private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

    public JwtService(@Value("${jwt.secret}") String secret) {
        byte[] decodedKey = java.util.Base64.getDecoder().decode(secret);
        this.SECRET_KEY = Keys.hmacShaKeyFor(decodedKey);
    }

    public String generateToken(String username, List<String> roles) {
        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public Key getSecretKey() {
        return SECRET_KEY;
    }

    // ✅ Added method for parsing and validating token
    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

// package com.expense.backend.service;

// import java.security.Key;
// import java.util.Date;
// import java.util.List;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.SignatureAlgorithm;
// import io.jsonwebtoken.security.Keys;

// @Service
// public class JwtService {

// private final Key SECRET_KEY;
// private final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hour

// public JwtService(@Value("${jwt.secret}") String secret) {
// byte[] decodedKey = java.util.Base64.getDecoder().decode(secret);
// this.SECRET_KEY = Keys.hmacShaKeyFor(decodedKey);
// }

// public String generateToken(String username, List<String> roles) {
// return Jwts.builder()
// .setSubject(username)
// .claim("roles", roles)
// .setIssuedAt(new Date())
// .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
// .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
// .compact();
// }

// public Key getSecretKey() {
// return SECRET_KEY;
// }
// }
