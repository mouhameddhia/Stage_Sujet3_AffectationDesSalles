package affectationsDesSalles.affectationDesSalles.dto;

import jakarta.validation.constraints.NotNull;

public class ApprovalRequest {
    
    @NotNull(message = "Le statut d'approbation est requis")
    private Boolean approved; // true for approve, false for reject
    
    private String approverId; // ID of the admin approving/rejecting
    
    private String approvalTime; // Timestamp of approval/rejection
    
    public ApprovalRequest() {}
    
    public ApprovalRequest(Boolean approved, String approverId, String approvalTime) {
        this.approved = approved;
        this.approverId = approverId;
        this.approvalTime = approvalTime;
    }
    
    public Boolean getApproved() {
        return approved;
    }
    
    public void setApproved(Boolean approved) {
        this.approved = approved;
    }
    
    public String getApproverId() {
        return approverId;
    }
    
    public void setApproverId(String approverId) {
        this.approverId = approverId;
    }
    
    public String getApprovalTime() {
        return approvalTime;
    }
    
    public void setApprovalTime(String approvalTime) {
        this.approvalTime = approvalTime;
    }
    
    /**
     * Helper method to get the action string for the service
     */
    public String getAction() {
        return Boolean.TRUE.equals(approved) ? "approve" : "reject";
    }
}
