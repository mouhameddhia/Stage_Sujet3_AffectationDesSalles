import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    // Simulate saving to localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === form.email)) {
      setMessage('Email already registered.');
      return;
    }
    users.push({ username: form.username, email: form.email, password: form.password });
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Sign up successful! Redirecting to login...');
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Sign Up</h2>
      {message && <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className={`form-control${errors.username ? ' is-invalid' : ''}`} name="username" value={form.username} onChange={handleChange} />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className={`form-control${errors.email ? ' is-invalid' : ''}`} name="email" value={form.email} onChange={handleChange} />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className={`form-control${errors.password ? ' is-invalid' : ''}`} name="password" value={form.password} onChange={handleChange} />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input type="password" className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
      <div className="mt-3 text-center">
        Already have an account? <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default SignUpForm; 