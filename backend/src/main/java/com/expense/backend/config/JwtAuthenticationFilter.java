//jwtAuthenticationFilter.java
package com.expense.backend.config;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.expense.backend.service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger jwtLogger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                Claims claims = jwtService.parseToken(token);
                String username = claims.getSubject();
                List<?> rawRoles = claims.get("roles", List.class);

                List<SimpleGrantedAuthority> authorities = rawRoles != null
                        ? rawRoles.stream()
                                .map(r -> {
                                    if (r instanceof String s) {
                                        return new SimpleGrantedAuthority(s);
                                    } else if (r instanceof Map) {
                                        Object roleValue = ((Map<?, ?>) r).get("authority");
                                        return roleValue instanceof String
                                                ? new SimpleGrantedAuthority((String) roleValue)
                                                : null;
                                    } else {
                                        return null;
                                    }
                                })
                                .filter(Objects::nonNull)
                                .collect(Collectors.toList())
                        : List.of();

                jwtLogger.info("🔑 Username: {}", username);
                jwtLogger.info("🔑 Raw roles from token: {}", rawRoles);
                jwtLogger.info("🔑 Authorities created: {}", authorities);

                if (username != null) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username,
                            null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    jwtLogger.info("🔑 Final authorities in SecurityContext: {}",
                            SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                }

            } catch (JwtException | IllegalArgumentException e) {
                jwtLogger.warn("❌ Invalid token on path {}: {}", request.getRequestURI(), e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}

// package com.expense.backend.config;

// import java.io.IOException;
// import java.util.List;
// import java.util.Map;
// import java.util.Objects;
// import java.util.stream.Collectors;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.lang.NonNull;
// import
// org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.expense.backend.service.JwtService;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.JwtException;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// public class JwtAuthenticationFilter extends OncePerRequestFilter {

// private static final Logger jwtLogger =
// LoggerFactory.getLogger(JwtAuthenticationFilter.class);

// private final JwtService jwtService;

// public JwtAuthenticationFilter(JwtService jwtService) {
// this.jwtService = jwtService;
// }

// @Override
// protected void doFilterInternal(@NonNull HttpServletRequest request,
// @NonNull HttpServletResponse response,
// @NonNull FilterChain filterChain)
// throws ServletException, IOException {

// String authHeader = request.getHeader("Authorization");

// if (authHeader != null && authHeader.startsWith("Bearer ")) {
// String token = authHeader.substring(7);
// try {
// // Delegate parsing to JwtService
// Claims claims = jwtService.parseToken(token);

// String username = claims.getSubject();

// List<?> rawRoles = claims.get("roles", List.class);

// // ⭐ UPDATED: Handle both List<String> and List<Map> for roles
// List<SimpleGrantedAuthority> authorities = rawRoles != null
// ? rawRoles.stream()
// .map(r -> {
// if (r instanceof String s) {
// return new SimpleGrantedAuthority(s);
// } else if (r instanceof Map) {
// Object roleValue = ((Map<?, ?>) r).get("authority");
// return roleValue instanceof String
// ? new SimpleGrantedAuthority((String) roleValue)
// : null;
// } else {
// return null;
// }
// })
// .filter(Objects::nonNull)
// .collect(Collectors.toList())
// : List.of();

// // ⭐ ADDED DEBUG LOGGING TO SEE CLAIMS AND AUTHORITIES
// jwtLogger.info("🔑 Username: {}", username);
// jwtLogger.info("🔑 Raw roles from token: {}", rawRoles);
// jwtLogger.info("🔑 Authorities created: {}", authorities);

// if (username != null) {
// UsernamePasswordAuthenticationToken authToken = new
// UsernamePasswordAuthenticationToken(username,
// null, authorities);
// SecurityContextHolder.getContext().setAuthentication(authToken);
// }

// } catch (JwtException | IllegalArgumentException e) {
// jwtLogger.warn("Invalid token on path {}: {}", request.getRequestURI(),
// e.getMessage());
// response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
// return;
// }
// }

// filterChain.doFilter(request, response);
// }
// }
