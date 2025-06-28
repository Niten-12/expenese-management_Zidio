//SecurityConfig.java
package com.expense.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.expense.backend.service.JwtService;

@Configuration
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/employee/expenses/**").hasRole("EMPLOYEE")
                        .requestMatchers("/api/manager/expenses/**").hasRole("MANAGER")
                        .requestMatchers("/api/finance/expenses/**").hasRole("FINANCE")

                        // 🔹 NEW: Manager submission API secured for manager role
                        .requestMatchers("/api/manager/submission/**").hasRole("MANAGER")

                        // 🔹 NEW: Finance review API secured for finance role
                        .requestMatchers("/api/finance/review/**").hasRole("FINANCE")

                        // 🔹 NEW: Admin review API secured for admin role
                        .requestMatchers("/api/admin/review/**").hasRole("ADMIN")
                        .requestMatchers("/api/manager/history/**").hasRole("MANAGER")
                        .requestMatchers("/api/manager/rows/**").hasRole("MANAGER")

                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

// package com.expense.backend.config;

// import java.util.List;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.http.HttpMethod;
// import
// org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import
// org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import com.expense.backend.service.JwtService;

// @Configuration
// public class SecurityConfig {

// private final JwtService jwtService;

// public SecurityConfig(JwtService jwtService) {
// this.jwtService = jwtService;
// }

// @Bean
// public PasswordEncoder passwordEncoder() {
// return new BCryptPasswordEncoder();
// }

// @Bean
// public JwtAuthenticationFilter jwtAuthenticationFilter() {
// return new JwtAuthenticationFilter(jwtService);
// }

// @Bean
// public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
// return http
// .csrf(csrf -> csrf.disable())
// .cors(cors -> cors.configurationSource(corsConfigurationSource()))
// .authorizeHttpRequests(auth -> auth
// .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
// .requestMatchers("/api/auth/**").permitAll()
// .requestMatchers("/api/admin/**").hasRole("ADMIN")
// .requestMatchers("/api/employee/expenses/**").hasRole("EMPLOYEE")
// .requestMatchers("/api/manager/expenses/**").hasRole("MANAGER")
// .requestMatchers("/api/finance/expenses/**").hasRole("FINANCE")
// .anyRequest().authenticated())
// .addFilterBefore(jwtAuthenticationFilter(),
// UsernamePasswordAuthenticationFilter.class)
// .build();
// }

// @Bean
// public CorsConfigurationSource corsConfigurationSource() {
// var config = new org.springframework.web.cors.CorsConfiguration();
// config.setAllowedOrigins(List.of("http://localhost:4200"));
// config.setAllowedMethods(List.of("*"));
// config.setAllowedHeaders(List.of("*"));
// config.setAllowCredentials(true);

// var source = new UrlBasedCorsConfigurationSource();
// source.registerCorsConfiguration("/**", config);
// return source;
// }
// }
