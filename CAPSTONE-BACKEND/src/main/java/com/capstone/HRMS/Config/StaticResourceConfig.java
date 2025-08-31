package com.capstone.HRMS.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve profile pictures from static folder
        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("classpath:/static/profile-pictures/");
        
        // Serve default profile picture
        registry.addResourceHandler("/default-profile.svg")
                .addResourceLocations("classpath:/static/");
    }
}
