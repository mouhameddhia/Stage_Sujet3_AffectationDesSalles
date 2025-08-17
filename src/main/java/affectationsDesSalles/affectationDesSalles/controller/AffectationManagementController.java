package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.dto.AffectationRequest;
import affectationsDesSalles.affectationDesSalles.dto.AffectationResponse;
import affectationsDesSalles.affectationDesSalles.dto.ApprovalRequest;
import affectationsDesSalles.affectationDesSalles.service.AffectationManagementService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/affectations")
@CrossOrigin(origins = "*")
public class AffectationManagementController {

    private static final Logger logger = LoggerFactory.getLogger(AffectationManagementController.class);
    
    private final AffectationManagementService affectationManagementService;

    public AffectationManagementController(AffectationManagementService affectationManagementService) {
        this.affectationManagementService = affectationManagementService;
    }

    /**
     * GET /api/affectations/test - Test endpoint pour vérifier l'accès admin
     */
    @GetMapping("/test")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> testAdminAccess() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Test admin - Utilisateur actuel: " + authentication.getName() + 
                               ", Rôles: " + authentication.getAuthorities());
    }

    /**
     * GET /api/affectations - Récupérer toutes les affectations approuvées (pour affichage calendrier)
     * Accessible à tous les utilisateurs authentifiés
     */
    @GetMapping
    public ResponseEntity<List<AffectationResponse>> getAllApprovedAffectations() {
        try {
            List<AffectationResponse> affectations = affectationManagementService.getAllApprovedAffectations();
            return ResponseEntity.ok(affectations);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des affectations approuvées: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * GET /api/affectations/pending - Récupérer toutes les affectations en attente d'approbation
     * Accessible uniquement aux administrateurs
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AffectationResponse>> getAllPendingAffectations() {
        try {
            List<AffectationResponse> pendingAffectations = affectationManagementService.getAllPendingAffectations();
            return ResponseEntity.ok(pendingAffectations);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des affectations en attente: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * GET /api/affectations/my-pending - Récupérer les affectations en attente de l'utilisateur connecté
     * Accessible à tous les utilisateurs authentifiés
     */
    @GetMapping("/my-pending")
    public ResponseEntity<List<AffectationResponse>> getMyPendingAffectations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String requesterId = authentication.getName();
            
            List<AffectationResponse> myPendingAffectations = affectationManagementService.getPendingAffectationsByUser(requesterId);
            return ResponseEntity.ok(myPendingAffectations);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des affectations en attente de l'utilisateur: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/affectations/{id} - Récupérer une affectation par ID
     * Accessible à tous les utilisateurs authentifiés
     */
    @GetMapping("/{id}")
    public ResponseEntity<AffectationResponse> getAffectationById(@PathVariable Integer id) {
        try {
            Optional<AffectationResponse> affectation = affectationManagementService.getAffectationById(id);
            return affectation.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération de l'affectation {}: {}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * POST /api/affectations - Créer une nouvelle affectation
     * Accessible à tous les utilisateurs authentifiés
     */
    @PostMapping
    public ResponseEntity<?> createAffectation(@Valid @RequestBody AffectationRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String requesterId = authentication.getName();
            String userRole = getCurrentUserRole(authentication);
            
            logger.info("Création d'affectation - Utilisateur: {}, Rôle: {}, Données: date={}, heureDebut={}, heureFin={}, typeActivite={}, idSalle={}", 
                requesterId, userRole, request.getDate(), request.getHeureDebut(), request.getHeureFin(), 
                request.getTypeActivite(), request.getIdSalle());
            
            AffectationResponse response = affectationManagementService.createAffectation(request, requesterId, userRole);
            
            String statusMessage = "approved".equals(response.getStatus()) ? 
                "Affectation créée et approuvée avec succès" : 
                "Affectation créée et en attente d'approbation";
            
            logger.info("Affectation créée avec succès - ID: {}, Statut: {}", response.getIdaffectation(), response.getStatus());
            
            return ResponseEntity.ok(Map.of(
                "affectation", response,
                "message", statusMessage,
                "status", response.getStatus()
            ));
            
        } catch (RuntimeException e) {
            logger.error("Erreur de validation lors de la création d'affectation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la création d'affectation", e);
            return ResponseEntity.internalServerError().body("Erreur lors de la création de l'affectation");
        }
    }
    
    /**
     * POST /api/affectations/{id}/approve - Approuver ou rejeter une affectation
     * Accessible uniquement aux administrateurs
     */
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveOrRejectAffectation(
            @PathVariable Integer id, 
            @Valid @RequestBody ApprovalRequest approvalRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String approverId = authentication.getName();
            
            logger.info("Action d'approbation - Affectation: {}, Approuvé: {}, Approver: {}", 
                id, approvalRequest.getApproved(), approverId);
            
            AffectationResponse response = affectationManagementService.approveOrRejectAffectation(
                id, 
                approvalRequest.getAction(), 
                approverId, 
                null // No rejection reason needed for this simple approval flow
            );
            
            String actionMessage = Boolean.TRUE.equals(approvalRequest.getApproved()) ? 
                "Affectation approuvée avec succès" : 
                "Affectation rejetée avec succès";
            
            logger.info("Action d'approbation terminée - Affectation: {}, Nouveau statut: {}", 
                id, response.getStatus());
            
            return ResponseEntity.ok(Map.of(
                "affectation", response,
                "message", actionMessage,
                "status", response.getStatus()
            ));
            
        } catch (RuntimeException e) {
            logger.error("Erreur lors de l'action d'approbation pour l'affectation {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de l'action d'approbation", e);
            return ResponseEntity.internalServerError().body("Erreur lors de l'action d'approbation");
        }
    }

    /**
     * PUT /api/affectations/{id} - Modifier une affectation existante
     * Accessible uniquement aux administrateurs
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAffectation(@PathVariable Integer id, @Valid @RequestBody AffectationRequest request) {
        try {
            logger.info("Modification d'affectation - ID: {}, Données: date={}, heureDebut={}, heureFin={}, typeActivite={}, idSalle={}", 
                id, request.getDate(), request.getHeureDebut(), request.getHeureFin(), 
                request.getTypeActivite(), request.getIdSalle());
            
            AffectationResponse response = affectationManagementService.updateAffectation(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Erreur lors de la modification de l'affectation {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la modification de l'affectation", e);
            return ResponseEntity.internalServerError().body("Erreur lors de la modification de l'affectation");
        }
    }

    /**
     * DELETE /api/affectations/{id} - Supprimer une affectation
     * Accessible uniquement aux administrateurs
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAffectation(@PathVariable Integer id) {
        try {
            logger.info("Suppression d'affectation - ID: {}", id);
            affectationManagementService.deleteAffectation(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Erreur lors de la suppression de l'affectation {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Erreur inattendue lors de la suppression de l'affectation", e);
            return ResponseEntity.internalServerError().body("Erreur lors de la suppression de l'affectation");
        }
    }
    
    /**
     * Méthode utilitaire pour obtenir le rôle de l'utilisateur actuel
     */
    private String getCurrentUserRole(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN")) ? "ADMIN" : "USER";
    }
} 