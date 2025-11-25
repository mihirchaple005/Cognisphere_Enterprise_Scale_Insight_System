package com.example.databasemicroservice.repository;

import com.example.databasemicroservice.model.Employee;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.ser.std.ToEmptyObjectSerializer;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends Neo4jRepository<Employee, Long> {

    // Find employee by email
    Optional<Employee> findByEmail(String email);

    // Find employees by name (case insensitive)
    List<Employee> findByNameContainingIgnoreCase(String name);

    // Find employees by department
    List<Employee> findByDepartment(String department);

    // Custom query: Find employees with a specific skill
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "WHERE s.skillName = $skillName " +
            "RETURN e")
    List<Employee> findEmployeesWithSkill(String skillName);

    // Custom query: Find employees with proficiency above threshold
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "WHERE s.proficiency >= $minProficiency " +
            "RETURN DISTINCT e")
    List<Employee> findEmployeesWithProficiencyAbove(Double minProficiency);

    // Custom query: Count employees with specific skill
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "WHERE s.skillName = $skillName " +
            "RETURN COUNT(e)")
    Long countEmployeesWithSkill(String skillName);

    // Custom query: Get all skills for an employee
    @Query("MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill) " +
            "WHERE e.email = $email " +
            "RETURN s")
    List<Object> findSkillsByEmployeeEmail(String email);
}

