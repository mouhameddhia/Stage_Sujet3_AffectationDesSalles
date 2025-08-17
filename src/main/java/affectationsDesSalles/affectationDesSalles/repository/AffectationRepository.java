package affectationsDesSalles.affectationDesSalles.repository;

import affectationsDesSalles.affectationDesSalles.model.Affectation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AffectationRepository extends JpaRepository<Affectation, Integer> {
    
    /**
     * Trouve les affectations pour une salle donnée à une date donnée
     */
    List<Affectation> findBySalle_IdAndDate(Long salleId, LocalDate date);
    
    /**
     * Trouve les affectations qui ont des conflits horaires avec les paramètres donnés
     * (exclut l'affectation en cours de modification si idAffectation est fourni)
     */
    @Query("SELECT a FROM Affectation a WHERE a.salle.id = :salleId " +
           "AND a.date = :date " +
           "AND ((a.heuredebut < :heureFin AND a.heurefin > :heureDebut) " +
           "OR (a.heuredebut >= :heureDebut AND a.heuredebut < :heureFin) " +
           "OR (a.heurefin > :heureDebut AND a.heurefin <= :heureFin)) " +
           "AND (:idAffectation IS NULL OR a.idaffectation != :idAffectation) " +
           "AND a.status = 'approved'")
    List<Affectation> findConflictingAffectations(
        @Param("salleId") Long salleId,
        @Param("date") LocalDate date,
        @Param("heureDebut") LocalTime heureDebut,
        @Param("heureFin") LocalTime heureFin,
        @Param("idAffectation") Integer idAffectation
    );
    
    /**
     * Trouve toutes les affectations avec les informations de salle
     */
    @Query("SELECT a FROM Affectation a JOIN FETCH a.salle ORDER BY a.date, a.heuredebut")
    List<Affectation> findAllWithSalle();
    
    /**
     * Trouve toutes les affectations approuvées avec les informations de salle
     */
    @Query("SELECT a FROM Affectation a JOIN FETCH a.salle WHERE a.status = 'approved' ORDER BY a.date, a.heuredebut")
    List<Affectation> findAllApprovedWithSalle();
    
    /**
     * Trouve toutes les affectations en attente d'approbation
     */
    @Query("SELECT a FROM Affectation a JOIN FETCH a.salle WHERE a.status = 'pending' ORDER BY a.requestTime")
    List<Affectation> findAllPendingWithSalle();
    
    /**
     * Trouve les affectations en attente d'approbation pour un utilisateur spécifique
     */
    @Query("SELECT a FROM Affectation a JOIN FETCH a.salle WHERE a.status = 'pending' AND a.requesterId = :requesterId ORDER BY a.requestTime")
    List<Affectation> findPendingByRequesterId(@Param("requesterId") String requesterId);
    
    /**
     * Trouve les affectations par statut
     */
    List<Affectation> findByStatus(String status);
    
    /**
     * Trouve les affectations par requester ID et statut
     */
    List<Affectation> findByRequesterIdAndStatus(String requesterId, String status);
    
    /**
     * Vérifie l'existence d'au moins une affectation liée à une salle donnée
     */
    boolean existsBySalle_Id(Long salleId);
} 