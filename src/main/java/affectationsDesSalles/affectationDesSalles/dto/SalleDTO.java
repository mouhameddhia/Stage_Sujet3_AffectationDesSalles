package affectationsDesSalles.affectationDesSalles.dto;

public class SalleDTO {
    private Long idSalle;
    private String nomSalle;
    private String typeSalle;
    private Integer capacite;
    private Long etageId;
    private String etageNumero;
    private Long blocId;
    private String blocNom;
    
    // Constructors
    public SalleDTO() {}
    
    public SalleDTO(Long idSalle, String nomSalle, String typeSalle, Integer capacite) {
        this.idSalle = idSalle;
        this.nomSalle = nomSalle;
        this.typeSalle = typeSalle;
        this.capacite = capacite;
    }
    
    public SalleDTO(Long idSalle, String nomSalle, String typeSalle, Integer capacite, 
                    Long etageId, String etageNumero, Long blocId, String blocNom) {
        this.idSalle = idSalle;
        this.nomSalle = nomSalle;
        this.typeSalle = typeSalle;
        this.capacite = capacite;
        this.etageId = etageId;
        this.etageNumero = etageNumero;
        this.blocId = blocId;
        this.blocNom = blocNom;
    }
    
    // Getters and Setters
    public Long getIdSalle() {
        return idSalle;
    }
    
    public void setIdSalle(Long idSalle) {
        this.idSalle = idSalle;
    }
    
    public String getNomSalle() {
        return nomSalle;
    }
    
    public void setNomSalle(String nomSalle) {
        this.nomSalle = nomSalle;
    }
    
    public String getTypeSalle() {
        return typeSalle;
    }
    
    public void setTypeSalle(String typeSalle) {
        this.typeSalle = typeSalle;
    }
    
    public Integer getCapacite() {
        return capacite;
    }
    
    public void setCapacite(Integer capacite) {
        this.capacite = capacite;
    }
    
    public Long getEtageId() {
        return etageId;
    }
    
    public void setEtageId(Long etageId) {
        this.etageId = etageId;
    }
    
    public String getEtageNumero() {
        return etageNumero;
    }
    
    public void setEtageNumero(String etageNumero) {
        this.etageNumero = etageNumero;
    }
    
    public Long getBlocId() {
        return blocId;
    }
    
    public void setBlocId(Long blocId) {
        this.blocId = blocId;
    }
    
    public String getBlocNom() {
        return blocNom;
    }
    
    public void setBlocNom(String blocNom) {
        this.blocNom = blocNom;
    }
}
