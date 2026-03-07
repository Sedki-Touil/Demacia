package com.ira.formation.services;

import com.ira.formation.entities.RefreshToken;
import com.ira.formation.entities.Utilisateur;
import com.ira.formation.repositories.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    // Durée de vie du refresh token en secondes (ex: 7 jours)
    private static final long REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    // Créer un refresh token
    public RefreshToken createRefreshToken(Utilisateur utilisateur) {
        RefreshToken token = new RefreshToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUtilisateur(utilisateur);
        token.setCreatedAt(Instant.now());
        token.setExpiresAt(Instant.now().plusSeconds(REFRESH_TOKEN_DURATION));
        token.setRevoked(false);
        return refreshTokenRepository.save(token);
    }

    // Récupérer par token
    public Optional<RefreshToken> getRefreshTokenByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // Vérifier si token valide
    public boolean isValid(RefreshToken token) {
        return !token.isRevoked() && token.getExpiresAt().isAfter(Instant.now());
    }

    // Révoquer un token
    public void revokeToken(RefreshToken token) {
        token.setRevoked(true);
        refreshTokenRepository.save(token);
    }
}