package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.User;
import affectationsDesSalles.affectationDesSalles.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    @Override
    public User save(User user) {
        // Check if password is null or empty
        if (user.getMotDePasse() == null || user.getMotDePasse().trim().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }
        
        // Hash the password before saving
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        return userRepository.save(user);
    }

    @Override
    public User update(Integer id, User user) {
        return userRepository.findById(id)
            .map(existing -> {
                existing.setNom(user.getNom());
                existing.setEmail(user.getEmail());
                // Hash the password if it's being updated
                if (user.getMotDePasse() != null && !user.getMotDePasse().isEmpty()) {
                    existing.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
                }
                existing.setRole(user.getRole());
                return userRepository.save(existing);
            }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}