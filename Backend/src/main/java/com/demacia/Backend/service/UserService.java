package com.demacia.Backend.service;

import com.demacia.Backend.dto.RegisterRequest;


import com.demacia.Backend.model.Role;
import com.demacia.Backend.model.User;
import com.demacia.Backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class UserService {
	
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerLearner(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) throw new RuntimeException("Email déjà utilisé");
        User u = new User();
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(Role.APPRENANT);
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        return userRepository.save(u);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow();
    }

}
