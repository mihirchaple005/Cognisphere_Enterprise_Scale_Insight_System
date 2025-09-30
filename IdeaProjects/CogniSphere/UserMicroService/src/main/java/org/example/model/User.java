package org.example.model;

import jakarta.persistence.*;

enum Status {
    ACTIVE,
    INACTIVE,
    BANNED
}

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String email;

    @Enumerated(EnumType.STRING)
    private Status status;
}
