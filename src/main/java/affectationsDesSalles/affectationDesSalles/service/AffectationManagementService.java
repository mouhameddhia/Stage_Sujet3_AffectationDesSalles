package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.AffectationRequest;
import affectationsDesSalles.affectationDesSalles.dto.AffectationResponse;
import affectationsDesSalles.affectationDesSalles.model.Affectation;
import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.repository.AffectationRepository;
import affectationsDesSalles.affectationDesSalles.repository.SalleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AffectationManagementService {

    private final AffectationRepository affectationRepository;
    private final SalleRepository salleRepository;

    public AffectationManagementService(AffectationRepository affectationRepository, SalleRepository salleRepository) {
        this.affectationRepository = affectationRepository;
        this.salleRepository = salleRepository;
    }

    /**
     * Récupère toutes les affectations approuvées avec les informations de salle
     */
    public List<AffectationResponse> getAllApprovedAffectations() {
        return affectationRepository.findAllApprovedWithSalle()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Récupère toutes les affectations en attente d'approbation (pour les admins)
     */
    public List<AffectationResponse> getAllPendingAffectations() {
        return affectationRepository.findAllPendingWithSalle()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Récupère les affectations en attente d'approbation pour un utilisateur spécifique
     */
    public List<AffectationResponse> getPendingAffectationsByUser(String requesterId) {
        return affectationRepository.findPendingByRequesterId(requesterId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupère une affectation par son ID
     */
    public Optional<AffectationResponse> getAffectationById(Integer id) {
        return affectationRepository.findById(id)
                .map(this::convertToResponse);
    }

    /**
     * Crée une nouvelle affectation avec validation des conflits
     */
    public AffectationResponse createAffectation(AffectationRequest request, String requesterId, String userRole) {
        // Validation des données
        validateAffectationRequest(request);
        
        // Vérification de l'existence de la salle
        Salle salle = salleRepository.findById(request.getIdSalle())
                .orElseThrow(() -> new RuntimeException("Salle non trouvée avec l'ID: " + request.getIdSalle()));
        
        // Déterminer le statut initial basé sur le rôle
        String initialStatus = "ADMIN".equals(userRole) ? "approved" : "pending";
        
        // Vérification des conflits horaires seulement pour les affectations approuvées
        if ("approved".equals(initialStatus)) {
            List<Affectation> conflicts = affectationRepository.findConflictingAffectations(
                    request.getIdSalle(),
                    request.getDate(),
                    request.getHeureDebut(),
                    request.getHeureFin(),
                    null // Pas d'ID pour une nouvelle affectation
            );
            
            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Conflit horaire détecté. La salle est déjà réservée pour ce créneau.");
            }
        }
        
        // Création de l'affectation
        Affectation affectation = new Affectation();
        affectation.setDate(request.getDate());
        affectation.setHeuredebut(request.getHeureDebut());
        affectation.setHeurefin(request.getHeureFin());
        affectation.setTypeactivite(request.getTypeActivite());
        affectation.setSalle(salle);
        affectation.setStatus(initialStatus);
        affectation.setRequesterId(requesterId);
        affectation.setRequestTime(LocalDateTime.now());
        
        // Si c'est un admin, marquer comme approuvé
        if ("ADMIN".equals(userRole)) {
            affectation.setApproverId(requesterId);
            affectation.setApprovalTime(LocalDateTime.now());
        }
        
        Affectation savedAffectation = affectationRepository.save(affectation);
        return convertToResponse(savedAffectation);
    }
    
    /**
     * Approuve ou rejette une affectation (admin seulement)
     */
    public AffectationResponse approveOrRejectAffectation(Integer affectationId, String action, 
                                                         String approverId, String rejectionReason) {
        Affectation affectation = affectationRepository.findById(affectationId)
                .orElseThrow(() -> new RuntimeException("Affectation non trouvée avec l'ID: " + affectationId));
        
        if (!"pending".equals(affectation.getStatus())) {
            throw new RuntimeException("Cette affectation n'est pas en attente d'approbation");
        }
        
        if ("approve".equals(action)) {
            // Vérifier les conflits avant d'approuver
            List<Affectation> conflicts = affectationRepository.findConflictingAffectations(
                    affectation.getSalle().getId(),
                    affectation.getDate(),
                    affectation.getHeuredebut(),
                    affectation.getHeurefin(),
                    affectation.getIdaffectation()
            );
            
            if (!conflicts.isEmpty()) {
                throw new RuntimeException("Impossible d'approuver: conflit horaire détecté");
            }
            
            affectation.setStatus("approved");
            affectation.setApproverId(approverId);
            affectation.setApprovalTime(LocalDateTime.now());
            
        } else if ("reject".equals(action)) {
            affectation.setStatus("rejected");
            affectation.setApproverId(approverId);
            affectation.setApprovalTime(LocalDateTime.now());
            // Note: rejectionReason is not used in this simplified flow
            
        } else {
            throw new RuntimeException("Action invalide. Utilisez 'approve' ou 'reject'");
        }
        
        Affectation savedAffectation = affectationRepository.save(affectation);
        return convertToResponse(savedAffectation);
    }

    /**
     * Met à jour une affectation existante avec validation des conflits
     */
    public AffectationResponse updateAffectation(Integer id, AffectationRequest request) {
        // Validation des données
        validateAffectationRequest(request);
        
        // Vérification de l'existence de l'affectation
        Affectation existingAffectation = affectationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affectation non trouvée avec l'ID: " + id));
        
        // Vérification de l'existence de la salle
        Salle salle = salleRepository.findById(request.getIdSalle())
                .orElseThrow(() -> new RuntimeException("Salle non trouvée avec l'ID: " + request.getIdSalle()));
        
        // Vérification des conflits horaires (en excluant l'affectation en cours de modification)
        List<Affectation> conflicts = affectationRepository.findConflictingAffectations(
                request.getIdSalle(),
                request.getDate(),
                request.getHeureDebut(),
                request.getHeureFin(),
                id // Exclut l'affectation en cours de modification
        );
        
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Conflit horaire détecté. La salle est déjà réservée pour ce créneau.");
        }
        
        // Mise à jour de l'affectation
        existingAffectation.setDate(request.getDate());
        existingAffectation.setHeuredebut(request.getHeureDebut());
        existingAffectation.setHeurefin(request.getHeureFin());
        existingAffectation.setTypeactivite(request.getTypeActivite());
        existingAffectation.setSalle(salle);
        
        Affectation savedAffectation = affectationRepository.save(existingAffectation);
        return convertToResponse(savedAffectation);
    }

    /**
     * Supprime une affectation
     */
    public void deleteAffectation(Integer id) {
        if (!affectationRepository.existsById(id)) {
            throw new RuntimeException("Affectation non trouvée avec l'ID: " + id);
        }
        affectationRepository.deleteById(id);
    }

    /**
     * Valide les données d'une requête d'affectation
     */
    private void validateAffectationRequest(AffectationRequest request) {
        // Validation de la date (pas de restriction sur les week-ends)
        if (request.getDate() == null) {
            throw new RuntimeException("La date est requise");
        }
        
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("La date ne peut pas être dans le passé");
        }
        
        // Validation des heures
        if (request.getHeureDebut() == null || request.getHeureFin() == null) {
            throw new RuntimeException("Les heures de début et de fin sont requises");
        }
        
        if (request.getHeureFin().isBefore(request.getHeureDebut()) || 
            request.getHeureFin().equals(request.getHeureDebut())) {
            throw new RuntimeException("L'heure de fin doit être postérieure à l'heure de début");
        }
        
        // Validation du type d'activité
        if (request.getTypeActivite() == null || request.getTypeActivite().trim().isEmpty()) {
            throw new RuntimeException("Le type d'activité est requis");
        }
        
        // Validation de l'ID de salle
        if (request.getIdSalle() == null) {
            throw new RuntimeException("L'ID de la salle est requis");
        }
    }

    /**
     * Convertit une entité Affectation en DTO de réponse
     */
    private AffectationResponse convertToResponse(Affectation affectation) {
        return new AffectationResponse(
                affectation.getIdaffectation(),
                affectation.getDate(),
                affectation.getHeuredebut(),
                affectation.getHeurefin(),
                affectation.getTypeactivite(),
                affectation.getSalle().getId(),
                affectation.getSalle().getNom(),
                affectation.getSalle().getType(),
                affectation.getSalle().getCapacite(),
                affectation.getStatus(),
                affectation.getRequesterId(),
                affectation.getRequestTime(),
                affectation.getApproverId(),
                affectation.getApprovalTime(),
                affectation.getRejectionReason()
        );
    }
} 