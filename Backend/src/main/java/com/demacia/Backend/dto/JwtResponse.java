package com.demacia.Backend.dto;

import lombok.Data;

@Data
public class JwtResponse {

    private String token;
    private String role;
    private Long userId;
    private String email;

    
    public JwtResponse() {
    }

    public JwtResponse(String token, String role, Long userId, String email) {
        this.setToken(token);
        this.setRole(role);
        this.setUserId(userId);
        this.setEmail(email);
    }

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}