package com.example.databasemicroservice.service;


import com.example.databasemicroservice.dto.EmployeeDTO;
import com.example.databasemicroservice.dto.SkillDTO;
import com.example.databasemicroservice.model.Employee;
import com.example.databasemicroservice.model.Skill;
import com.example.databasemicroservice.repository.EmployeeRepository;
import com.example.databasemicroservice.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DatabaseService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SkillRepository skillRepository;

    // Save single employee
    public Employee saveEmployee(EmployeeDTO dto) {
        System.out.println("💾 Saving employee: " + dto.getName());

        // Create employee entity
        Employee employee = new Employee();
        employee.setName(dto.getName());
        employee.setEmail(dto.getEmail());
        employee.setDepartment(dto.getDepartment());
        employee.setPosition(dto.getPosition());

        // Create and add skills
        if (dto.getSkills() != null && !dto.getSkills().isEmpty()) {
            for (SkillDTO skillDTO : dto.getSkills()) {
                Skill skill = new Skill();
                skill.setSkillName(skillDTO.getSkillName());
                skill.setProficiency(skillDTO.getProficiency());
                employee.addSkill(skill);
            }
        }

        Employee saved = employeeRepository.save(employee);
        System.out.println("✅ Saved: " + saved.getName() + " with " + saved.getSkills().size() + " skills");
        return saved;
    }

    // Save multiple employees (batch)
    public List<Employee> saveEmployees(List<EmployeeDTO> employeeDTOs) {
        System.out.println("🔄 Batch saving " + employeeDTOs.size() + " employees...");

        return employeeDTOs.stream()
                .map(this::saveEmployee)
                .collect(Collectors.toList());
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // Get employee by email
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }

    // Search employees by name
    public List<Employee> searchEmployeesByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }

    // Get employees by department
    public List<Employee> getEmployeesByDepartment(String department) {
        return employeeRepository.findByDepartment(department);
    }

    // Get employees with specific skill
    public List<Employee> getEmployeesWithSkill(String skillName) {
        return employeeRepository.findEmployeesWithSkill(skillName);
    }

    // Get employees with proficiency above threshold
    public List<Employee> getEmployeesWithProficiencyAbove(Double minProficiency) {
        return employeeRepository.findEmployeesWithProficiencyAbove(minProficiency);
    }

    // Update employee
    public Employee updateEmployee(Long id, EmployeeDTO dto) {
        Optional<Employee> existing = employeeRepository.findById(id);
        if (existing.isPresent()) {
            Employee employee = existing.get();
            employee.setName(dto.getName());
            employee.setEmail(dto.getEmail());
            employee.setDepartment(dto.getDepartment());
            employee.setPosition(dto.getPosition());

            // Update skills
            if (dto.getSkills() != null) {
                employee.setSkills(new HashSet<>());
                for (SkillDTO skillDTO : dto.getSkills()) {
                    Skill skill = new Skill();
                    skill.setSkillName(skillDTO.getSkillName());
                    skill.setProficiency(skillDTO.getProficiency());
                    employee.addSkill(skill);
                }
            }

            return employeeRepository.save(employee);
        }
        throw new RuntimeException("Employee not found with id: " + id);
    }

    // Delete employee
    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    // Delete all employees
    public void deleteAllEmployees() {
        employeeRepository.deleteAll();
    }

    // Get employee count
    public long getEmployeeCount() {
        return employeeRepository.count();
    }

    // Count employees with specific skill
    public Long countEmployeesWithSkill(String skillName) {
        return employeeRepository.countEmployeesWithSkill(skillName);
    }
}

