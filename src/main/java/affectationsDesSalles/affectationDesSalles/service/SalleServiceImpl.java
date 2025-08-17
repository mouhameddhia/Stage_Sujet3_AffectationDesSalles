package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.model.Etage;
import affectationsDesSalles.affectationDesSalles.dto.SalleDTO;
import affectationsDesSalles.affectationDesSalles.dto.CreateSalleRequest;
import affectationsDesSalles.affectationDesSalles.exception.ConflictException;
import affectationsDesSalles.affectationDesSalles.exception.BadRequestException;
import affectationsDesSalles.affectationDesSalles.repository.AffectationRepository;
import affectationsDesSalles.affectationDesSalles.repository.SalleRepository;
import affectationsDesSalles.affectationDesSalles.repository.EtageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SalleServiceImpl implements SalleService {
    private final SalleRepository salleRepository;
    private final AffectationRepository affectationRepository;
    private final EtageRepository etageRepository;

    public SalleServiceImpl(SalleRepository salleRepository, AffectationRepository affectationRepository, EtageRepository etageRepository) {
        this.salleRepository = salleRepository;
        this.affectationRepository = affectationRepository;
        this.etageRepository = etageRepository;
    }

    @Override
    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    @Override
    public Optional<Salle> getSalleById(Long id) {
        return salleRepository.findById(id);
    }

    @Override
    public Salle saveSalle(Salle salle) {
        return salleRepository.save(salle);
    }

    @Override
    public void deleteSalle(Long id) {
        // Check if salle has affectations
        if (affectationRepository.existsBySalle_Id(id)) {
            throw new ConflictException("Impossible de supprimer la salle: des affectations y sont liées.");
        }
        salleRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return salleRepository.existsById(id);
    }
    
    @Override
    public List<SalleDTO> getAllSallesWithHierarchy() {
        return salleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SalleDTO> getSallesWithoutEtage() {
        return salleRepository.findAll().stream()
                .filter(salle -> salle.getEtage() == null)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SalleDTO> getSallesByBlocId(Long blocId) {
        return salleRepository.findByEtage_Bloc_Id(blocId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SalleDTO> getSallesByBlocNom(String blocNom) {
        return salleRepository.findByEtage_Bloc_Nom(blocNom).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SalleDTO> getSallesByEtageId(Long etageId) {
        return salleRepository.findByEtage_Id(etageId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<SalleDTO> getSallesByBlocAndEtage(String blocNom, String etageNumero) {
        return salleRepository.findByEtage_Bloc_NomAndEtage_Numero(blocNom, etageNumero).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public SalleDTO getSalleDTOById(Long id) {
        Salle salle = salleRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Salle non trouvée avec l'ID: " + id));
        return convertToDTO(salle);
    }
    
    @Override
    public SalleDTO createSalle(CreateSalleRequest request) {
        Etage etage = etageRepository.findById(request.getEtageId())
                .orElseThrow(() -> new BadRequestException("Étage non trouvé avec l'ID: " + request.getEtageId()));
        
        Salle salle = new Salle();
        salle.setNom(request.getNom());
        salle.setCapacite(request.getCapacite());
        salle.setType(request.getType());
        salle.setEtage(etage);
        
        Salle savedSalle = salleRepository.save(salle);
        return convertToDTO(savedSalle);
    }
    
    private SalleDTO convertToDTO(Salle salle) {
        return new SalleDTO(
            salle.getId(),
            salle.getNom(),
            salle.getType(),
            salle.getCapacite(),
            salle.getEtage() != null ? salle.getEtage().getId() : null,
            salle.getEtageNumero(),
            salle.getBloc() != null ? salle.getBloc().getId() : null,
            salle.getBlocNom()
        );
    }
} 