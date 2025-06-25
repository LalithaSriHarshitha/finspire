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
  const [form, setForm] = React.useState({ name: '', email: '', idea: '' });
  const funders = [
    { name: 'Jane Capital', type: 'Angel Investor', desc: 'Invests in early-stage women-led startups.' },
    { name: 'GrowthX Fund', type: 'VC', desc: 'Focus on tech and social impact.' },
    { name: 'Empower Grants', type: 'Grant', desc: 'Non-dilutive funding for women entrepreneurs.' },
  ];
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); alert('Submitted!'); };
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
  const handleFile = e => {
    const f = e.target.files[0];
    setFile(f);
    // Simulate AI feedback
    setTimeout(() => setFeedback('Great start! Consider clarifying your value proposition and target audience.'), 1200);
  };
  return (
    <div className="pitch-help-page">
      <h2>Pitch Help: Get AI Feedback</h2>
      <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFile} />
      {file && <div className="file-info">Uploaded: {file.name}</div>}
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

function App() {
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
