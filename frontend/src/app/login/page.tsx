import LoginForm from '@/components/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 overflow-hidden">
      {/* SVG vague décorative */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{zIndex:0}}>
        <path fill="url(#wave-gradient)" fillOpacity="0.3" d="M0,320L48,293.3C96,267,192,213,288,197.3C384,181,480,203,576,229.3C672,256,768,288,864,288C960,288,1056,256,1152,229.3C1248,203,1344,181,1392,170.7L1440,160L1440,600L1392,600C1344,600,1248,600,1152,600C1056,600,960,600,864,600C768,600,672,600,576,600C480,600,384,600,288,600C192,600,96,600,48,600L0,600Z" />
        <defs>
          <linearGradient id="wave-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>
      {/* Contenu centré */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
        <LoginForm />
      </div>
    </main>
  );
} 