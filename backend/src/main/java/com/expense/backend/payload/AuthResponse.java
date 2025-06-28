// AuthResponse.java
package com.expense.backend.payload;

public class AuthResponse {

    private String message;
    private String token; // ✅ Include token for frontend
    private String role;

    // 💡 NEW: Include ID and username in response
    private Long id;
    private String username;

    public AuthResponse() {
    }

    // 💡 Updated constructor
    public AuthResponse(String message, String token, String role, Long id, String username) {
        this.message = message;
        this.token = token;
        this.role = role;
        this.id = id;
        this.username = username;
    }

    // Getters + Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // 💡 NEW getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
