package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.model.Affectation;
import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.exception.BadRequestException;
import affectationsDesSalles.affectationDesSalles.repository.AffectationRepository;
import affectationsDesSalles.affectationDesSalles.repository.SalleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AffectationServiceImpl implements AffectationService {
    private final AffectationRepository affectationRepository;
    private final SalleRepository salleRepository;

    public AffectationServiceImpl(AffectationRepository affectationRepository, SalleRepository salleRepository) {
        this.affectationRepository = affectationRepository;
        this.salleRepository = salleRepository;
    }

    @Override
    public List<Affectation> findAll() {
        return affectationRepository.findAll();
    }

    @Override
    public Optional<Affectation> findById(Integer id) {
        return affectationRepository.findById(id);
    }

    @Override
    public Affectation save(Affectation affectation) {
        // 1) Validate that the salle exists
        if (affectation.getSalle() == null || affectation.getSalle().getId() == null) {
            throw new BadRequestException("L'ID de la salle est requis");
        }

        Salle salle = salleRepository.findById(affectation.getSalle().getId())
            .orElseThrow(() -> new BadRequestException("Salle non trouvée avec l'ID: " + affectation.getSalle().getId()));

        // 2) Business rules
        // 2.a) Type compatibility (currently no restriction per requirement)
        // Salle type can be not compatible with affectation type -> it's ok (no check)

        // 2.b) Time overlap check for same salle and date
        if (affectation.getDate() == null || affectation.getHeuredebut() == null || affectation.getHeurefin() == null) {
            throw new BadRequestException("La date, l'heure de début et l'heure de fin sont requis");
        }

        if (!affectation.getHeurefin().isAfter(affectation.getHeuredebut())) {
            throw new BadRequestException("L'heure de fin doit être postérieure à l'heure de début");
        }

        boolean conflictExists = !affectationRepository.findConflictingAffectations(
            salle.getId(),
            affectation.getDate(),
            affectation.getHeuredebut(),
            affectation.getHeurefin(),
            null
        ).isEmpty();

        if (conflictExists) {
            throw new BadRequestException("Conflit horaire détecté. La salle est déjà réservée pour ce créneau.");
        }

        affectation.setSalle(salle);
        return affectationRepository.save(affectation);
    }

    @Override
    public Affectation update(Integer id, Affectation affectation) {
        return affectationRepository.findById(id)
            .map(existing -> {
                existing.setDate(affectation.getDate());
                existing.setHeuredebut(affectation.getHeuredebut());
                existing.setHeurefin(affectation.getHeurefin());
                existing.setTypeactivite(affectation.getTypeactivite());
                
                // Validate and update salle if provided
                if (affectation.getSalle() != null) {
                    Salle salle = salleRepository.findById(affectation.getSalle().getId())
                        .orElseThrow(() -> new RuntimeException("Salle not found"));
                    existing.setSalle(salle);
                }
                
                return affectationRepository.save(existing);
            }).orElseThrow(() -> new RuntimeException("Affectation not found"));
    }

    @Override
    public void delete(Integer id) {
        affectationRepository.deleteById(id);
    }
} 