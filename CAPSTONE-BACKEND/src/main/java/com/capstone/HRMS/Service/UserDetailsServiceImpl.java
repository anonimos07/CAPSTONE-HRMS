package com.capstone.HRMS.Service;


import com.capstone.HRMS.Entity.Users;
import com.capstone.HRMS.Repository.UserRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepo userRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    public UserDetailsServiceImpl(UserRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("Loading user by username: {}", username);

        Optional<Users> userOpt = userRepository.findByUsername(username);
        Users users = userOpt.orElseThrow(() ->
                new UsernameNotFoundException("User not found with username: " + username));

        return User.builder()
                .username(users.getUsername())
                .password(users.getPassword())
                .authorities("ROLE_" + users.getRole().name())
                .build();
    }
}