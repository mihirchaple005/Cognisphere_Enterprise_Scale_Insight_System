package com.example.databasemicroservice.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("Skill")
public class Skill {

    @Id
    @GeneratedValue
    private Long id;

    private String skillName;
    private Double proficiency;

    // Constructors
    public Skill() {}

    public Skill(String skillName, Double proficiency) {
        this.skillName = skillName;
        this.proficiency = proficiency;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        return "Skill{" +
                "id=" + id +
                ", skillName='" + skillName + '\'' +
                ", proficiency=" + proficiency +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Skill skill = (Skill) o;
        return skillName != null && skillName.equals(skill.skillName);
    }

    @Override
    public int hashCode() {
        return skillName != null ? skillName.hashCode() : 0;
    }
}


