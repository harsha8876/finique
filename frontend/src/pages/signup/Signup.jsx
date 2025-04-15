import React, { useState } from 'react';
import './Signup.module.css';

const Signup = () => {
  // States for the form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [govtId, setGovtId] = useState("");
  const [occupation, setOccupation] = useState("");
  const [income, setIncome] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [branchId, setBranchId] = useState(""); // State for the selected branch
  const [branchName, setBranchName] = useState(""); // State for the branch name
  const [ifscCode, setIfscCode] = useState(""); // State for the IFSC Code
  const [errors, setErrors] = useState({});

  // List of Indian cities with their IFSC codes
  const cities = [
    { id: 1, name: 'Mumbai', ifscCode: 'MUM0001234' },
    { id: 2, name: 'Delhi', ifscCode: 'DEL0002345' },
    { id: 3, name: 'Bangalore', ifscCode: 'BLR0003456' },
    { id: 4, name: 'Chennai', ifscCode: 'CHE0004567' },
    { id: 5, name: 'Kolkata', ifscCode: 'KOL0005678' },
    { id: 6, name: 'Hyderabad', ifscCode: 'HYD0006789' },
    { id: 7, name: 'Pune', ifscCode: 'PUN0007890' },
    { id: 8, name: 'Ahmedabad', ifscCode: 'AHM0008901' },
    { id: 9, name: 'Surat', ifscCode: 'SUR0009012' },
    { id: 10, name: 'Jaipur', ifscCode: 'JAI0000123' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!branchId) newErrors.branchId = "Branch selection is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
  
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            firstName,
            lastName,
            dob,
            gender,
            nationality,
            phone,
            email,
            address,
            govtId,
            occupation,
            income,
            password,
            branchId, // Send the selected branch ID in the request body
            branchName, // Send the selected branch name
            ifscCode // Send the selected IFSC code
          })
        });
  
        if (!response.ok) throw new Error("Failed to sign up");
  
        const data = await response.json();
        console.log("Signup successful:", data);
  
        // Save user info in cookies (optional, if you plan to use these later)
        document.cookie = `email=${data.email}; path=/`;
        document.cookie = `balance=${data.balance}; path=/`;
        document.cookie = `firstName=${data.firstName}; path=/`;
  
        // Redirect to dashboard
        window.location.href = "/dashboard";
  
      } catch (err) {
        console.error("Signup error:", err);
        alert("Signup failed: " + err.message);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="signup-container">
      <h1>Create an Account</h1>
      <p className="subtitle">Please fill in the form below to register</p>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-section">
          <h2>Personal Information</h2>

          {/* First Name */}
          <div className="form-row">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
          </div>

          {/* Last Name */}
          <div className="form-row">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
          </div>

          {/* Date of Birth */}
          <div className="form-row">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
            {errors.dob && <span className="error-message">{errors.dob}</span>}
          </div>

          {/* Gender */}
          <div className="form-row">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Nationality */}
          <div className="form-row">
            <label htmlFor="nationality">Nationality</label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            />
          </div>

          {/* Phone */}
          <div className="form-row">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Address */}
          <div className="form-row">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Govt ID */}
          <div className="form-row">
            <label htmlFor="govtId">Government ID</label>
            <input
              type="text"
              id="govtId"
              value={govtId}
              onChange={(e) => setGovtId(e.target.value)}
            />
          </div>

          {/* Occupation */}
          <div className="form-row">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          {/* Income */}
          <div className="form-row">
            <label htmlFor="income">Income</label>
            <input
              type="number"
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-row">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Branch Selection */}
          <div className="form-row">
            <label htmlFor="branchId">Branch</label>
            <select
              id="branchId"
              value={branchId}
              onChange={(e) => {
                const selectedBranchId = e.target.value;
                const selectedBranch = cities.find(branch => branch.id === parseInt(selectedBranchId));
                setBranchId(selectedBranchId);
                setBranchName(selectedBranch.name);
                setIfscCode(selectedBranch.ifscCode); // Set IFSC code when branch is selected
              }}
              required
            >
              <option value="">Select a Branch</option>
              {cities.map((branch) => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
            {errors.branchId && <span className="error-message">{errors.branchId}</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
