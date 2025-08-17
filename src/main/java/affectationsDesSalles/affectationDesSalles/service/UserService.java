package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> findAll();
    Optional<User> findById(Integer id);
    User save(User user);
    User update(Integer id, User user);
    void delete(Integer id);
}