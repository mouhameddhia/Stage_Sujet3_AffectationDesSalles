package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.dto.SalleDTO;
import affectationsDesSalles.affectationDesSalles.dto.CreateSalleRequest;

import java.util.List;
import java.util.Optional;

public interface SalleService {
    List<Salle> getAllSalles();
    List<SalleDTO> getAllSallesWithHierarchy();
    List<SalleDTO> getSallesWithoutEtage();
    List<SalleDTO> getSallesByBlocId(Long blocId);
    List<SalleDTO> getSallesByBlocNom(String blocNom);
    List<SalleDTO> getSallesByEtageId(Long etageId);
    List<SalleDTO> getSallesByBlocAndEtage(String blocNom, String etageNumero);
    Optional<Salle> getSalleById(Long id);
    SalleDTO getSalleDTOById(Long id);
    Salle saveSalle(Salle salle);
    SalleDTO createSalle(CreateSalleRequest request);
    void deleteSalle(Long id);
    boolean existsById(Long id);
} 