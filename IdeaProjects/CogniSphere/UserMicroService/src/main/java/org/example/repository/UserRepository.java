package org.example.repository;


public interface UserRepository extends Repository<User, Long> {
    User findByUsername(String username);
}