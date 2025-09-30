package org.example.dto;


import org.antlr.v4.runtime.misc.NotNull;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserResponseDto {
    Long id;
    String username;
    String email;
    String status;
}