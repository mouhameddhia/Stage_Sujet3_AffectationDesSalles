package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.dto.SalleDTO;
import affectationsDesSalles.affectationDesSalles.dto.CreateSalleRequest;
import affectationsDesSalles.affectationDesSalles.service.SalleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salles")
@CrossOrigin(origins = "*")
public class SalleController {
    private static final Logger logger = LoggerFactory.getLogger(SalleController.class);
    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }

    /**
     * GET /api/salles - Returns list of all rooms with hierarchical information
     */
    @GetMapping
    public List<SalleDTO> getAllSalles() {
        return salleService.getAllSallesWithHierarchy();
    }
    
    /**
     * GET /api/salles/without-etage - Returns list of rooms without etage assignment
     */
    @GetMapping("/without-etage")
    public ResponseEntity<List<SalleDTO>> getSallesWithoutEtage() {
        List<SalleDTO> salles = salleService.getSallesWithoutEtage();
        return ResponseEntity.ok(salles);
    }

    /**
     * GET /api/salles/{id} - Get salle by ID with hierarchical information
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalleDTO> getSalleById(@PathVariable Long id) {
        try {
            SalleDTO salleDTO = salleService.getSalleDTOById(id);
            return ResponseEntity.ok(salleDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/salles - Create new salle with hierarchical information
     */
    @PostMapping
    public ResponseEntity<SalleDTO> createSalle(@Valid @RequestBody CreateSalleRequest request) {
        logger.info("Creating Salle - payload: nom='{}', capacite={}, type='{}', etageId={}", 
                   request.getNom(), request.getCapacite(), request.getType(), request.getEtageId());
        SalleDTO createdSalle = salleService.createSalle(request);
        return ResponseEntity.ok(createdSalle);
    }

    /**
     * PUT /api/salles/{id} - Update salle
     */
    @PutMapping("/{id}")
    public ResponseEntity<Salle> updateSalle(@PathVariable Long id, @Valid @RequestBody Salle salleDetails) {
        logger.info("Updating Salle (ID: {}) - payload: nom='{}', capacite={}, type='{}'", id, salleDetails.getNom(), salleDetails.getCapacite(), salleDetails.getType());
        Optional<Salle> salleOptional = salleService.getSalleById(id);
        if (salleOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Salle salle = salleOptional.get();
        salle.setNom(salleDetails.getNom());
        salle.setCapacite(salleDetails.getCapacite());
        salle.setType(salleDetails.getType());
        return ResponseEntity.ok(salleService.saveSalle(salle));
    }

    /**
     * DELETE /api/salles/{id} - Delete salle
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalle(@PathVariable Long id) {
        if (!salleService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        salleService.deleteSalle(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * GET /api/salles/bloc/{blocId} - Get salles by bloc ID
     */
    @GetMapping("/bloc/{blocId}")
    public ResponseEntity<List<SalleDTO>> getSallesByBlocId(@PathVariable Long blocId) {
        List<SalleDTO> salles = salleService.getSallesByBlocId(blocId);
        return ResponseEntity.ok(salles);
    }
    
    /**
     * GET /api/salles/bloc-nom/{blocNom} - Get salles by bloc name
     */
    @GetMapping("/bloc-nom/{blocNom}")
    public ResponseEntity<List<SalleDTO>> getSallesByBlocNom(@PathVariable String blocNom) {
        List<SalleDTO> salles = salleService.getSallesByBlocNom(blocNom);
        return ResponseEntity.ok(salles);
    }
    
    /**
     * GET /api/salles/etage/{etageId} - Get salles by etage ID
     */
    @GetMapping("/etage/{etageId}")
    public ResponseEntity<List<SalleDTO>> getSallesByEtageId(@PathVariable Long etageId) {
        List<SalleDTO> salles = salleService.getSallesByEtageId(etageId);
        return ResponseEntity.ok(salles);
    }
    
    /**
     * GET /api/salles/bloc/{blocNom}/etage/{etageNumero} - Get salles by bloc and etage
     */
    @GetMapping("/bloc/{blocNom}/etage/{etageNumero}")
    public ResponseEntity<List<SalleDTO>> getSallesByBlocAndEtage(
            @PathVariable String blocNom, 
            @PathVariable String etageNumero) {
        List<SalleDTO> salles = salleService.getSallesByBlocAndEtage(blocNom, etageNumero);
        return ResponseEntity.ok(salles);
    }
} 