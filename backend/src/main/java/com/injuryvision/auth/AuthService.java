package com.injuryvision.auth;

import com.injuryvision.auth.dto.AuthResponse;
import com.injuryvision.auth.dto.RegisterRequest;
import com.injuryvision.auth.dto.UserResponse;
import com.injuryvision.common.UserRole;
import com.injuryvision.user.User;
import com.injuryvision.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		String email = request.getEmail().trim().toLowerCase();

		if (userRepository.existsByEmail(email)) {
			throw new DuplicateEmailException("Email is already registered");
		}

		User user = new User();
		user.setFullName(request.getFullName().trim());
		user.setEmail(email);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(UserRole.ATHLETE);

		User saved = userRepository.save(user);

		return new AuthResponse("Registration successful", UserResponse.from(saved));
	}
}
