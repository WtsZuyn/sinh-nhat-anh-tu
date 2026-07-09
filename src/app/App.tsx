import './app.css';
import React, {
  useState, useEffect, useRef, useCallback,
  useContext, createContext, useMemo,
} from 'react';
import {
  Volume2, VolumeX, ChevronDown, Music, Mic, Heart,
  Star, Gift, Mail, Sparkles, Play, Wind, Plane,
  MessageSquare, MapPin, Shield, Lock, X as XIcon,
} from 'lucide-react';

// ── Static asset paths (served from /public/assets/) ──
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const MEMORY_SRCS = [
  `${BASE}/assets/memory-01.PNG`,
  `${BASE}/assets/memory-02.jpg`,
  `${BASE}/assets/memory-03.PNG`,
  `${BASE}/assets/memory-04.png`,
  `${BASE}/assets/memory-05..jpg`,
  `${BASE}/assets/memory-06.PNG`,
  `${BASE}/assets/memory-07.JPG`,
  `${BASE}/assets/memory-08.jpg`,
  `${BASE}/assets/memory-09.jpg`,
  `${BASE}/assets/memory-10.JPG`,
  `${BASE}/assets/memory-11.jpg`,
  `${BASE}/assets/memory-12.jpg`,
];
const birthdayVideo = `${BASE}/assets/birthday-video.mp4`;
const musicSrc = `${BASE}/assets/khieu-vu-trong-tranh.mp3`;

// ═══════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════
interface Ctx {
  lang: 'vi' | 'en';
  setLang: (l: 'vi' | 'en') => void;
  audio: boolean;
  audioState: 'muted' | 'playing' | 'error';
  toggleAudio: () => void;
  fadeAudio: (targetVol: number, ms: number) => void;
  reduceMotion: boolean;
  setReduceMotion: (v: boolean) => void;
  loveMode: boolean;
  setLoveMode: (v: boolean) => void;
  chapter: number;
  setChapter: (n: number) => void;
}
const AppCtx = createContext<Ctx>({} as Ctx);
const useApp = () => useContext(AppCtx);

// ═══════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════
const CHAPTERS = ['Opening','Planets','Memories','Tunnel','Stars','Wishes','Birthday','Gift','Letter','Ending'];

const MEMORIES_DATA = [
  { id:'IMG01', en:'The first message that quietly became something important.', vi:'Tin nhắn đầu tiên, vậy mà sau này lại trở thành điều rất quan trọng.' },
  { id:'IMG02', en:'The day we started talking like home.', vi:'Ngày tụi mình bắt đầu nói chuyện với nhau như một nơi để quay về.' },
  { id:'IMG03', en:'A small moment, but it stayed.', vi:'Một khoảnh khắc nhỏ thôi, nhưng em vẫn nhớ.' },
  { id:'IMG04', en:'The first time distance felt a little less far.', vi:'Lần đầu khoảng cách bỗng thấy bớt xa.' },
  { id:'IMG05', en:'One call, one laugh, one reason to keep going.', vi:'Một cuộc gọi, một tiếng cười, một lý do để tiếp tục.' },
  { id:'IMG06', en:'Even online, you still felt close.', vi:'Dù chỉ qua màn hình, anh vẫn ở rất gần.' },
  { id:'IMG07', en:'A memory I want to keep somewhere safe.', vi:'Một kỷ niệm em muốn cất ở một nơi thật an toàn.' },
  { id:'IMG08', en:'The kind of day I wish we could replay.', vi:'Một ngày mà em ước có thể tua lại.' },
  { id:'IMG09', en:'You made ordinary days feel softer.', vi:'Anh làm những ngày bình thường trở nên dịu dàng hơn.' },
  { id:'IMG10', en:'One of the reasons I believe in us.', vi:'Một trong những lý do khiến em tin vào tụi mình.' },
  { id:'IMG11', en:'This is what missing someone looks like.', vi:'Nhớ một người có lẽ trông như thế này.' },
  { id:'IMG12', en:'Still here. Still choosing you.', vi:'Vẫn ở đây. Vẫn chọn anh.' },
];

const TIMELINE_DATA = [
  { date:'20.03.2025', vi:'Ngày đầu tụi mình làm quen', en:'First Connection', Icon: Star, caption:{ vi:'Khi tất cả bắt đầu.', en:'When it all began.' } },
  { date:'02.05.2025', vi:'Ngày tụi mình bắt đầu nói chuyện thật nhiều', en:'First Real Conversations', Icon: MessageSquare, caption:{ vi:'Giờ trôi qua nhanh như phút.', en:'Hours felt like minutes.' } },
  { date:'27.06.2025', vi:'Ngày đầu gặp nhau', en:'First Meeting', Icon: MapPin, caption:{ vi:'Khoảnh khắc màn hình biến mất.', en:'The moment the screen disappeared.' } },
  { date:'28.06.2025', vi:'Ngày tỏ tình', en:'Confession Day', Icon: Heart, caption:{ vi:'Nói ra điều mà mình đã biết.', en:'Said out loud what we already knew.' } },
  { date:'05.10.2025', vi:'Lần đầu đón một ngày đặc biệt qua màn hình', en:'First Online Celebration', sub:{ vi:'Kỷ niệm 100 ngày', en:'100-day anniversary' }, Icon: Gift, caption:{ vi:'Một chiếc bánh, hai màn hình, một cảm giác.', en:'A cake, two screens, one feeling.' } },
  { date:'07.09.2025', vi:'Khi yêu xa thật sự bắt đầu', en:'Long Distance Begins', Icon: Plane, caption:{ vi:'Khác bầu trời, vẫn là tụi mình.', en:'Different skies, same us.' } },
  { date:'09.07.2026', vi:'Khi ck iu trở thành vùng an toàn của zk iu', en:'Safe Place', Icon: Shield, caption:{ vi:'Một nơi không cần địa chỉ.', en:'A place that needs no address.' } },
  { date:'09.07.2026', vi:'Sinh nhật của ck iu', en:'His Birthday', Icon: Sparkles, caption:{ vi:'Hôm nay.', en:'Today.' } },
];

const PROMISES_DATA = [
  { n:'01', vi:'Một ngày nào đó, tụi mình sẽ cùng nhau ngắm cực quang.', en:'We will watch the aurora together one day.' },
  { n:'02', vi:'Tụi mình sẽ cùng đi trên một con đường mùa đông ở Ostrava.', en:'We will walk through a winter street in Ostrava.' },
  { n:'03', vi:'Tụi mình sẽ cùng nấu món Việt trong một căn bếp nhỏ.', en:'We will cook Vietnamese food in a small kitchen.' },
  { n:'04', vi:'Tụi mình sẽ cùng đi siêu thị như một gia đình nhỏ.', en:'We will go grocery shopping like a tiny family.' },
  { n:'05', vi:'Tụi mình sẽ đón một sinh nhật mà không còn cách nhau bởi màn hình.', en:'We will celebrate a birthday without a screen between us.' },
  { n:'06', vi:'Tụi mình sẽ uống một món gì đó thật ấm trong một đêm lạnh.', en:'We will drink something warm on a cold night.' },
  { n:'07', vi:'Tụi mình sẽ xây một nơi mà cả hai đều thấy an toàn.', en:'We will build a home that feels safe for both of us.' },
  { n:'08', vi:'Tụi mình sẽ chụp những tấm ảnh thật ngốc nghếch và giữ lại mãi.', en:'We will take silly photos and keep them forever.' },
  { n:'09', vi:'Tụi mình sẽ đi qua những ngày khó khăn bằng sự dịu dàng.', en:'We will survive hard days, gently.' },
  { n:'10', vi:'Tụi mình sẽ chọn nhau thêm nhiều lần nữa.', en:'We will choose each other again and again.' },
  { n:'11', vi:'Tụi mình sẽ biến khoảng cách thành một câu chuyện, không phải một vết thương.', en:'We will make distance become a story, not a wound.' },
  { n:'12', vi:'Tụi mình sẽ có những buổi sáng bình yên bên nhau.', en:'We will have quiet mornings together.' },
  { n:'13', vi:'Tụi mình sẽ cười khi nhớ lại khoảng thời gian này từng khó khăn ra sao.', en:'We will laugh about how hard this used to be.' },
  { n:'14', vi:'Tụi mình sẽ đứng dưới cùng một bầu trời.', en:'We will stand under the same sky.' },
];

const WISHES_DATA = [
  { vi:'Một buổi sáng mùa đông ở Ostrava, hai đứa cùng đi mua bánh mì nóng.', en:'A winter morning in Ostrava, buying warm bread together.' },
  { vi:'Lần đầu tụi mình cùng nhìn tuyết rơi qua cùng một ô cửa.', en:'The first time we watch snow fall from the same window.' },
  { vi:'Một căn bếp nhỏ, món Việt, và rất nhiều tiếng cười.', en:'A tiny kitchen, Vietnamese food, and too much laughter.' },
  { vi:'Một chuyến tram thật yên, nơi tay tụi mình không còn phải nhớ nhau nữa.', en:'A quiet tram ride where our hands finally do not have to miss each other.' },
  { vi:'Một danh sách đi chợ được viết bởi hai người đang xây một cuộc sống chung.', en:'A grocery list written by two people building one life.' },
  { vi:'Một chiếc bánh sinh nhật không còn cần cuộc gọi video nữa.', en:'A birthday cake that does not need a video call anymore.' },
  { vi:'Một đêm lạnh, một chiếc chăn, và một vùng an toàn tên là tụi mình.', en:'A cold night, one blanket, and a safe place called us.' },
  { vi:'Một chuyến đi cuối tuần đến nơi mà cả hai chưa từng đến.', en:'A weekend trip to somewhere neither of us has been.' },
  { vi:'Một ngày rất bình thường nhưng trở nên đặc biệt vì tụi mình ở cạnh nhau.', en:'A normal day that feels special because we are together.' },
  { vi:'Một ngày nào đó, không còn đếm ngược. Không còn khoảng cách. Chỉ còn tụi mình.', en:'One day, no countdown. No distance. Just us.' },
];

const NORMAL_STARS_RAW = [
  {x:45,y:42,r:.7,phase:0.2},{x:110,y:28,r:.5,phase:1.1},{x:185,y:65,r:.9,phase:2.3},{x:250,y:18,r:.6,phase:0.8},
  {x:320,y:55,r:.4,phase:1.9},{x:415,y:30,r:.8,phase:3.1},{x:488,y:72,r:.5,phase:0.5},{x:570,y:22,r:.7,phase:2.7},
  {x:645,y:48,r:.6,phase:1.4},{x:720,y:18,r:.9,phase:0.1},{x:795,y:58,r:.4,phase:3.0},{x:870,y:28,r:.7,phase:1.7},
  {x:940,y:50,r:.5,phase:2.4},{x:72,y:130,r:.6,phase:0.9},{x:158,y:158,r:.8,phase:1.3},{x:240,y:118,r:.5,phase:2.1},
  {x:345,y:148,r:.9,phase:0.6},{x:430,y:125,r:.4,phase:2.8},{x:510,y:162,r:.7,phase:1.5},{x:600,y:138,r:.6,phase:3.2},
  {x:680,y:168,r:.8,phase:0.3},{x:755,y:118,r:.5,phase:1.8},{x:828,y:142,r:.7,phase:2.5},{x:898,y:158,r:.4,phase:0.7},
  {x:960,y:125,r:.9,phase:1.2},{x:95,y:248,r:.6,phase:2.9},{x:175,y:278,r:.5,phase:0.4},{x:255,y:258,r:.8,phase:1.6},
  {x:385,y:298,r:.4,phase:2.2},{x:465,y:265,r:.7,phase:3.3},{x:545,y:282,r:.9,phase:0.0},{x:620,y:248,r:.5,phase:1.0},
  {x:710,y:268,r:.6,phase:2.6},{x:790,y:255,r:.8,phase:1.4},{x:860,y:278,r:.4,phase:3.1},{x:942,y:245,r:.7,phase:0.8},
  {x:120,y:380,r:.5,phase:2.0},{x:210,y:415,r:.8,phase:1.3},{x:300,y:390,r:.6,phase:2.7},{x:460,y:408,r:.4,phase:0.5},
  {x:540,y:378,r:.9,phase:1.9},{x:640,y:398,r:.5,phase:3.0},{x:730,y:385,r:.7,phase:0.2},{x:840,y:405,r:.6,phase:2.4},
  {x:910,y:372,r:.8,phase:1.1},
];

const PROMISE_STAR_POS = [
  {x:220,y:195},{x:285,y:158},{x:355,y:178},{x:310,y:238},{x:248,y:272},
  {x:330,y:305},{x:395,y:248},{x:655,y:188},{x:718,y:152},{x:785,y:175},
  {x:748,y:238},{x:678,y:272},{x:758,y:308},{x:822,y:252},
];
const STAR_CONNECTIONS = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,2],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[6,7]];

// ═══════════════════════════════════════════
// WEBAUDIO AMBIENT PIANO
// ═══════════════════════════════════════════
// Audio constants
const MUSIC_DEFAULT_VOL = 0.35;

// ═══════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useClock(tz: string) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}

function getBirthdayState() {
  const now = new Date();
  const bday = new Date(2026, 6, 9);
  const bdayEnd = new Date(2026, 6, 10);
  if (now < bday) return 'countdown';
  if (now < bdayEnd) return 'birthday';
  return 'past';
}

// ═══════════════════════════════════════════
// PASSWORD GATE
// ═══════════════════════════════════════════
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const [errMsg, setErrMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  useEffect(() => { setTimeout(() => inputRefs.current[0]?.focus(), 500); }, []);

  const check = useCallback((pin: string) => {
    if (pin === '971413') {
      setSuccess(true);
      setTimeout(() => onUnlock(), 1800);
    } else {
      const wc = wrongCount + 1;
      setWrongCount(wc);
      setErrMsg(wc >= 3
        ? 'Hint: ngày tụi mình bắt đầu + điều đặc biệt của tụi mình.'
        : 'Chưa đúng rồi ck iu, thử lại nha.');
      setShake(true);
      setTimeout(() => { setShake(false); setDigits(['', '', '', '', '', '']); inputRefs.current[0]?.focus(); }, 800);
    }
  }, [wrongCount, onUnlock]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const ch = val.slice(-1);
    const nd = [...digits]; nd[i] = ch;
    setDigits(nd);
    if (ch && i < 5) setTimeout(() => inputRefs.current[i + 1]?.focus(), 0);
    if (nd.every(d => d)) check(nd.join(''));
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[i]) { const nd = [...digits]; nd[i] = ''; setDigits(nd); }
      else if (i > 0) { const nd = [...digits]; nd[i - 1] = ''; setDigits(nd); inputRefs.current[i - 1]?.focus(); }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) { setDigits(text.split('')); check(text); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'radial-gradient(ellipse at 50% 40%, rgba(15,35,80,.95), #030712 70%)' }}>
      {/* bg stars */}
      {[...Array(28)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', width: 1.5 + Math.random() * 1.5, height: 1.5 + Math.random() * 1.5, borderRadius: '50%', background: 'rgba(200,230,255,.35)', top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${2 + Math.random() * 3}s ${Math.random() * 2}s ease-in-out infinite` }} />
      ))}
      {/* aurora behind card */}
      <div style={{ position: 'absolute', width: 600, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,221,253,.14), transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', animation: 'auroraFloat1 18s ease-in-out infinite' }} />

      <div style={{
        animation: shake ? 'shake 0.4s ease' : success ? 'fadeOut 1.4s 0.3s ease forwards' : 'fadeSlideUp 0.9s ease',
        maxWidth: 400, width: '100%',
        background: 'rgba(10,25,60,.75)',
        backdropFilter: 'blur(32px)',
        border: `1px solid ${shake ? 'rgba(255,100,120,.45)' : success ? 'rgba(143,221,253,.7)' : 'rgba(143,221,253,.22)'}`,
        borderRadius: 26, padding: '52px 44px',
        textAlign: 'center',
        boxShadow: success ? '0 0 100px rgba(143,221,253,.4)' : '0 0 60px rgba(143,221,253,.08)',
        transition: 'border .3s, box-shadow .4s',
      }}>
        <div style={{ fontSize: 44, marginBottom: 22, filter: 'drop-shadow(0 0 18px rgba(143,221,253,.8))', animation: success ? 'heartbeat .6s ease infinite' : 'floatSlow 3.5s ease-in-out infinite' }}>
          {success ? '💫' : '🔐'}
        </div>
        <h2 style={{ fontSize: 'clamp(1.1rem,3vw,1.45rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 8, letterSpacing: '.02em' }}>
          Mời ck iu nhập password
        </h2>
        <p style={{ color: '#AAB6C5', fontSize: '.82rem', marginBottom: 38, lineHeight: 1.6 }}>
          {success ? 'Đang mở vũ trụ…' : 'Chỉ ck iu mới mở được vũ trụ nhỏ này.'}
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 26 }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input key={i} ref={el => { inputRefs.current[i] = el; }}
              type="text" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{
                width: 48, height: 60, borderRadius: 12, textAlign: 'center',
                fontSize: '1.55rem', fontWeight: 700, fontFamily: 'Be Vietnam Pro, sans-serif',
                background: success ? 'rgba(143,221,253,.22)' : d ? 'rgba(143,221,253,.14)' : 'rgba(150,200,255,.06)',
                border: `1.5px solid ${shake ? 'rgba(255,100,120,.55)' : success ? 'rgba(143,221,253,.9)' : d ? 'rgba(143,221,253,.5)' : 'rgba(143,221,253,.18)'}`,
                color: '#8FDDFD', outline: 'none', caretColor: 'transparent',
                transition: 'all .2s',
                boxShadow: success ? '0 0 20px rgba(143,221,253,.55)' : d ? '0 0 10px rgba(143,221,253,.28)' : 'none',
              }} />
          ))}
        </div>

        {errMsg && !success && (
          <p style={{ color: wrongCount >= 3 ? '#AAB6C5' : 'rgba(255,140,150,.85)', fontSize: '.78rem', marginBottom: 20, animation: 'fadeIn .3s ease', lineHeight: 1.55 }}>
            {errMsg}
          </p>
        )}

        <button onClick={() => { if (digits.every(d => d)) check(digits.join('')); }} disabled={success}
          style={{ padding: '13px 46px', background: digits.every(d => d) ? 'rgba(143,221,253,.15)' : 'rgba(143,221,253,.05)', border: '1px solid rgba(143,221,253,.35)', borderRadius: 50, color: '#8FDDFD', cursor: digits.every(d => d) ? 'pointer' : 'default', fontSize: '.9rem', fontWeight: 600, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.05em', transition: 'all .3s' }}>
          {success ? '✦ Đang mở…' : 'Mở vũ trụ'}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ATMOSPHERE CANVAS
// ═══════════════════════════════════════════
function AtmosphereCanvas({ loveMode }: { loveMode: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reduceMotion } = useApp();
  const loveModeRef = useRef(loveMode);
  loveModeRef.current = loveMode;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const snowCount = isMobile ? 18 : 46;

    const snow = Array.from({ length: snowCount }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 2 + 0.4, s: Math.random() * 0.6 + 0.2,
      dx: (Math.random() - 0.5) * 0.4, op: Math.random() * 0.48 + 0.12, heart: false,
    }));
    const bgStars = Array.from({ length: isMobile ? 50 : 120 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      r: Math.random() * 1.1 + 0.2, phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.3, baseOp: Math.random() * 0.45 + 0.1,
    }));
    const fogs = Array.from({ length: isMobile ? 2 : 4 }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      rx: 200 + Math.random() * 260, ry: 80 + Math.random() * 120,
      dx: (Math.random() - 0.5) * 0.12, dy: (Math.random() - 0.5) * 0.06,
      op: Math.random() * 0.025 + 0.007,
    }));

    let t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      bgStars.forEach(s => {
        const op = s.baseOp + 0.22 * Math.abs(Math.sin(t * s.speed + s.phase));
        ctx.fillStyle = `rgba(215,235,255,${Math.max(0.04, op)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      if (!reduceMotion) {
        fogs.forEach(f => {
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, Math.max(f.rx, f.ry));
          grad.addColorStop(0, `rgba(143,221,253,${loveModeRef.current ? f.op * 2.8 : f.op})`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.save(); ctx.translate(f.x, f.y); ctx.scale(1, f.ry / f.rx);
          ctx.beginPath(); ctx.arc(0, 0, f.rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
          f.x += f.dx; f.y += f.dy;
          if (f.x < -f.rx) f.x = W + f.rx; if (f.x > W + f.rx) f.x = -f.rx;
          if (f.y < -f.ry) f.y = H + f.ry; if (f.y > H + f.ry) f.y = -f.ry;
        });

        snow.forEach(p => {
          if (loveModeRef.current && Math.random() < 0.002) p.heart = true;
          if (p.heart) {
            ctx.fillStyle = `rgba(255,160,185,${p.op})`; ctx.font = `${p.r * 5}px serif`;
            ctx.fillText('♡', p.x, p.y);
          } else {
            ctx.fillStyle = `rgba(210,232,255,${p.op})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
          }
          p.y += p.s; p.x += p.dx;
          if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; p.heart = false; }
          if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        });
      }

      t += 0.012; animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }} />;
}

// ═══════════════════════════════════════════
// AURORA
// ═══════════════════════════════════════════
function Aurora({ loveMode }: { loveMode: boolean }) {
  const { reduceMotion } = useApp();
  const blobs = [
    { c: '143,221,253', size: 660, top: '5%', left: '-5%', anim: 'auroraFloat1 20s ease-in-out infinite', op: loveMode ? 0.3 : 0.16 },
    { c: '167,139,250', size: 560, top: '35%', right: '-8%', anim: 'auroraFloat2 26s ease-in-out infinite', op: loveMode ? 0.25 : 0.13 },
    { c: '126,249,212', size: 490, bottom: '10%', left: '10%', anim: 'auroraFloat3 28s ease-in-out infinite', op: loveMode ? 0.23 : 0.11 },
    { c: '143,221,253', size: 380, top: '55%', right: '15%', anim: 'auroraFloat4 22s ease-in-out infinite', op: loveMode ? 0.19 : 0.09 },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', width: b.size, height: b.size, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${b.c},${b.op}) 0%, transparent 70%)`,
          filter: 'blur(70px)', animation: reduceMotion ? 'none' : b.anim,
          top: (b as any).top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
        }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// CURSOR GLOW
// ═══════════════════════════════════════════
function CursorGlow() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.innerWidth < 768) return;
    const move = (e: MouseEvent) => {
      if (!el.current) return;
      el.current.style.left = `${e.clientX - 175}px`;
      el.current.style.top = `${e.clientY - 175}px`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return (
    <div ref={el} style={{ position: 'fixed', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,221,253,.05) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 9999, mixBlendMode: 'screen', transition: 'left .1s ease, top .1s ease' }} />
  );
}

// ═══════════════════════════════════════════
// CHAPTER 1 — OPENING UNIVERSE
// ═══════════════════════════════════════════
function Ch01Opening({ onHeartDoubleClick }: { onHeartDoubleClick: (x: number, y: number) => void }) {
  const { lang, reduceMotion } = useApp();
  const hcmcTime = useClock('Asia/Ho_Chi_Minh');
  const ostravaTime = useClock('Europe/Prague');
  const [phase, setPhase] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 3200);
    const t3 = setTimeout(() => setPhase(3), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: ((e.clientY - r.top) / r.height - 0.5) * -14 });
  };

  return (
    <section id="ch-opening" className="chapter-section" onMouseMove={handleMove}>
      <div style={{ position: 'relative', marginBottom: 52 }} onDoubleClick={e => onHeartDoubleClick(e.clientX, e.clientY)}>
        {/* Orbit rings */}
        {[40, 22].map((s, i) => (
          <div key={i} style={{ position: 'absolute', inset: -s, borderRadius: '50%', border: `1px solid rgba(143,221,253,${i === 0 ? .08 : .12})`, animation: reduceMotion ? 'none' : `globeSpin ${i === 0 ? 40 : 25}s linear infinite ${i === 1 ? 'reverse' : ''}` }} />
        ))}
        {/* Globe */}
        <div style={{
          width: 250, height: 250, borderRadius: '50%',
          background: 'radial-gradient(circle at 32% 28%, rgba(230,245,255,.95) 0%, rgba(140,200,255,.7) 16%, rgba(60,120,210,.78) 38%, rgba(15,50,130,.88) 62%, rgba(3,10,36,.97) 85%, rgba(1,5,18,1) 100%)',
          boxShadow: '0 0 0 1px rgba(143,221,253,.25), 0 0 40px rgba(143,221,253,.38), 0 0 90px rgba(143,221,253,.18), 0 0 170px rgba(143,221,253,.1)',
          transform: `rotateX(${tilt.y * .3}deg) rotateY(${tilt.x * .3}deg)`,
          transition: 'transform .08s ease', position: 'relative', cursor: 'pointer',
          animation: reduceMotion ? 'none' : 'globePulse 5s ease-in-out infinite',
        }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 72% 72%, transparent 38%, rgba(143,221,253,.42) 100%)' }} />
          <div style={{ position: 'absolute', top: '12%', left: '16%', width: '28%', height: '18%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,.7) 0%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, filter: 'drop-shadow(0 0 14px rgba(143,221,253,.9))', animation: reduceMotion ? 'none' : 'heartbeat 3.2s ease-in-out infinite', userSelect: 'none' }}>♡</div>
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(170,182,197,.3)', fontSize: '.6rem', marginTop: 10, letterSpacing: '.1em' }}>
          {lang === 'vi' ? 'Nhấn đúp để khám phá' : 'Double-click to explore'}
        </p>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 600, position: 'relative', zIndex: 5 }}>
        {phase >= 1 && (
          <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp 1.4s ease forwards' }}>
            <p style={{ fontSize: 'clamp(1.2rem,2.8vw,1.8rem)', color: '#F8FAFC', lineHeight: 1.8, fontWeight: 300, letterSpacing: '.02em', whiteSpace: 'pre-line', textShadow: '0 0 30px rgba(143,221,253,.25)', marginBottom: 40 }}>
              {phase < 2
                ? (lang === 'vi' ? 'Có những khoảng cách\nkhông thể đo\nbằng kilômét.' : 'Some distances\ncannot be measured\nin kilometers.')
                : (lang === 'vi' ? '…nhưng khoảng cách của tụi mình thì được.\n8,988 km' : '…but ours can.\n8,988 km')}
            </p>
          </div>
        )}
        {phase >= 3 && (
          <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp 1.2s ease forwards' }}>
            <div style={{ display: 'flex', gap: 22, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
              {[{ city: 'Hồ Chí Minh', time: hcmcTime, flag: '🇻🇳' }, { city: 'Ostrava', time: ostravaTime, flag: '🇨🇿' }].map(c => (
                <div key={c.city} style={{ padding: '20px 26px', textAlign: 'center', minWidth: 165, background: 'rgba(150,200,255,.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(150,200,255,.16)', borderRadius: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{c.flag}</div>
                  <div style={{ color: '#AAB6C5', fontSize: '.67rem', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>{c.city}</div>
                  <div style={{ fontSize: 'clamp(1.3rem,3vw,1.75rem)', fontWeight: 700, color: '#8FDDFD', letterSpacing: '.06em', fontVariantNumeric: 'tabular-nums', textShadow: '0 0 20px rgba(143,221,253,.6)' }}>{c.time}</div>
                </div>
              ))}
            </div>
            <p style={{ color: '#AAB6C5', fontSize: '.85rem', letterSpacing: '.2em', textTransform: 'uppercase' }}>
              {lang === 'vi' ? 'Hai vũ trụ. Một khoảnh khắc.' : 'Two universes. One moment.'}
            </p>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', color: '#AAB6C5', opacity: .4, animation: reduceMotion ? 'none' : 'floatSlow 2.8s ease-in-out infinite' }}>
        <ChevronDown size={22} />
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 2 — PLANET SYNC (4-step)
// ═══════════════════════════════════════════
type SyncPhase = 0 | 1 | 2 | 3 | 4;

function Ch02Planets({ onHoldVietnam }: { onHoldVietnam: () => void }) {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView();
  const hcmcTime = useClock('Asia/Ho_Chi_Minh');
  const ostravaTime = useClock('Europe/Prague');
  const [syncPhase, setSyncPhase] = useState<SyncPhase>(0);
  const [orbitHover, setOrbitHover] = useState(false);
  const holdRef = useRef<any>(null);

  const doSync = () => {
    if (syncPhase > 0) return;
    setSyncPhase(1);
    setTimeout(() => setSyncPhase(2), 1800);
    setTimeout(() => setSyncPhase(3), 3600);
    setTimeout(() => setSyncPhase(4), 5400);
  };

  const startHold = () => { holdRef.current = setTimeout(onHoldVietnam, 5000); };
  const endHold = () => clearTimeout(holdRef.current);

  const synced = syncPhase === 4;
  const pulling = syncPhase >= 2;

  return (
    <section id="ch-planets" className="chapter-section">
      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 860, textAlign: 'center' }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14 }}>
          {lang === 'vi' ? 'Chương 02' : 'Chapter 02'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 52, textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Đồng bộ hành tinh' : 'Planet Synchronization'}
        </h2>

        <div style={{ position: 'relative', display: 'flex', gap: 'clamp(20px,6vw,80px)', justifyContent: 'center', alignItems: 'center', marginBottom: 48, flexWrap: 'wrap' }}>

          {/* Dotted signal line */}
          {syncPhase === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '18%', right: '18%', height: 1, transform: 'translateY(-50%)', background: 'repeating-linear-gradient(90deg, rgba(143,221,253,.2) 0, rgba(143,221,253,.2) 5px, transparent 5px, transparent 12px)', pointerEvents: 'none' }} />
          )}
          {/* Signal line phase 1 */}
          {syncPhase === 1 && (
            <div style={{ position: 'absolute', top: '50%', left: '18%', right: '18%', height: 1, transform: 'translateY(-50%)', background: 'linear-gradient(90deg, rgba(255,165,70,.5), rgba(143,221,253,.5))', boxShadow: '0 0 8px rgba(143,221,253,.4)', pointerEvents: 'none' }} />
          )}

          {/* Vietnam */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: pulling ? 'translateX(55px)' : 'none', transition: 'transform 2s cubic-bezier(.34,1.15,.64,1)' }}>
            <div onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold}
              style={{ width: 140, height: 140, borderRadius: '50%', cursor: 'pointer', position: 'relative', marginBottom: 22, background: 'radial-gradient(circle at 33% 28%, rgba(255,210,130,.95), rgba(220,110,45,.75) 38%, rgba(80,25,12,.92) 72%, rgba(10,5,2,.98) 100%)', boxShadow: synced ? '0 0 50px rgba(255,165,70,.55), 0 0 100px rgba(255,120,40,.28)' : '0 0 28px rgba(255,155,55,.38), 0 0 70px rgba(255,100,20,.18)', border: '1px solid rgba(255,180,80,.3)', animation: reduceMotion ? 'none' : 'float 4.5s ease-in-out infinite', transition: 'box-shadow 1.2s' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 72% 72%, transparent 38%, rgba(255,160,60,.32) 100%)' }} />
              <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1px solid rgba(255,180,80,.12)', animation: reduceMotion ? 'none' : 'globeSpin 20s linear infinite', transformOrigin: 'center', transform: 'rotateX(70deg)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌙</div>
            </div>
            <p style={{ color: '#AAB6C5', fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>Vietnam</p>
            <p style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 600, marginBottom: 14 }}>Hồ Chí Minh</p>
            <div style={{ padding: '7px 20px', background: 'rgba(150,200,255,.07)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,180,80,.2)', borderRadius: 50 }}>
              <span style={{ color: '#FFC87A', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '.95rem' }}>{hcmcTime}</span>
            </div>
          </div>

          {/* Center */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60, flexShrink: 0, position: 'relative' }}>
            {syncPhase === 1 && <p style={{ color: 'rgba(143,221,253,.7)', fontSize: '.7rem', letterSpacing: '.08em', animation: 'fadeIn .4s ease', textAlign: 'center', maxWidth: 110 }}>Đang đồng bộ hai bầu trời…</p>}
            {syncPhase === 2 && <div style={{ width: 34, height: 34, borderRadius: '50%', border: '2px solid rgba(143,221,253,.4)', borderTopColor: '#8FDDFD', animation: 'globeSpin .8s linear infinite' }} />}
            {syncPhase === 3 && [0, .28, .56].map(d => (
              <div key={d} style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(143,221,253,.3)', animation: reduceMotion ? 'none' : `energyWave 1.5s ${d}s ease-out infinite`, pointerEvents: 'none' }} />
            ))}
            {synced && (
              <div style={{ fontSize: 44, filter: 'drop-shadow(0 0 24px rgba(143,221,253,.95))', animation: reduceMotion ? 'none' : 'heartbeat 2.5s ease-in-out infinite', cursor: orbitHover ? 'pointer' : 'default', position: 'relative' }}
                onMouseEnter={() => setOrbitHover(true)} onMouseLeave={() => setOrbitHover(false)}>
                💎
                {orbitHover && (
                  <p style={{ position: 'absolute', top: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: '#8FDDFD', fontSize: '.7rem', background: 'rgba(5,14,32,.9)', backdropFilter: 'blur(12px)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 8, padding: '5px 12px', animation: 'fadeIn .3s ease', fontWeight: 500 }}>
                    8,988 km, nhưng vẫn cùng một nhịp.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Ostrava */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: pulling ? 'translateX(-55px)' : 'none', transition: 'transform 2s cubic-bezier(.34,1.15,.64,1)' }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', position: 'relative', marginBottom: 22, background: 'radial-gradient(circle at 33% 28%, rgba(215,238,255,.95), rgba(100,165,230,.7) 38%, rgba(12,35,95,.92) 72%, rgba(2,7,22,.98) 100%)', boxShadow: synced ? '0 0 50px rgba(143,221,253,.55), 0 0 100px rgba(100,175,255,.28)' : '0 0 28px rgba(100,180,255,.38), 0 0 70px rgba(143,221,253,.18)', border: '1px solid rgba(143,221,253,.28)', animation: reduceMotion ? 'none' : 'floatAlt 5s ease-in-out infinite', transition: 'box-shadow 1.2s' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 72% 72%, transparent 38%, rgba(143,221,253,.32) 100%)' }} />
              <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1px solid rgba(143,221,253,.12)', animation: reduceMotion ? 'none' : 'globeSpin 28s linear infinite', transformOrigin: 'center', transform: 'rotateX(70deg)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>❄️</div>
            </div>
            <p style={{ color: '#AAB6C5', fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: 4 }}>Czech Republic</p>
            <p style={{ color: '#F8FAFC', fontSize: '1rem', fontWeight: 600, marginBottom: 14 }}>Ostrava</p>
            <div style={{ padding: '7px 20px', background: 'rgba(150,200,255,.07)', backdropFilter: 'blur(14px)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 50 }}>
              <span style={{ color: '#8FDDFD', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: '.95rem' }}>{ostravaTime}</span>
            </div>
          </div>
        </div>

        {/* Aurora merge overlay */}
        {syncPhase === 3 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(143,221,253,.1), rgba(126,249,212,.05) 50%, transparent 70%)', animation: 'fadeIn 1.2s ease', borderRadius: '50%' }} />
        )}

        {!synced ? (
          <button onClick={doSync} disabled={syncPhase > 0} style={{ padding: '15px 44px', background: syncPhase > 0 ? 'rgba(143,221,253,.04)' : 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.38)', borderRadius: 50, color: '#8FDDFD', cursor: syncPhase > 0 ? 'wait' : 'pointer', fontSize: '.9rem', fontWeight: 500, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.04em', transition: 'all .3s' }}>
            {syncPhase === 0 ? (lang === 'vi' ? '✦ Đồng bộ thời gian' : '✦ Sync our time') : '…'}
          </button>
        ) : (
          <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp 1s ease' }}>
            <p style={{ fontSize: 'clamp(1.2rem,3vw,1.65rem)', color: '#F8FAFC', fontWeight: 300, lineHeight: 1.8 }}>
              {lang === 'vi' ? 'Khác bầu trời.' : 'Different skies.'}
            </p>
            <p style={{ fontSize: 'clamp(1.2rem,3vw,1.65rem)', color: '#8FDDFD', fontWeight: 600, textShadow: '0 0 20px rgba(143,221,253,.5)' }}>
              {lang === 'vi' ? 'Nhưng vẫn cùng một hiện tại.' : 'Same present.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 3 — FLOATING MEMORIES (centered)
// ═══════════════════════════════════════════
function Ch03Memories() {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView(0.05);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [lightbox, setLightbox] = useState<number | null>(null);

  const ROTS   = [-2.2,  1.8, -1.2,  2.4, -2.8,  1.2, -1.6,  2.8, -1.0,  1.6, -2.4,  1.0];
  const FLOATS = [ 5.8,  5.2,  6.1,  4.9,  6.4,  5.5,  5.0,  5.9,  6.3,  5.3,  6.0,  5.6];
  const DELAYS = [   0, .18,  .36,  .10,  .28,  .46,  .08,  .22,  .40,  .14,  .32,  .50];
  // alternating float/floatAlt so cards drift independently
  const ANIMS  = ['float','floatAlt','float','floatAlt','float','floatAlt','float','floatAlt','float','floatAlt','float','floatAlt'];

  const handleMouseMove = (e: React.MouseEvent, i: number) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - .5) * 20, y: ((e.clientY - r.top) / r.height - .5) * -20 });
    setHovered(i);
  };

  return (
    <section id="ch-memories" className="chapter-section" style={{ paddingTop: 80 }}>
      {/* Lightbox overlay */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(3,7,18,.88)', backdropFilter: 'blur(18px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .25s ease' }}>
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 480, width: '100%', animation: 'fadeSlideUp .3s ease' }}>
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              style={{ position: 'absolute', top: -14, right: -14, width: 36, height: 36, borderRadius: '50%', background: 'rgba(143,221,253,.12)', border: '1px solid rgba(143,221,253,.3)', color: '#8FDDFD', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
              <XIcon size={16} />
            </button>
            {/* Image */}
            <div style={{ background: 'rgba(150,200,255,.06)', backdropFilter: 'blur(24px)', border: '1px solid rgba(143,221,253,.22)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 0 60px rgba(143,221,253,.18)' }}>
              <img
                src={MEMORY_SRCS[lightbox]}
                alt={MEMORIES_DATA[lightbox].id}
                style={{ width: '100%', display: 'block', maxHeight: '70vh', objectFit: 'contain' }}
              />
              <div style={{ padding: '16px 20px' }}>
                <p style={{ color: '#F8FAFC', fontSize: '.85rem', lineHeight: 1.65, fontStyle: 'italic' }}>
                  {lang === 'vi' ? MEMORIES_DATA[lightbox].vi : MEMORIES_DATA[lightbox].en}
                </p>
                <p style={{ color: 'rgba(143,221,253,.4)', fontSize: '.62rem', letterSpacing: '.1em', marginTop: 8 }}>
                  {MEMORIES_DATA[lightbox].id}
                </p>
              </div>
            </div>
            {/* Prev / Next */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              {[['← Prev', (lightbox - 1 + 12) % 12], ['Next →', (lightbox + 1) % 12]].map(([label, idx]) => (
                <button
                  key={String(label)}
                  onClick={() => setLightbox(idx as number)}
                  style={{ padding: '8px 20px', background: 'rgba(143,221,253,.08)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 30, color: '#8FDDFD', cursor: 'pointer', fontSize: '.75rem', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 1100, margin: '0 auto' }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>
          {lang === 'vi' ? 'Chương 03' : 'Chapter 03'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 8, textAlign: 'center', textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Những ký ức nổi' : 'Floating Memories'}
        </h2>
        <p style={{ color: '#AAB6C5', marginBottom: 44, textAlign: 'center', fontSize: '.88rem' }}>
          {lang === 'vi' ? '✦ Chạm để mở một kỷ niệm' : '✦ Tap a memory to open it'}
        </p>

        {/* Centered balanced grid — 6 cols on wide, 4 on mid, 3 on mobile */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 20, width: '100%', perspective: '1200px', justifyItems: 'center' }}>
          {MEMORIES_DATA.map((m, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={m.id}
                onMouseMove={e => handleMouseMove(e, i)}
                onMouseLeave={() => { setHovered(null); setTilt({ x: 0, y: 0 }); }}
                onClick={() => setLightbox(i)}
                style={{
                  width: '100%', maxWidth: 180,
                  transform: isHov
                    ? `perspective(900px) rotateX(${tilt.y * .35}deg) rotateY(${tilt.x * .35}deg) translateZ(22px) scale(1.05) rotate(0deg)`
                    : `rotate(${ROTS[i]}deg)`,
                  transition: isHov ? 'transform .12s ease' : 'transform .45s cubic-bezier(.34,1.2,.64,1)',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  animation: reduceMotion ? 'none' : `${ANIMS[i]} ${FLOATS[i]}s ${DELAYS[i]}s ease-in-out infinite`,
                }}>
                <div style={{
                  background: 'rgba(150,200,255,.07)',
                  backdropFilter: 'blur(22px)',
                  border: `1px solid ${isHov ? 'rgba(143,221,253,.38)' : 'rgba(150,200,255,.15)'}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: isHov
                    ? '0 22px 55px rgba(143,221,253,.22), 0 0 30px rgba(143,221,253,.1)'
                    : '0 4px 22px rgba(0,0,10,.45)',
                  transition: 'border .3s, box-shadow .3s',
                }}>
                  {/* Photo */}
                  <div style={{ width: '100%', aspectRatio: '3/5', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={MEMORY_SRCS[i]}
                      alt={m.id}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .45s ease', transform: isHov ? 'scale(1.06)' : 'scale(1)' }}
                    />
                    {/* Shimmer on hover */}
                    {isHov && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(108deg, transparent 35%, rgba(143,221,253,.1) 50%, transparent 65%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s linear infinite', pointerEvents: 'none' }} />
                    )}
                    {/* Soft cyan vignette at bottom */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top, rgba(3,7,18,.6), transparent)', pointerEvents: 'none' }} />
                  </div>
                  {/* Caption */}
                  <div style={{ padding: '10px 12px' }}>
                    <p style={{ color: isHov ? '#F8FAFC' : '#7A8A9A', fontSize: '.62rem', lineHeight: 1.55, transition: 'color .3s' }}>
                      {lang === 'vi' ? m.vi : m.en}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 4 — TIME TUNNEL (updated dates)
// ═══════════════════════════════════════════
function Ch04TimeTunnel() {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView(0.05);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <section id="ch-tunnel" className="chapter-section">
      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 820 }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>
          {lang === 'vi' ? 'Chương 04' : 'Chapter 04'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 56, textAlign: 'center', textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Đường hầm thời gian' : 'Time Tunnel'}
        </h2>

        <div style={{ position: 'relative', padding: '0 20px' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(143,221,253,.35) 10%, rgba(143,221,253,.35) 90%, transparent)', transform: 'translateX(-50%)' }} />

          {TIMELINE_DATA.map((node, i) => {
            const isLeft = i % 2 === 0;
            const active = activeNode === i;
            const { Icon } = node;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: isLeft ? 'row' : 'row-reverse', alignItems: 'flex-start', marginBottom: 44, gap: 0, animation: reduceMotion ? 'none' : `fadeSlideUp 0.7s ${i * .12}s ease both` }}>
                <div style={{ flex: 1, textAlign: isLeft ? 'right' : 'left', paddingRight: isLeft ? 28 : 0, paddingLeft: isLeft ? 0 : 28 }}>
                  <div onClick={() => setActiveNode(active ? null : i)} style={{ display: 'inline-block', maxWidth: 285, cursor: 'pointer', padding: '14px 18px', background: active ? 'rgba(143,221,253,.1)' : 'rgba(150,200,255,.05)', backdropFilter: 'blur(16px)', border: `1px solid ${active ? 'rgba(143,221,253,.38)' : 'rgba(150,200,255,.12)'}`, borderRadius: 14, transition: 'all .3s ease', boxShadow: active ? '0 0 22px rgba(143,221,253,.15)' : 'none' }}>
                    <p style={{ color: '#8FDDFD', fontSize: '.68rem', letterSpacing: '.1em', marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{node.date}</p>
                    <p style={{ color: '#F8FAFC', fontWeight: 600, fontSize: '.9rem', lineHeight: 1.4 }}>{lang === 'vi' ? node.vi : node.en}</p>
                    {(node as any).sub && <p style={{ color: '#8FDDFD', fontSize: '.7rem', marginTop: 3 }}>{lang === 'vi' ? (node as any).sub.vi : (node as any).sub.en}</p>}
                    {active && <p style={{ color: '#AAB6C5', fontSize: '.77rem', marginTop: 8, animation: 'fadeIn .3s ease', lineHeight: 1.5 }}>{lang === 'vi' ? node.caption.vi : node.caption.en}</p>}
                  </div>
                </div>
                <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 14 }}>
                  <div onClick={() => setActiveNode(active ? null : i)} style={{ width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', background: active ? 'radial-gradient(circle, rgba(143,221,253,.65), rgba(7,17,31,.6))' : 'radial-gradient(circle, rgba(143,221,253,.25), rgba(3,7,18,.8))', border: '1px solid rgba(143,221,253,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FDDFD', boxShadow: active ? '0 0 24px rgba(143,221,253,.6)' : '0 0 8px rgba(143,221,253,.15)', transition: 'all .3s ease' }}>
                    <Icon size={13} />
                  </div>
                </div>
                <div style={{ flex: 1 }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 5 — PROMISE CONSTELLATION
// ═══════════════════════════════════════════
function Ch05Constellation({ onSecretStar }: { onSecretStar: () => void }) {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView(0.1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoveredRef = useRef<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const openedRef = useRef<Set<number>>(new Set());
  const [activePromise, setActivePromise] = useState<number | null>(null);
  const [popover, setPopover] = useState<{ x: number; y: number; idx: number } | null>(null);
  const [openedPromises, setOpenedPromises] = useState<Set<number>>(new Set());
  const [allOpened, setAllOpened] = useState(false);

  useEffect(() => { activeRef.current = activePromise; }, [activePromise]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animId: number;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize(); window.addEventListener('resize', resize);

    const draw = (ts: number) => {
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      ctx.clearRect(0, 0, W, H);
      const sx = W / 1000, sy = H / 500;

      NORMAL_STARS_RAW.forEach((s, i) => {
        const op = .18 + .28 * Math.abs(Math.sin(ts * .0004 * (.6 + (i % 5) * .1) + s.phase));
        ctx.fillStyle = `rgba(210,235,255,${op})`;
        ctx.beginPath(); ctx.arc(s.x * sx, s.y * sy, s.r, 0, Math.PI * 2); ctx.fill();
      });

      STAR_CONNECTIONS.forEach(([a, b]) => {
        const pa = PROMISE_STAR_POS[a], pb = PROMISE_STAR_POS[b];
        const bothOpen = openedRef.current.has(a) && openedRef.current.has(b);
        ctx.save();
        ctx.strokeStyle = bothOpen ? 'rgba(143,221,253,.32)' : 'rgba(143,221,253,.12)';
        ctx.lineWidth = .8; ctx.setLineDash([4, 9]);
        ctx.beginPath(); ctx.moveTo(pa.x * sx, pa.y * sy); ctx.lineTo(pb.x * sx, pb.y * sy); ctx.stroke();
        ctx.setLineDash([]); ctx.restore();
        const t = ((ts * .00045) + (a + b) * .07) % 1;
        const px = (pa.x + (pb.x - pa.x) * t) * sx, py = (pa.y + (pb.y - pa.y) * t) * sy;
        ctx.save(); ctx.shadowBlur = 6; ctx.shadowColor = '#8FDDFD';
        ctx.fillStyle = 'rgba(143,221,253,.7)'; ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });

      PROMISE_STAR_POS.forEach((s, i) => {
        const hov = hoveredRef.current === i;
        const act = activeRef.current === i;
        const opened = openedRef.current.has(i);
        const r = act ? 8.5 : hov ? 7.5 : 5.5;
        const pulse = opened ? 1 + .18 * Math.sin(ts * .0025 + i * .4) : 1 + .1 * Math.sin(ts * .0015 + i * .4);
        ctx.save(); ctx.shadowBlur = act ? 22 : hov ? 16 : opened ? 12 : 7; ctx.shadowColor = '#8FDDFD';
        ctx.fillStyle = act ? '#8FDDFD' : opened ? 'rgba(143,221,253,.88)' : 'rgba(143,221,253,.65)';
        ctx.beginPath(); ctx.arc(s.x * sx, s.y * sy, r * pulse, 0, Math.PI * 2); ctx.fill();
        if (act) {
          ctx.strokeStyle = 'rgba(143,221,253,.35)'; ctx.lineWidth = 1.5;
          const rr = (r + 8) + 6 * Math.abs(Math.sin(ts * .006));
          ctx.beginPath(); ctx.arc(s.x * sx, s.y * sy, rr, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = 'rgba(143,221,253,.45)'; ctx.font = `bold 8px 'Be Vietnam Pro',sans-serif`; ctx.textAlign = 'center';
        ctx.fillText(PROMISES_DATA[i].n, s.x * sx, s.y * sy - 14);
      });

      const secOp = .07 + .07 * Math.abs(Math.sin(ts * .0008));
      ctx.fillStyle = `rgba(255,255,255,${hoveredRef.current === -1 ? .3 : secOp})`;
      ctx.beginPath(); ctx.arc(928 * sx, 58 * sy, hoveredRef.current === -1 ? 2.8 : 1.8, 0, Math.PI * 2); ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const getCC = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { mx: (e.clientX - rect.left) / rect.width * 1000, my: (e.clientY - rect.top) / rect.height * 500, rect };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my } = getCC(e);
    if (Math.hypot(mx - 928, my - 58) < 18) { hoveredRef.current = -1; canvasRef.current!.style.cursor = 'pointer'; return; }
    let found = -1;
    PROMISE_STAR_POS.forEach((s, i) => { if (Math.hypot(mx - s.x, my - s.y) < 22) found = i; });
    hoveredRef.current = found >= 0 ? found : null;
    canvasRef.current!.style.cursor = found !== -1 ? 'pointer' : 'default';
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const { mx, my, rect } = getCC(e);
    if (Math.hypot(mx - 928, my - 58) < 18) { onSecretStar(); return; }
    let found = -1;
    PROMISE_STAR_POS.forEach((s, i) => { if (Math.hypot(mx - s.x, my - s.y) < 22) found = i; });
    if (found !== -1) {
      const newActive = found === activePromise ? null : found;
      setActivePromise(newActive); activeRef.current = newActive;
      if (newActive !== null) {
        setOpenedPromises(prev => {
          const next = new Set(prev); next.add(found);
          openedRef.current = next;
          if (next.size === 14) setAllOpened(true);
          return next;
        });
        const sx = rect.width / 1000, sy = rect.height / 500;
        setPopover({ x: PROMISE_STAR_POS[found].x * sx + rect.left, y: PROMISE_STAR_POS[found].y * sy + rect.top, idx: found });
      } else setPopover(null);
    } else { setActivePromise(null); activeRef.current = null; setPopover(null); }
  }, [activePromise, onSecretStar]);

  return (
    <section id="ch-constellation" className="chapter-section">
      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 1000 }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>
          {lang === 'vi' ? 'Chương 05' : 'Chapter 05'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 8, textAlign: 'center', textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Chòm sao lời hứa' : 'Promise Constellation'}
        </h2>
        <p style={{ color: '#AAB6C5', marginBottom: 4, textAlign: 'center', fontSize: '.88rem' }}>
          {lang === 'vi' ? 'Mười bốn lời hứa nhỏ, nằm giữa Việt Nam và Séc.' : 'Fourteen little promises, waiting somewhere between Vietnam and Czechia.'}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ padding: '6px 18px', background: 'rgba(143,221,253,.07)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 50 }}>
            <span style={{ color: openedPromises.size === 14 ? '#7EF9D4' : '#8FDDFD', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.1em' }}>
              {openedPromises.size}/14 {lang === 'vi' ? 'lời hứa đã mở' : 'promises revealed'}
            </span>
          </div>
        </div>

        <canvas ref={canvasRef} style={{ width: '100%', height: 400, display: 'block', borderRadius: 20, cursor: 'default' }}
          onMouseMove={handleMouseMove} onClick={handleClick} onMouseLeave={() => { hoveredRef.current = null; }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, padding: '0 14px', flexWrap: 'wrap', gap: 4 }}>
          <p style={{ color: 'rgba(170,182,197,.3)', fontSize: '.68rem', letterSpacing: '.1em' }}>🌸 Hồ Chí Minh</p>
          <p style={{ color: 'rgba(170,182,197,.3)', fontSize: '.68rem', letterSpacing: '.1em' }}>❄️ Ostrava</p>
        </div>

        {allOpened && (
          <div style={{ marginTop: 32, padding: '22px 28px', background: 'rgba(126,249,212,.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(126,249,212,.28)', borderRadius: 18, textAlign: 'center', animation: 'fadeSlideUp .6s ease', boxShadow: '0 0 40px rgba(126,249,212,.12)' }}>
            <p style={{ color: '#7EF9D4', fontSize: '.72rem', letterSpacing: '.1em', marginBottom: 10 }}>✦ {lang === 'vi' ? 'Đã mở đủ 14 lời hứa' : 'All 14 promises revealed'}</p>
            <p style={{ color: '#F8FAFC', fontSize: '1rem', lineHeight: 1.7 }}>
              {lang === 'vi' ? 'Ck iu đã mở hết 14 lời hứa.\nGiờ thì tụi mình giữ chúng cùng nhau nha.' : 'You found all 14 promises.\nNow we keep them together.'}
            </p>
          </div>
        )}
      </div>

      {popover && activePromise !== null && (
        <div onClick={e => e.stopPropagation()} style={{
          position: 'fixed',
          left: Math.min(Math.max(popover.x - 155, 12), window.innerWidth - 322),
          top: Math.max(popover.y - 145, 72),
          width: 310, zIndex: 300,
          background: 'rgba(5,14,32,.92)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(143,221,253,.32)', borderRadius: 16, padding: '18px 22px',
          boxShadow: '0 0 40px rgba(143,221,253,.12)', animation: 'fadeSlideUp .3s ease',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <p style={{ color: '#8FDDFD', fontSize: '.65rem', letterSpacing: '.12em', fontWeight: 600, marginBottom: 2 }}>Lời hứa #{PROMISES_DATA[activePromise].n}</p>
              {openedPromises.has(activePromise) && <p style={{ color: 'rgba(126,249,212,.6)', fontSize: '.6rem' }}>✓ {lang === 'vi' ? 'Đã mở' : 'Revealed'}</p>}
            </div>
            <button onClick={() => { setActivePromise(null); activeRef.current = null; setPopover(null); }} style={{ background: 'none', border: 'none', color: '#AAB6C5', cursor: 'pointer', fontSize: 16, padding: '0 0 0 8px' }}>×</button>
          </div>
          <p style={{ color: '#F8FAFC', fontSize: '.9rem', lineHeight: 1.7, marginBottom: 8 }}>
            {lang === 'vi' ? PROMISES_DATA[activePromise].vi : PROMISES_DATA[activePromise].en}
          </p>
          {lang === 'en' && <p style={{ color: 'rgba(170,182,197,.55)', fontSize: '.72rem', lineHeight: 1.6 }}>{PROMISES_DATA[activePromise].vi}</p>}
        </div>
      )}
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 6 — WISH MACHINE
// ═══════════════════════════════════════════
function Ch06WishMachine() {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView();
  const [wish, setWish] = useState<typeof WISHES_DATA[0] | null>(null);
  const [wishKey, setWishKey] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [filledBars, setFilledBars] = useState(0);
  const [wishQueue, setWishQueue] = useState<number[]>([]);
  const [wishCount, setWishCount] = useState(0);
  const [showCapsuleMsg, setShowCapsuleMsg] = useState(false);
  const capsuleHoldRef = useRef<any>(null);

  const generate = () => {
    if (generating) return;
    setGenerating(true); setFilledBars(0); setWish(null);
    for (let i = 1; i <= 5; i++) setTimeout(() => setFilledBars(i), i * 240);
    setTimeout(() => {
      let queue = wishQueue;
      if (queue.length === 0) queue = [...Array(10).keys()].sort(() => Math.random() - .5);
      const idx = queue[0];
      setWishQueue(queue.slice(1));
      setWish(WISHES_DATA[idx]);
      setWishKey(k => k + 1);
      setWishCount(c => c + 1);
      setGenerating(false);
    }, 5 * 240 + 300);
  };

  const startCapsuleHold = () => {
    let prog = 0;
    capsuleHoldRef.current = setInterval(() => {
      prog += 100 / 30;
      if (prog >= 100) { clearInterval(capsuleHoldRef.current); setShowCapsuleMsg(true); setTimeout(() => setShowCapsuleMsg(false), 4500); }
    }, 100);
  };
  const endCapsuleHold = () => clearInterval(capsuleHoldRef.current);

  const displayCount = ((wishCount - 1) % 10) + 1;

  return (
    <section id="ch-wish" className="chapter-section" style={{ minHeight: '80vh' }}>
      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 700, textAlign: 'center' }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14 }}>
          {lang === 'vi' ? 'Chương 06' : 'Chapter 06'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 8, textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Cỗ máy điều ước' : 'Wish Machine'}
        </h2>
        <p style={{ color: '#AAB6C5', marginBottom: 48, fontSize: '.9rem', lineHeight: 1.65 }}>
          {lang === 'vi' ? 'Bấm để mở ra một tương lai nhỏ mà tụi mình có thể cùng sống.' : 'Press the button to generate one tiny future we might live together.'}
        </p>

        {/* Capsule machine */}
        <div style={{ position: 'relative', width: 240, height: 320, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onPointerDown={startCapsuleHold} onPointerUp={endCapsuleHold} onPointerLeave={endCapsuleHold}
            style={{ width: '100%', height: '100%', borderRadius: 44, background: 'rgba(150,200,255,.055)', backdropFilter: 'blur(24px)', border: '1px solid rgba(143,221,253,.2)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: generating ? '0 0 70px rgba(143,221,253,.3)' : '0 0 22px rgba(143,221,253,.08)', transition: 'box-shadow .5s', cursor: 'pointer' }}>
            {generating && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(143,221,253,.07) 50%, transparent 70%)', backgroundSize: '200% 100%', animation: 'shimmer .7s linear infinite' }} />}
            {generating && [0, .2, .4].map(d => (
              <div key={d} style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(143,221,253,.3)', animation: reduceMotion ? 'none' : `energyRing .9s ${d}s ease-out infinite` }} />
            ))}
            <div style={{ width: 100, height: 136, borderRadius: 50, background: 'radial-gradient(ellipse at 32% 24%, rgba(210,242,255,.9), rgba(75,155,225,.6) 38%, rgba(8,28,90,.96) 100%)', border: '1px solid rgba(143,221,253,.38)', boxShadow: '0 0 28px rgba(143,221,253,.28), inset 0 0 18px rgba(143,221,253,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, animation: reduceMotion ? 'none' : 'floatSlow 4.2s ease-in-out infinite', marginBottom: 16 }}>✨</div>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ position: 'absolute', bottom: 18, left: `${22 + i * 18}%`, width: 1, height: 24, background: 'linear-gradient(to top, rgba(143,221,253,.22), transparent)', animation: reduceMotion ? 'none' : `floatSlow ${2.2 + i * .25}s ${i * .18}s ease-in-out infinite` }} />
            ))}
            <p style={{ color: '#AAB6C5', fontSize: '.64rem', letterSpacing: '.1em', position: 'relative', zIndex: 1 }}>
              {lang === 'vi' ? 'Máy tương lai' : 'Future Generator'}
            </p>
          </div>
        </div>

        {/* Energy bars */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 36 }}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} style={{ width: 12, height: 40, borderRadius: 6, background: 'rgba(143,221,253,.08)', border: '1px solid rgba(143,221,253,.15)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${filledBars >= n ? 100 : 0}%`, background: 'linear-gradient(to top, #8FDDFD, #7EF9D4)', transition: 'height .28s ease', boxShadow: '0 0 8px rgba(143,221,253,.5)' }} />
            </div>
          ))}
        </div>

        {showCapsuleMsg && (
          <div style={{ padding: '14px 22px', background: 'rgba(143,221,253,.08)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 14, marginBottom: 24, animation: 'fadeSlideUp .4s ease' }}>
            <p style={{ color: 'rgba(143,221,253,.8)', fontSize: '.82rem', lineHeight: 1.65, fontStyle: 'italic' }}>
              {lang === 'vi' ? 'Có những tương lai nhỏ, nhưng đủ làm zk iu cố gắng thêm một chút.' : 'Some futures are small, but enough to keep trying.'}
            </p>
          </div>
        )}

        {wish && (
          <div key={wishKey} style={{ padding: '24px 28px', marginBottom: 28, background: 'rgba(150,200,255,.08)', backdropFilter: 'blur(22px)', border: '1px solid rgba(143,221,253,.22)', borderRadius: 18, animation: reduceMotion ? 'none' : 'capsuleOpen .55s cubic-bezier(.34,1.56,.64,1) forwards', transformOrigin: 'top center', boxShadow: '0 0 36px rgba(143,221,253,.08)' }}>
            <p style={{ color: '#7EF9D4', fontSize: '.65rem', letterSpacing: '.12em', marginBottom: 8 }}>
              {lang === 'vi' ? `✦ Điều ước tương lai #${String(displayCount).padStart(2, '0')}/10` : `✦ Future wish #${String(displayCount).padStart(2, '0')}/10`}
            </p>
            <p style={{ color: '#F8FAFC', fontSize: '1rem', lineHeight: 1.75 }}>{lang === 'vi' ? wish.vi : wish.en}</p>
          </div>
        )}

        <button onClick={generate} disabled={generating} style={{ padding: '15px 48px', background: generating ? 'rgba(143,221,253,.04)' : 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.38)', borderRadius: 50, color: '#8FDDFD', cursor: generating ? 'wait' : 'pointer', fontSize: '.92rem', fontWeight: 500, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.04em', transition: 'all .3s' }}>
          {generating ? '…' : (wish ? (lang === 'vi' ? '✦ Tạo tương lai khác' : '✦ Generate another') : (lang === 'vi' ? '✦ Tạo một tương lai' : '✦ Generate a future'))}
        </button>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 7 — BIRTHDAY CAKE + CANDLE
// ═══════════════════════════════════════════
type CakePhase = 'lit' | 'wishing' | 'countdown' | 'blowing' | 'blown';

function BirthdayCake({ cakePhase, reduceMotion, onHoldStart, onHoldEnd, holdProgress }: {
  cakePhase: CakePhase;
  reduceMotion: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
  holdProgress: number;
}) {
  const isBlown = cakePhase === 'blown';
  const isBlowing = cakePhase === 'blowing';

  // SVG circle arc for the hold-progress ring around the flame
  const RING_R = 28;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C * (1 - holdProgress / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>

      {/* ── CANDLE ZONE (top of cake) ── */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, paddingBottom: 0 }}>

        {/* Hold-progress ring (visible during 'blowing' phase) */}
        {isBlowing && (
          <svg width={74} height={74} style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', zIndex: 2 }}>
            <circle cx={37} cy={37} r={RING_R} fill="none" stroke="rgba(143,221,253,.12)" strokeWidth={2.5} />
            <circle
              cx={37} cy={37} r={RING_R}
              fill="none" stroke="#8FDDFD" strokeWidth={2.5} strokeLinecap="round"
              strokeDasharray={RING_C} strokeDashoffset={ringOffset}
              transform="rotate(-90 37 37)"
              style={{ transition: 'stroke-dashoffset .08s linear', filter: 'drop-shadow(0 0 4px rgba(143,221,253,.8))' }}
            />
          </svg>
        )}

        {/* Flame / smoke — rendered ABOVE the candle body */}
        {!isBlown ? (
          <div style={{ position: 'relative', marginBottom: 0, zIndex: 3 }}>
            {/* Outer ambient glow */}
            <div style={{
              position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
              width: 32, height: 38, borderRadius: '50%',
              background: 'rgba(255,175,50,.22)', filter: 'blur(10px)',
              pointerEvents: 'none',
            }} />
            {/* Inner tight glow */}
            <div style={{
              position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)',
              width: 18, height: 22, borderRadius: '50%',
              background: 'rgba(255,220,80,.35)', filter: 'blur(5px)',
              pointerEvents: 'none',
            }} />
            {/* Flame shape */}
            <div style={{
              width: 16, height: 30,
              borderRadius: '50% 50% 35% 35% / 60% 60% 40% 40%',
              background: 'linear-gradient(to top, rgba(255,90,0,1) 0%, rgba(255,200,40,1) 55%, rgba(255,255,200,.9) 100%)',
              filter: 'drop-shadow(0 0 7px rgba(255,160,40,.95))',
              animation: isBlowing
                ? (reduceMotion ? 'none' : 'flickerFast .12s ease-in-out infinite')
                : (reduceMotion ? 'none' : 'flicker .4s ease-in-out infinite'),
              position: 'relative', zIndex: 1,
            }} />
          </div>
        ) : (
          /* Smoke wisps after blow */
          <div style={{ position: 'relative', width: 16, height: 34, marginBottom: 0 }}>
            {[0, 1, 2].map(d => (
              <div key={d} style={{
                position: 'absolute', left: `${20 + d * 20}%`, bottom: 0,
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(200,225,255,.45)',
                animation: reduceMotion ? 'none' : `smokeRiseUp 1.8s ${d * .4}s ease-out infinite`,
              }} />
            ))}
          </div>
        )}

        {/* Wick (tiny dark line between flame and candle body) */}
        <div style={{ width: 2, height: 6, background: 'rgba(30,20,10,.7)', borderRadius: 1, marginTop: -2, position: 'relative', zIndex: 2 }} />

        {/* Candle body — stands on top of the cake */}
        <div
          onPointerDown={isBlowing ? onHoldStart : undefined}
          onPointerUp={isBlowing ? onHoldEnd : undefined}
          onPointerLeave={isBlowing ? onHoldEnd : undefined}
          style={{
            width: 18, height: 70,
            background: 'linear-gradient(to bottom, rgba(230,242,255,.96) 0%, rgba(180,215,250,.88) 40%, rgba(130,175,235,.82) 100%)',
            borderRadius: '4px 4px 3px 3px',
            boxShadow: isBlown
              ? '0 0 8px rgba(143,221,253,.2)'
              : '0 0 14px rgba(143,221,253,.55), inset 2px 0 4px rgba(255,255,255,.35)',
            position: 'relative', zIndex: 2,
            cursor: isBlowing ? 'pointer' : 'default',
            transition: 'box-shadow .6s',
          }}>
          {/* Candle highlight stripe */}
          <div style={{ position: 'absolute', top: 4, left: 3, width: 4, bottom: 4, borderRadius: 2, background: 'rgba(255,255,255,.38)' }} />
          {/* Wax drip — flows downward from side of candle */}
          {!isBlown && (
            <div style={{
              position: 'absolute', top: 12, right: -3,
              width: 7, height: 0,
              background: 'linear-gradient(to bottom, rgba(200,228,255,.9), rgba(160,200,245,.6))',
              borderRadius: '0 2px 3px 3px',
              animation: cakePhase === 'lit' && !reduceMotion ? 'waxDrip 7s 1.5s ease-out forwards' : 'none',
            }} />
          )}
          {/* Second wax drip on opposite side */}
          {!isBlown && (
            <div style={{
              position: 'absolute', top: 22, left: -3,
              width: 6, height: 0,
              background: 'linear-gradient(to bottom, rgba(200,228,255,.8), rgba(160,200,245,.5))',
              borderRadius: '0 2px 3px 3px',
              animation: cakePhase === 'lit' && !reduceMotion ? 'waxDrip 9s 4s ease-out forwards' : 'none',
            }} />
          )}
        </div>
      </div>

      {/* ── TOP FROSTING (on top of the cake, connects candle to top tier) ── */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Frosting dollops */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: -6 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: i === 2 ? 22 : 18, height: i === 2 ? 16 : 13,
              borderRadius: '50% 50% 0 0',
              background: 'linear-gradient(to bottom, rgba(240,250,255,.9), rgba(200,230,250,.75))',
              boxShadow: '0 0 6px rgba(143,221,253,.3)',
            }} />
          ))}
        </div>
      </div>

      {/* ── TOP TIER (narrowest, sits below frosting) ── */}
      <div style={{
        width: 130, height: 60,
        background: 'linear-gradient(to bottom, rgba(18,52,130,.92) 0%, rgba(10,35,100,.97) 100%)',
        border: '1px solid rgba(143,221,253,.28)',
        borderRadius: '2px 2px 0 0',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 0 18px rgba(143,221,253,.1), inset 0 1px 0 rgba(143,221,253,.12)',
        zIndex: 1,
      }}>
        {/* Subtle glass reflection */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,.06) 0%, transparent 50%)' }} />
        {/* Star decorations */}
        {['✦', '✧', '✦'].map((s, i) => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: `${22 + i * 28}%`, transform: 'translateY(-50%)', fontSize: 10, color: 'rgba(143,221,253,.5)' }}>{s}</div>
        ))}
      </div>

      {/* ── MID FROSTING LAYER ── */}
      <div style={{
        width: 160, height: 10,
        background: 'linear-gradient(to bottom, rgba(230,245,255,.82), rgba(190,225,250,.65))',
        boxShadow: '0 2px 8px rgba(143,221,253,.2)',
        position: 'relative', zIndex: 2,
      }}>
        {/* Frosting drips on the sides */}
        {[-1, 1].map(side => (
          <div key={side} style={{
            position: 'absolute', top: 4, [side === -1 ? 'left' : 'right']: -4,
            width: 8, height: 12,
            background: 'rgba(220,240,255,.7)',
            borderRadius: '0 0 5px 5px',
          }} />
        ))}
      </div>

      {/* ── BASE TIER (widest, at the bottom) ── */}
      <div style={{
        width: 230, height: 80,
        background: 'linear-gradient(to bottom, rgba(22,58,148,.92) 0%, rgba(8,28,90,.97) 100%)',
        border: '1px solid rgba(143,221,253,.22)',
        borderRadius: '0 0 4px 4px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,20,.5), 0 0 20px rgba(143,221,253,.08)',
        zIndex: 1,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,.05) 0%, transparent 50%)' }} />
        {/* Berry / dot decorations */}
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ position: 'absolute', top: '50%', left: `${10 + i * 20}%`, transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', background: 'rgba(167,139,250,.45)', boxShadow: '0 0 5px rgba(167,139,250,.3)' }} />
        ))}
        {/* Subtle horizontal stripe */}
        <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 1, background: 'rgba(143,221,253,.08)' }} />
        <div style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 1, background: 'rgba(143,221,253,.06)' }} />
      </div>

      {/* ── CAKE PLATE ── */}
      <div style={{
        width: 264, height: 12,
        background: 'linear-gradient(to bottom, rgba(160,210,255,.25), rgba(100,160,230,.12))',
        border: '1px solid rgba(143,221,253,.18)',
        borderRadius: '0 0 8px 8px',
        boxShadow: '0 4px 16px rgba(0,0,20,.35)',
      }} />
    </div>
  );
}

function Ch07Countdown() {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView();
  const bdState = useMemo(() => getBirthdayState(), []);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [cakePhase, setCakePhase] = useState<CakePhase>('lit');
  const [cdNum, setCdNum] = useState(3);
  const [hasMic, setHasMic] = useState<boolean | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const micRef = useRef<any>(null);
  const holdIntervalRef = useRef<any>(null);
  const holdProgressRef = useRef(0);

  useEffect(() => {
    if (bdState !== 'countdown') return;
    const target = new Date('2026-07-09T00:00:00');
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [bdState]);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleWish = () => {
    setCakePhase('wishing');
    setTimeout(() => {
      setCakePhase('countdown'); setCdNum(3);
      let c = 3;
      const iv = setInterval(() => {
        c--; setCdNum(c);
        if (c <= 0) { clearInterval(iv); setCakePhase('blowing'); tryMic(); }
      }, 1000);
    }, 2800);
  };

  const tryMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasMic(true);
      const ac = new AudioContext();
      const src = ac.createMediaStreamSource(stream);
      const ana = ac.createAnalyser(); ana.fftSize = 256;
      src.connect(ana);
      const buf = new Uint8Array(ana.frequencyBinCount);
      micRef.current = setInterval(() => {
        ana.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        if (avg > 45) { clearInterval(micRef.current); stream.getTracks().forEach(t => t.stop()); ac.close(); blowCandle(); }
      }, 80);
    } catch { setHasMic(false); }
  };

  // Hold-to-blow mechanic (3 s hold)
  const startHold = () => {
    clearInterval(holdIntervalRef.current);
    holdProgressRef.current = 0;
    holdIntervalRef.current = setInterval(() => {
      holdProgressRef.current = Math.min(100, holdProgressRef.current + 100 / (3000 / 60));
      setHoldProgress(holdProgressRef.current);
      if (holdProgressRef.current >= 100) { clearInterval(holdIntervalRef.current); blowCandle(); }
    }, 60);
  };
  const endHold = () => {
    clearInterval(holdIntervalRef.current);
    if (holdProgressRef.current < 100) { holdProgressRef.current = 0; setHoldProgress(0); }
  };

  const blowCandle = () => { setHoldProgress(100); setCakePhase('blown'); };

  const confetti = useMemo(() => cakePhase === 'blown'
    ? Array.from({ length: 55 }, (_, i) => ({ x: Math.random() * 100, delay: Math.random() * 2.5, dur: Math.random() * 3 + 3, color: ['#8FDDFD', '#7EF9D4', '#A78BFA', '#F8FAFC', '#FFB6C1', '#FDE68A'][i % 6], w: 5 + Math.random() * 7, h: 3 + Math.random() * 5 }))
    : [], [cakePhase]);

  return (
    <section id="ch-birthday" className="chapter-section" style={{ overflow: 'hidden', position: 'relative' }}>
      {cakePhase === 'blown' && !reduceMotion && confetti.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: -24, width: c.w, height: c.h, background: c.color, borderRadius: 2, animation: `confettiFall ${c.dur}s ${c.delay}s ease-in infinite`, zIndex: 10, pointerEvents: 'none' }} />
      ))}

      {/* Soft glow pulse when blown */}
      {cakePhase === 'blown' && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 45%, rgba(143,221,253,.12), transparent 65%)', animation: reduceMotion ? 'none' : 'auroraFloat1 4s ease-in-out infinite', zIndex: 0 }} />
      )}

      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ textAlign: 'center', position: 'relative', zIndex: 5, width: '100%', maxWidth: 720 }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14 }}>
          {lang === 'vi' ? 'Chương 07' : 'Chapter 07'}
        </p>

        {/* ── COUNTDOWN MODE ── */}
        {bdState === 'countdown' && (
          <>
            <p style={{ color: '#AAB6C5', fontSize: '.92rem', marginBottom: 48, lineHeight: 1.65 }}>
              {lang === 'vi' ? 'Đếm ngược đến ngày của ck iu.' : 'Counting down to your day, ck iu.'}
            </p>
            <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[{ v: timeLeft.d, l: lang === 'vi' ? 'Ngày' : 'Days' }, { v: timeLeft.h, l: lang === 'vi' ? 'Giờ' : 'Hours' }, { v: timeLeft.m, l: lang === 'vi' ? 'Phút' : 'Min' }, { v: timeLeft.s, l: lang === 'vi' ? 'Giây' : 'Sec' }].map(({ v, l }) => (
                <div key={l} style={{ padding: '22px 26px', minWidth: 96, background: 'rgba(150,200,255,.07)', backdropFilter: 'blur(20px)', border: '1px solid rgba(150,200,255,.14)', borderRadius: 18 }}>
                  <div style={{ fontSize: 'clamp(2.2rem,6vw,3.8rem)', fontWeight: 700, color: '#8FDDFD', fontVariantNumeric: 'tabular-nums', lineHeight: 1, textShadow: '0 0 30px rgba(143,221,253,.6)' }}>{pad(v)}</div>
                  <p style={{ color: '#AAB6C5', fontSize: '.68rem', letterSpacing: '.12em', marginTop: 8 }}>{l}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── BIRTHDAY / PAST MODE ── */}
        {(bdState === 'birthday' || bdState === 'past') && (
          <>
            <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg,#8FDDFD 0%,#7EF9D4 50%,#A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.15, whiteSpace: 'pre-line' }}>
              {bdState === 'birthday' ? (lang === 'vi' ? 'Chúc mừng sinh nhật\nck iu.' : 'Happy Birthday,\nck iu.') : (lang === 'vi' ? 'Sinh nhật anh đã qua, nhưng vũ trụ nhỏ này vẫn ở đây.' : 'Your birthday has passed, but this little universe is still here.')}
            </h2>
            <p style={{ color: '#AAB6C5', fontSize: '.9rem', letterSpacing: '.1em', marginBottom: 44 }}>09 · 07 · 2026</p>

            {bdState === 'birthday' && (
              <>
                {/* The cake — always visible, centered */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40, transition: 'filter .8s ease', filter: cakePhase === 'blown' ? 'drop-shadow(0 0 28px rgba(143,221,253,.45))' : 'none' }}>
                  <BirthdayCake
                    cakePhase={cakePhase}
                    reduceMotion={reduceMotion}
                    onHoldStart={startHold}
                    onHoldEnd={endHold}
                    holdProgress={holdProgress}
                  />
                </div>

                {/* Wish button */}
                {cakePhase === 'lit' && (
                  <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp .6s ease' }}>
                    <button onClick={handleWish} style={{ padding: '14px 44px', background: 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.35)', borderRadius: 50, color: '#8FDDFD', cursor: 'pointer', fontSize: '.9rem', fontWeight: 500, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.04em', transition: 'all .3s' }}>
                      {lang === 'vi' ? '🕯 Ước rồi thổi nến' : '🕯 Make a wish'}
                    </button>
                  </div>
                )}

                {/* Wishing — eyes-closed message */}
                {cakePhase === 'wishing' && (
                  <div style={{ animation: reduceMotion ? 'none' : 'fadeIn .5s ease' }}>
                    <p style={{ color: '#F8FAFC', fontSize: '1.05rem', lineHeight: 1.75 }}>
                      {lang === 'vi' ? 'Ck iu nhắm mắt 3 giây để ước nha.' : 'Close your eyes for 3 seconds to make a wish.'}
                    </p>
                  </div>
                )}

                {/* Countdown 3-2-1 */}
                {cakePhase === 'countdown' && (
                  <div style={{ fontSize: 'clamp(3rem,10vw,5rem)', color: '#8FDDFD', fontWeight: 700, textShadow: '0 0 30px rgba(143,221,253,.8)', animation: reduceMotion ? 'none' : 'heartbeat .9s ease-in-out infinite', lineHeight: 1 }}>
                    {cdNum}
                  </div>
                )}

                {/* Blowing phase */}
                {cakePhase === 'blowing' && (
                  <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp .4s ease' }}>
                    <p style={{ color: '#8FDDFD', fontSize: '1.05rem', fontWeight: 600, marginBottom: 18 }}>
                      {lang === 'vi' ? 'Thổi nến nào ✨' : 'Blow the candle ✨'}
                    </p>
                    {/* Hold-to-blow instruction */}
                    {hasMic !== true && (
                      <p style={{ color: 'rgba(170,182,197,.55)', fontSize: '.74rem', marginBottom: 14 }}>
                        {lang === 'vi' ? 'Giữ nến 3 giây để thổi' : 'Hold the candle for 3 s to blow'}
                      </p>
                    )}
                    {/* Mic-based blow */}
                    {hasMic === true && (
                      <p style={{ color: 'rgba(143,221,253,.6)', fontSize: '.72rem', marginBottom: 14 }}>
                        {lang === 'vi' ? 'Đang nghe… thổi vào mic nha.' : 'Listening… blow into your mic.'}
                      </p>
                    )}
                    {/* Fallback tap button */}
                    {hasMic === false && (
                      <button onClick={blowCandle} style={{ padding: '12px 36px', background: 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.32)', borderRadius: 50, color: '#8FDDFD', cursor: 'pointer', fontSize: '.85rem', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                        {lang === 'vi' ? '💨 Thổi nến' : '💨 Blow candle'}
                      </button>
                    )}
                  </div>
                )}

                {/* Blown — wish sent */}
                {cakePhase === 'blown' && (
                  <div style={{ animation: reduceMotion ? 'none' : 'fadeSlideUp .7s ease' }}>
                    <p style={{ color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 600, marginBottom: 10 }}>
                      {lang === 'vi' ? 'Điều ước của ck iu đã được gửi vào vũ trụ.' : 'Your wish has been sent into the universe.'}
                    </p>
                    <p style={{ color: '#AAB6C5', fontSize: '.88rem', fontStyle: 'italic' }}>
                      {lang === 'vi' ? 'Zk iu mong điều đó sẽ thành sự thật.' : 'I hope it comes true.'}
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 8 — DIGITAL GIFT BOX
// ═══════════════════════════════════════════
function Ch08GiftBox() {
  const { lang, reduceMotion, fadeAudio } = useApp();
  const { ref, inView } = useInView();
  const [progress, setProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [bloom, setBloom] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);
  const intervalRef = useRef<any>(null);
  const progressRef = useRef(0);

  const startHold = () => {
    if (isOpen) return;
    clearInterval(intervalRef.current);
    progressRef.current = progress;
    intervalRef.current = setInterval(() => {
      progressRef.current = Math.min(100, progressRef.current + 2.2);
      setProgress(Math.min(100, progressRef.current));
      if (progressRef.current >= 100) {
        clearInterval(intervalRef.current);
        setBloom(true);
        setTimeout(() => { setBloom(false); setIsOpen(true); }, 500);
        setParticles(Array.from({ length: 50 }, (_, i) => ({ id: i, angle: (i / 50) * 360, dist: 55 + Math.random() * 115, color: ['#8FDDFD', '#7EF9D4', '#A78BFA', '#F8FAFC', '#FFB6C1', '♡', '❄️', '⭐'][i % 8], size: 5 + Math.random() * 9, delay: Math.random() * .4 })));
      }
    }, 40);
  };
  const endHold = () => {
    clearInterval(intervalRef.current);
    if (progressRef.current < 100) { setProgress(0); progressRef.current = 0; }
  };

  const C = 2 * Math.PI * 100;

  return (
    <section id="ch-gift" className="chapter-section" style={{ minHeight: '90vh' }}>
      {bloom && <div style={{ position: 'fixed', inset: 0, background: 'rgba(200,235,255,.22)', animation: 'bloomIn .5s ease forwards', zIndex: 50, pointerEvents: 'none' }} />}

      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ textAlign: 'center', width: '100%', maxWidth: 600 }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14 }}>
          {lang === 'vi' ? 'Chương 08' : 'Chapter 08'}
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F8FAFC', fontWeight: 700, marginBottom: 8, textShadow: '0 0 30px rgba(143,221,253,.3)' }}>
          {lang === 'vi' ? 'Hộp quà kỹ thuật số' : 'Digital Gift Box'}
        </h2>
        <p style={{ color: '#AAB6C5', marginBottom: 48, fontSize: '.85rem' }}>
          {lang === 'vi' ? 'Giữ để mở hộp quà' : 'Press and hold the ribbon to open'}
        </p>

        <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 36px' }}>
          {/* Orbital particles */}
          {!isOpen && !reduceMotion && [0, 90, 180, 270].map(a => (
            <div key={a} style={{ position: 'absolute', top: '50%', left: '50%', width: 5, height: 5, borderRadius: '50%', background: 'rgba(143,221,253,.5)', transform: `rotate(${a}deg) translateX(110px)`, animation: `globeSpin ${6 + a * .01}s linear infinite`, pointerEvents: 'none', zIndex: 5 }} />
          ))}

          {/* Progress ring */}
          {!isOpen && (
            <svg style={{ position: 'absolute', inset: -14, width: 228, height: 228, pointerEvents: 'none', zIndex: 5 }}>
              <circle cx={114} cy={114} r={100} fill="none" stroke="rgba(143,221,253,.07)" strokeWidth={2} />
              {progress > 0 && <circle cx={114} cy={114} r={100} fill="none" stroke="#8FDDFD" strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${C}`} strokeDashoffset={`${C * (1 - progress / 100)}`} transform="rotate(-90 114 114)" style={{ transition: 'stroke-dashoffset .04s linear', filter: 'drop-shadow(0 0 6px rgba(143,221,253,.7))' }} />}
            </svg>
          )}

          {/* Box */}
          <div style={{ width: 200, height: 200, background: 'linear-gradient(155deg, rgba(20,50,100,.82), rgba(4,14,42,.96))', border: '1px solid rgba(143,221,253,.28)', borderRadius: 18, boxShadow: isOpen ? '0 0 80px rgba(143,221,253,.4)' : '0 0 40px rgba(143,221,253,.12)', position: 'relative', overflow: 'hidden', transition: 'box-shadow .5s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 32% 28%, rgba(143,221,253,.1), transparent 60%)' }} />
            {isOpen ? (
              <div style={{ animation: 'fadeSlideUp .5s ease', textAlign: 'center', padding: 10, position: 'relative', zIndex: 1, width: '100%' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>✨</div>
                <p style={{ color: '#8FDDFD', fontSize: '.58rem', letterSpacing: '.06em' }}>{lang === 'vi' ? 'Mở ra rồi…' : 'Revealed…'}</p>
              </div>
            ) : (
              <>
                {particles.map(p => {
                  const isEmoji = ['♡', '❄️', '⭐'].includes(p.color);
                  return <div key={p.id} style={{ position: 'absolute', top: '50%', left: '50%', '--px': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`, '--py': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`, animation: `giftParticle .9s ${p.delay}s ease-out forwards`, pointerEvents: 'none', zIndex: 15, fontSize: isEmoji ? p.size + 'px' : undefined, width: isEmoji ? undefined : p.size, height: isEmoji ? undefined : p.size, background: isEmoji ? undefined : p.color, borderRadius: isEmoji ? undefined : '50%' } as React.CSSProperties}>{isEmoji ? p.color : ''}</div>;
                })}
                <div style={{ position: 'absolute', top: 0, left: -1, right: -1, height: 52, background: 'linear-gradient(155deg,rgba(30,80,165,.9),rgba(10,42,108,.96))', border: '1px solid rgba(143,221,253,.28)', borderRadius: '18px 18px 0 0' }} />
                <div onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 26, transform: 'translateX(-50%)', background: 'linear-gradient(to bottom, rgba(143,221,253,.65), rgba(167,139,250,.65))', cursor: 'pointer', zIndex: 6, userSelect: 'none' }} />
                <div onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 26, transform: 'translateY(-50%)', background: 'linear-gradient(to right, rgba(143,221,253,.65), rgba(167,139,250,.65))', cursor: 'pointer', zIndex: 6, userSelect: 'none' }} />
                <span style={{ fontSize: 44, filter: 'drop-shadow(0 0 14px rgba(143,221,253,.5))', position: 'relative', zIndex: 1 }}>🎁</span>
              </>
            )}
          </div>
        </div>

        {!isOpen ? (
          <p style={{ color: 'rgba(170,182,197,.4)', fontSize: '.78rem' }}>{lang === 'vi' ? 'Nhấn giữ nơ để mở' : 'Press and hold the ribbon'}</p>
        ) : (
          <div style={{ animation: 'fadeSlideUp .6s ease' }}>
            <p style={{ color: '#F8FAFC', fontSize: '.95rem', marginBottom: 24, lineHeight: 1.75, maxWidth: 380, margin: '0 auto 24px' }}>
              {lang === 'vi' ? 'Món quà thật sự của anh nằm trong vũ trụ nhỏ này.' : 'Your real gift is inside this little universe.'}
            </p>
            {/* Real birthday video — cinematic reveal */}
            <div style={{ maxWidth: 340, margin: '0 auto 22px', position: 'relative', borderRadius: 18, overflow: 'hidden', boxShadow: '0 0 50px rgba(143,221,253,.22), 0 12px 40px rgba(0,0,20,.5)', border: '1px solid rgba(143,221,253,.22)', animation: 'fadeSlideUp .7s .1s ease both' }}>
              {/* Glow layer behind video */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(143,221,253,.12), transparent 60%)', pointerEvents: 'none', zIndex: 1 }} />
              <video
                src={birthdayVideo}
                controls
                playsInline
                onPlay={() => fadeAudio(0, 1200)}
                onPause={() => fadeAudio(0.25, 1200)}
                onEnded={() => fadeAudio(0.35, 1800)}
                style={{ width: '100%', display: 'block', borderRadius: 18, position: 'relative', zIndex: 0, background: '#030712' }}
              />
            </div>
            <p style={{ color: 'rgba(170,182,197,.38)', fontSize: '.72rem', fontStyle: 'italic' }}>
              {lang === 'vi' ? 'Sau khi xem xong, ck iu mở tiếp lá thư nha.' : 'After watching, continue to the letter.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 9 — LETTER (envelope reveal)
// ═══════════════════════════════════════════
function Ch09Letter({ onVoiceClick }: { onVoiceClick: () => void }) {
  const { lang } = useApp();
  const { ref, inView } = useInView(0.05);
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [showEn, setShowEn] = useState(false);
  const [voiceHover, setVoiceHover] = useState(false);

  const openEnvelope = () => {
    setEnvelopeOpened(true);
    setTimeout(() => setLetterVisible(true), 700);
  };

  const viLetter = `Darling,

Chúc mừng sinh nhật ck iu.

Zk iu biết ck iu cũng đang chật vật trong thế giới của một người đang lớn, vậy mà ck iu vẫn dịu dàng và dành những điều tốt đẹp nhất cho zk iu.

Có những ngày yêu xa làm zk iu thấy mọi thứ dài hơn bình thường. Một ngày dài hơn. Một đêm cũng dài hơn. Một tin nhắn chờ lâu hơn. Một cuộc gọi kết thúc cũng tiếc hơn. Nhưng kỳ lạ là, chỉ cần nghĩ đến ck iu, zk iu vẫn thấy mình có một nơi rất an toàn để quay về.

Ck iu là người khiến zk iu cảm thấy được thương theo cách rất nhẹ nhàng. Không cần quá ồn ào, không cần phải hoàn hảo, chỉ cần là ck iu thôi cũng đủ làm zk iu thấy thế giới này mềm hơn một chút.

Zk iu mong tuổi mới của ck iu sẽ dịu dàng với ck iu hơn. Mong ck iu có đủ sức khỏe, đủ niềm tin, đủ bình yên, và đủ may mắn để đi qua những ngày khó khăn phía trước. Mong những điều ck iu đang cố gắng sẽ dần có kết quả. Mong ck iu luôn nhớ rằng dù tụi mình đang cách nhau 8,988 km, vẫn có một người ở đây thương ck iu rất nhiều.

Zk iu yêu ck iu nhất trên đời.

Happy Birthday, my safe place.

From zk iu,
Việt Trinh

Đừng quên ck iu còn một lá thư tay zk iu đã viết cho ck iu trong hộp thư nhé.`;

  const enLetter = `Darling,

Happy birthday, my love.

I know you are also struggling in the world of someone who is growing up, yet you still stay gentle and give me the best things you can.

Some days, long distance makes everything feel longer. The days feel longer. The nights feel longer. Waiting for a message feels longer. Ending a call feels harder. But somehow, just thinking of you still makes me feel like I have a safe place to return to.

You are the person who makes me feel loved in the gentlest way. It does not need to be loud. It does not need to be perfect. Just you being you is enough to make the world feel a little softer.

I hope your new age is kinder to you. I hope you have health, faith, peace, and luck to get through the hard days ahead. I hope the things you are working for will slowly come true. And I hope you always remember that even though we are 8,988 km apart, there is someone here who loves you very much.

I love you most in this world.

Happy Birthday, my safe place.

From zk iu,
Việt Trinh

Do not forget, there is still one handwritten letter from me waiting for you in your mailbox.`;

  return (
    <section id="ch-letter" className="chapter-section">
      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ width: '100%', maxWidth: 740, position: 'relative' }}>
        <p style={{ color: '#AAB6C5', letterSpacing: '.15em', fontSize: '.72rem', textTransform: 'uppercase', marginBottom: 14, textAlign: 'center' }}>
          {lang === 'vi' ? 'Chương 09' : 'Chapter 09'}
        </p>

        {!letterVisible && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: envelopeOpened ? 'letterRise .6s ease forwards' : 'fadeSlideUp .8s ease' }}>
            {/* Envelope */}
            <div onClick={!envelopeOpened ? openEnvelope : undefined} style={{
              width: 300, height: 200, position: 'relative', cursor: envelopeOpened ? 'default' : 'pointer',
              background: 'linear-gradient(145deg,rgba(18,50,115,.88),rgba(5,18,58,.96))',
              border: '1px solid rgba(143,221,253,.25)', borderRadius: 12,
              boxShadow: '0 0 50px rgba(143,221,253,.1), 0 20px 50px rgba(0,0,20,.5)',
              overflow: 'hidden', marginBottom: 28,
              animation: envelopeOpened ? 'envelopeFlapOpen .6s ease forwards' : 'floatSlow 4s ease-in-out infinite',
              transformOrigin: 'bottom center',
            }}>
              {/* Envelope flap */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(145deg,rgba(22,62,145,.9),rgba(10,38,105,.97))', clipPath: 'polygon(0 0, 100% 0, 50% 80%)', borderBottom: '1px solid rgba(143,221,253,.15)' }} />
              {!envelopeOpened && (
                <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 28, filter: 'drop-shadow(0 0 10px rgba(143,221,253,.7))', animation: 'heartbeat 2.8s ease-in-out infinite', zIndex: 2 }}>💌</div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 70%, rgba(143,221,253,.06), transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'rgba(10,30,90,.4)', clipPath: 'polygon(0 100%, 100% 100%, 50% 0%)' }} />
            </div>
            <p style={{ color: '#AAB6C5', fontSize: '.8rem', marginBottom: 16 }}>Có một lá thư dành cho ck iu</p>
            {!envelopeOpened && (
              <button onClick={openEnvelope} style={{ padding: '12px 36px', background: 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.32)', borderRadius: 50, color: '#8FDDFD', cursor: 'pointer', fontSize: '.85rem', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.04em' }}>
                {lang === 'vi' ? 'Mở thư của zk iu' : 'Open the letter'}
              </button>
            )}
          </div>
        )}

        {letterVisible && (
          <div style={{ animation: 'letterRise .8s ease', position: 'relative' }}>
            <div style={{ padding: 'clamp(28px,5vw,56px)', background: 'rgba(150,200,255,.055)', backdropFilter: 'blur(24px)', border: '1px solid rgba(150,200,255,.18)', borderRadius: 24, boxShadow: '0 0 60px rgba(143,221,253,.06)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -50, left: -50, right: -50, height: 150, background: 'radial-gradient(ellipse, rgba(143,221,253,.07), transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ textAlign: 'center', marginBottom: 26 }}>
                <div style={{ display: 'inline-flex', width: 52, height: 52, borderRadius: '50%', background: 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.22)', alignItems: 'center', justifyContent: 'center', color: '#8FDDFD', marginBottom: 14 }}><Mail size={20} /></div>
                <h3 style={{ color: '#8FDDFD', fontSize: '1.05rem', letterSpacing: '.06em', textShadow: '0 0 16px rgba(143,221,253,.5)' }}>
                  {lang === 'vi' ? 'Gửi ck iu' : 'To ck iu'}
                </h3>
              </div>

              <div className="letter-scroll" style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: 8 }}>
                <div style={{ color: '#F0F4F8', fontSize: 'clamp(.84rem,1.5vw,.96rem)', lineHeight: 2.0, whiteSpace: 'pre-line' }}>
                  {showEn ? enLetter : viLetter}
                </div>
              </div>

              <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <button onClick={() => setShowEn(!showEn)} style={{ padding: '7px 20px', background: 'rgba(143,221,253,.07)', border: '1px solid rgba(143,221,253,.2)', borderRadius: 50, color: '#AAB6C5', cursor: 'pointer', fontSize: '.76rem', fontFamily: 'Be Vietnam Pro, sans-serif', transition: 'all .3s' }}>
                  {showEn ? 'Xem tiếng Việt' : 'Read in English'}
                </button>
              </div>
            </div>

            {/* Hidden mic */}
            <div style={{ position: 'absolute', bottom: -8, right: 18, opacity: voiceHover ? .85 : .1, transition: 'opacity .4s', cursor: 'pointer' }}
              onMouseEnter={() => setVoiceHover(true)} onMouseLeave={() => setVoiceHover(false)} onClick={onVoiceClick}>
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(143,221,253,.12)', border: '1px solid rgba(143,221,253,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FDDFD' }}>
                <Mic size={16} />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// CHAPTER 10 — ENDING
// ═══════════════════════════════════════════
function Ch10Ending({ onHiddenPhoto }: { onHiddenPhoto: () => void }) {
  const { lang, reduceMotion } = useApp();
  const { ref, inView } = useInView(0.1);
  const [merged, setMerged] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [hiddenHover, setHiddenHover] = useState(false);
  const [postClose, setPostClose] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setMerged(true), 1800);
    const t2 = setTimeout(() => setHeartVisible(true), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [inView]);

  return (
    <section id="ch-ending" className="chapter-section" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 35%, rgba(143,221,253,.14) 0%, rgba(126,249,212,.08) 50%, transparent 75%)', animation: inView && !reduceMotion ? 'auroraFloat1 14s ease-in-out infinite' : 'none' }} />

      <div ref={ref} className={`inview-slide${inView ? ' visible' : ''}`} style={{ textAlign: 'center', position: 'relative', zIndex: 5, width: '100%', maxWidth: 720 }}>
        {/* Stars merging */}
        <div style={{ position: 'relative', height: 220, marginBottom: 48 }}>
          <div style={{ position: 'absolute', top: '35%', left: merged ? '43%' : '8%', transition: 'left 2.2s cubic-bezier(.34,1.1,.64,1)', width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,200,90,1),rgba(255,140,40,.5))', boxShadow: '0 0 18px rgba(255,180,70,.85)', animation: reduceMotion ? 'none' : 'floatSlow 3s ease-in-out infinite' }} />
          {heartVisible && (
            <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', fontSize: 50, animation: reduceMotion ? 'none' : 'heartForm 1.2s cubic-bezier(.34,1.56,.64,1) forwards', filter: 'drop-shadow(0 0 28px rgba(143,221,253,.95))' }}>♡</div>
          )}
          <div style={{ position: 'absolute', top: '35%', right: merged ? '43%' : '8%', transition: 'right 2.2s cubic-bezier(.34,1.1,.64,1)', width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle,rgba(143,221,253,1),rgba(100,175,255,.5))', boxShadow: '0 0 18px rgba(143,221,253,.9)', animation: reduceMotion ? 'none' : 'floatAlt 3.5s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', bottom: 8, left: '4%', color: 'rgba(170,182,197,.35)', fontSize: '.63rem' }}>🌸 Hồ Chí Minh</div>
          <div style={{ position: 'absolute', bottom: 8, right: '4%', color: 'rgba(170,182,197,.35)', fontSize: '.63rem', textAlign: 'right' }}>❄️ Ostrava</div>
        </div>

        <p style={{ fontSize: 'clamp(1.4rem,4vw,2.3rem)', color: '#F8FAFC', fontWeight: 600, marginBottom: 14, lineHeight: 1.55, textShadow: '0 0 30px rgba(143,221,253,.25)' }}>
          {lang === 'vi' ? 'Chúc mừng sinh nhật, người zk iu yêu nhất.' : 'Happy Birthday, my favorite person.'}
        </p>
        <p style={{ color: '#AAB6C5', fontSize: '.96rem', fontStyle: 'italic', lineHeight: 1.75, marginBottom: 10 }}>
          {lang === 'vi' ? 'Rồi sẽ có một ngày, chúng mình cùng đứng dưới bầu trời này.' : "One day, we'll watch this sky together."}
        </p>
        <p style={{ color: '#8FDDFD', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '.12em', marginTop: 44, textShadow: '0 0 18px rgba(143,221,253,.55)' }}>
          28.06.2025 → ∞
        </p>

        {/* Hidden photo star */}
        <div style={{ marginTop: 48, position: 'relative', display: 'inline-block' }}
          onMouseEnter={() => setHiddenHover(true)} onMouseLeave={() => setHiddenHover(false)}>
          {hiddenHover && (
            <div style={{ position: 'absolute', bottom: '120%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(5,14,32,.88)', backdropFilter: 'blur(12px)', border: '1px solid rgba(143,221,253,.18)', borderRadius: 8, padding: '5px 14px', color: 'rgba(143,221,253,.7)', fontSize: '.7rem', animation: 'fadeIn .3s ease', pointerEvents: 'none' }}>
              {lang === 'vi' ? 'Có gì đó đang giấu ở đây…' : 'Something is hidden here…'}
            </div>
          )}
          <div onClick={() => { onHiddenPhoto(); setTimeout(() => setPostClose(true), 2000); }}
            style={{ opacity: hiddenHover ? .6 : .06, transition: 'opacity .5s', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(143,221,253,.15)', border: '1px solid rgba(143,221,253,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8FDDFD', marginBottom: 4, animation: hiddenHover && !reduceMotion ? 'heartbeat 1.2s ease-in-out infinite' : 'none' }}>
              <Star size={16} />
            </div>
            <p style={{ color: 'rgba(170,182,197,.25)', fontSize: '.55rem', letterSpacing: '.08em' }}>HIDDEN_PHOTO</p>
          </div>
        </div>

        {postClose && (
          <p style={{ marginTop: 28, color: 'rgba(170,182,197,.4)', fontSize: '.78rem', fontStyle: 'italic', animation: 'fadeSlideUp .8s ease' }}>
            {lang === 'vi' ? 'Vũ trụ nhỏ này sẽ vẫn ở đây, mỗi khi ck iu cần một nơi để quay lại.' : 'This little universe will always be here, whenever you need a place to return to.'}
          </p>
        )}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════
// GLOBAL NAV
// ═══════════════════════════════════════════
function GlobalNav() {
  const { lang, setLang, audio, audioState, toggleAudio, reduceMotion, setReduceMotion, chapter } = useApp();
  const chIds = ['ch-opening', 'ch-planets', 'ch-memories', 'ch-tunnel', 'ch-constellation', 'ch-wish', 'ch-birthday', 'ch-gift', 'ch-letter', 'ch-ending'];
  return (
    <>
      {/* Chapter dots */}
      <div style={{ position: 'fixed', right: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 8, zIndex: 100 }}>
        {CHAPTERS.map((_, i) => (
          <button key={i} title={CHAPTERS[i]} onClick={() => document.getElementById(chIds[i])?.scrollIntoView({ behavior: 'smooth' })} style={{ width: chapter === i ? 9 : 5, height: chapter === i ? 9 : 5, borderRadius: '50%', background: chapter === i ? '#8FDDFD' : 'rgba(143,221,253,.22)', border: 'none', cursor: 'pointer', padding: 0, boxShadow: chapter === i ? '0 0 10px rgba(143,221,253,.8)' : 'none', transition: 'all .3s ease' }} />
        ))}
      </div>

      {/* Top-right controls */}
      <div style={{ position: 'fixed', top: 16, right: 16, display: 'flex', gap: 7, zIndex: 100, alignItems: 'center' }}>
        <button title={reduceMotion ? 'Bật chuyển động nền' : 'Tắt chuyển động nền'} onClick={() => setReduceMotion(!reduceMotion)} style={{ width: 34, height: 34, borderRadius: '50%', background: reduceMotion ? 'rgba(143,221,253,.18)' : 'rgba(143,221,253,.06)', border: '1px solid rgba(143,221,253,.2)', color: reduceMotion ? 'rgba(170,182,197,.4)' : '#AAB6C5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
          <Wind size={13} />
        </button>
        <button
          onClick={toggleAudio}
          title={audioState === 'error' ? 'Chưa thêm file nhạc' : audioState === 'playing' ? 'Đang phát: Khiêu vũ trong tranh — Hải Sâm' : 'Bật nhạc nền'}
          style={{ width: 34, height: 34, borderRadius: '50%', background: audioState === 'playing' ? 'rgba(143,221,253,.14)' : 'rgba(143,221,253,.06)', border: '1px solid rgba(143,221,253,.2)', color: '#AAB6C5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s' }}>
          {audioState === 'playing' ? <Volume2 size={13} style={{ color: '#8FDDFD' }} /> : audioState === 'error' ? <Music size={13} style={{ opacity: .4 }} /> : <VolumeX size={13} />}
        </button>
        <button onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')} style={{ padding: '5px 12px', borderRadius: 50, background: 'rgba(143,221,253,.06)', border: '1px solid rgba(143,221,253,.2)', color: '#8FDDFD', cursor: 'pointer', fontSize: '.71rem', fontWeight: 600, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.05em', transition: 'all .3s' }}>
          {lang === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>

      {/* Audio indicator */}
      {audioState === 'playing' && (
        <div style={{ position: 'fixed', bottom: 18, left: 18, zIndex: 100 }}>
          <div style={{ padding: '9px 14px', background: 'rgba(150,200,255,.07)', backdropFilter: 'blur(16px)', border: '1px solid rgba(143,221,253,.15)', borderRadius: 50, display: 'flex', alignItems: 'center', gap: 9 }}>
            <Music size={12} style={{ color: '#8FDDFD' }} />
            {/* Animated waveform bars */}
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {[10, 15, 10, 18, 12, 14, 9].map((h, i) => (
                <div key={i} style={{ width: 2, height: h, background: '#8FDDFD', borderRadius: 1, opacity: .55, animation: reduceMotion ? 'none' : `floatSlow ${.5 + i * .12}s ease-in-out infinite` }} />
              ))}
            </div>
            <span style={{ color: '#AAB6C5', fontSize: '.65rem', letterSpacing: '.04em', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Khiêu vũ trong tranh — Hải Sâm
            </span>
          </div>
        </div>
      )}
      {audioState === 'muted' && (
        <div style={{ position: 'fixed', bottom: 18, left: 18, zIndex: 100 }}>
          <button onClick={toggleAudio} style={{ padding: '8px 14px', background: 'rgba(150,200,255,.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(143,221,253,.1)', borderRadius: 50, color: 'rgba(170,182,197,.45)', fontSize: '.64rem', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '.03em' }}>
            Bấm để bật nhạc
          </button>
        </div>
      )}
      {audioState === 'error' && (
        <div style={{ position: 'fixed', bottom: 18, left: 18, zIndex: 100, padding: '8px 14px', background: 'rgba(150,200,255,.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(143,221,253,.1)', borderRadius: 50, color: 'rgba(170,182,197,.4)', fontSize: '.64rem' }}>
          Chưa thêm file nhạc
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════
// MODAL
// ═══════════════════════════════════════════
function Modal({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!visible) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(3,7,18,.82)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, animation: 'fadeIn .3s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: 480, width: '100%', padding: '36px 40px', position: 'relative', background: 'rgba(7,17,35,.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(143,221,253,.28)', borderRadius: 20, boxShadow: '0 0 60px rgba(143,221,253,.1)', animation: 'fadeSlideUp .4s ease' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', color: '#AAB6C5', cursor: 'pointer', fontSize: 18 }}>×</button>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// APP
// ═══════════════════════════════════════════
export default function App() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('unlocked') === '1');
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [audio, setAudio] = useState(false);
  const [audioState, setAudioState] = useState<'muted' | 'playing' | 'error'>('muted');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [loveMode, setLoveMode] = useState(false);
  const [chapter, setChapter] = useState(0);

  // Easter egg state
  const [loveModeMsg, setLoveModeMsg] = useState(false);
  const [heartBurst, setHeartBurst] = useState<{ x: number; y: number } | null>(null);
  const [showMissYou, setShowMissYou] = useState(false);
  const [showSecretStar, setShowSecretStar] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [showHiddenPhoto, setShowHiddenPhoto] = useState(false);
  const [showMidnight, setShowMidnight] = useState(false);

  // ── HTMLAudioElement-based music system ──
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Create the audio element once on mount
  useEffect(() => {
    const a = new Audio(musicSrc);
    a.loop = true;
    a.volume = 0;
    a.addEventListener('error', () => setAudioState('error'));
    audioRef.current = a;
    return () => { a.pause(); a.src = ''; };
  }, []);

  const fadeAudio = useCallback((targetVol: number, ms: number) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    const startVol = a.volume;
    const diff = targetVol - startVol;
    const steps = Math.max(1, Math.ceil(ms / 30));
    let step = 0;
    fadeTimerRef.current = setInterval(() => {
      step++;
      a.volume = Math.max(0, Math.min(1, startVol + diff * (step / steps)));
      if (step >= steps) {
        a.volume = Math.max(0, Math.min(1, targetVol));
        if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    }, 30);
  }, []);

  const startAudio = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.volume = 0;
      await a.play();
      setAudio(true);
      setAudioState('playing');
      fadeAudio(MUSIC_DEFAULT_VOL, 2000);
    } catch {
      setAudioState('error');
    }
  }, [fadeAudio]);

  const toggleAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (audioState === 'playing') {
      fadeAudio(0, 700);
      setTimeout(() => { a.pause(); }, 720);
      setAudio(false);
      setAudioState('muted');
    } else {
      startAudio();
    }
  }, [audioState, fadeAudio, startAudio]);

  const handleUnlock = useCallback(() => {
    sessionStorage.setItem('unlocked', '1');
    setUnlocked(true);
    setTimeout(() => startAudio(), 700);
  }, [startAudio]);

  // Chapter tracking via IntersectionObserver
  useEffect(() => {
    if (!unlocked) return;
    const ids = ['ch-opening', 'ch-planets', 'ch-memories', 'ch-tunnel', 'ch-constellation', 'ch-wish', 'ch-birthday', 'ch-gift', 'ch-letter', 'ch-ending'];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { const i = ids.indexOf(e.target.id); if (i !== -1) setChapter(i); } });
    }, { threshold: .3 });
    const timer = setTimeout(() => {
      ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    }, 400);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [unlocked]);

  // Konami code
  const konamiSeq = useRef<string[]>([]);
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      konamiSeq.current = [...konamiSeq.current, e.key].slice(-10);
      if (konamiSeq.current.join(',') === KONAMI.join(',')) {
        setLoveMode(true); setLoveModeMsg(true);
        setTimeout(() => setLoveModeMsg(false), 4500);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Midnight check
  useEffect(() => {
    const now = new Date();
    if (now.getMonth() === 6 && now.getDate() === 9 && now.getFullYear() === 2026 && now.getHours() === 0 && now.getMinutes() === 0) {
      setShowMidnight(true); setTimeout(() => setShowMidnight(false), 6000);
    }
  }, []);

  const ctx: Ctx = { lang, setLang, audio, audioState, toggleAudio, fadeAudio, reduceMotion, setReduceMotion, loveMode, setLoveMode, chapter, setChapter };

  return (
    <AppCtx.Provider value={ctx}>
      <div className={reduceMotion ? 'reduce-motion' : ''} style={{ background: '#030712', minHeight: '100vh', fontFamily: "'Be Vietnam Pro', sans-serif", color: '#F8FAFC', position: 'relative' }}>

        <Aurora loveMode={loveMode} />
        <AtmosphereCanvas loveMode={loveMode} />
        <CursorGlow />

        {!unlocked ? (
          <PasswordGate onUnlock={handleUnlock} />
        ) : (
          <>
            <GlobalNav />
            <Ch01Opening onHeartDoubleClick={(x, y) => { setHeartBurst({ x, y }); setTimeout(() => setHeartBurst(null), 3200); }} />
            <Ch02Planets onHoldVietnam={() => setShowMissYou(true)} />
            <Ch03Memories />
            <Ch04TimeTunnel />
            <Ch05Constellation onSecretStar={() => setShowSecretStar(true)} />
            <Ch06WishMachine />
            <Ch07Countdown />
            <Ch08GiftBox />
            <Ch09Letter onVoiceClick={() => setShowVoice(true)} />
            <Ch10Ending onHiddenPhoto={() => setShowHiddenPhoto(true)} />

            {/* ── EASTER EGGS ── */}
            {loveModeMsg && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 500, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'rgba(3,7,18,.9)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: '40px 56px', textAlign: 'center', border: '1px solid rgba(143,221,253,.32)', animation: 'fadeSlideUp .6s ease', boxShadow: '0 0 80px rgba(143,221,253,.2)' }}>
                  <div style={{ fontSize: 50, marginBottom: 14 }}>💫</div>
                  <p style={{ color: '#8FDDFD', fontSize: '1.2rem', fontWeight: 600, marginBottom: 8, textShadow: '0 0 20px rgba(143,221,253,.7)' }}>
                    {lang === 'vi' ? 'Anh tìm thấy bí mật của em rồi.' : 'You found my secret.'}
                  </p>
                  <p style={{ color: '#AAB6C5', fontSize: '.8rem' }}>Love Mode activated ♡</p>
                </div>
              </div>
            )}

            {heartBurst && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 450, pointerEvents: 'none' }}>
                {Array.from({ length: 22 }, (_, i) => (
                  <div key={i} style={{ position: 'absolute', left: heartBurst.x, top: heartBurst.y, fontSize: 14 + Math.random() * 14, '--dx': `${(Math.random() - .5) * 200}px`, '--dy': `${(Math.random() - .5) * 200}px`, animation: `particleDrift 1.6s ${Math.random() * .25}s ease-out forwards` } as React.CSSProperties}>♡</div>
                ))}
                <div style={{ position: 'fixed', left: '50%', top: '55%', transform: 'translate(-50%,-50%)', background: 'rgba(3,7,18,.85)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '18px 34px', textAlign: 'center', border: '1px solid rgba(143,221,253,.22)', animation: 'fadeSlideUp .4s ease', zIndex: 1 }}>
                  <p style={{ color: '#8FDDFD', fontWeight: 600, fontSize: '1rem' }}>{lang === 'vi' ? 'Vẫn chọn anh.' : 'Still choosing you.'}</p>
                </div>
              </div>
            )}

            {showMidnight && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 450, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle,rgba(143,221,253,.12),transparent 70%)', animation: 'fadeIn 1s ease' }}>
                <p style={{ color: '#8FDDFD', fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 700, textAlign: 'center', textShadow: '0 0 40px rgba(143,221,253,.95)', animation: 'heartbeat 2s ease-in-out infinite' }}>
                  {lang === 'vi' ? 'Đến ngày của ck iu rồi.' : "It's your day, ck iu."}
                </p>
              </div>
            )}

            <Modal visible={showMissYou} onClose={() => setShowMissYou(false)}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 14 }}>🌙</div>
                <p style={{ color: '#8FDDFD', fontSize: '1.25rem', fontWeight: 600, marginBottom: 8, textShadow: '0 0 16px rgba(143,221,253,.5)' }}>{lang === 'vi' ? 'Em nhớ anh.' : 'I miss you.'}</p>
                <p style={{ color: '#AAB6C5', fontSize: '.83rem' }}>8,988 km — {lang === 'vi' ? 'nhưng anh vẫn rất gần.' : 'but you still feel close.'}</p>
              </div>
            </Modal>

            <Modal visible={showSecretStar} onClose={() => setShowSecretStar(false)}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 50, marginBottom: 14, filter: 'drop-shadow(0 0 20px rgba(143,221,253,.8))' }}>⭐</div>
                <p style={{ color: '#8FDDFD', fontSize: '1.05rem', fontWeight: 600, marginBottom: 8 }}>
                  {lang === 'vi' ? 'Ngôi sao này nhỏ hơn vì zk iu giấu kỹ hơn.' : 'This star is smaller because I hid it better.'}
                </p>
              </div>
            </Modal>

            <Modal visible={showVoice} onClose={() => setShowVoice(false)}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(143,221,253,.1)', border: '1px solid rgba(143,221,253,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: '#8FDDFD' }}><Mic size={26} /></div>
                <p style={{ color: '#8FDDFD', fontSize: '.95rem', fontWeight: 600, marginBottom: 16 }}>{lang === 'vi' ? 'Nghe lời nhắn từ zk iu' : 'Play voice message from zk iu'}</p>
                <div style={{ padding: '13px 20px', background: 'rgba(150,200,255,.07)', border: '1px solid rgba(143,221,253,.18)', borderRadius: 50, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Play size={16} style={{ color: '#8FDDFD', flexShrink: 0 }} />
                  <div style={{ flex: 1, height: 4, background: 'rgba(143,221,253,.12)', borderRadius: 2 }} />
                  <span style={{ color: '#AAB6C5', fontSize: '.65rem', whiteSpace: 'nowrap' }}>VOICE_MESSAGE_PLACEHOLDER</span>
                </div>
              </div>
            </Modal>

            <Modal visible={showHiddenPhoto} onClose={() => setShowHiddenPhoto(false)}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '100%', maxWidth: 220, aspectRatio: '3/5', background: 'linear-gradient(155deg,rgba(18,48,105,.82),rgba(5,15,42,.96))', borderRadius: 14, margin: '0 auto 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(143,221,253,.15)' }}>
                  <span style={{ fontSize: 26, opacity: .32, marginBottom: 8 }}>📷</span>
                  <p style={{ color: 'rgba(170,182,197,.38)', fontSize: '.62rem', letterSpacing: '.08em' }}>HIDDEN_PHOTO_PLACEHOLDER</p>
                </div>
                <p style={{ color: '#8FDDFD', fontSize: '.95rem', fontWeight: 600, marginBottom: 6 }}>
                  {lang === 'vi' ? 'Thêm một kỷ niệm nữa, chỉ dành cho ck iu.' : 'One more memory, just for you.'}
                </p>
              </div>
            </Modal>
          </>
        )}
      </div>
    </AppCtx.Provider>
  );
}
