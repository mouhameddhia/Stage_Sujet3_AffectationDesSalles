import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateProfileForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      navigate('/login');
      return;
    }
    setForm({ username: user.username, email: user.email, password: user.password });
  }, [navigate]);

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
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
    // Update user in localStorage
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.email === JSON.parse(localStorage.getItem('currentUser')).email);
    if (idx !== -1) {
      users[idx] = { ...form };
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(form));
      setMessage('Profile updated successfully!');
    } else {
      setMessage('User not found.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Update Profile</h2>
      {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
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
        <button type="submit" className="btn btn-primary w-100">Update</button>
      </form>
      <div className="mt-3 text-center">
        <a href="/login">Logout</a>
      </div>
    </div>
  );
};

export default UpdateProfileForm; 