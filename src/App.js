import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ReactPlayer from 'react-player';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import LandingPage from "./LandingPage";

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
  const [form, setForm] = React.useState({ name: '', email: '', idea: '' });
  const funders = [
    { name: 'Jane Capital', type: 'Angel Investor', desc: 'Invests in early-stage women-led startups.' },
    { name: 'GrowthX Fund', type: 'VC', desc: 'Focus on tech and social impact.' },
    { name: 'Empower Grants', type: 'Grant', desc: 'Non-dilutive funding for women entrepreneurs.' },
  ];

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = e => {
    e.preventDefault();
    alert('Connection request submitted successfully! We will get back to you soon.');
    setForm({ name: '', email: '', idea: '' });
  };

  return (
    <div className="connect-page">
      <form className="connect-form" onSubmit={handleSubmit}>
        <h2>Find Your Match</h2>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <textarea name="idea" value={form.idea} onChange={handleChange} placeholder="Describe your business idea" required />
        <button type="submit">Connect Me</button>
      </form>
      <div className="funder-cards">
        {funders.map((f, i) => (
          <div className="funder-card" key={i}>
            <h3>{f.name}</h3>
            <span className="funder-type">{f.type}</span>
            <p>{f.desc}</p>
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

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setLoading(true);
    
    // Simulate AI feedback
    setTimeout(() => {
      setFeedback('Great start! Consider clarifying your value proposition and target audience. Your pitch shows potential but could benefit from more specific market validation data and clearer revenue model explanation.');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="pitch-help-page">
      <h2>Pitch Help: Get AI Feedback</h2>
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} />
      {file && <div className="file-info">Uploaded: {file.name}</div>}
      {loading && <div className="loading-message">Analyzing your pitch...</div>}
      {feedback && <div className="ai-feedback"><strong>AI Feedback:</strong> {feedback}</div>}
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
  const [newMilestone, setNewMilestone] = React.useState("");

  const handleCheck = idx => setChecked(checked => checked.map((c, i) => i === idx ? !c : c));

  const handleAddMilestone = e => {
    e.preventDefault();
    if (newMilestone.trim()) {
      setMilestones([...milestones, newMilestone.trim()]);
      setChecked([...checked, false]);
      setNewMilestone("");
    }
  };

  const percent = (checked.filter(Boolean).length / milestones.length) * 100;

  return (
    <div className="progress-page">
      <h2>Your Startup Journey</h2>
      <form className="add-milestone-form" onSubmit={handleAddMilestone} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={newMilestone}
          onChange={e => setNewMilestone(e.target.value)}
          placeholder="Add a new milestone..."
          className="px-3 py-2 border rounded mr-2"
        />
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Add</button>
      </form>
      <ul className="milestone-list">
        {milestones.map((m, i) => (
          <li key={i} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={checked[i] || false}
              onChange={() => handleCheck(i)}
              className="mr-2"
            />
            <span className={checked[i] ? "line-through text-gray-400" : ""}>{m}</span>
          </li>
        ))}
      </ul>
      <div className="progress-bar-bg" style={{ background: '#eee', borderRadius: '8px', height: '16px', margin: '1rem 0' }}>
        <div
          className="progress-bar-fill"
          style={{ width: percent + '%', background: '#a78bfa', height: '100%', borderRadius: '8px', transition: 'width 0.3s' }}
        />
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

  const handleSubmit = e => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    
    // Simulate registration
    setTimeout(() => {
      setStatus('Registration successful! You can now log in.');
      setForm({ name: '', email: '', password: '' });
      setLoading(false);
    }, 1500);
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

  const handleSubmit = e => {
    e.preventDefault();
    setStatus('');
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      localStorage.setItem('jwt', 'mock-jwt-token');
      setStatus('Login successful!');
      if (onLogin) onLogin();
      setLoading(false);
    }, 1500);
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

  React.useEffect(() => {
    // Simulate loading profile
    setTimeout(() => {
      setProfile({
        name: 'Demo User',
        email: 'demo@example.com',
        createdAt: new Date().toISOString()
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    if (onLogout) onLogout();
  };

  if (loading) return <div className="loading-message">Loading profile...</div>;
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

  const handleSubmit = e => {
    e.preventDefault();
    setAdvice('');
    setError('');
    setLoading(true);
    
    // Simulate AI advice
    setTimeout(() => {
      const mockAdvice = `Based on your question about "${form.question}", here's my advice:

**Key Recommendations:**
1. Focus on validating your market assumptions early
2. Build a strong network of mentors and advisors
3. Start with a minimum viable product (MVP)
4. Track key metrics from day one

**Next Steps:**
- Conduct customer interviews
- Create a simple prototype
- Join relevant industry groups
- Set up basic analytics

Remember, every successful entrepreneur started exactly where you are. Stay persistent and keep learning!`;
      
      setAdvice(mockAdvice);
      setLoading(false);
    }, 2000);
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

  React.useEffect(() => {
    // Simulate loading analytics
    setTimeout(() => {
      setAnalytics({
        profileViews: 42,
        connections: 8,
        messages: 15
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="loading-message">Loading analytics...</div>;
  if (!analytics) return <div className="error-message">Failed to load analytics</div>;

  return (
    <div className="analytics-dashboard">
      <h2>Your Analytics</h2>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Profile Views</h3>
          <div className="analytics-number">{analytics.profileViews}</div>
        </div>
        <div className="analytics-card">
          <h3>Connections Made</h3>
          <div className="analytics-number">{analytics.connections}</div>
        </div>
        <div className="analytics-card">
          <h3>Messages Sent</h3>
          <div className="analytics-number">{analytics.messages}</div>
        </div>
      </div>
    </div>
  );
}

function BoxedPage({ children }) {
  return <div className="page-content">{children}</div>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => !!localStorage.getItem('jwt'));

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      <nav className="navbar bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <ul className="navbar-list flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 py-2">
          <li><Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Home</Link></li>
          <li><Link to="/connect" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Connect</Link></li>
          <li><Link to="/community" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Community</Link></li>
          <li><Link to="/learn" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Learn</Link></li>
          <li><Link to="/pitch-help" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Pitch Help</Link></li>
          <li><Link to="/progress" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Progress</Link></li>
          <li><Link to="/business-advice" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">AI Advice</Link></li>
          <li><Link to="/analytics" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Analytics</Link></li>
          {isLoggedIn && (
            <li><Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Profile</Link></li>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/connect" element={<BoxedPage><Connect /></BoxedPage>} />
        <Route path="/community" element={<BoxedPage><Community /></BoxedPage>} />
        <Route path="/learn" element={<BoxedPage><Learn /></BoxedPage>} />
        <Route path="/pitch-help" element={<BoxedPage><PitchHelp /></BoxedPage>} />
        <Route path="/progress" element={<BoxedPage><Progress /></BoxedPage>} />
        <Route path="/register" element={<BoxedPage><Register /></BoxedPage>} />
        <Route path="/login" element={<BoxedPage><Login onLogin={handleLogin} /></BoxedPage>} />
        <Route path="/profile" element={<BoxedPage><Profile onLogout={handleLogout} /></BoxedPage>} />
        <Route path="/business-advice" element={<BoxedPage><BusinessAdvice /></BoxedPage>} />
        <Route path="/analytics" element={<BoxedPage><AnalyticsDashboard /></BoxedPage>} />
      </Routes>
    </Router>
  );
}

export default App;