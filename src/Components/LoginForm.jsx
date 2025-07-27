import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
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
    // Simulate checking credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === form.email && u.password === form.password);
    if (!user) {
      setMessage('Invalid email or password.');
      return;
    }
    // Simulate storing a token
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('currentUser', JSON.stringify(user));
    setMessage('Login successful! Redirecting...');
    setTimeout(() => navigate('/update-profile'), 1200);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Login</h2>
      {message && <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
      <form onSubmit={handleSubmit} noValidate>
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
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      <div className="mt-3 text-center">
        Don't have an account? <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
};

export default LoginForm; 