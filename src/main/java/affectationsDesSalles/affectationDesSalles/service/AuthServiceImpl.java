package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.AuthResponse;
import affectationsDesSalles.affectationDesSalles.dto.LoginRequest;
import affectationsDesSalles.affectationDesSalles.dto.SignupRequest;
import affectationsDesSalles.affectationDesSalles.model.User;
import affectationsDesSalles.affectationDesSalles.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserServiceImpl userService;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserServiceImpl userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse signup(SignupRequest signupRequest) {
        // Debug logging
        System.out.println("DEBUG - SignupRequest received:");
        System.out.println("Nom: " + signupRequest.getNom());
        System.out.println("Email: " + signupRequest.getEmail());
        System.out.println("MotDePasse: " + signupRequest.getMotDePasse());
        System.out.println("Role: " + signupRequest.getRole());
        
        // Check if user already exists
        if (userService.findByEmail(signupRequest.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create new user
        User user = new User();
        user.setNom(signupRequest.getNom());
        user.setEmail(signupRequest.getEmail());
        user.setMotDePasse(signupRequest.getMotDePasse());
        user.setRole(signupRequest.getRole() != null ? signupRequest.getRole() : "user");

        // Debug logging
        System.out.println("DEBUG - User object before save:");
        System.out.println("Nom: " + user.getNom());
        System.out.println("Email: " + user.getEmail());
        System.out.println("MotDePasse: " + user.getMotDePasse());
        System.out.println("Role: " + user.getRole());

        // Save user (password will be hashed in the service)
        User savedUser = userService.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getIdUser());

        // Return response without password
        return new AuthResponse(token, savedUser.getNom(), savedUser.getEmail(), savedUser.getRole(), savedUser.getIdUser());
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by email
        User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check password
        if (!userService.checkPassword(loginRequest.getMotDePasse(), user.getMotDePasse())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getIdUser());

        // Return response without password
        return new AuthResponse(token, user.getNom(), user.getEmail(), user.getRole(), user.getIdUser());
    }
} 