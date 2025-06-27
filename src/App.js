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

function BoxedPage({ children }) {
  return <div className="page-content">{children}</div>;
}

function App() {
  return (
    <Router>
      <nav className="navbar bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <ul className="navbar-list flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 py-2">
          <li><Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Landing Page</Link></li>
          <li><Link to="/home" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Home</Link></li>
          <li><Link to="/connect" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Connect</Link></li>
          <li><Link to="/community" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Community</Link></li>
          <li><Link to="/learn" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Learn</Link></li>
          <li><Link to="/pitch-help" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Pitch Help</Link></li>
          <li><Link to="/progress" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition">Progress</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<BoxedPage><Home /></BoxedPage>} />
        <Route path="/connect" element={<BoxedPage><Connect /></BoxedPage>} />
        <Route path="/community" element={<BoxedPage><Community /></BoxedPage>} />
        <Route path="/learn" element={<BoxedPage><Learn /></BoxedPage>} />
        <Route path="/pitch-help" element={<BoxedPage><PitchHelp /></BoxedPage>} />
        <Route path="/progress" element={<BoxedPage><Progress /></BoxedPage>} />
      </Routes>
    </Router>
  );
}

export default App;