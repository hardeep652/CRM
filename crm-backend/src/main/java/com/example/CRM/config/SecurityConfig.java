    package com.example.CRM.config;

    import java.util.Arrays;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.ProviderManager;
    import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    import com.example.CRM.service.UsersDetailsService;

    import jakarta.servlet.http.HttpServletResponse;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        private final UsersDetailsService usersDetailsService;

        public SecurityConfig(UsersDetailsService usersDetailsService) {
            this.usersDetailsService = usersDetailsService;
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public DaoAuthenticationProvider daoAuthenticationProvider() {
            DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
            provider.setUserDetailsService(usersDetailsService);
            provider.setPasswordEncoder(passwordEncoder());
            return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager() {
            return new ProviderManager(daoAuthenticationProvider());
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration configuration = new CorsConfiguration();
            configuration.setAllowedOrigins(Arrays.asList("https://crm-snowy-mu.vercel.app")); // Frontend URL
            configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
            configuration.setAllowedHeaders(Arrays.asList("*"));
            configuration.setAllowCredentials(true); // Allow cookies for session management
            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", configuration);
            return source;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Explicit CORS config
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/api/auth/login").permitAll()
                    .requestMatchers("/api/admin/**").hasRole("ADMIN")
                    .requestMatchers("/api/Leads/**", "/api/Tasks/**", "/api/clients/**").hasAnyRole("EMPLOYEE", "MANAGER")
                    .requestMatchers("/api/Manager/**").hasRole("MANAGER")
                    .anyRequest().authenticated()
                )
                .formLogin(login -> login
                    .loginProcessingUrl("/api/auth/login")
                    .successHandler((request, response, authentication) -> {
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");

        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        String role = user.getAuthorities().iterator().next().getAuthority();

        response.getWriter().write("{\"message\":\"Login successful\",\"role\":\"" + role + "\",\"username\":\"" + user.getUsername() + "\"}");
    })

                    .failureHandler((request, response, exception) -> {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"message\":\"Invalid username or password\"}");
                    })
                    .permitAll()
                );

            return http.build();
        }
    }
