## backend folder

backend/
└── src/
└── main/
└── java/
└── com/
└── expense/
└── backend/
├── config/
│ ├── DataInitializer.java # Creates admin + role on startup
│ └── SecurityConfig.java # Spring Security + JWT setup
│
├── controller/
│ └── AuthController.java # /api/auth/login endpoint
│
├── model/
│ ├── Role.java # Role entity (ROLE_ADMIN etc.)
│ └── User.java # User entity (with roles)
│
├── repository/
│ ├── RoleRepository.java # Role JPA repo
│ └── UserRepository.java # User JPA repo
│
├── security/
│ ├── JwtAuthEntryPoint.java # Handles unauthorized access (401)
│ ├── JwtAuthFilter.java # Extracts + validates token on requests
│ ├── JwtUtils.java # Token generation + validation
│ └── UserDetailsServiceImpl.java# Loads user + roles for auth
│
└── BackendApplication.java # Spring Boot main class

        └── resources/
            ├── application.properties                    # DB + JWT config
            ├── static/
            └── templates/

        └── test/
