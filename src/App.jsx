import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    education: '',
    profession: '',
    jobType: '',
    salary: '',
    land: '',
    propertyValue: '',
    hasShop: false,
    hasCar: false,
    hasBike: false,
    hasTractor: false,
  });

  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.age || isNaN(formData.age) || Number(formData.age) <= 0) newErrors.age = 'Valid age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.education) newErrors.education = 'Education is required';
    if (!formData.profession) newErrors.profession = 'Profession is required';
    if (!formData.jobType) newErrors.jobType = 'Job Type is required';

    if (!formData.salary || isNaN(formData.salary) || Number(formData.salary) < 0) newErrors.salary = 'Valid salary is required';
    if (!formData.land || isNaN(formData.land) || Number(formData.land) < 0) newErrors.land = 'Valid land amount is required';
    if (!formData.propertyValue || isNaN(formData.propertyValue) || Number(formData.propertyValue) < 0) newErrors.propertyValue = 'Valid property value is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateScore = () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    let score = 0;

    // Age Scoring
    const age = Number(formData.age);
    if (age > 17 && age <= 23) score += 5;
    else if (age >= 24 && age <= 28) score += 15;
    else if (age >= 29 && age <= 35) score += 0;
    else score -= 10;

    // Profession Scoring
    if (formData.profession === 'Student') score += 5;
    else if (formData.profession === 'Engineer') score += 15;
    else if (formData.profession === 'Doctor') score += 15;
    else if (formData.profession === 'Business') score += 25;
    else if (formData.profession === 'Farmer') score += 10;
    else if (formData.profession === 'Unemployed') score -= 10;
    else score += 0;

    // Salary Scoring
    const salary = Number(formData.salary);
    if (salary < 20000) score += 5;
    else if (salary <= 50000) score += 15;
    else if (salary <= 100000) score += 30;
    else score += 50;

    // Job Type Scoring
    if (formData.jobType === 'Government') score += 40;
    else if (formData.jobType === 'Private') score += 25;
    else if (formData.jobType === 'Business') score += 35;

    // Education Scoring
    if (formData.education === 'High School') score += 5;
    else if (formData.education === 'Graduate') score += 15;
    else if (formData.education === 'Postgraduate') score += 25;
    else if (formData.education === 'PhD') score += 40;

    // Land Scoring
    const land = Number(formData.land);
    if (land === 0) score += 0;
    else if (land <= 2) score += 10;
    else if (land <= 5) score += 25;
    else if (land <= 10) score += 40;
    else score += 60;

    // Property Scoring
    const property = Number(formData.propertyValue);
    if (property < 500000) score += 10;
    else if (property <= 2000000) score += 25;
    else if (property <= 5000000) score += 40;
    else score += 60;

    // Shop Ownership
    if (formData.hasShop) score += 25;

    // Vehicles
    if (formData.hasCar) score += 15;
    if (formData.hasBike) score += 5;
    if (formData.hasTractor) score += 15;

    // Gender Scoring
    if (formData.gender === 'Male') score *= 1.2;
    else if (formData.gender === 'Female') score *= 1.1;
    else score -= 10;

    score = Math.round(score);

    // Determine Category
    let category = '';
    if (score <= 150) category = 'Low';
    else if (score <= 250) category = 'Medium';
    else category = 'High';

    setResult({ score, category });

    // Smooth scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const resetForm = () => {
    setFormData({
      age: '', gender: '', education: '', profession: '', jobType: '', salary: '',
      land: '', propertyValue: '', hasShop: false, hasCar: false, hasBike: false, hasTractor: false
    });
    setErrors({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderError = (field) => {
    return errors[field] ? <span className="error-text">{errors[field]}</span> : null;
  };

  const progressPercentage = result ? Math.min(100, (Math.max(0, result.score) / 420) * 100) : 0;

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <div className="header-content">
          <h1>Marriage Dahej Calculator</h1>
          <p>Find out your profile dahej based on your personal, professional, and asset details.</p>
        </div>
        <button className="theme-toggle" onClick={toggleDarkMode}>
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main className="main-container">
        <div className="form-card">
          {/* Personal Information */}
          <section className="form-section">
            <h2><span className="icon">👤</span> Personal Information</h2>
            <div className="grid-2">
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Enter your age" />
                {renderError('age')}
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {renderError('gender')}
              </div>
              <div className="form-group">
                <label>Education</label>
                <select name="education" value={formData.education} onChange={handleInputChange}>
                  <option value="">Select Education</option>
                  <option value="High School">High School</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                </select>
                {renderError('education')}
              </div>
              <div className="form-group">
                <label>Profession</label>
                <select name="profession" value={formData.profession} onChange={handleInputChange}>
                  <option value="">Select Profession</option>
                  <option value="Student">Student</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Business">Business</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Other">Other</option>
                </select>
                {renderError('profession')}
              </div>
            </div>
          </section>

          <hr className="divider" />

          {/* Professional Details */}
          <section className="form-section">
            <h2><span className="icon">💼</span> Professional Details</h2>
            <div className="grid-2">
              <div className="form-group">
                <label>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleInputChange}>
                  <option value="">Select Job Type</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Business">Business</option>
                </select>
                {renderError('jobType')}
              </div>
              <div className="form-group">
                <label>Monthly Salary (₹)</label>
                <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} placeholder="e.g. 50000" />
                {renderError('salary')}
              </div>
            </div>
          </section>

          <hr className="divider" />

          {/* Assets */}
          <section className="form-section">
            <h2><span className="icon">🌾</span> Assets & Property</h2>
            <div className="grid-2">
              <div className="form-group">
                <label>Land Owned (in acres)</label>
                <input type="number" step="0.1" name="land" value={formData.land} onChange={handleInputChange} placeholder="e.g. 2.5" />
                {renderError('land')}
              </div>
              <div className="form-group">
                <label>Property Value (₹)</label>
                <input type="number" name="propertyValue" value={formData.propertyValue} onChange={handleInputChange} placeholder="e.g. 2500000" />
                {renderError('propertyValue')}
              </div>
            </div>

            <div className="toggles-grid">
              <div className="form-group checkbox-group toggle-box">
                <label className="checkbox-label">
                  <input type="checkbox" name="hasShop" checked={formData.hasShop} onChange={handleInputChange} />
                  <span className="toggle-text">Owns a Shop</span>
                </label>
              </div>

              <div className="vehicles-group">
                <h4>Vehicles Owned:</h4>
                <div className="checkboxes-inline">
                  <label className="checkbox-label">
                    <input type="checkbox" name="hasCar" checked={formData.hasCar} onChange={handleInputChange} />
                    Car
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="hasBike" checked={formData.hasBike} onChange={handleInputChange} />
                    Bike
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" name="hasTractor" checked={formData.hasTractor} onChange={handleInputChange} />
                    Tractor
                  </label>
                </div>
              </div>
            </div>
          </section>

          <div className="action-buttons">
            <button className="btn-primary" onClick={calculateScore}>Calculate Score</button>
            <button className="btn-secondary" onClick={resetForm}>Reset Form</button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="result-card fade-in" ref={resultRef}>
            <h2>Your Profile Dahej</h2>
            <div className="score-circle">
              <span className="score-value">{result.score * 10000}</span>
              <span className="score-label">Rupees</span>
            </div>

            <div className="category-badge" data-category={result.category}>
              {result.category} Dahej
            </div>

            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className="progress-labels">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem 1rem 1rem', color: 'var(--text-muted)' }}>
        <p>Made by Sahil Lodhi, Thank you!</p>
        <br />
        <p>Share me with your friends and have fun !!</p>
        <br />
        <p>Note: This is just a fun calculator and should not be taken seriously.</p>
        <br />
        <p>Copyright © 2026 Dahej.com. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
