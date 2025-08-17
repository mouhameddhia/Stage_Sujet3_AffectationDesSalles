package affectationsDesSalles.affectationDesSalles.controller;

import affectationsDesSalles.affectationDesSalles.dto.BlocDTO;
import affectationsDesSalles.affectationDesSalles.dto.BlocRequest;
import affectationsDesSalles.affectationDesSalles.model.Bloc;
import affectationsDesSalles.affectationDesSalles.service.BlocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/blocs")
@CrossOrigin(origins = "*")
public class BlocController {
    
    @Autowired
    private BlocService blocService;
    
    @GetMapping
    public ResponseEntity<List<BlocDTO>> getAllBlocs() {
        List<BlocDTO> blocs = blocService.getAllBlocs();
        return ResponseEntity.ok(blocs);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BlocDTO> getBlocById(@PathVariable Long id) {
        BlocDTO bloc = blocService.getBlocById(id);
        return ResponseEntity.ok(bloc);
    }
    
    @PostMapping
    public ResponseEntity<?> createBloc(@RequestBody BlocRequest request) {
        String nom = request.nom == null ? null : request.nom.trim();
        if (nom == null || nom.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le champ 'nom' est requis"));
        }
        BlocDTO created = blocService.createBloc(new BlocDTO(null, nom));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<BlocDTO> updateBloc(@PathVariable Long id, @Valid @RequestBody BlocDTO blocDTO) {
        BlocDTO updatedBloc = blocService.updateBloc(id, blocDTO);
        return ResponseEntity.ok(updatedBloc);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBloc(@PathVariable Long id) {
        blocService.deleteBloc(id);
        return ResponseEntity.noContent().build();
    }
}
