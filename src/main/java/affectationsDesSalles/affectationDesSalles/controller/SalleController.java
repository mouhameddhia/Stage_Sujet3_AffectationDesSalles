package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.model.Salle;
import affectationsDesSalles.affectationDesSalles.service.SalleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salles")
public class SalleController {
    private final SalleService salleService;

    public SalleController(SalleService salleService) {
        this.salleService = salleService;
    }

    @GetMapping("/test")
    public String testConnection() {
        return "Database connection test - Salle controller is working!";
    }

    @GetMapping
    public List<Salle> getAllSalles() {
        return salleService.getAllSalles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Salle> getSalleById(@PathVariable Long id) {
        Optional<Salle> salle = salleService.getSalleById(id);
        return salle.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Salle createSalle(@RequestBody Salle salle) {
        return salleService.saveSalle(salle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Salle> updateSalle(@PathVariable Long id, @RequestBody Salle salleDetails) {
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalle(@PathVariable Long id) {
        if (salleService.getSalleById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        salleService.deleteSalle(id);
        return ResponseEntity.noContent().build();
    }
} 