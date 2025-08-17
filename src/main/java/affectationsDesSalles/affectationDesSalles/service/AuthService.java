package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.AuthResponse;
import affectationsDesSalles.affectationDesSalles.dto.LoginRequest;
import affectationsDesSalles.affectationDesSalles.dto.SignupRequest;

public interface AuthService {
    AuthResponse signup(SignupRequest signupRequest);
    AuthResponse login(LoginRequest loginRequest);
} 