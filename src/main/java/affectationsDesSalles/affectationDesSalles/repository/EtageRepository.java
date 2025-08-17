package affectationsDesSalles.affectationDesSalles.repository;

import affectationsDesSalles.affectationDesSalles.model.Etage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EtageRepository extends JpaRepository<Etage, Long> {
    List<Etage> findByBlocId(Long blocId);
    List<Etage> findByBlocNom(String blocNom);
}
