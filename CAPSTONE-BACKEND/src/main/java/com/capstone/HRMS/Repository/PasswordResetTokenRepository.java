package com.capstone.HRMS.Repository;

import com.capstone.HRMS.Entity.PasswordResetToken;
import com.capstone.HRMS.Entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    Optional<PasswordResetToken> findByTokenAndUsedAtIsNull(String token);
    
    @Query("SELECT prt FROM PasswordResetToken prt WHERE prt.user = :user AND prt.usedAt IS NULL AND prt.expiresAt > :now")
    Optional<PasswordResetToken> findValidTokenByUser(@Param("user") Users user, @Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.expiresAt < :now")
    void deleteExpiredTokens(@Param("now") LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken prt SET prt.usedAt = :usedAt WHERE prt.user = :user AND prt.usedAt IS NULL")
    void invalidateUserTokens(@Param("user") Users user, @Param("usedAt") LocalDateTime usedAt);
}
