import React, { useState } from 'react';
import './Recharge.css'; // You'll create this CSS file separately

const Recharge = () => {
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    circle: '',
    amount: '',
    plan: 'custom'
  });

  const operators = [
    { id: 'jio', name: 'Reliance Jio' },
    { id: 'airtel', name: 'Airtel' },
    { id: 'vi', name: 'Vi (Vodafone Idea)' },
    { id: 'bsnl', name: 'BSNL' },
    { id: 'mtnl', name: 'MTNL' }
  ];

  const circles = [
    { id: 'andhra-pradesh', name: 'Andhra Pradesh' },
    { id: 'assam', name: 'Assam' },
    { id: 'bihar', name: 'Bihar & Jharkhand' },
    { id: 'delhi', name: 'Delhi NCR' },
    { id: 'gujarat', name: 'Gujarat' },
    { id: 'haryana', name: 'Haryana' },
    { id: 'himachal-pradesh', name: 'Himachal Pradesh' },
    { id: 'jammu-kashmir', name: 'Jammu & Kashmir' },
    { id: 'karnataka', name: 'Karnataka' },
    { id: 'kerala', name: 'Kerala' },
    { id: 'kolkata', name: 'Kolkata' },
    { id: 'maharashtra', name: 'Maharashtra & Goa' },
    { id: 'madhya-pradesh', name: 'Madhya Pradesh & Chhattisgarh' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'northeast', name: 'North East' },
    { id: 'orissa', name: 'Orissa' },
    { id: 'punjab', name: 'Punjab' },
    { id: 'rajasthan', name: 'Rajasthan' },
    { id: 'tamil-nadu', name: 'Tamil Nadu' },
    { id: 'up-east', name: 'UP East' },
    { id: 'up-west', name: 'UP West' },
    { id: 'west-bengal', name: 'West Bengal' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recharge details:', formData);
    // Here you would typically call an API to process the recharge
    alert('Recharge initiated successfully!');
  };

  return (
    <div className="recharge-container">
      <h1>Mobile Recharge</h1>
      <form onSubmit={handleSubmit} className="recharge-form">
        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
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
          <select
            id="operator"
            name="operator"
            value={formData.operator}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your operator</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="circle">Select Circle</label>
          <select
            id="circle"
            name="circle"
            value={formData.circle}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your circle</option>
            {circles.map((circle) => (
              <option key={circle.id} value={circle.id}>
                {circle.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="plan">Plan Type</label>
          <select
            id="plan"
            name="plan"
            value={formData.plan}
            onChange={handleInputChange}
          >
            <option value="custom">Custom Amount</option>
            <option value="plans">Select from Plans</option>
          </select>
        </div>

        {formData.plan === 'custom' ? (
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              id="amount"
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
            <select id="planSelect" name="amount" onChange={handleInputChange} required>
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
    </div>
  );
};

export default Recharge;