package com.zomato.opspro.controller;

import com.zomato.opspro.model.User;
import com.zomato.opspro.service.UserService;
import com.zomato.opspro.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for user: {}", loginRequest.getUsername());
            logger.debug("Login request received: username={}", loginRequest.getUsername());
            
            if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
                logger.error("Username or password is null");
                return ResponseEntity.badRequest().body("Username and password are required");
            }

            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
                )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = tokenProvider.generateToken(userDetails);

            User user = userService.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            logger.info("Login successful for user: {}", loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                token
            ));
        } catch (Exception e) {
            logger.error("Login error: ", e);
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    // Request and Response DTOs
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginResponse {
        private Long id;
        private String username;
        private User.Role role;
        private String token;

        public LoginResponse(Long id, String username, User.Role role, String token) {
            this.id = id;
            this.username = username;
            this.role = role;
            this.token = token;
        }

        public Long getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public User.Role getRole() {
            return role;
        }

        public String getToken() {
            return token;
        }
    }
} 