package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.dto.AuthResponse;
import affectationsDesSalles.affectationDesSalles.dto.LoginRequest;
import affectationsDesSalles.affectationDesSalles.dto.SignupRequest;
import affectationsDesSalles.affectationDesSalles.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * GET /api/auth/test - Test endpoint to verify authentication
     */
    @GetMapping("/test")
    public ResponseEntity<String> testAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Authentication test - Current user: " + authentication.getName());
    }

    /**
     * POST /api/auth/test-json - Test JSON parsing
     */
    @PostMapping("/test-json")
    public ResponseEntity<?> testJson(@RequestBody Map<String, Object> jsonData) {
        System.out.println("=== JSON TEST ===");
        System.out.println("Received JSON: " + jsonData);
        return ResponseEntity.ok("JSON received: " + jsonData);
    }

    /**
     * POST /api/auth/signup - Register a new user
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        // Debug logging in controller
        System.out.println("=== CONTROLLER DEBUG ===");
        System.out.println("SignupRequest object received: " + signupRequest);
        if (signupRequest != null) {
            System.out.println("Nom: " + signupRequest.getNom());
            System.out.println("Email: " + signupRequest.getEmail());
            System.out.println("MotDePasse: " + signupRequest.getMotDePasse());
            System.out.println("Role: " + signupRequest.getRole());
        } else {
            System.out.println("SignupRequest is NULL!");
        }
        System.out.println("========================");
        
        try {
            AuthResponse response = authService.signup(signupRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }

    /**
     * POST /api/auth/login - Authenticate user and return JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed");
        }
    }
} 