package com.example.databasemicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
@EnableNeo4jRepositories
public class DatabaseMicroserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatabaseMicroserviceApplication.class, args);
        System.out.println("🚀 HR Microservice Started Successfully!");
        System.out.println("📡 API available at: http://localhost:8080");
        System.out.println("🗄️ Neo4j connection: bolt://localhost:7687");
    }

}
