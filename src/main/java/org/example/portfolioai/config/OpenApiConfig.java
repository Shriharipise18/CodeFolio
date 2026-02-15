package org.example.portfolioai.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI portfolioOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Portfolio Generator API")
                        .description("API for generating and managing professional portfolios powered by AI")
                        .version("v1.0.0"));
    }
}
