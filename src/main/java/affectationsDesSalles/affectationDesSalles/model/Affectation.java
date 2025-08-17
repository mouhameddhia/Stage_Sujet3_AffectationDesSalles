package affectationsDesSalles.affectationDesSalles.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "affectation")
public class Affectation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idaffectation")
    private Integer idaffectation;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "heuredebut")
    private LocalTime heuredebut;

    @Column(name = "heurefin")
    private LocalTime heurefin;

    @Column(name = "typeactivite", columnDefinition = "TEXT")
    private String typeactivite;

    @ManyToOne(optional = false)
    @JoinColumn(name = "idsalle")
    private Salle salle;
    
    @Column(name = "status", nullable = false)
    private String status = "pending";
    
    @Column(name = "requester_id")
    private String requesterId;
    
    @Column(name = "request_time")
    private LocalDateTime requestTime;
    
    @Column(name = "approver_id")
    private String approverId;
    
    @Column(name = "approval_time")
    private LocalDateTime approvalTime;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;

    public Affectation() {}

    public Affectation(LocalDate date, LocalTime heuredebut, LocalTime heurefin, String typeactivite, Salle salle) {
        this.date = date;
        this.heuredebut = heuredebut;
        this.heurefin = heurefin;
        this.typeactivite = typeactivite;
        this.salle = salle;
        this.status = "pending";
        this.requestTime = LocalDateTime.now();
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

    public Salle getSalle() {
        return salle;
    }

    public void setSalle(Salle salle) {
        this.salle = salle;
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