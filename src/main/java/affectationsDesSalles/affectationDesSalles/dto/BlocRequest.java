package affectationsDesSalles.affectationDesSalles.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public class BlocRequest {
    @JsonAlias({"nom", "name"})
    public String nom;
}


