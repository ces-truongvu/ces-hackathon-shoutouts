
import React, { useState } from 'react';
import DuoButton from './DuoButton';
import OwlMascot from './OwlMascot';

interface LoginProps {
  onLogin: (username: string, role: 'Admin' | 'Staff') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'admin' && password === 'admin') {
      onLogin('admin', 'Admin');
    } else if (username === 'staff' && password === 'staff') {
      onLogin('staff', 'Staff');
    } else {
      setError('Invalid credentials. Try admin/admin or staff/staff');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300" style={{ backgroundImage: 'var(--bg-pattern)' }}>
      <div className="w-full max-w-md bg-surface rounded-theme border-theme border-borderMain shadow-theme overflow-hidden p-8 animate-pop">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-black text-primary tracking-tighter mb-2 drop-shadow-sm">
            EOS<span className="text-secondary">SHOUT</span>
          </h1>
          <p className="text-textMuted font-bold uppercase tracking-widest text-xs">Employee Recognition</p>
        </div>

        <OwlMascot mood="happy" message="Welcome back! Ready to celebrate your team?" />

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {error && (
            <div className="bg-danger/10 border-theme border-danger text-danger p-3 rounded-theme text-sm font-bold text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-textMuted uppercase ml-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-theme border-theme border-borderMain focus:border-primary focus:border-b-[6px] outline-none transition-all text-textMain font-bold bg-background focus:bg-surface"
              placeholder="admin or staff"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-textMuted uppercase ml-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-theme border-theme border-borderMain focus:border-primary focus:border-b-[6px] outline-none transition-all text-textMain font-bold bg-background focus:bg-surface"
              placeholder="••••••"
            />
          </div>

          <div className="pt-4">
            <DuoButton fullWidth type="submit">
              LOG IN
            </DuoButton>
          </div>
        </form>
        
        <div className="mt-6 text-center text-xs text-textMuted font-bold">
          <p>Demo Credentials:</p>
          <p>Admin: admin / admin</p>
          <p>Staff: staff / staff</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
