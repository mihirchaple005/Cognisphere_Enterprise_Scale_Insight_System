package com.example.databasemicroservice.repository;

import com.example.databasemicroservice.model.Skill;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends Neo4jRepository<Skill, Long> {

    // Find skill by name
    Optional<Skill> findBySkillName(String skillName);

    // Find all skills with name containing search term
    List<Skill> findBySkillNameContainingIgnoreCase(String searchTerm);

    // Custom query: Get top N most common skills
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "RETURN s.skillName AS skillName, COUNT(e) AS employeeCount " +
            "ORDER BY employeeCount DESC " +
            "LIMIT $limit")
    List<Object> findTopSkills(int limit);

    // Custom query: Get average proficiency for a skill
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "WHERE s.skillName = $skillName " +
            "RETURN AVG(s.proficiency)")
    Double getAverageProficiency(String skillName);
}
