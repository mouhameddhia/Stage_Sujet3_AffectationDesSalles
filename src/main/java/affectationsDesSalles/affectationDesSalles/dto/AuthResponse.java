package affectationsDesSalles.affectationDesSalles.dto;

public class AuthResponse {
    private String token;
    private String nom;
    private String email;
    private String role;
    private Integer idUser;

    public AuthResponse() {}

    public AuthResponse(String token, String nom, String email, String role, Integer idUser) {
        this.token = token;
        this.nom = nom;
        this.email = email;
        this.role = role;
        this.idUser = idUser;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getIdUser() {
        return idUser;
    }

    public void setIdUser(Integer idUser) {
        this.idUser = idUser;
    }
} 