package com.capstone.HRMS.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column
    private LocalDateTime usedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public PasswordResetToken() {
        this.createdAt = LocalDateTime.now();
    }

    public PasswordResetToken(String token, Users user, LocalDateTime expiresAt) {
        this();
        this.token = token;
        this.user = user;
        this.expiresAt = expiresAt;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }

    public boolean isUsed() {
        return this.usedAt != null;
    }

    public void markAsUsed() {
        this.usedAt = LocalDateTime.now();
    }
}
