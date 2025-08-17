package affectationsDesSalles.affectationDesSalles.service;

import affectationsDesSalles.affectationDesSalles.dto.BlocDTO;
import java.util.List;

public interface BlocService {
    List<BlocDTO> getAllBlocs();
    BlocDTO getBlocById(Long id);
    BlocDTO createBloc(BlocDTO blocDTO);
    BlocDTO updateBloc(Long id, BlocDTO blocDTO);
    void deleteBloc(Long id);
}
