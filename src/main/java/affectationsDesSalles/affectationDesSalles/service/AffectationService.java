package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.Affectation;

import java.util.List;
import java.util.Optional;

public interface AffectationService {
    List<Affectation> findAll();
    Optional<Affectation> findById(Integer id);
    Affectation save(Affectation affectation);
    Affectation update(Integer id, Affectation affectation);
    void delete(Integer id);
} 