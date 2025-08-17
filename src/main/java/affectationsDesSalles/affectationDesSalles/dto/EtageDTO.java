package affectationsDesSalles.affectationDesSalles.dto;

public class EtageDTO {
    private Long id;
    private String numero;
    private Long blocId;
    private String blocNom;
    
    public EtageDTO() {}
    
    public EtageDTO(Long id, String numero, Long blocId, String blocNom) {
        this.id = id;
        this.numero = numero;
        this.blocId = blocId;
        this.blocNom = blocNom;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getNumero() {
        return numero;
    }
    
    public void setNumero(String numero) {
        this.numero = numero;
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
