package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.Salle;

import java.util.List;
import java.util.Optional;

public interface SalleService {
    List<Salle> getAllSalles();
    Optional<Salle> getSalleById(Long id);
    Salle saveSalle(Salle salle);
    void deleteSalle(Long id);
} 