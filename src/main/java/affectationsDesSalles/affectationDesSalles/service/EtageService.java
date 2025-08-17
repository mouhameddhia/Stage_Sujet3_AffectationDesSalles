package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.EtageDTO;
import java.util.List;

public interface EtageService {
    List<EtageDTO> getAllEtages();
    List<EtageDTO> getEtagesByBlocId(Long blocId);
    List<EtageDTO> getEtagesByBlocNom(String blocNom);
    EtageDTO getEtageById(Long id);
    EtageDTO createEtage(EtageDTO etageDTO);
    EtageDTO updateEtage(Long id, EtageDTO etageDTO);
    void deleteEtage(Long id);
}
