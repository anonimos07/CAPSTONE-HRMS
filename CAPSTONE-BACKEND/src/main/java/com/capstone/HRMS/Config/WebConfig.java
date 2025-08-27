package com.capstone.HRMS.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static resources from classpath:/static/
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
        
        // Specifically handle profile pictures
        registry.addResourceHandler("/profile-pictures/**")
                .addResourceLocations("classpath:/static/profile-pictures/")
                .setCachePeriod(3600);
    }
}
