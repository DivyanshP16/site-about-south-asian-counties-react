function validateSignup(formData) {
  const errors = {};

  if (!formData.username.trim()) {
    errors.username = 'Username is required.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!formData.password) {
    errors.password = 'Password is required.';
  } else if (!isStrongPassword(formData.password)) {
    errors.password =
      'Password must be 8+ characters with uppercase, lowercase, number, and special character.';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!formData.dob) {
    errors.dob = 'Date of Birth is required.';
  } else if (new Date(formData.dob) > new Date()) {
    errors.dob = 'Date cannot be in the future.';
  }

  if (!formData.gender) {
    errors.gender = 'Please select your gender.';
  }

  return errors;
}

function validateFeedback(formData) {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = 'Name is required.';
  }

  if (!formData.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Enter a valid email.';
  }

  if (!formData.country) {
    errors.country = 'Please select a country.';
  }

  if (!formData.message.trim()) {
    errors.message = 'Message cannot be empty.';
  }

  return errors;
}

function isStrongPassword(password) {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

export { validateSignup, validateFeedback, isStrongPassword };