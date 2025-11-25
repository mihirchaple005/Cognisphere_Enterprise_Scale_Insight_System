package com.example.databasemicroservice.contoller;


import com.example.databasemicroservice.dto.EmployeeDTO;
import com.example.databasemicroservice.model.Employee;
import com.example.databasemicroservice.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {"http://localhost:5000", "http://127.0.0.1:5000"})
public class DatabaseController {

    @Autowired
    private DatabaseService employeeService;

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "HR Microservice");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    // Save single employee
    @PostMapping
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody EmployeeDTO employeeDTO) {
        try {
            System.out.println("📥 Received employee: " + employeeDTO);
            Employee saved = employeeService.saveEmployee(employeeDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Employee created successfully");
            response.put("employee", saved);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("❌ Error creating employee: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Batch save employees (MOST IMPORTANT FOR YOUR SCRAPER)
    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> createEmployeesBatch(@RequestBody List<EmployeeDTO> employeeDTOs) {
        try {
            System.out.println("📥 Received batch of " + employeeDTOs.size() + " employees");
            List<Employee> saved = employeeService.saveEmployees(employeeDTOs);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Employees created successfully");
            response.put("count", saved.size());
            response.put("employees", saved);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            System.err.println("❌ Error in batch save: " + e.getMessage());
            e.printStackTrace();

            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get employee by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Employee> getEmployeeByEmail(@PathVariable String email) {
        Optional<Employee> employee = employeeService.getEmployeeByEmail(email);
        return employee.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Search employees by name
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String name) {
        List<Employee> employees = employeeService.searchEmployeesByName(name);
        return ResponseEntity.ok(employees);
    }

    // Get employees by department
    @GetMapping("/department/{department}")
    public ResponseEntity<List<Employee>> getEmployeesByDepartment(@PathVariable String department) {
        List<Employee> employees = employeeService.getEmployeesByDepartment(department);
        return ResponseEntity.ok(employees);
    }

    // Get employees with specific skill
    @GetMapping("/skill/{skillName}")
    public ResponseEntity<List<Employee>> getEmployeesWithSkill(@PathVariable String skillName) {
        List<Employee> employees = employeeService.getEmployeesWithSkill(skillName);
        return ResponseEntity.ok(employees);
    }

    // Get employees with proficiency above threshold
    @GetMapping("/proficiency/{minProficiency}")
    public ResponseEntity<List<Employee>> getEmployeesWithProficiency(@PathVariable Double minProficiency) {
        List<Employee> employees = employeeService.getEmployeesWithProficiencyAbove(minProficiency);
        return ResponseEntity.ok(employees);
    }

    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO) {
        try {
            Employee updated = employeeService.updateEmployee(id, employeeDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Employee deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete all employees (useful for testing)
    @DeleteMapping("/all")
    public ResponseEntity<Map<String, String>> deleteAllEmployees() {
        employeeService.deleteAllEmployees();
        Map<String, String> response = new HashMap<>();
        response.put("message", "All employees deleted");
        return ResponseEntity.ok(response);
    }

    // Get employee count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getEmployeeCount() {
        long count = employeeService.getEmployeeCount();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    // Count employees with specific skill
    @GetMapping("/skill/{skillName}/count")
    public ResponseEntity<Map<String, Long>> countEmployeesWithSkill(@PathVariable String skillName) {
        Long count = employeeService.countEmployeesWithSkill(skillName);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        response.put("skillName", 0L);
        return ResponseEntity.ok(response);
    }
}

