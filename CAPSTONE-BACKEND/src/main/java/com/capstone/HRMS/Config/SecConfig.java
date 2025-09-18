package com.capstone.HRMS.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@RequiredArgsConstructor
public class SecConfig {
    //asd
    @Autowired
    private final UserDetailsService userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/employee/login",
                                "/hr/login",
                                "/admin/login",
                                "/api/password/**",
                                "/auth/forgot-password",
                                "/auth/reset-password",
                                "/auth/validate-reset-token",
                                "/api/applications/submit",
                                "api/notifications/all",
                                "api/timelog/time-in",
                                "/api/job-positions",
                                "/api/health",
                                "/default-profile.png",
                                "/*.png",
                                "/*.jpg",
                                "/*.jpeg",
                                "/*.gif",
                                "/static/**",
                                "/profile-pictures/**"

                        ).permitAll()

                        .requestMatchers("/api/positions/add", "/api/positions/getPositions").hasAnyRole("HR", "ADMIN")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/hr/**","/api/ai/review-resume-file").hasRole("HR")
                        .requestMatchers(HttpMethod.POST, "/api/job-positions/**").hasRole("HR")
                        .requestMatchers(HttpMethod.PUT, "/api/job-positions/**").hasRole("HR")
                        .requestMatchers(HttpMethod.DELETE, "/api/job-positions/**").hasRole("HR")
                        .requestMatchers("/api/applications/application", "/api/applications/{id}", "/api/applications/{id}/status").hasRole("HR")
                        .requestMatchers("/api/timelog/**").hasAnyRole("EMPLOYEE", "HR", "ADMIN")
                        .requestMatchers("/api/announcements/**").hasAnyRole("EMPLOYEE", "HR", "ADMIN")
                        .requestMatchers("/profile/**").hasAnyRole("EMPLOYEE", "HR", "ADMIN")
                        .requestMatchers("/employee/**").hasRole("EMPLOYEE")

                        .requestMatchers("/hr/available-hr-for-leave").hasAnyRole("EMPLOYEE", "HR")
                        .anyRequest().authenticated()
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(new BCryptPasswordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)throws Exception{
        return authenticationConfiguration.getAuthenticationManager();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("https://capstone-hrms.vercel.app"));
//        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
