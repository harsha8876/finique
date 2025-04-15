import React, { useState, useEffect } from 'react';
import './Recharge.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const Recharge = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    circle: '',
    amount: '',
    plan: 'custom'
  });

  const [status, setStatus] = useState('');
  const [balance, setBalance] = useState(0);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const storedEmail = Cookies.get('email');
    const storedFirstName = Cookies.get('firstName');
    const storedBalance = Cookies.get('balance');

    if (storedEmail && storedFirstName && storedBalance !== undefined) {
      setEmail(storedEmail);
      setFirstName(storedFirstName);
      setBalance(parseFloat(storedBalance));
    } else {
      setStatus('User not logged in or missing data.');
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');

    const { mobileNumber, operator, circle, amount } = formData;

    if (!mobileNumber || !operator || !circle || !amount || isNaN(amount)) {
      setStatus('Please fill in all fields with valid data.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/recharge/process', {
        email,
        amount: parseFloat(amount),
        mobileNumber,
        operator,
        circle
      }, {
        withCredentials: true // ✅ This is crucial to send cookies with the request
      });

      if (response.data && response.data.success) {
        const newBalance = response.data.newBalance;
        setBalance(newBalance);
        Cookies.set('balance', newBalance, { expires: 7, path: '/', secure: true, sameSite: 'None' });
        setStatus('Recharge successful!');
        setFormData({ mobileNumber: '', operator: '', circle: '', amount: '', plan: 'custom' });
      } else {
        setStatus(response.data.message || 'Recharge failed.');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      setStatus(error.response?.data?.error || 'Recharge request failed.');
    }
  };

  const operators = [
    { id: 'jio', name: 'Reliance Jio' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'vi', name: 'Vi (Vodafone Idea)' },
    { id: 'bsnl', name: 'BSNL' },
    { id: 'mtnl', name: 'MTNL' }
  ];

  const circles = [
    { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'maharashtra', name: 'Maharashtra & Goa' },
    { id: 'tamil-nadu', name: 'Tamil Nadu' },
    { id: 'west-bengal', name: 'West Bengal' }
    // ... Add more as needed
  ];

  return (
    <div className="recharge-container">
      <h1>Welcome, {firstName}!</h1>
      <p>Current Balance: ₹{balance.toFixed(2)}</p>

      <form onSubmit={handleSubmit} className="recharge-form">
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter 10 digit mobile number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="operator">Select Operator</label>
          <select name="operator" value={formData.operator} onChange={handleInputChange} required>
            <option value="">Select your operator</option>
            {operators.map(op => (
              <option key={op.id} value={op.id}>{op.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="circle">Select Circle</label>
          <select name="circle" value={formData.circle} onChange={handleInputChange} required>
            <option value="">Select your circle</option>
            {circles.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="plan">Plan Type</label>
          <select name="plan" value={formData.plan} onChange={handleInputChange}>
            <option value="custom">Custom Amount</option>
            <option value="plans">Select from Plans</option>
          </select>
        </div>

        {formData.plan === 'custom' ? (
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter recharge amount"
              min="10"
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="planSelect">Select Plan</label>
            <select name="amount" onChange={handleInputChange} required>
              <option value="">Select a plan</option>
              <option value="149">₹149 - 1GB/day, 28 days</option>
              <option value="199">₹199 - 1.5GB/day, 28 days</option>
              <option value="249">₹249 - 2GB/day, 28 days</option>
              <option value="299">₹299 - 2.5GB/day, 28 days</option>
              <option value="399">₹399 - 3GB/day, 56 days</option>
              <option value="499">₹499 - 2GB/day, 84 days</option>
            </select>
          </div>
        )}

        <button type="submit" className="submit-btn">Proceed to Recharge</button>
      </form>

      {status && (
        <p style={{ color: status.includes('success') ? 'green' : 'red' }}>{status}</p>
      )}
    </div>
  );
};

export default Recharge;
