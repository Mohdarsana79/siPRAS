import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ErrorPageProps {
    status: number;
}

interface ErrorConfig {
    code: number;
    title: string;
    description: string;
    icon: string;
    gradient: string;
    bgGradient: string;
    orbColor1: string;
    orbColor2: string;
    orbColor3: string;
    accentColor: string;
    badgeColor: string;
    hint: string;
    particles: string[];
}

const errorConfigs: Record<number, ErrorConfig> = {
    400: {
        code: 400,
        title: 'Permintaan Tidak Valid',
        description: 'Server tidak dapat memproses permintaan Anda karena sintaks yang tidak valid atau data yang rusak.',
        icon: '⚠️',
        gradient: 'from-amber-500 via-orange-500 to-red-500',
        bgGradient: 'from-amber-950 via-orange-950 to-red-950',
        orbColor1: 'rgba(251, 191, 36, 0.25)',
        orbColor2: 'rgba(249, 115, 22, 0.2)',
        orbColor3: 'rgba(239, 68, 68, 0.15)',
        accentColor: '#f59e0b',
        badgeColor: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
        hint: 'Periksa data yang Anda kirimkan dan coba lagi.',
        particles: ['⚡', '🔧', '⚙️', '🛠️'],
    },
    402: {
        code: 402,
        title: 'Pembayaran Diperlukan',
        description: 'Akses ke halaman ini memerlukan pembayaran atau langganan aktif untuk melanjutkan.',
        icon: '💳',
        gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
        bgGradient: 'from-emerald-950 via-teal-950 to-cyan-950',
        orbColor1: 'rgba(16, 185, 129, 0.25)',
        orbColor2: 'rgba(20, 184, 166, 0.2)',
        orbColor3: 'rgba(6, 182, 212, 0.15)',
        accentColor: '#10b981',
        badgeColor: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
        hint: 'Hubungi administrator untuk informasi lebih lanjut.',
        particles: ['💰', '💳', '🏦', '💎'],
    },
    403: {
        code: 403,
        title: 'Akses Ditolak',
        description: 'Anda tidak memiliki izin untuk mengakses halaman ini. Harap hubungi administrator sistem.',
        icon: '🔒',
        gradient: 'from-red-500 via-rose-500 to-pink-500',
        bgGradient: 'from-red-950 via-rose-950 to-pink-950',
        orbColor1: 'rgba(239, 68, 68, 0.25)',
        orbColor2: 'rgba(244, 63, 94, 0.2)',
        orbColor3: 'rgba(236, 72, 153, 0.15)',
        accentColor: '#ef4444',
        badgeColor: 'bg-red-500/20 border-red-500/40 text-red-300',
        hint: 'Pastikan Anda sudah login dengan akun yang benar.',
        particles: ['🔒', '🛡️', '🔑', '🚫'],
    },
    404: {
        code: 404,
        title: 'Halaman Tidak Ditemukan',
        description: 'Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau belum pernah ada.',
        icon: '🔭',
        gradient: 'from-violet-500 via-purple-500 to-indigo-500',
        bgGradient: 'from-violet-950 via-purple-950 to-indigo-950',
        orbColor1: 'rgba(139, 92, 246, 0.3)',
        orbColor2: 'rgba(168, 85, 247, 0.2)',
        orbColor3: 'rgba(99, 102, 241, 0.2)',
        accentColor: '#8b5cf6',
        badgeColor: 'bg-violet-500/20 border-violet-500/40 text-violet-300',
        hint: 'Periksa URL atau gunakan navigasi untuk kembali.',
        particles: ['🌌', '⭐', '🪐', '🌠'],
    },
    413: {
        code: 413,
        title: 'File Terlalu Besar',
        description: 'File atau data yang Anda kirim melebihi batas ukuran maksimum yang diizinkan oleh server.',
        icon: '📦',
        gradient: 'from-orange-500 via-amber-500 to-yellow-500',
        bgGradient: 'from-orange-950 via-amber-950 to-yellow-950',
        orbColor1: 'rgba(249, 115, 22, 0.25)',
        orbColor2: 'rgba(245, 158, 11, 0.2)',
        orbColor3: 'rgba(234, 179, 8, 0.15)',
        accentColor: '#f97316',
        badgeColor: 'bg-orange-500/20 border-orange-500/40 text-orange-300',
        hint: 'Kurangi ukuran file dan coba lagi.',
        particles: ['📦', '⬆️', '📁', '💾'],
    },
    500: {
        code: 500,
        title: 'Kesalahan Server Internal',
        description: 'Terjadi kesalahan tak terduga di server kami. Tim teknis kami sedang bekerja untuk memperbaikinya.',
        icon: '🔥',
        gradient: 'from-rose-500 via-red-500 to-orange-500',
        bgGradient: 'from-rose-950 via-red-950 to-orange-950',
        orbColor1: 'rgba(244, 63, 94, 0.3)',
        orbColor2: 'rgba(239, 68, 68, 0.2)',
        orbColor3: 'rgba(249, 115, 22, 0.2)',
        accentColor: '#f43f5e',
        badgeColor: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
        hint: 'Coba muat ulang halaman atau kembali beberapa saat lagi.',
        particles: ['🔥', '⚡', '💥', '🌋'],
    },
    503: {
        code: 503,
        title: 'Layanan Tidak Tersedia',
        description: 'Server sedang dalam pemeliharaan atau kelebihan beban. Mohon bersabar dan coba beberapa saat lagi.',
        icon: '🔧',
        gradient: 'from-sky-500 via-blue-500 to-indigo-500',
        bgGradient: 'from-sky-950 via-blue-950 to-indigo-950',
        orbColor1: 'rgba(14, 165, 233, 0.25)',
        orbColor2: 'rgba(59, 130, 246, 0.2)',
        orbColor3: 'rgba(99, 102, 241, 0.15)',
        accentColor: '#0ea5e9',
        badgeColor: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
        hint: 'Sistem akan kembali normal dalam waktu dekat.',
        particles: ['🔧', '⚙️', '🛠️', '🔩'],
    },
    505: {
        code: 505,
        title: 'Versi HTTP Tidak Didukung',
        description: 'Server tidak mendukung versi protokol HTTP yang digunakan dalam permintaan Anda.',
        icon: '🌐',
        gradient: 'from-cyan-500 via-teal-500 to-green-500',
        bgGradient: 'from-cyan-950 via-teal-950 to-green-950',
        orbColor1: 'rgba(6, 182, 212, 0.25)',
        orbColor2: 'rgba(20, 184, 166, 0.2)',
        orbColor3: 'rgba(34, 197, 94, 0.15)',
        accentColor: '#06b6d4',
        badgeColor: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
        hint: 'Perbarui browser Anda atau hubungi administrator.',
        particles: ['🌐', '📡', '🔗', '💻'],
    },
};

const defaultConfig: ErrorConfig = {
    code: 0,
    title: 'Terjadi Kesalahan',
    description: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi atau hubungi administrator.',
    icon: '❓',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    bgGradient: 'from-slate-950 via-gray-950 to-zinc-950',
    orbColor1: 'rgba(100, 116, 139, 0.25)',
    orbColor2: 'rgba(107, 114, 128, 0.2)',
    orbColor3: 'rgba(113, 113, 122, 0.15)',
    accentColor: '#64748b',
    badgeColor: 'bg-slate-500/20 border-slate-500/40 text-slate-300',
    hint: 'Silakan hubungi administrator sistem.',
    particles: ['❓', '🤔', '💭', '🔍'],
};

function FloatingParticle({ emoji, delay, x, y }: { emoji: string; delay: number; x: number; y: number }) {
    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                fontSize: '1.5rem',
                animation: `floatParticle 6s ease-in-out ${delay}s infinite`,
                opacity: 0.4,
                userSelect: 'none',
                pointerEvents: 'none',
            }}
        >
            {emoji}
        </div>
    );
}

function GlitchText({ text, accentColor }: { text: string; accentColor: string }) {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
                style={{
                    fontSize: 'clamp(7rem, 20vw, 14rem)',
                    fontWeight: 900,
                    lineHeight: 1,
                    background: `linear-gradient(135deg, ${accentColor}, #fff, ${accentColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: glitch ? `blur(2px) drop-shadow(0 0 20px ${accentColor})` : `drop-shadow(0 0 40px ${accentColor}88)`,
                    transition: 'filter 0.1s ease',
                    display: 'block',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '-0.05em',
                }}
            >
                {text}
            </span>
            {glitch && (
                <>
                    <span
                        style={{
                            position: 'absolute',
                            top: '4px',
                            left: '-4px',
                            fontSize: 'clamp(7rem, 20vw, 14rem)',
                            fontWeight: 900,
                            lineHeight: 1,
                            background: '#ff006644',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            display: 'block',
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: '-0.05em',
                            clipPath: 'polygon(0 30%, 100% 30%, 100% 60%, 0 60%)',
                        }}
                    >
                        {text}
                    </span>
                    <span
                        style={{
                            position: 'absolute',
                            top: '-4px',
                            left: '4px',
                            fontSize: 'clamp(7rem, 20vw, 14rem)',
                            fontWeight: 900,
                            lineHeight: 1,
                            background: '#0066ff44',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            display: 'block',
                            fontFamily: "'Space Grotesk', sans-serif",
                            letterSpacing: '-0.05em',
                            clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)',
                        }}
                    >
                        {text}
                    </span>
                </>
            )}
        </div>
    );
}

export default function ErrorPage({ status }: ErrorPageProps) {
    const config = errorConfigs[status] || { ...defaultConfig, code: status };
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const particlePositions = [
        { x: 8, y: 15, delay: 0 },
        { x: 85, y: 10, delay: 1.2 },
        { x: 15, y: 75, delay: 0.6 },
        { x: 80, y: 70, delay: 1.8 },
        { x: 50, y: 8, delay: 2.4 },
        { x: 92, y: 45, delay: 0.3 },
        { x: 5, y: 50, delay: 1.5 },
        { x: 70, y: 88, delay: 0.9 },
    ];

    return (
        <>
            <Head title={`Error ${config.code} - ${config.title}`} />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes floatParticle {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                    33% { transform: translateY(-20px) rotate(10deg); opacity: 0.6; }
                    66% { transform: translateY(-10px) rotate(-5deg); opacity: 0.4; }
                }

                @keyframes orbPulse {
                    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.6; }
                    33% { transform: scale(1.2) translate(30px, -20px); opacity: 0.8; }
                    66% { transform: scale(0.9) translate(-20px, 30px); opacity: 0.5; }
                }

                @keyframes orbPulse2 {
                    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.5; }
                    33% { transform: scale(0.85) translate(-40px, 20px); opacity: 0.7; }
                    66% { transform: scale(1.15) translate(20px, -30px); opacity: 0.4; }
                }

                @keyframes orbPulse3 {
                    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.4; }
                    50% { transform: scale(1.3) translate(20px, 20px); opacity: 0.7; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scanline {
                    0% { top: -10%; }
                    100% { top: 110%; }
                }

                @keyframes borderGlow {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 1; }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes counter-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(-360deg); }
                }

                @keyframes gridMove {
                    from { transform: perspective(500px) rotateX(0deg) translateY(0px); }
                    to { transform: perspective(500px) rotateX(0deg) translateY(40px); }
                }

                .error-page-btn {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }
                .error-page-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .error-page-btn:hover::after { opacity: 1; }
                .error-page-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .error-page-btn:active { transform: translateY(-1px); }

                .status-badge {
                    animation: borderGlow 2s ease-in-out infinite;
                }

                .grid-bg {
                    background-image:
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    animation: gridMove 8s linear infinite alternate;
                }

                .glass-card {
                    backdrop-filter: blur(20px);
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                }

                @media (max-width: 480px) {
                    .error-actions { flex-direction: column !important; }
                    .error-actions a { width: 100% !important; text-align: center !important; }
                    .info-grid { grid-template-columns: 1fr !important; }
                }

                @media (max-width: 768px) {
                    .ring-outer { display: none !important; }
                }
            `}</style>

            <div
                style={{
                    minHeight: '100vh',
                    width: '100%',
                    background: `radial-gradient(ellipse at 20% 20%, ${config.orbColor1} 0%, transparent 50%),
                                 radial-gradient(ellipse at 80% 80%, ${config.orbColor2} 0%, transparent 50%),
                                 radial-gradient(ellipse at 50% 50%, ${config.orbColor3} 0%, transparent 70%),
                                 linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 50%, #0a0a0f 100%)`,
                    fontFamily: "'Inter', sans-serif",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '2rem 1.5rem',
                }}
            >
                {/* Animated grid background */}
                <div
                    className="grid-bg"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                    }}
                />

                {/* Orbs */}
                <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-15%',
                    width: '60vw',
                    height: '60vw',
                    maxWidth: '600px',
                    maxHeight: '600px',
                    background: config.orbColor1,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'orbPulse 10s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-15%',
                    width: '55vw',
                    height: '55vw',
                    maxWidth: '550px',
                    maxHeight: '550px',
                    background: config.orbColor2,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'orbPulse2 12s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    top: '40%',
                    left: '40%',
                    width: '40vw',
                    height: '40vw',
                    maxWidth: '400px',
                    maxHeight: '400px',
                    background: config.orbColor3,
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    animation: 'orbPulse3 8s ease-in-out infinite',
                    pointerEvents: 'none',
                }} />

                {/* Scanline effect */}
                <div style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${config.accentColor}44, ${config.accentColor}88, ${config.accentColor}44, transparent)`,
                    animation: 'scanline 6s linear infinite',
                    pointerEvents: 'none',
                    zIndex: 1,
                }} />

                {/* Floating particles */}
                {mounted && particlePositions.map((pos, i) => (
                    <FloatingParticle
                        key={i}
                        emoji={config.particles[i % config.particles.length]}
                        delay={pos.delay}
                        x={pos.x}
                        y={pos.y}
                    />
                ))}

                {/* Main content */}
                <div
                    style={{
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '780px',
                        width: '100%',
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Rotating rings behind number */}
                    <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {/* Outer ring */}
                        <div
                            className="ring-outer"
                            style={{
                                position: 'absolute',
                                width: 'clamp(300px, 40vw, 420px)',
                                height: 'clamp(300px, 40vw, 420px)',
                                borderRadius: '50%',
                                border: `1px solid ${config.accentColor}22`,
                                animation: 'spin-slow 20s linear infinite',
                                pointerEvents: 'none',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                top: '10%',
                                right: '-4px',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: config.accentColor,
                                boxShadow: `0 0 12px ${config.accentColor}`,
                            }} />
                        </div>
                        {/* Middle ring */}
                        <div
                            className="ring-outer"
                            style={{
                                position: 'absolute',
                                width: 'clamp(240px, 33vw, 360px)',
                                height: 'clamp(240px, 33vw, 360px)',
                                borderRadius: '50%',
                                border: `1px dashed ${config.accentColor}33`,
                                animation: 'counter-spin 15s linear infinite',
                                pointerEvents: 'none',
                            }}
                        >
                            <div style={{
                                position: 'absolute',
                                bottom: '15%',
                                left: '-4px',
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: config.accentColor,
                                boxShadow: `0 0 10px ${config.accentColor}`,
                            }} />
                        </div>

                        {/* Error code */}
                        <GlitchText text={String(config.code)} accentColor={config.accentColor} />
                    </div>

                    {/* Status badge */}
                    <div
                        className={`status-badge ${config.badgeColor}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            border: '1px solid',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            marginBottom: '1.5rem',
                        }}
                    >
                        <span style={{ fontSize: '1.2em' }}>{config.icon}</span>
                        HTTP {config.code} Error
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: 'clamp(1.6rem, 5vw, 2.8rem)',
                            fontWeight: 800,
                            color: '#ffffff',
                            textAlign: 'center',
                            letterSpacing: '-0.02em',
                            marginBottom: '1rem',
                            lineHeight: 1.2,
                            fontFamily: "'Space Grotesk', sans-serif",
                            animation: 'slideUp 0.6s ease both',
                            animationDelay: '0.1s',
                        }}
                    >
                        {config.title}
                    </h1>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                            color: 'rgba(255,255,255,0.55)',
                            textAlign: 'center',
                            maxWidth: '520px',
                            lineHeight: 1.7,
                            marginBottom: '2.5rem',
                            animation: 'slideUp 0.6s ease both',
                            animationDelay: '0.2s',
                        }}
                    >
                        {config.description}
                    </p>

                    {/* Info cards */}
                    <div
                        className="info-grid"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '1rem',
                            width: '100%',
                            maxWidth: '520px',
                            marginBottom: '2.5rem',
                            animation: 'slideUp 0.6s ease both',
                            animationDelay: '0.3s',
                        }}
                    >
                        {/* Error code card */}
                        <div
                            className="glass-card"
                            style={{
                                borderRadius: '16px',
                                padding: '1.2rem',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>🔢</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Kode Error</div>
                            <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>{config.code}</div>
                        </div>

                        {/* Hint card */}
                        <div
                            className="glass-card"
                            style={{
                                borderRadius: '16px',
                                padding: '1.2rem',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>💡</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Tips</div>
                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', lineHeight: 1.5 }}>{config.hint}</div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        width: '100%',
                        maxWidth: '520px',
                        height: '1px',
                        background: `linear-gradient(90deg, transparent, ${config.accentColor}44, transparent)`,
                        marginBottom: '2.5rem',
                    }} />

                    {/* Action buttons */}
                    <div
                        className="error-actions"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '1rem',
                            justifyContent: 'center',
                            animation: 'slideUp 0.6s ease both',
                            animationDelay: '0.4s',
                        }}
                    >
                        {/* Primary button - Back */}
                        <button
                            onClick={() => window.history.back()}
                            className="error-page-btn"
                            style={{
                                padding: '0.85rem 2rem',
                                borderRadius: '100px',
                                border: 'none',
                                background: `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}bb)`,
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: `0 8px 32px ${config.accentColor}44`,
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.01em',
                            }}
                        >
                            <span>←</span>
                            Kembali
                        </button>

                        {/* Secondary button - Dashboard */}
                        <Link
                            href="/dashboard"
                            className="error-page-btn"
                            style={{
                                padding: '0.85rem 2rem',
                                borderRadius: '100px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                color: 'rgba(255,255,255,0.85)',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.01em',
                            }}
                        >
                            <span>🏠</span>
                            Dashboard
                        </Link>

                        {/* Tertiary button - Home */}
                        <Link
                            href="/"
                            className="error-page-btn"
                            style={{
                                padding: '0.85rem 2rem',
                                borderRadius: '100px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'rgba(255,255,255,0.6)',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                textDecoration: 'none',
                                fontFamily: "'Inter', sans-serif",
                                letterSpacing: '-0.01em',
                            }}
                        >
                            <span>🌐</span>
                            Beranda
                        </Link>
                    </div>

                    {/* Footer note */}
                    <p
                        style={{
                            marginTop: '3rem',
                            color: 'rgba(255,255,255,0.2)',
                            fontSize: '0.78rem',
                            textAlign: 'center',
                            letterSpacing: '0.05em',
                            animation: 'fadeIn 1s ease both',
                            animationDelay: '0.6s',
                        }}
                    >
                        siPRAS — Sistem Inventaris Aset Sekolah &nbsp;•&nbsp; Error {config.code}
                    </p>
                </div>
            </div>
        </>
    );
}
