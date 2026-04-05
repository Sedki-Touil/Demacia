package com.demacia.Backend.controller;

import com.demacia.Backend.dto.JwtResponse;
import com.demacia.Backend.dto.LoginRequest;
import com.demacia.Backend.dto.RegisterRequest;
import com.demacia.Backend.model.User;
import com.demacia.Backend.security.JwtUtil;
import com.demacia.Backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")

public class AuthController {
	
	private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            userService.registerLearner(request);
            return ResponseEntity.ok("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt : " + request.getEmail());

        if (request.getEmail() == null || request.getPassword() == null ||
            request.getEmail().trim().isEmpty() || request.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email et mot de passe requis");
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword().trim())
            );

            User user = userService.findByEmail(request.getEmail().trim());
            String token = jwtUtil.generateToken(user);

            JwtResponse res = new JwtResponse();
            res.setToken(token);
            res.setRole(user.getRole().name());
            res.setUserId(user.getId());
            res.setEmail(user.getEmail());

            return ResponseEntity.ok(res);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Identifiants incorrects");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur inattendue : " + e.getMessage());
        }
    }

}
