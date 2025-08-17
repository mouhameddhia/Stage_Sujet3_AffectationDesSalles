package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.EtageDTO;
import affectationsDesSalles.affectationDesSalles.model.Bloc;
import affectationsDesSalles.affectationDesSalles.model.Etage;
import affectationsDesSalles.affectationDesSalles.repository.BlocRepository;
import affectationsDesSalles.affectationDesSalles.repository.EtageRepository;
import affectationsDesSalles.affectationDesSalles.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EtageServiceImpl implements EtageService {
    private static final Logger log = LoggerFactory.getLogger(EtageServiceImpl.class);
    
    @Autowired
    private EtageRepository etageRepository;
    
    @Autowired
    private BlocRepository blocRepository;
    
    @Override
    public List<EtageDTO> getAllEtages() {
        return etageRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<EtageDTO> getEtagesByBlocId(Long blocId) {
        return etageRepository.findByBlocId(blocId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<EtageDTO> getEtagesByBlocNom(String blocNom) {
        return etageRepository.findByBlocNom(blocNom).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public EtageDTO getEtageById(Long id) {
        Etage etage = etageRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Étage non trouvé avec l'ID: " + id));
        return convertToDTO(etage);
    }
    
    @Override
    @Transactional
    public EtageDTO createEtage(EtageDTO etageDTO) {
        Bloc bloc = blocRepository.findById(etageDTO.getBlocId())
                .orElseThrow(() -> new BadRequestException("Bloc non trouvé avec l'ID: " + etageDTO.getBlocId()));
        
        Etage etage = new Etage();
        etage.setNumero(etageDTO.getNumero());
        etage.setBloc(bloc);
        
        Etage savedEtage = etageRepository.saveAndFlush(etage);
        log.info("Etage persisted: id={}, numero={}, blocId={}", savedEtage.getId(), savedEtage.getNumero(), savedEtage.getBloc().getId());
        return convertToDTO(savedEtage);
    }
    
    @Override
    @Transactional
    public EtageDTO updateEtage(Long id, EtageDTO etageDTO) {
        Etage etage = etageRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Étage non trouvé avec l'ID: " + id));
        
        Bloc bloc = blocRepository.findById(etageDTO.getBlocId())
                .orElseThrow(() -> new BadRequestException("Bloc non trouvé avec l'ID: " + etageDTO.getBlocId()));
        
        etage.setNumero(etageDTO.getNumero());
        etage.setBloc(bloc);
        
        Etage updatedEtage = etageRepository.saveAndFlush(etage);
        log.info("Etage updated: id={}, numero={}, blocId={}", updatedEtage.getId(), updatedEtage.getNumero(), updatedEtage.getBloc().getId());
        return convertToDTO(updatedEtage);
    }
    
    @Override
    @Transactional
    public void deleteEtage(Long id) {
        if (!etageRepository.existsById(id)) {
            throw new BadRequestException("Étage non trouvé avec l'ID: " + id);
        }
        etageRepository.deleteById(id);
        log.info("Etage deleted: id={}", id);
    }
    
    private EtageDTO convertToDTO(Etage etage) {
        return new EtageDTO(
            etage.getId(),
            etage.getNumero(),
            etage.getBloc().getId(),
            etage.getBloc().getNom()
        );
    }
}
