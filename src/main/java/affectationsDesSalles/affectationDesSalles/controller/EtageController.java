package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.dto.EtageDTO;
import affectationsDesSalles.affectationDesSalles.service.EtageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/etages")
@CrossOrigin(origins = "*")
public class EtageController {
    
    @Autowired
    private EtageService etageService;
    
    @GetMapping
    public ResponseEntity<List<EtageDTO>> getAllEtages() {
        List<EtageDTO> etages = etageService.getAllEtages();
        return ResponseEntity.ok(etages);
    }
    
    @GetMapping("/bloc/{blocId}")
    public ResponseEntity<List<EtageDTO>> getEtagesByBlocId(@PathVariable Long blocId) {
        List<EtageDTO> etages = etageService.getEtagesByBlocId(blocId);
        return ResponseEntity.ok(etages);
    }
    
    @GetMapping("/bloc-nom/{blocNom}")
    public ResponseEntity<List<EtageDTO>> getEtagesByBlocNom(@PathVariable String blocNom) {
        List<EtageDTO> etages = etageService.getEtagesByBlocNom(blocNom);
        return ResponseEntity.ok(etages);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<EtageDTO> getEtageById(@PathVariable Long id) {
        EtageDTO etage = etageService.getEtageById(id);
        return ResponseEntity.ok(etage);
    }
    
    @PostMapping
    public ResponseEntity<EtageDTO> createEtage(@Valid @RequestBody EtageDTO etageDTO) {
        EtageDTO createdEtage = etageService.createEtage(etageDTO);
        return ResponseEntity.ok(createdEtage);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<EtageDTO> updateEtage(@PathVariable Long id, @Valid @RequestBody EtageDTO etageDTO) {
        EtageDTO updatedEtage = etageService.updateEtage(id, etageDTO);
        return ResponseEntity.ok(updatedEtage);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtage(@PathVariable Long id) {
        etageService.deleteEtage(id);
        return ResponseEntity.noContent().build();
    }
}
