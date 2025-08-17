package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.BlocDTO;
import affectationsDesSalles.affectationDesSalles.model.Bloc;
import affectationsDesSalles.affectationDesSalles.repository.BlocRepository;
import affectationsDesSalles.affectationDesSalles.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlocServiceImpl implements BlocService {
    private static final Logger log = LoggerFactory.getLogger(BlocServiceImpl.class);
    
    @Autowired
    private BlocRepository blocRepository;
    
    @Override
    public List<BlocDTO> getAllBlocs() {
        return blocRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public BlocDTO getBlocById(Long id) {
        Bloc bloc = blocRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Bloc non trouvé avec l'ID: " + id));
        return convertToDTO(bloc);
    }
    
    @Override
    @Transactional
    public BlocDTO createBloc(BlocDTO blocDTO) {
        if (blocRepository.existsByNom(blocDTO.getNom())) {
            throw new BadRequestException("Un bloc avec ce nom existe déjà: " + blocDTO.getNom());
        }
        
        Bloc bloc = new Bloc();
        bloc.setNom(blocDTO.getNom());
        
        Bloc savedBloc = blocRepository.saveAndFlush(bloc);
        log.info("Bloc persisted: id={}, nom={}", savedBloc.getId(), savedBloc.getNom());
        return convertToDTO(savedBloc);
    }
    
    @Override
    @Transactional
    public BlocDTO updateBloc(Long id, BlocDTO blocDTO) {
        Bloc bloc = blocRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Bloc non trouvé avec l'ID: " + id));
        
        // Check if the new name already exists for another bloc
        Bloc existingBloc = blocRepository.findByNom(blocDTO.getNom());
        if (existingBloc != null && !existingBloc.getId().equals(id)) {
            throw new BadRequestException("Un bloc avec ce nom existe déjà: " + blocDTO.getNom());
        }
        
        bloc.setNom(blocDTO.getNom());
        Bloc updatedBloc = blocRepository.saveAndFlush(bloc);
        log.info("Bloc updated: id={}, nom={}", updatedBloc.getId(), updatedBloc.getNom());
        return convertToDTO(updatedBloc);
    }
    
    @Override
    @Transactional
    public void deleteBloc(Long id) {
        if (!blocRepository.existsById(id)) {
            throw new BadRequestException("Bloc non trouvé avec l'ID: " + id);
        }
        blocRepository.deleteById(id);
        log.info("Bloc deleted: id={}", id);
    }
    
    private BlocDTO convertToDTO(Bloc bloc) {
        return new BlocDTO(bloc.getId(), bloc.getNom());
    }
}
