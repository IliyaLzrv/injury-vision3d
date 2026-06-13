package com.injuryvision.auth;

import com.injuryvision.auth.dto.AuthResponse;
import com.injuryvision.auth.dto.LoginRequest;
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
	private final JwtService jwtService;

	public AuthService(
		UserRepository userRepository,
		PasswordEncoder passwordEncoder,
		JwtService jwtService
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
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
		String token = jwtService.generateToken(saved);

		return new AuthResponse("Registration successful", token, UserResponse.from(saved));
	}

	public AuthResponse login(LoginRequest request) {
		String email = request.getEmail().trim().toLowerCase();

		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new InvalidCredentialsException();
		}

		String token = jwtService.generateToken(user);

		return new AuthResponse("Login successful", token, UserResponse.from(user));
	}

	@Transactional(readOnly = true)
	public UserResponse getCurrentUser(String email) {
		User user = userRepository.findByEmail(email)
			.orElseThrow(InvalidCredentialsException::new);

		return UserResponse.from(user);
	}
}
