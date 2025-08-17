package affectationsDesSalles.affectationDesSalles.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class AffectationResponse {
    private Integer idaffectation;
    private LocalDate date;
    private LocalTime heuredebut;
    private LocalTime heurefin;
    private String typeactivite;
    private Long idSalle;
    private String nomSalle;
    private String typeSalle;
    private Integer capaciteSalle;
    private String status;
    private String requesterId;
    private LocalDateTime requestTime;
    private String approverId;
    private LocalDateTime approvalTime;
    private String rejectionReason;

    public AffectationResponse() {}

    public AffectationResponse(Integer idaffectation, LocalDate date, LocalTime heuredebut, LocalTime heurefin, 
                             String typeactivite, Long idSalle, String nomSalle, String typeSalle, Integer capaciteSalle,
                             String status, String requesterId, LocalDateTime requestTime, String approverId, 
                             LocalDateTime approvalTime, String rejectionReason) {
        this.idaffectation = idaffectation;
        this.date = date;
        this.heuredebut = heuredebut;
        this.heurefin = heurefin;
        this.typeactivite = typeactivite;
        this.idSalle = idSalle;
        this.nomSalle = nomSalle;
        this.typeSalle = typeSalle;
        this.capaciteSalle = capaciteSalle;
        this.status = status;
        this.requesterId = requesterId;
        this.requestTime = requestTime;
        this.approverId = approverId;
        this.approvalTime = approvalTime;
        this.rejectionReason = rejectionReason;
    }

    public Integer getIdaffectation() {
        return idaffectation;
    }

    public void setIdaffectation(Integer idaffectation) {
        this.idaffectation = idaffectation;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getHeuredebut() {
        return heuredebut;
    }

    public void setHeuredebut(LocalTime heuredebut) {
        this.heuredebut = heuredebut;
    }

    public LocalTime getHeurefin() {
        return heurefin;
    }

    public void setHeurefin(LocalTime heurefin) {
        this.heurefin = heurefin;
    }

    public String getTypeactivite() {
        return typeactivite;
    }

    public void setTypeactivite(String typeactivite) {
        this.typeactivite = typeactivite;
    }

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

    public Integer getCapaciteSalle() {
        return capaciteSalle;
    }

    public void setCapaciteSalle(Integer capaciteSalle) {
        this.capaciteSalle = capaciteSalle;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getRequesterId() {
        return requesterId;
    }
    
    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }
    
    public LocalDateTime getRequestTime() {
        return requestTime;
    }
    
    public void setRequestTime(LocalDateTime requestTime) {
        this.requestTime = requestTime;
    }
    
    public String getApproverId() {
        return approverId;
    }
    
    public void setApproverId(String approverId) {
        this.approverId = approverId;
    }
    
    public LocalDateTime getApprovalTime() {
        return approvalTime;
    }
    
    public void setApprovalTime(LocalDateTime approvalTime) {
        this.approvalTime = approvalTime;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
} 