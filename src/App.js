import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ReactPlayer from 'react-player';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Page stubs
function Home() {
  return (
    <section className="hero fade-in">
      <h1 className="hero-title">Empowering Women Entrepreneurs</h1>
      <p className="hero-subtitle">
        AI-powered platform to connect you with funders, communities, and personalized business education.
      </p>
      <a href="/connect" className="hero-cta">Get Started</a>
    </section>
  );
}
function Connect() {
  const [form, setForm] = React.useState({ name: '', email: '', idea: '', funderId: '' });
  const [funders, setFunders] = React.useState([]);
  const [loadingFunders, setLoadingFunders] = React.useState(true);
  const [fundersError, setFundersError] = React.useState('');
  const [submitStatus, setSubmitStatus] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    async function fetchFunders() {
      setLoadingFunders(true);
      setFundersError('');
      try {
        const res = await fetch('http://localhost:5000/api/funders');
        const data = await res.json();
        if (res.ok) {
          setFunders(data.funders);
        } else {
          setFundersError(data.message || 'Failed to load funders');
        }
      } catch (err) {
        setFundersError('Network error. Please try again.');
      } finally {
        setLoadingFunders(false);
      }
    }
    fetchFunders();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitStatus('');
    setSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/funders/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          funderId: form.funderId,
          entrepreneurName: form.name,
          email: form.email,
          businessIdea: form.idea,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('Request sent successfully!');
        setForm({ name: '', email: '', idea: '', funderId: '' });
      } else {
        setSubmitStatus(data.message || 'Failed to submit request');
      }
    } catch (err) {
      setSubmitStatus('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="connect-page">
      <form className="connect-form" onSubmit={handleSubmit}>
        <h2>Find Your Match</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <textarea name="idea" value={form.idea} onChange={handleChange} placeholder="Describe your business idea" required />
        <select name="funderId" value={form.funderId} onChange={handleChange} required>
          <option value="">Select a Funder</option>
          {funders.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
        <button type="submit" disabled={submitting || loadingFunders}>Connect Me</button>
        {submitStatus && <div className="submit-status">{submitStatus}</div>}
      </form>
      {loadingFunders && <div className="loading-message">Loading funders...</div>}
      {fundersError && <div className="error-message">{fundersError}</div>}
      <div className="funder-cards">
        {funders.map((f, i) => (
          <div className="funder-card" key={f.id}>
            <h3>{f.name}</h3>
            <span className="funder-type">{f.type}</span>
            <p>{f.description}</p>
            <div className="funder-details">
              <div><strong>Focus:</strong> {Array.isArray(f.focus) ? f.focus.join(', ') : f.focus}</div>
              <div><strong>Investment Range:</strong> {f.investmentRange}</div>
              <div><strong>Stage:</strong> {Array.isArray(f.stage) ? f.stage.join(', ') : f.stage}</div>
              <div><a href={f.website} target="_blank" rel="noopener noreferrer">Website</a></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Community() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [username, setUsername] = React.useState(() => localStorage.getItem('chat_username') || '');
  const [showPrompt, setShowPrompt] = React.useState(!username);
  const [tempName, setTempName] = React.useState('');

  React.useEffect(() => {
    if (!username) return;
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [username]);

  const handleSend = async e => {
    e.preventDefault();
    if (input.trim() && username) {
      await addDoc(collection(db, 'messages'), {
        user: username,
        text: input,
        createdAt: serverTimestamp(),
      });
      setInput('');
    }
  };

  const handleSetName = e => {
    e.preventDefault();
    if (tempName.trim()) {
      setUsername(tempName);
      localStorage.setItem('chat_username', tempName);
      setShowPrompt(false);
    }
  };

  if (showPrompt) {
    return (
      <div className="community-page">
        <form className="username-form" onSubmit={handleSetName}>
          <label htmlFor="username-input">Enter your name to join the chat:</label>
          <input id="username-input" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="Your name" />
          <button type="submit">Join</button>
        </form>
      </div>
    );
  }

  return (
    <div className="community-page">
      <div className="chat-box">
        {messages.map((m) => (
          <div className={m.user === username ? 'chat-msg chat-msg-you' : 'chat-msg'} key={m.id}>
            <span className="chat-user">{m.user}:</span> {m.text}
          </div>
        ))}
      </div>
      <form className="chat-input-row" onSubmit={handleSend}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
function Learn() {
  const videos = [
    { title: 'How to Pitch', url: 'https://www.youtube.com/watch?v=HAnw168huqA' },
    { title: 'Finding Funders', url: 'https://www.youtube.com/watch?v=QILiHiTD3uc' },
    { title: 'Building Your Team', url: 'https://www.youtube.com/watch?v=ysz5S6PUM-U' },
  ];
  return (
    <div className="learn-grid">
      {videos.map((v, i) => (
        <div className="video-card" key={i}>
          <ReactPlayer url={v.url} width="100%" height="180px" controls />
          <div className="video-title">{v.title}</div>
        </div>
      ))}
    </div>
  );
}
function PitchHelp() {
  const [file, setFile] = React.useState(null);
  const [feedback, setFeedback] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFeedback('');
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('pitchFile', selectedFile);

      const response = await fetch('http://localhost:5000/api/ai/pitch-feedback-file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback(data.feedback);
      } else {
        setError(data.message || 'Failed to get feedback');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pitch-help-page">
      <h2>Pitch Help: Get AI Feedback</h2>
      <p>Upload your pitch document (PDF, DOC, DOCX, or TXT) to get personalized AI feedback.</p>
      
      <input 
        type="file" 
        accept=".pdf,.doc,.docx,.txt" 
        onChange={handleFile}
        disabled={loading}
      />
      
      {file && (
        <div className="file-info">
          Uploaded: {file.name} ({Math.round(file.size / 1024)}KB)
        </div>
      )}
      
      {loading && (
        <div className="loading-message">
          Analyzing your pitch document... Please wait.
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {feedback && (
        <div className="ai-feedback">
          <strong>AI Feedback:</strong>
          <div style={{ whiteSpace: 'pre-line', marginTop: '10px' }}>
            {feedback}
          </div>
        </div>
      )}
    </div>
  );
}
function Progress() {
  const [milestones, setMilestones] = React.useState([
    'Validate your idea',
    'Build your pitch',
    'Connect with a funder',
    'Join a community',
    'Launch your business',
  ]);
  const [checked, setChecked] = React.useState([false, false, false, false, false]);
  const [newMilestone, setNewMilestone] = React.useState('');

  const handleCheck = idx => setChecked(checked => checked.map((c, i) => i === idx ? !c : c));
  
  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone.trim()]);
      setChecked([...checked, false]);
      setNewMilestone('');
    }
  };

  const percent = (checked.filter(Boolean).length / milestones.length) * 100;
  
  return (
    <div className="progress-page">
      <h2>Your Startup Journey</h2>
      <div className="add-milestone-form">
        <input 
          type="text" 
          value={newMilestone} 
          onChange={e => setNewMilestone(e.target.value)} 
          placeholder="Add a new milestone..." 
          onKeyPress={e => e.key === 'Enter' && handleAddMilestone()}
        />
        <button onClick={handleAddMilestone}>Add</button>
      </div>
      <ul className="milestone-list">
        {milestones.map((m, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={checked[i]} onChange={() => handleCheck(i)} />
              {m}
            </label>
          </li>
        ))}
      </ul>
      <div className="progress-bar-bg">
        <div className="progress-bar-fill" style={{ width: percent + '%' }} />
      </div>
      <div className="progress-label">{Math.round(percent)}% complete</div>
    </div>
  );
}

function Register() {
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Registration successful! You can now log in.');
        setForm({ name: '', email: '', password: '' });
      } else {
        setStatus(data.message || 'Registration failed');
      }
    } catch (err) {
      setStatus('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
        <button type="submit" disabled={loading}>Register</button>
        {status && <div className="submit-status">{status}</div>}
      </form>
    </div>
  );
}

function Login({ onLogin }) {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [status, setStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('jwt', data.token);
        setStatus('Login successful!');
        if (onLogin) onLogin();
      } else {
        setStatus(data.message || 'Login failed');
      }
    } catch (err) {
      setStatus('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
        <button type="submit" disabled={loading}>Login</button>
        {status && <div className="submit-status">{status}</div>}
      </form>
    </div>
  );
}

function Profile({ onLogout }) {
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: { 'Authorization': 'Bearer ' + token },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data.user);
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    if (onLogout) onLogout();
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return null;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <div><strong>Name:</strong> {profile.name}</div>
      <div><strong>Email:</strong> {profile.email}</div>
      <div><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleString()}</div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

function BusinessAdvice() {
  const [form, setForm] = React.useState({ question: '', context: '', industry: '' });
  const [advice, setAdvice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setAdvice('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/business-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAdvice(data.advice);
      } else {
        setError(data.message || 'Failed to get advice');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-advice-page">
      <form className="business-advice-form" onSubmit={handleSubmit}>
        <h2>Business Advice: Ask AI</h2>
        <textarea name="question" value={form.question} onChange={handleChange} placeholder="Your business question..." required rows={3} />
        <input name="context" value={form.context} onChange={handleChange} placeholder="Context (optional)" />
        <input name="industry" value={form.industry} onChange={handleChange} placeholder="Industry (optional)" />
        <button type="submit" disabled={loading}>Get Advice</button>
      </form>
      {loading && <div className="loading-message">Getting advice...</div>}
      {error && <div className="error-message">{error}</div>}
      {advice && (
        <div className="ai-feedback">
          <strong>AI Advice:</strong>
          <div style={{ whiteSpace: 'pre-line', marginTop: '10px' }}>{advice}</div>
        </div>
      )}
    </div>
  );
}

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/analytics/dashboard');
        const data = await res.json();
        if (res.ok) {
          setAnalytics(data.analytics);
        } else {
          setError(data.message || 'Failed to load analytics');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <div className="loading-message">Loading analytics...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!analytics) return null;

  return (
    <div className="analytics-dashboard-page">
      <h2>Platform Analytics</h2>
      <ul className="analytics-list">
        <li><strong>Total Users:</strong> {analytics.totalUsers}</li>
        <li><strong>Total Connections:</strong> {analytics.totalConnections}</li>
        <li><strong>Total Pitch Reviews:</strong> {analytics.totalPitchReviews}</li>
        <li><strong>Active Funders:</strong> {analytics.activeFunders}</li>
        <li><strong>Success Stories:</strong> {analytics.successStories}</li>
      </ul>
      <h3>Monthly Stats</h3>
      <ul className="analytics-list">
        <li><strong>New Users:</strong> {analytics.monthlyStats.newUsers}</li>
        <li><strong>New Connections:</strong> {analytics.monthlyStats.newConnections}</li>
        <li><strong>Pitch Reviews:</strong> {analytics.monthlyStats.pitchReviews}</li>
      </ul>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('jwt'));

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/connect">Connect</Link></li>
          <li><Link to="/community">Community</Link></li>
          <li><Link to="/learn">Learn</Link></li>
          <li><Link to="/pitch-help">Pitch Help</Link></li>
          <li><Link to="/progress">Progress</Link></li>
          <li><Link to="/business-advice">Business Advice</Link></li>
          <li><Link to="/analytics">Analytics</Link></li>
          {!isLoggedIn && <li><Link to="/register">Register</Link></li>}
          {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
          {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
        </ul>
      </nav>
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/community" element={<Community />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/pitch-help" element={<PitchHelp />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
          <Route path="/business-advice" element={<BusinessAdvice />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
