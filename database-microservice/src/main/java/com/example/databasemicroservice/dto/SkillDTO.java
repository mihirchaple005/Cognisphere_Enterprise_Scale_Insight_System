package com.example.databasemicroservice.dto;

public class SkillDTO {

    private String skillName;
    private Double proficiency;

    // Constructors
    public SkillDTO() {}

    public SkillDTO(String skillName, Double proficiency) {
        this.skillName = skillName;
        this.proficiency = proficiency;
    }

    // Getters and Setters
    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Double getProficiency() {
        return proficiency;
    }

    public void setProficiency(Double proficiency) {
        this.proficiency = proficiency;
    }

    @Override
    public String toString() {
        return "SkillDTO{" +
                "skillName='" + skillName + '\'' +
                ", proficiency=" + proficiency +
                '}';
    }
}
