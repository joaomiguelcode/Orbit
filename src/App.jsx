import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import {
  Hash,
  Volume2,
  PhoneOff,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Plus,
  Pin,
  Users,
  Search,
  Gift,
  Sticker,
  Smile,
  Send,
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  Radio,
  X,
  MessageSquare,
  MessagesSquare,
  Megaphone,
  AtSign,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Compass,
  UserPlus,
  HelpCircle,
  Bell,
  Inbox,
  LogOut,
  FolderPlus,
  Check,
  CheckCircle,
  Phone,
  Video,
  VideoOff,
  UserCheck,
  ArrowRight,
  Sparkle,
  Copy,
  Trash2,
  Edit3,
  VolumeX,
  RefreshCw,
  UserMinus,
  CornerUpLeft,
  ExternalLink,
  MonitorUp,
  Maximize2,
  Minimize2,
  Tv,
  Cast,
  Signal,
  LayoutGrid,
  Camera,
  Palette,
  Upload,
  Link as LinkIcon,
  Calendar,
  Flame,
  Award,
  MoreVertical,
  UserCircle,
  FileText,
  Sliders,
  SlidersHorizontal,
  AlertTriangle,
  Key,
  ShieldCheck,
  Lock,
  Folder,
  Gamepad2,
  Globe,
  Music,
  Layers,
  MoveUp,
  MoveDown,
  CheckSquare,
  Square,
  Zap,
  GraduationCap,
  ChevronRight,
  Info,
  Clock,
  User,
  PenLine,
  Eye,
  Share2
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || (
  window.location.port === '5173'
    ? `http://${window.location.hostname}:3001`
    : window.location.origin
);

// Synthesize Discord UI sound effects using Web Audio API
function playDiscordSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === 'join') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'leave') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(330, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'mute') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(300, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'unmute') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    // Web Audio auto-policy guard
  }
}

// Orbit Br Logo Image Component (3D Silver Planet with Ring & Chat Bubble)
function OrbitBrLogo({ size = 28, className = '' }) {
  return (
    <img
      src="/logo.png"
      alt="Orbit Br"
      className={`object-contain drop-shadow-md select-none transition-transform duration-200 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}

// Wumpus SVG Illustration
function WumpusEmptyFriends() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-md animate-msg-enter">
      <div className="w-56 h-44 mb-6 relative flex items-center justify-center">
        <svg viewBox="0 0 240 180" className="w-full h-full drop-shadow-2xl">
          {/* Ground */}
          <ellipse cx="120" cy="155" rx="85" ry="18" fill="#2B2D31" />
          {/* Wumpus Body */}
          <path
            d="M80,140 C60,110 70,60 120,60 C170,60 180,110 160,140 C145,155 95,155 80,140 Z"
            fill="#5865F2"
          />
          {/* Horns */}
          <path d="M95,65 Q80,40 70,50 Q85,60 92,72 Z" fill="#FEE75C" />
          <path d="M145,65 Q160,40 170,50 Q155,60 148,72 Z" fill="#FEE75C" />
          {/* Eyes */}
          <ellipse cx="108" cy="95" rx="5" ry="7" fill="#1E1F22" />
          <ellipse cx="132" cy="95" rx="5" ry="7" fill="#1E1F22" />
          <circle cx="106" cy="93" r="2" fill="#FFFFFF" />
          <circle cx="130" cy="93" r="2" fill="#FFFFFF" />
          {/* Snout */}
          <ellipse cx="120" cy="108" rx="14" ry="9" fill="#4752C4" />
          <ellipse cx="120" cy="105" rx="4" ry="2.5" fill="#1E1F22" />
          {/* Waiting Star/Sparkles */}
          <circle cx="175" cy="55" r="4" fill="#FEE75C" />
          <circle cx="65" cy="90" r="3" fill="#57F287" />
          <circle cx="185" cy="115" r="3" fill="#EB459E" />
        </svg>
      </div>
      <p className="text-[#949BA4] text-[15px] font-normal leading-relaxed mb-6">
        Wumpus is waiting on friends. You don't have to though!
      </p>
    </div>
  );
}

// User Avatar Component with GIF/Image support, Fallback Initials, and Avatar Decorations
function DiscordUserAvatar({
  user,
  size = 38,
  isSpeaking = false,
  showStatus = true,
  status = null,
  decoration = null,
  className = '',
  onClick = null
}) {
  const currentStatus = status || user?.status || 'online';
  const initial = (user?.nickname || user?.display_name || user?.username || 'U').charAt(0).toUpperCase();
  const avatarColor = user?.avatar_color || '#5865F2';
  const avatarUrl = user?.server_avatar || user?.avatar_url || user?.avatar;
  const activeDeco = decoration || user?.avatar_decoration || null;

  let statusBg = '#80848E'; // offline
  if (currentStatus === 'online') statusBg = '#23A55A';
  if (currentStatus === 'idle') statusBg = '#F0B232';
  if (currentStatus === 'dnd') statusBg = '#F23F43';

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center flex-shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center font-bold select-none text-white shadow-sm overflow-hidden transition-all ${
          activeDeco ? `avatar-deco-${activeDeco}` : ''
        } ${isSpeaking ? 'discord-speaking-ring ring-2 ring-[#23A55A]' : ''}`}
        style={{
          backgroundColor: avatarColor.includes('gradient') ? '#5865F2' : avatarColor,
          fontSize: `${Math.max(12, Math.round(size * 0.44))}px`,
        }}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={user?.display_name || user?.username || 'Avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {showStatus && (
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full flex items-center justify-center pointer-events-none z-10"
          style={{
            width: `${Math.max(10, Math.round(size * 0.32))}px`,
            height: `${Math.max(10, Math.round(size * 0.32))}px`,
            backgroundColor: statusBg,
            boxShadow: '0 0 0 2px #2B2D31',
          }}
        >
          {currentStatus === 'dnd' && <span className="w-1.5 h-0.5 bg-[#2B2D31] rounded-full" />}
          {currentStatus === 'idle' && <span className="w-1.5 h-1.5 bg-[#2B2D31] rounded-full absolute -top-0.5 -left-0.5" />}
        </span>
      )}
    </div>
  );
}

// Live Video Tile for Screen Sharing
function ScreenShareVideoTile({ stream, username, isLocal = false, onToggleFullscreen }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative group bg-[#000000] rounded-[8px] overflow-hidden border border-[#1F2023] shadow-lg flex items-center justify-center flex-1 min-w-[280px] max-h-[48vh] aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-contain bg-black"
      />

      {/* Top Left Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="px-2 py-0.5 rounded-[3px] bg-[#F23F43] text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          AO VIVO
        </span>
        <span className="px-2 py-0.5 rounded-[3px] bg-[#111214]/85 text-white text-xs font-semibold shadow-sm">
          {username} {isLocal ? '(Você)' : ''}
        </span>
      </div>

      {/* Hover Action Controls */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 z-10">
        {onToggleFullscreen && (
          <button
            onClick={() => onToggleFullscreen({ stream, username, isLocal })}
            className="p-1.5 rounded-[4px] bg-[#111214]/90 hover:bg-[#35373C] text-white transition-all shadow-md"
            title="Tela Cheia"
          >
            <Maximize2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

// Discord Voice Lounge Participant Card
function DiscordVoiceParticipantCard({
  participant,
  isLocal = false,
  isSpeaking = false,
  isMuted = false,
  isDeafened = false,
  isSharingScreen = false,
  cameraStream = null,
  onClick = null
}) {
  const cameraVideoRef = useRef(null);

  useEffect(() => {
    if (cameraVideoRef.current && cameraStream) {
      cameraVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-6 rounded-[8px] bg-[#2B2D31] border transition-all shadow-md overflow-hidden aspect-video min-h-[220px] max-h-[360px] flex-1 select-none ${onClick ? 'cursor-pointer' : ''} ${
        isSpeaking
          ? 'border-[#23A55A] ring-2 ring-[#23A55A]'
          : 'border-[#1F2023] hover:border-[#35373C]'
      }`}
    >
      {/* Video stream background if camera is active */}
      {cameraStream ? (
        <video
          ref={cameraVideoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Large User Avatar with Animated Glowing Speaking Ring */
        <div className="relative">
          <div
            className={`rounded-full transition-all duration-150 ${
              isSpeaking
                ? 'discord-speaking-ring ring-4 ring-[#23A55A]'
                : ''
            }`}
          >
            <DiscordUserAvatar user={participant} size={80} showStatus={false} />
          </div>
        </div>
      )}

      {/* Bottom overlay info bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#111214]/85 border border-black/20 shadow-md">
          <span className="text-xs font-semibold text-[#F2F3F5] truncate max-w-[160px]">
            {participant.display_name || participant.username} {isLocal ? '(Você)' : ''}
          </span>
          {participant.role === 'owner' && <Crown size={13} className="text-[#F0B232] fill-current" />}
        </div>

        <div className="flex items-center gap-1.5">
          {isSharingScreen && (
            <span className="px-2 py-0.5 rounded-[3px] bg-[#F23F43] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              AO VIVO
            </span>
          )}
          {isMuted && (
            <span className="p-1 rounded-[3px] bg-[#111214]/85 text-[#F23F43] shadow-sm">
              <MicOff size={14} />
            </span>
          )}
          {isDeafened && (
            <span className="p-1 rounded-[3px] bg-[#111214]/85 text-[#F23F43] shadow-sm">
              <Headphones size={14} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 1. DISCORD USER PROFILE MODAL / POPOVER
// 1. DISCORD USER PROFILE MODAL (100% Faithful Discord Profile Card)
// =========================================================================
function DiscordUserProfileModal({
  profileData,
  currentUserId,
  onClose,
  onOpenEditProfile,
  onSendMessage,
  onCallUser,
  onAddFriend,
  activeServer,
  onToggleMemberRole
}) {
  if (!profileData || !profileData.user) return null;
  const { user, serverMemberInfo, serverProfile, assignedRoles = [], mutualServers = [] } = profileData;
  const isSelf = user.id === currentUserId;

  const currentServerObj = activeServer?.server || activeServer;
  const isServerContext = Boolean(currentServerObj && currentServerObj.id && currentServerObj.id !== 'dms');
  const isServerOwner = isServerContext && (currentServerObj.owner_id === currentUserId || currentUserId === currentServerObj.owner_id);
  const isTargetOwner = isServerContext && (currentServerObj.owner_id === user.id || serverMemberInfo?.role === 'owner');

  const [profileViewMode, setProfileViewMode] = useState(isServerContext && serverProfile ? 'server' : 'global');
  const [showRoleAssignDropdown, setShowRoleAssignDropdown] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [userNote, setUserNote] = useState(() => {
    try {
      return localStorage.getItem(`discord_note_${user.id}`) || '';
    } catch {
      return '';
    }
  });
  const [quickDmText, setQuickDmText] = useState('');

  const handleSaveNote = (val) => {
    setUserNote(val);
    try {
      localStorage.setItem(`discord_note_${user.id}`, val);
    } catch {}
  };

  // Display attributes based on mode
  const effectiveDisplayName = (isServerContext && profileViewMode === 'server' && serverProfile?.nickname) || user.display_name || user.username;
  const effectiveAvatar = (isServerContext && profileViewMode === 'server' && serverProfile?.server_avatar) || user.avatar_url;
  const effectiveBanner = (isServerContext && profileViewMode === 'server' && serverProfile?.server_banner) || user.banner_url;
  const effectiveBio = (isServerContext && profileViewMode === 'server' && serverProfile?.server_bio) || user.bio;

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })
    : '26 de ago. de 2026';

  const serverJoinDate = serverMemberInfo?.joined_at
    ? new Date(serverMemberInfo.joined_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  const handleCopyTag = () => {
    const fullTag = `@${user.username}`;
    navigator.clipboard.writeText(fullTag);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const themePrimary = user.theme_primary || user.banner_color || '#5865F2';
  const themeAccent = user.theme_accent || '#232428';

  const handleQuickSendDm = (e) => {
    e?.preventDefault();
    if (!quickDmText.trim()) return;
    onClose();
    if (onSendMessage) {
      onSendMessage(user);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100000] flex items-center justify-center p-4 animate-msg-enter select-none"
      onClick={onClose}
    >
      <div
        className="w-[340px] max-w-full bg-[#111214] rounded-[16px] overflow-hidden shadow-2xl border text-[#DBDEE1] relative discord-popin flex flex-col max-h-[90vh]"
        style={{
          borderColor: `${themePrimary}50`,
          boxShadow: `0 0 35px ${themePrimary}30`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Actions over Banner */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          {isSelf && (
            <button
              onClick={() => {
                onClose();
                onOpenEditProfile();
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-[#DBDEE1] hover:text-white transition-colors shadow flex items-center gap-1 text-[11px] font-bold px-2.5"
              title="Editar Perfil"
            >
              <PenLine size={13} />
              <span>Editar</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-[#DBDEE1] hover:text-white transition-colors shadow"
            title="Fechar"
          >
            <X size={15} />
          </button>
        </div>

        {/* Profile Banner */}
        <div className="w-full h-32 relative bg-[#1E1F22] overflow-hidden flex-shrink-0">
          {effectiveBanner ? (
            <img
              src={effectiveBanner}
              alt="Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${themePrimary}, ${themeAccent})`
              }}
            />
          )}

          {/* Toggle between Global and Server Profile if in server */}
          {isServerContext && serverProfile && (
            <div className="absolute bottom-2 right-2 z-20 flex bg-black/80 p-0.5 rounded-[6px] border border-white/10 text-[10px] font-bold shadow-lg">
              <button
                type="button"
                onClick={() => setProfileViewMode('server')}
                className={`px-2.5 py-0.5 rounded-[4px] transition-all ${
                  profileViewMode === 'server'
                    ? 'bg-[#5865F2] text-white shadow-sm font-semibold'
                    : 'text-[#949BA4] hover:text-white'
                }`}
              >
                Servidor
              </button>
              <button
                type="button"
                onClick={() => setProfileViewMode('global')}
                className={`px-2.5 py-0.5 rounded-[4px] transition-all ${
                  profileViewMode === 'global'
                    ? 'bg-[#5865F2] text-white shadow-sm font-semibold'
                    : 'text-[#949BA4] hover:text-white'
                }`}
              >
                Global
              </button>
            </div>
          )}
        </div>

        {/* Avatar & Badges Header Row */}
        <div className="px-4 relative flex items-end justify-between -mt-12 pb-2">
          {/* Avatar with Status & Decoration */}
          <div className="relative">
            <div className="p-1.5 rounded-full bg-[#111214] shadow-xl">
              <DiscordUserAvatar
                user={{ ...user, avatar_url: effectiveAvatar, avatar_decoration: user.avatar_decoration }}
                size={80}
                showStatus={true}
              />
            </div>
          </div>

          {/* Badges Container */}
          <div className="flex items-center gap-1 bg-[#1E1F22] px-2 py-1 rounded-[8px] border border-[#2B2D31] shadow-md mb-1">
            <span className="discord-badge cursor-pointer p-1" title="Desenvolvedor do Orbit">
              <Sparkles size={14} className="text-[#5865F2]" />
            </span>
            <span className="discord-badge cursor-pointer p-1" title="Apoiador Inicial">
              <Award size={14} className="text-[#F0B232]" />
            </span>
            <span className="discord-badge cursor-pointer p-1" title="Nitro Booster">
              <Zap size={14} className="text-[#EB459E]" />
            </span>
            {isServerContext && isTargetOwner && (
              <span className="discord-badge cursor-pointer p-1" title="Dono do Servidor">
                <Crown size={14} className="text-[#F0B232] fill-current" />
              </span>
            )}
          </div>
        </div>

        {/* Inner Card Container (#111214 + #232428) */}
        <div className="mx-3.5 mb-3.5 p-3.5 bg-[#232428] rounded-[12px] border border-[#1F2023] space-y-3.5 overflow-y-auto max-h-[60vh]">
          {/* Name & Identity */}
          <div>
            <h3 className="text-xl font-bold text-[#F2F3F5] leading-tight flex items-center gap-2">
              <span className="truncate">{effectiveDisplayName}</span>
              {user.pronouns && (
                <span className="text-[11px] font-medium text-[#949BA4] bg-[#1E1F22] px-2 py-0.5 rounded-full border border-white/5 font-sans">
                  {user.pronouns}
                </span>
              )}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-[#949BA4] mt-0.5">
              <button
                type="button"
                onClick={handleCopyTag}
                className="font-medium hover:text-white transition-colors flex items-center gap-1"
                title="Clique para copiar"
              >
                <span>@{user.username}</span>
                {copiedTag ? (
                  <span className="text-[10px] text-[#23A55A] font-bold">Copiado!</span>
                ) : (
                  <Copy size={11} className="opacity-60" />
                )}
              </button>
            </div>

            {/* Custom Status Capsule */}
            {user.custom_status && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#1E1F22] border border-[#1F2023] text-xs text-[#DBDEE1]">
                <Smile size={13} className="text-[#5865F2]" />
                <span className="truncate">{user.custom_status}</span>
              </div>
            )}
          </div>

          <div className="w-full h-[1px] bg-[#1E1F22]" />

          {/* About Me (Bio) */}
          {effectiveBio && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] block mb-1.5">
                Sobre Mim
              </span>
              <p className="text-xs text-[#DBDEE1] leading-relaxed whitespace-pre-wrap">
                {effectiveBio}
              </p>
            </div>
          )}

          {/* Member Since Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] block mb-2">
              Membro Desde
            </span>
            <div className="grid grid-cols-1 gap-2 text-xs text-[#DBDEE1]">
              <div className="flex items-center gap-2.5 p-2 rounded-[6px] bg-[#1E1F22] border border-[#1F2023]">
                <Calendar size={16} className="text-[#5865F2]" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#949BA4] uppercase font-bold">Orbit</span>
                  <span className="font-medium">{memberSince}</span>
                </div>
              </div>

              {isServerContext && serverJoinDate && (
                <div className="flex items-center gap-2.5 p-2 rounded-[6px] bg-[#1E1F22] border border-[#1F2023]">
                  <Shield size={16} className="text-[#23A55A]" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#949BA4] uppercase font-bold">Neste Servidor</span>
                    <span className="font-medium">{serverJoinDate}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Card */}
          {user.custom_activity && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] block mb-1.5">
                Atividade
              </span>
              <div className="p-2.5 rounded-[8px] bg-[#1E1F22] border border-[#1F2023] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                    <Gamepad2 size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#23A55A]">Jogando</span>
                    <span className="text-xs font-bold text-[#F2F3F5] truncate">{user.custom_activity}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roles (In Server Context) */}
          {isServerContext && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] block mb-1.5">
                Cargos ({assignedRoles.length + (isTargetOwner ? 1 : 0)})
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {isTargetOwner && (
                  <span className="role-pill text-[#F0B232] bg-[#F0B232]/10 border-[#F0B232]/30 font-semibold text-xs py-0.5 px-2">
                    <Crown size={11} className="fill-current" />
                    <span>Dono</span>
                  </span>
                )}

                {assignedRoles.map((r) => (
                  <span
                    key={r.id || r.role_id}
                    className="role-pill text-xs font-semibold py-0.5 px-2 shadow-sm"
                    style={{
                      color: r.role_color || r.color || '#DBDEE1',
                      borderColor: `${r.role_color || r.color || '#5865F2'}40`,
                      backgroundColor: `${r.role_color || r.color || '#5865F2'}15`
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: r.role_color || r.color || '#5865F2' }}
                    />
                    <span>{r.role_name || r.name}</span>
                    {isServerOwner && onToggleMemberRole && (
                      <button
                        type="button"
                        onClick={() => onToggleMemberRole(user.id, r.id || r.role_id)}
                        className="ml-1 text-[#949BA4] hover:text-[#F23F43] p-0.5 rounded transition-colors"
                        title="Remover Cargo"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))}

                {isServerOwner && onToggleMemberRole && (
                  <button
                    type="button"
                    onClick={() => setShowRoleAssignDropdown((p) => !p)}
                    className="p-1 rounded-[4px] bg-[#1E1F22] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-colors text-xs font-bold flex items-center justify-center border border-white/5"
                    title="Adicionar Cargo"
                  >
                    <Plus size={13} />
                  </button>
                )}
              </div>

              {/* Quick Role Toggle Dropdown */}
              {showRoleAssignDropdown && currentServerObj?.roles && (
                <div className="mt-2 p-2 bg-[#1E1F22] rounded-[6px] border border-[#2B2D31] space-y-1 animate-msg-enter shadow-lg">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#949BA4] px-1 py-0.5 flex items-center justify-between">
                    <span>{isSelf ? 'Meus Cargos:' : 'Cargos do Membro:'}</span>
                    <span className="text-[10px] text-[#5865F2] font-mono">{currentServerObj.roles.length}</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-0.5 pr-0.5">
                    {currentServerObj.roles.map((sr) => {
                      const isAssigned = assignedRoles.some((ar) => (ar.id || ar.role_id) === sr.id);
                      return (
                        <button
                          key={sr.id}
                          type="button"
                          onClick={() => onToggleMemberRole(user.id, sr.id)}
                          className={`w-full flex items-center justify-between px-2 py-1 rounded-[3px] text-xs transition-all ${
                            isAssigned
                              ? 'bg-[#5865F2]/25 text-white font-bold border border-[#5865F2]/40'
                              : 'text-[#DBDEE1] hover:bg-[#2B2D31] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sr.color || '#5865F2' }} />
                            <span className="truncate">{sr.name}</span>
                          </div>
                          {isAssigned ? <Check size={12} className="text-[#23A55A]" /> : <Plus size={11} className="text-[#949BA4]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Personal Note */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] block mb-1">
              Nota
            </span>
            <input
              type="text"
              value={userNote}
              onChange={(e) => handleSaveNote(e.target.value)}
              placeholder="Clique para adicionar uma nota"
              className="w-full text-xs bg-[#1E1F22] border border-transparent focus:border-[#5865F2] rounded-[4px] px-2.5 py-1.5 text-[#F2F3F5] outline-none transition-colors placeholder:text-[#949BA4]"
            />
          </div>

          {/* Action Buttons / Quick Message */}
          {!isSelf && (
            <div className="pt-1">
              <form onSubmit={handleQuickSendDm} className="relative">
                <input
                  type="text"
                  placeholder={`Conversar com @${user.username}...`}
                  value={quickDmText}
                  onChange={(e) => setQuickDmText(e.target.value)}
                  className="w-full h-9 pl-3 pr-16 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-xs transition-colors"
                />
                <button
                  type="submit"
                  disabled={!quickDmText.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-30 text-white text-[11px] font-semibold transition-colors"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 1.1 DISCORD USER DOCK POPOUT (Bottom Left Profile Popout)
// =========================================================================
function DiscordUserDockPopout({
  currentUser,
  activeServer,
  connectedVoiceChannel,
  onClose,
  onOpenEditProfile,
  onChangeStatus,
  onLogout,
  onCopyId
}) {
  if (!currentUser) return null;
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const themePrimary = currentUser.theme_primary || currentUser.banner_color || '#5865F2';
  const themeAccent = currentUser.theme_accent || '#232428';

  const statuses = [
    { key: 'online', label: 'Disponível', color: '#23A55A', desc: 'Online' },
    { key: 'idle', label: 'Ausente', color: '#F0B232', desc: 'Ausente' },
    { key: 'dnd', label: 'Não perturbar', color: '#F23F43', desc: 'Você não receberá notificações de som' },
    { key: 'offline', label: 'Invisível', color: '#80848E', desc: 'Você parecerá offline, mas terá acesso total' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[99998]" onClick={onClose} />
      <div
        className="fixed bottom-14 left-2.5 z-[99999] w-[310px] bg-[#111214] text-[#DBDEE1] rounded-[16px] overflow-hidden shadow-2xl border relative select-none animate-msg-enter"
        style={{
          borderColor: `${themePrimary}50`,
          boxShadow: `0 0 30px ${themePrimary}30`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Banner */}
        <div className="w-full h-24 relative bg-[#1E1F22] overflow-hidden flex-shrink-0">
          {currentUser.banner_url ? (
            <img src={currentUser.banner_url} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(135deg, ${themePrimary}, ${themeAccent})`
              }}
            />
          )}
        </div>

        {/* Avatar & Badges Header Row */}
        <div className="px-3.5 relative flex items-end justify-between -mt-10 pb-1.5">
          <div className="p-1.5 rounded-full bg-[#111214] shadow-md">
            <DiscordUserAvatar
              user={currentUser}
              size={72}
              showStatus={true}
              status={currentUser.status}
            />
          </div>

          <div className="flex items-center gap-1 bg-[#1E1F22] px-2 py-1 rounded-[6px] border border-[#2B2D31] shadow-sm mb-1">
            <span className="discord-badge cursor-pointer p-0.5" title="Desenvolvedor">
              <Sparkles size={13} className="text-[#5865F2]" />
            </span>
            <span className="discord-badge cursor-pointer p-0.5" title="Apoiador">
              <Award size={13} className="text-[#F0B232]" />
            </span>
            <span className="discord-badge cursor-pointer p-0.5" title="Nitro">
              <Zap size={13} className="text-[#EB459E]" />
            </span>
          </div>
        </div>

        {/* User Identity Container */}
        <div className="mx-3 mb-3 p-3 bg-[#232428] rounded-[10px] border border-[#1F2023] space-y-2">
          <div>
            <h3 className="text-base font-bold text-[#F2F3F5] leading-tight">
              {currentUser.display_name || currentUser.username}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#949BA4] mt-0.5">
              <span>@{currentUser.username}</span>
              {currentUser.pronouns && (
                <span className="text-[10px] bg-[#1E1F22] px-1.5 py-0.2 rounded border border-white/5">
                  {currentUser.pronouns}
                </span>
              )}
            </div>
          </div>

          {/* Custom Status */}
          {currentUser.custom_status && (
            <div className="p-2 rounded-[6px] bg-[#1E1F22] border border-[#1F2023] text-xs text-[#DBDEE1] flex items-center gap-1.5">
              <Smile size={13} className="text-[#5865F2] flex-shrink-0" />
              <span className="truncate">{currentUser.custom_status}</span>
            </div>
          )}

          <div className="h-[1px] bg-[#1E1F22]" />

          {/* Menu Options List */}
          <div className="space-y-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenEditProfile();
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Edit3 size={15} className="text-[#949BA4]" />
                <span>Editar perfil</span>
              </div>
            </button>

            {/* Status Selector with Flyout */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusSubmenu((p) => !p)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{
                      backgroundColor:
                        currentUser.status === 'dnd'
                          ? '#F23F43'
                          : currentUser.status === 'idle'
                          ? '#F0B232'
                          : currentUser.status === 'offline'
                          ? '#80848E'
                          : '#23A55A'
                    }}
                  />
                  <span>
                    {currentUser.status === 'dnd'
                      ? 'Não perturbar'
                      : currentUser.status === 'idle'
                      ? 'Ausente'
                      : currentUser.status === 'offline'
                      ? 'Invisível'
                      : 'Disponível'}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[#949BA4]" />
              </button>

              {/* Status Flyout */}
              {showStatusSubmenu && (
                <div className="absolute left-full bottom-0 ml-1 w-48 bg-[#111214] border border-[#2B2D31] rounded-[8px] shadow-2xl p-1 space-y-0.5 z-[100000] animate-msg-enter">
                  {statuses.map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => {
                        onChangeStatus(st.key);
                        setShowStatusSubmenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-[4px] hover:bg-[#35373C] text-left transition-colors"
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-[#F2F3F5]">{st.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onCopyId}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Copy size={15} className="text-[#949BA4]" />
                <span>Copiar ID do usuário</span>
              </div>
            </button>

            <div className="h-[1px] bg-[#1E1F22] my-1" />

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-[4px] hover:bg-[#DA373C]/20 text-[#DA373C] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <LogOut size={15} />
                <span>Sair da conta</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// =========================================================================
// 2. DISCORD EDIT PROFILE SETTINGS MODAL (Global & Server Profiles & Decos)
// =========================================================================
function DiscordEditProfileModal({
  currentUser,
  servers = [],
  onClose,
  onSaveProfile,
  onSaveServerProfile,
  isSaving = false
}) {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'server'
  const [selectedServerId, setSelectedServerId] = useState(servers[0]?.id || '');

  // Global profile state
  const [displayName, setDisplayName] = useState(currentUser?.display_name || currentUser?.username || '');
  const [pronouns, setPronouns] = useState(currentUser?.pronouns || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [customStatus, setCustomStatus] = useState(currentUser?.custom_status || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || '');
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatar_color || '#5865F2');
  const [bannerUrl, setBannerUrl] = useState(currentUser?.banner_url || '');
  const [bannerColor, setBannerColor] = useState(currentUser?.banner_color || '#5865F2');
  const [avatarDecoration, setAvatarDecoration] = useState(currentUser?.avatar_decoration || null);
  const [themePrimary, setThemePrimary] = useState(currentUser?.theme_primary || '#5865F2');
  const [themeAccent, setThemeAccent] = useState(currentUser?.theme_accent || '#EB459E');
  const [customActivity, setCustomActivity] = useState(currentUser?.custom_activity || '');

  // Server-specific profile state
  const [serverNickname, setServerNickname] = useState('');
  const [serverAvatarUrl, setServerAvatarUrl] = useState('');
  const [serverBannerUrl, setServerBannerUrl] = useState('');
  const [serverBio, setServerBio] = useState('');

  // GIF prompt state
  const [showGifPrompt, setShowGifPrompt] = useState(false);
  const [gifInputUrl, setGifInputUrl] = useState('');
  const [gifTargetType, setGifTargetType] = useState('avatar'); // 'avatar' | 'banner' | 'server_avatar' | 'server_banner'

  const avatarFileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const serverAvatarInputRef = useRef(null);
  const serverBannerInputRef = useRef(null);

  // Avatar decorations library
  const avatarDecorations = [
    { id: null, name: 'Nenhuma', icon: '🚫' },
    { id: 'cosmic', name: 'Cosmic Galaxy', icon: '🌌', previewClass: 'avatar-deco-cosmic' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '⚡', previewClass: 'avatar-deco-cyberpunk' },
    { id: 'fire', name: 'Pixel Fire', icon: '🔥', previewClass: 'avatar-deco-fire' },
    { id: 'sakura', name: 'Sakura Petals', icon: '🌸', previewClass: 'avatar-deco-sakura' },
    { id: 'astral', name: 'Astral Stars', icon: '⭐', previewClass: 'avatar-deco-astral' },
    { id: 'crown', name: 'Imperial Crown', icon: '👑', previewClass: 'avatar-deco-crown' },
    { id: 'lightning', name: 'Electric Spark', icon: '⚡', previewClass: 'avatar-deco-lightning' },
  ];

  // Check if modified
  const isDirty =
    displayName !== (currentUser?.display_name || currentUser?.username || '') ||
    pronouns !== (currentUser?.pronouns || '') ||
    bio !== (currentUser?.bio || '') ||
    customStatus !== (currentUser?.custom_status || '') ||
    avatarUrl !== (currentUser?.avatar_url || '') ||
    avatarColor !== (currentUser?.avatar_color || '#5865F2') ||
    bannerUrl !== (currentUser?.banner_url || '') ||
    bannerColor !== (currentUser?.banner_color || '#5865F2') ||
    avatarDecoration !== (currentUser?.avatar_decoration || null) ||
    themePrimary !== (currentUser?.theme_primary || '#5865F2') ||
    themeAccent !== (currentUser?.theme_accent || '#EB459E') ||
    customActivity !== (currentUser?.custom_activity || '');

  const handleReset = () => {
    setDisplayName(currentUser?.display_name || currentUser?.username || '');
    setPronouns(currentUser?.pronouns || '');
    setBio(currentUser?.bio || '');
    setCustomStatus(currentUser?.custom_status || '');
    setAvatarUrl(currentUser?.avatar_url || '');
    setAvatarColor(currentUser?.avatar_color || '#5865F2');
    setBannerUrl(currentUser?.banner_url || '');
    setBannerColor(currentUser?.banner_color || '#5865F2');
    setAvatarDecoration(currentUser?.avatar_decoration || null);
    setThemePrimary(currentUser?.theme_primary || '#5865F2');
    setThemeAccent(currentUser?.theme_accent || '#EB459E');
    setCustomActivity(currentUser?.custom_activity || '');
  };

  const handleFileUpload = async (file, type) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'avatar') setAvatarUrl(data.url);
        if (type === 'banner') setBannerUrl(data.url);
        if (type === 'server_avatar') setServerAvatarUrl(data.url);
        if (type === 'server_banner') setServerBannerUrl(data.url);
      }
    } catch (err) {
      console.error('File upload error:', err);
    }
  };

  const previewUser = {
    ...currentUser,
    display_name: activeTab === 'server' && serverNickname ? serverNickname : displayName || currentUser.username,
    pronouns,
    bio: activeTab === 'server' && serverBio ? serverBio : bio,
    custom_status: customStatus,
    avatar_url: activeTab === 'server' && serverAvatarUrl ? serverAvatarUrl : avatarUrl,
    avatar_color: avatarColor,
    banner_url: activeTab === 'server' && serverBannerUrl ? serverBannerUrl : bannerUrl,
    banner_color: bannerColor,
    avatar_decoration: avatarDecoration,
    theme_primary: themePrimary,
    theme_accent: themeAccent,
    custom_activity: customActivity,
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100000] flex items-center justify-center p-4 animate-msg-enter select-none"
      onClick={onClose}
    >
      <div
        className="w-[940px] max-w-full max-h-[92vh] bg-[#313338] rounded-[8px] overflow-hidden shadow-2xl flex flex-col border border-[#1F2023] text-[#DBDEE1] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Tabs */}
        <div className="h-14 px-6 flex items-center justify-between border-b border-[#1F2023] bg-[#2B2D31] flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <UserCircle size={22} className="text-[#5865F2]" />
              <h2 className="font-bold text-base text-[#F2F3F5]">Perfis de Usuário</h2>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-1 bg-[#1E1F22] p-1 rounded-[6px] border border-black/20">
              <button
                type="button"
                onClick={() => setActiveTab('global')}
                className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-all ${
                  activeTab === 'global' ? 'bg-[#5865F2] text-white shadow-sm' : 'text-[#949BA4] hover:text-[#DBDEE1]'
                }`}
              >
                Perfil de Usuário (Global)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('server')}
                className={`px-3 py-1 rounded-[4px] text-xs font-bold transition-all ${
                  activeTab === 'server' ? 'bg-[#5865F2] text-white shadow-sm' : 'text-[#949BA4] hover:text-[#DBDEE1]'
                }`}
              >
                Perfil do Servidor
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 min-h-0">
          {/* LEFT: Customization Form (Col 7) */}
          <div className="md:col-span-7 space-y-5">
            {activeTab === 'global' ? (
              <>
                {/* Display Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Nome de Exibição
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    maxLength={32}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                    placeholder="Como as pessoas verão seu nome"
                  />
                </div>

                {/* Pronouns */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Pronomes
                  </label>
                  <input
                    type="text"
                    value={pronouns}
                    onChange={(e) => setPronouns(e.target.value)}
                    maxLength={40}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                    placeholder="Ex: ele/dele, ela/dela, they/them"
                  />
                </div>

                {/* Custom Status */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Status Personalizado
                  </label>
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    maxLength={128}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                    placeholder="O que está acontecendo? (ex: 🚀 No espaço, 🎧 Ouvindo música)"
                  />
                </div>

                {/* Custom Activity */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Atividade / Jogando (Rich Activity)
                  </label>
                  <input
                    type="text"
                    value={customActivity}
                    onChange={(e) => setCustomActivity(e.target.value)}
                    maxLength={64}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                    placeholder="Ex: Orbit Desktop 2.0, Minecraft, Spotify"
                  />
                </div>

                <div className="w-full h-[1px] bg-[#3F4147]/50 my-4" />

                {/* Avatar Decoration Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Decoração de Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatarDecorations.map((deco) => (
                      <button
                        key={String(deco.id)}
                        type="button"
                        onClick={() => setAvatarDecoration(deco.id)}
                        className={`p-2 rounded-[6px] border flex flex-col items-center gap-1.5 transition-all ${
                          avatarDecoration === deco.id
                            ? 'bg-[#5865F2]/20 border-[#5865F2] text-white shadow-md'
                            : 'bg-[#1E1F22] border-[#2B2D31] text-[#949BA4] hover:border-[#3F4147]'
                        }`}
                      >
                        <span className="text-lg">{deco.icon}</span>
                        <span className="text-[10px] font-bold text-center truncate w-full">{deco.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#3F4147]/50 my-4" />

                {/* Avatar Customization (Photos & GIFs) */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Avatar (Foto ou GIF Animado)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={avatarFileInputRef}
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'avatar')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Upload size={14} />
                      <span>Enviar Imagem ou GIF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGifTargetType('avatar');
                        setGifInputUrl(avatarUrl || '');
                        setShowGifPrompt(true);
                      }}
                      className="px-4 py-2 rounded-[3px] bg-[#4E5058] hover:bg-[#6D6F78] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <LinkIcon size={14} />
                      <span>Link de GIF / URL</span>
                    </button>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl('')}
                        className="px-3 py-2 rounded-[3px] hover:bg-[#DA373C]/20 text-[#DA373C] text-xs font-semibold transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  {/* Color Presets */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[#949BA4]">Cor padrão:</span>
                    {['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245', '#00D2FF', '#9B59B6'].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAvatarColor(color)}
                        className={`w-6 h-6 rounded-full transition-transform ${avatarColor === color ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#3F4147]/50 my-4" />

                {/* Banner Customization & Themes */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Banner do Perfil (Foto ou GIF Animado)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="file"
                      ref={bannerFileInputRef}
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'banner')}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Upload size={14} />
                      <span>Enviar Banner ou GIF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setGifTargetType('banner');
                        setGifInputUrl(bannerUrl || '');
                        setShowGifPrompt(true);
                      }}
                      className="px-4 py-2 rounded-[3px] bg-[#4E5058] hover:bg-[#6D6F78] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <LinkIcon size={14} />
                      <span>Link de GIF / Banner</span>
                    </button>

                    {bannerUrl && (
                      <button
                        type="button"
                        onClick={() => setBannerUrl('')}
                        className="px-3 py-2 rounded-[3px] hover:bg-[#DA373C]/20 text-[#DA373C] text-xs font-semibold transition-colors"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  {/* Profile Theme Gradient Colors */}
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#949BA4]">Cor Primária:</span>
                      <input
                        type="color"
                        value={themePrimary}
                        onChange={(e) => setThemePrimary(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#949BA4]">Cor de Destaque:</span>
                      <input
                        type="color"
                        value={themeAccent}
                        onChange={(e) => setThemeAccent(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-[#3F4147]/50 my-4" />

                {/* About Me / Bio */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1]">
                      Sobre Mim
                    </label>
                    <span className="text-[11px] text-[#949BA4]">
                      {190 - bio.length} restantes
                    </span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={190}
                    rows={3}
                    className="w-full p-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm resize-none transition-colors"
                    placeholder="Fale um pouco sobre você..."
                  />
                </div>
              </>
            ) : (
              /* TAB 2: SERVER PROFILE */
              <div className="space-y-5 animate-msg-enter">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Escolher Servidor
                  </label>
                  <select
                    value={selectedServerId}
                    onChange={(e) => setSelectedServerId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5]"
                  >
                    {servers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Server Nickname */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Apelido no Servidor
                  </label>
                  <input
                    type="text"
                    value={serverNickname}
                    onChange={(e) => setServerNickname(e.target.value)}
                    maxLength={32}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm"
                    placeholder="Apelido exclusivo para este servidor"
                  />
                </div>

                {/* Server Avatar */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Avatar do Servidor (Foto ou GIF)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={serverAvatarInputRef}
                      accept="image/*,.gif"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'server_avatar')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => serverAvatarInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Upload size={14} />
                      <span>Enviar Avatar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGifTargetType('server_avatar');
                        setGifInputUrl(serverAvatarUrl || '');
                        setShowGifPrompt(true);
                      }}
                      className="px-3.5 py-2 rounded-[3px] bg-[#4E5058] hover:bg-[#6D6F78] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <LinkIcon size={14} />
                      <span>Link GIF</span>
                    </button>
                    {serverAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setServerAvatarUrl('')}
                        className="text-xs text-[#F23F43] hover:underline ml-2"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {/* Server Banner */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Banner do Servidor (Foto ou GIF)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={serverBannerInputRef}
                      accept="image/*,.gif"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], 'server_banner')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => serverBannerInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Upload size={14} />
                      <span>Enviar Banner</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGifTargetType('server_banner');
                        setGifInputUrl(serverBannerUrl || '');
                        setShowGifPrompt(true);
                      }}
                      className="px-3.5 py-2 rounded-[3px] bg-[#4E5058] hover:bg-[#6D6F78] text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <LinkIcon size={14} />
                      <span>Link GIF</span>
                    </button>
                    {serverBannerUrl && (
                      <button
                        type="button"
                        onClick={() => setServerBannerUrl('')}
                        className="text-xs text-[#F23F43] hover:underline ml-2"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {/* Server Bio */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Sobre Mim no Servidor
                  </label>
                  <textarea
                    value={serverBio}
                    onChange={(e) => setServerBio(e.target.value)}
                    maxLength={190}
                    rows={3}
                    className="w-full p-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm resize-none"
                    placeholder="Bio específica para os membros deste servidor..."
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onSaveServerProfile({
                      serverId: selectedServerId,
                      nickname: serverNickname,
                      avatar_url: serverAvatarUrl,
                      banner_url: serverBannerUrl,
                      bio: serverBio,
                    })
                  }
                  className="w-full py-2.5 rounded-[4px] bg-[#23A55A] hover:bg-[#1D8848] text-white font-bold text-sm shadow-md transition-colors"
                >
                  Salvar Perfil do Servidor
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: Live Real-Time Discord Profile Card Preview (Col 5) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-3 self-start">
              Pré-visualização {activeTab === 'server' ? '(Perfil de Servidor)' : '(Global)'}
            </h4>

            {/* Real-time Discord Profile Card */}
            <div className="w-full max-w-[340px] bg-[#232428] rounded-[8px] overflow-hidden shadow-2xl border border-[#111214] text-[#DBDEE1]">
              {/* Banner Preview */}
              <div className="w-full h-28 relative bg-[#1E1F22] overflow-hidden">
                {previewUser.banner_url ? (
                  <img
                    src={previewUser.banner_url}
                    alt="Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, ${themePrimary}, ${themeAccent})`
                    }}
                  />
                )}
              </div>

              {/* Avatar Overlay Preview */}
              <div className="px-4 relative flex items-end justify-between -mt-10 pb-2">
                <div className="p-1.5 rounded-full bg-[#232428]">
                  <DiscordUserAvatar
                    user={previewUser}
                    size={72}
                    showStatus={true}
                  />
                </div>

                <div className="flex items-center gap-1 bg-[#111214] px-2 py-1 rounded-[4px] border border-white/5 pb-1">
                  <span className="discord-badge" title="Orbit Br">
                    <Sparkles size={13} className="text-[#5865F2]" />
                  </span>
                  <span className="discord-badge" title="Apoiador">
                    <Award size={13} className="text-[#F0B232]" />
                  </span>
                </div>
              </div>

              {/* Details Body Preview */}
              <div className="bg-[#111214] mx-3 mb-3 p-3 rounded-[8px] space-y-2.5 shadow-inner">
                <div>
                  <h3 className="text-lg font-bold text-[#F2F3F5] leading-tight truncate">
                    {previewUser.display_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#949BA4] font-medium font-mono">
                      {currentUser?.username}{currentUser?.tag || '#0000'}
                    </span>
                    {pronouns && (
                      <span className="text-[10px] bg-[#2B2D31] text-[#DBDEE1] px-1.5 py-0.5 rounded-[3px] font-semibold">
                        {pronouns}
                      </span>
                    )}
                  </div>
                  {customStatus && (
                    <div className="text-xs text-[#DBDEE1] mt-2 pt-1.5 border-t border-[#232428]">
                      {customStatus}
                    </div>
                  )}
                </div>

                {customActivity && (
                  <div className="p-2 rounded bg-[#1E1F22] border border-[#2B2D31] flex items-center gap-2">
                    <Gamepad2 size={14} className="text-[#23A55A]" />
                    <span className="text-xs font-semibold text-[#F2F3F5] truncate">{customActivity}</span>
                  </div>
                )}

                <div className="w-full h-[1px] bg-[#232428]" />

                <div>
                  <h5 className="text-[10px] font-bold text-[#B5BAC1] uppercase tracking-wider mb-1">
                    Sobre Mim
                  </h5>
                  <p className="text-xs text-[#DBDEE1] whitespace-pre-wrap line-clamp-3">
                    {previewUser.bio || 'Este usuário ainda não escreveu nada sobre si mesmo.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GIF URL Input Prompt Modal */}
        {showGifPrompt && (
          <div
            className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowGifPrompt(false)}
          >
            <div
              className="w-96 bg-[#313338] p-5 rounded-[6px] shadow-2xl border border-[#1F2023] text-[#DBDEE1]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-[#F2F3F5] mb-2">
                Inserir Link de {gifTargetType.includes('avatar') ? 'Avatar (GIF/Imagem)' : 'Banner (GIF/Imagem)'}
              </h3>
              <p className="text-xs text-[#949BA4] mb-3">
                Cole uma URL direta de GIF (Giphy, Tenor, Imgur, Discord CDN, etc.) ou imagem (.gif, .png, .jpg).
              </p>
              <input
                type="url"
                value={gifInputUrl}
                onChange={(e) => setGifInputUrl(e.target.value)}
                placeholder="https://media.giphy.com/media/.../giphy.gif"
                className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGifPrompt(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#949BA4] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (gifTargetType === 'avatar') setAvatarUrl(gifInputUrl.trim());
                    if (gifTargetType === 'banner') setBannerUrl(gifInputUrl.trim());
                    if (gifTargetType === 'server_avatar') setServerAvatarUrl(gifInputUrl.trim());
                    if (gifTargetType === 'server_banner') setServerBannerUrl(gifInputUrl.trim());
                    setShowGifPrompt(false);
                  }}
                  className="px-4 py-1.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Floating Unsaved Changes Bottom Notice */}
        {isDirty && activeTab === 'global' && (
          <div className="discord-unsaved-bar fixed bottom-6 left-1/2 -translate-x-1/2 w-[780px] max-w-[92vw] bg-[#111214]/95 backdrop-blur-md text-white p-3.5 rounded-[6px] flex items-center justify-between shadow-2xl border border-[#232428] z-50">
            <span className="text-xs font-medium text-[#F2F3F5]">
              Cuidado — você tem alterações não salvas!
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-[#DBDEE1] hover:underline"
              >
                Redefinir
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  onSaveProfile({
                    display_name: displayName,
                    pronouns,
                    bio,
                    custom_status: customStatus,
                    avatar_url: avatarUrl,
                    avatar_color: avatarColor,
                    banner_url: bannerUrl,
                    banner_color: bannerColor,
                    avatar_decoration: avatarDecoration,
                    theme_primary: themePrimary,
                    theme_accent: themeAccent,
                    custom_activity: customActivity,
                  })
                }
                className="px-5 py-2 rounded-[3px] bg-[#23A55A] hover:bg-[#1D8848] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                {isSaving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Salvar Alterações</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// 3. DISCORD SERVER SETTINGS MODAL (1:1 Discord Server Settings Experience)
// =========================================================================
function DiscordServerSettingsModal({
  server,
  currentUser,
  onClose,
  onServerUpdated,
  onServerDeleted,
  triggerToast
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, roles, emojis, channels, members, invites, audit, delete
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Overview form fields
  const [serverName, setServerName] = useState(server.name || '');
  const [serverIconUrl, setServerIconUrl] = useState(server.icon_url || '');
  const [serverBannerUrl, setServerBannerUrl] = useState(server.banner_url || '');
  const [serverDescription, setServerDescription] = useState(server.description || '');
  const [systemChannelId, setSystemChannelId] = useState(server.system_channel_id || '');
  const [afkChannelId, setAfkChannelId] = useState(server.afk_channel_id || '');
  const [afkTimeout, setAfkTimeout] = useState(server.afk_timeout || 300);
  const [verificationLevel, setVerificationLevel] = useState(server.verification_level || 'none');
  const [defaultNotifications, setDefaultNotifications] = useState(server.default_notifications || 'all');

  // Roles state
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  // Emojis state
  const [emojis, setEmojis] = useState([]);
  const [newEmojiName, setNewEmojiName] = useState('');
  const [newEmojiUrl, setNewEmojiUrl] = useState('');

  // Invites state
  const [invites, setInvites] = useState([]);
  const [currentInviteUrl, setCurrentInviteUrl] = useState('');

  // Members state
  const [members, setMembers] = useState([]);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Channels state
  const [channels, setChannels] = useState([]);

  // Audit log state
  const [auditLogs, setAuditLogs] = useState([]);

  // Delete server confirmation
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Upload refs
  const iconInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const emojiInputRef = useRef(null);

  const isOwner = server.owner_id === currentUser.id;

  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Load server settings bundle
  const loadServerSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/settings`);
      const data = await res.json();
      if (data.success) {
        setSettingsData(data);
        setServerName(data.server.name || '');
        setServerIconUrl(data.server.icon_url || '');
        setServerBannerUrl(data.server.banner_url || '');
        setServerDescription(data.server.description || '');
        setSystemChannelId(data.server.system_channel_id || '');
        setAfkChannelId(data.server.afk_channel_id || '');
        setAfkTimeout(data.server.afk_timeout || 300);
        setVerificationLevel(data.server.verification_level || 'none');
        setDefaultNotifications(data.server.default_notifications || 'all');
        setChannels(data.channels || []);
        setMembers(data.members || []);
        setRoles(data.roles || []);
        if (data.roles && data.roles.length > 0) setSelectedRole(data.roles[0]);
        setEmojis(data.emojis || []);
        setInvites(data.invites || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error('Error loading server settings:', err);
    } finally {
      setLoading(false);
    }
  }, [server.id]);

  useEffect(() => {
    loadServerSettings();
  }, [loadServerSettings]);

  // Check if overview has unsaved changes
  const isDirty =
    serverName !== (server.name || '') ||
    serverIconUrl !== (server.icon_url || '') ||
    serverBannerUrl !== (server.banner_url || '') ||
    serverDescription !== (server.description || '') ||
    systemChannelId !== (server.system_channel_id || '') ||
    afkChannelId !== (server.afk_channel_id || '') ||
    afkTimeout !== (server.afk_timeout || 300) ||
    verificationLevel !== (server.verification_level || 'none') ||
    defaultNotifications !== (server.default_notifications || 'all');

  const handleResetOverview = () => {
    setServerName(server.name || '');
    setServerIconUrl(server.icon_url || '');
    setServerBannerUrl(server.banner_url || '');
    setServerDescription(server.description || '');
    setSystemChannelId(server.system_channel_id || '');
    setAfkChannelId(server.afk_channel_id || '');
    setAfkTimeout(server.afk_timeout || 300);
    setVerificationLevel(server.verification_level || 'none');
    setDefaultNotifications(server.default_notifications || 'all');
  };

  // Save Overview Settings
  const handleSaveOverview = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: serverName,
          icon_url: serverIconUrl,
          banner_url: serverBannerUrl,
          description: serverDescription,
          system_channel_id: systemChannelId,
          afk_channel_id: afkChannelId,
          afk_timeout: afkTimeout,
          verification_level: verificationLevel,
          default_notifications: defaultNotifications,
          user_id: currentUser.id
        })
      });
      const data = await res.json();
      if (data.success) {
        onServerUpdated(data.server);
        triggerToast('Configurações do servidor salvas com sucesso!');
      } else {
        triggerToast(data.error || 'Erro ao salvar configurações.');
      }
    } catch (err) {
      console.error('Error saving server settings:', err);
      triggerToast('Falha na comunicação com o servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  // File upload for Server Icon / Banner / Emojis (supports GIFs)
  const handleUploadFile = async (file, type) => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (type === 'icon') {
          setServerIconUrl(data.url);
          triggerToast('Ícone do servidor carregado!');
        } else if (type === 'banner') {
          setServerBannerUrl(data.url);
          triggerToast('Banner do servidor carregado!');
        } else if (type === 'emoji') {
          setNewEmojiUrl(data.url);
          triggerToast('Arquivo de emoji carregado!');
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      triggerToast('Erro no upload do arquivo.');
    }
  };

  // Role Handlers
  const handleCreateRole = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Novo Cargo', color: '#99AAB5', user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles);
        const created = data.roles.find((r) => r.id === data.roleId);
        if (created) setSelectedRole(created);
        triggerToast('Novo cargo criado!');
      }
    } catch (err) {
      console.error('Create role error:', err);
    }
  };

  const handleUpdateRole = async (roleId, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updatedData, user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles);
        setSelectedRole((prev) => (prev && prev.id === roleId ? { ...prev, ...updatedData } : prev));
        triggerToast('Cargo atualizado!');
      }
    } catch (err) {
      console.error('Update role error:', err);
    }
  };

  const handleDeleteRole = async (roleId) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/roles/${roleId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setRoles(data.roles);
        if (selectedRole?.id === roleId) setSelectedRole(data.roles[0] || null);
        triggerToast('Cargo removido.');
      }
    } catch (err) {
      console.error('Delete role error:', err);
    }
  };

  // Role Hierarchy Move (Up / Down)
  const handleMoveRole = async (roleIndex, direction) => {
    const targetIndex = direction === 'up' ? roleIndex - 1 : roleIndex + 1;
    if (targetIndex < 0 || targetIndex >= roles.length) return;

    const updatedRoles = [...roles];
    const temp = updatedRoles[roleIndex];
    updatedRoles[roleIndex] = updatedRoles[targetIndex];
    updatedRoles[targetIndex] = temp;

    const rolesOrder = updatedRoles.map((r, idx) => ({ id: r.id, position: idx + 1 }));
    setRoles(updatedRoles);

    try {
      await fetch(`${API_BASE}/api/servers/${server.id}/roles/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rolesOrder, user_id: currentUser.id })
      });
      triggerToast('Hierarquia de cargos reordenada!');
    } catch (err) {
      console.error('Error reordering roles:', err);
    }
  };

  // Toggle member role assignment
  const handleToggleMemberRole = async (userId, roleId) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/members/${userId}/roles/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId, admin_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success && data.members) {
        setMembers(data.members);
        triggerToast('Cargos do membro atualizados!');
      }
    } catch (err) {
      console.error('Toggle member role error:', err);
    }
  };

  // Emoji Handlers
  const handleAddEmoji = async (e) => {
    if (e) e.preventDefault();
    if (!newEmojiName.trim() || !newEmojiUrl.trim()) {
      triggerToast('Preencha o nome e o arquivo/link do emoji.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/emojis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEmojiName, url: newEmojiUrl, user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setEmojis(data.emojis);
        setNewEmojiName('');
        setNewEmojiUrl('');
        triggerToast(`Emoji :${newEmojiName}: adicionado!`);
      }
    } catch (err) {
      console.error('Add emoji error:', err);
    }
  };

  const handleDeleteEmoji = async (emojiId) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/emojis/${emojiId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setEmojis(data.emojis);
        triggerToast('Emoji removido.');
      }
    } catch (err) {
      console.error('Delete emoji error:', err);
    }
  };

  // Invite Handler
  const handleGetInvite = async (forceNew = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviter_id: currentUser.id, force_new: forceNew })
      });
      const data = await res.json();
      if (data.success) {
        const fullUrl = `${window.location.origin}/?invite=${data.code}`;
        setCurrentInviteUrl(fullUrl);
        navigator.clipboard.writeText(fullUrl);
        triggerToast('Link de convite oficial copiado!');
        const settRes = await fetch(`${API_BASE}/api/servers/${server.id}/settings`);
        const settData = await settRes.json();
        if (settData.success) {
          setInvites(settData.invites || []);
        }
      }
    } catch (err) {
      console.error('Invite error:', err);
    }
  };

  const handleDeleteInvite = async (code) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/invites/${code}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setInvites(data.invites || []);
        if (currentInviteUrl.includes(code)) setCurrentInviteUrl('');
        triggerToast('Convite excluído!');
      }
    } catch (err) {
      console.error('Delete invite error:', err);
    }
  };

  // Member Kick Handler
  const handleKickMember = async (memberId, memberName) => {
    if (!confirm(`Tem certeza que deseja expulsar ${memberName} do servidor?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/members/${memberId}/kick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
        triggerToast(`${memberName} foi expulso do servidor.`);
      }
    } catch (err) {
      console.error('Kick member error:', err);
    }
  };

  // Member Role Update
  const handleUpdateMemberRole = async (memberId, newRole) => {
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}/members/${memberId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, admin_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        setMembers(data.members);
        triggerToast('Cargo do membro atualizado.');
      }
    } catch (err) {
      console.error('Update member role error:', err);
    }
  };

  // Delete Server Handler
  const handleDeleteServer = async (e) => {
    if (e) e.preventDefault();
    if (deleteConfirmName.trim() !== server.name) {
      triggerToast('O nome do servidor digitado não corresponde.');
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/servers/${server.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Servidor "${server.name}" excluído com sucesso.`);
        onClose();
        onServerDeleted(server.id);
      } else {
        triggerToast(data.error || 'Erro ao excluir servidor.');
      }
    } catch (err) {
      console.error('Delete server error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const textChannels = channels.filter((c) => c.type !== 'voice');
  const voiceChannels = channels.filter((c) => c.type === 'voice');
  const filteredMembers = members.filter((m) =>
    (m.display_name || m.username || '').toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    (m.tag || '').toLowerCase().includes(memberSearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-[#313338] z-[99999] flex select-none animate-msg-enter">
      {/* Hidden File Inputs for Icon, Banner & Emoji Uploads */}
      <input
        type="file"
        ref={iconInputRef}
        accept="image/*,.gif"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUploadFile(e.target.files[0], 'icon');
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={bannerInputRef}
        accept="image/*,.gif"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUploadFile(e.target.files[0], 'banner');
        }}
        className="hidden"
      />
      <input
        type="file"
        ref={emojiInputRef}
        accept="image/*,.gif"
        onChange={(e) => {
          if (e.target.files?.[0]) handleUploadFile(e.target.files[0], 'emoji');
        }}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR OF CATEGORIES (240px, #2B2D31) */}
      {/* ========================================================================= */}
      <div className="w-60 bg-[#2B2D31] flex flex-col justify-between p-4 border-r border-[#1F2023] flex-shrink-0">
        <div>
          {/* Header Server Name */}
          <div className="px-2 py-2 mb-3">
            <h3 className="font-extrabold text-sm text-[#F2F3F5] uppercase tracking-wide truncate">
              {server.name}
            </h3>
          </div>

          {/* Group 1: CONFIGURAÇÃO DO SERVIDOR */}
          <div className="space-y-0.5 mb-4">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#949BA4] px-2 mb-1">
              Configuração do Servidor
            </div>
            {[
              { id: 'overview', label: 'Visão Geral', icon: <Sliders size={16} /> },
              { id: 'roles', label: 'Cargos', icon: <Shield size={16} /> },
              { id: 'emojis', label: 'Emoji', icon: <Smile size={16} /> },
              { id: 'channels', label: 'Canais', icon: <Hash size={16} /> },
              { id: 'audit', label: 'Registro de Auditoria', icon: <FileText size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#404249] text-white'
                    : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Group 2: GERENCIAMENTO DE USUÁRIOS */}
          <div className="space-y-0.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#949BA4] px-2 mb-1">
              Gerenciamento de Usuários
            </div>
            {[
              { id: 'members', label: `Membros (${members.length})`, icon: <Users size={16} /> },
              { id: 'invites', label: 'Convites', icon: <LinkIcon size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-[#404249] text-white'
                    : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Group 3: EXCLUIR SERVIDOR */}
          {isOwner && (
            <div className="mt-4 pt-3 border-t border-[#35373C]">
              <button
                onClick={() => setActiveTab('delete')}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold transition-colors text-left text-[#F23F43] hover:bg-[#F23F43]/15 ${
                  activeTab === 'delete' ? 'bg-[#F23F43]/20 font-bold' : ''
                }`}
              >
                <Trash2 size={16} />
                <span>Excluir Servidor</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-[10px] text-[#949BA4] px-2">
          Orbit Br v1.0.0 • ID: {server.id}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT VIEWPORT */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col h-full bg-[#313338] relative overflow-hidden">
        {/* Top Header & ESC Button */}
        <div className="p-6 pb-2 flex items-center justify-between border-b border-[#232428] flex-shrink-0">
          <h2 className="text-lg font-bold text-[#F2F3F5]">
            {activeTab === 'overview' && 'Visão Geral do Servidor'}
            {activeTab === 'roles' && 'Cargos do Servidor'}
            {activeTab === 'emojis' && 'Emojis Customizados'}
            {activeTab === 'channels' && 'Canais & Categorias'}
            {activeTab === 'audit' && 'Registro de Auditoria'}
            {activeTab === 'members' && 'Membros do Servidor'}
            {activeTab === 'invites' && 'Convites Ativos'}
            {activeTab === 'delete' && 'Excluir Servidor'}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex flex-col items-center group cursor-pointer"
              title="Fechar (ESC)"
            >
              <div className="w-8 h-8 rounded-full border-2 border-[#B5BAC1] group-hover:border-white flex items-center justify-center text-[#B5BAC1] group-hover:text-white transition-colors">
                <X size={16} />
              </div>
              <span className="text-[10px] font-bold text-[#949BA4] group-hover:text-white mt-1">ESC</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tab Body */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl space-y-8 pb-28">
          {/* TAB 1: VISÃO GERAL (OVERVIEW) */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-msg-enter">
              {/* Server Icon & Banner Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Server Icon */}
                <div className="p-4 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] space-y-3">
                  <span className="text-[11px] font-bold text-[#949BA4] uppercase tracking-wider">
                    Ícone do Servidor (Foto ou GIF)
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#1E1F22] border-2 border-[#5865F2] flex items-center justify-center overflow-hidden flex-shrink-0 text-xl font-bold text-white shadow-md">
                      {serverIconUrl ? (
                        <img src={serverIconUrl} alt="Icon" className="w-full h-full object-cover" />
                      ) : (
                        <span>
                          {serverName
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .substring(0, 3)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => iconInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Upload size={14} />
                          <span>Enviar Imagem/GIF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const url = prompt('Insira o link direto de imagem ou GIF para o ícone:', serverIconUrl);
                            if (url !== null) setServerIconUrl(url);
                          }}
                          className="px-3 py-1.5 rounded-[3px] bg-[#383A40] hover:bg-[#404249] text-[#DBDEE1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <LinkIcon size={14} />
                          <span>Link GIF</span>
                        </button>
                      </div>
                      {serverIconUrl && (
                        <button
                          type="button"
                          onClick={() => setServerIconUrl('')}
                          className="text-[11px] text-[#F23F43] hover:underline text-left"
                        >
                          Remover ícone
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#949BA4]">
                    Tamanho recomendado: pelo menos 512x512 pixels. Suporta fotos e GIFs animados.
                  </p>
                </div>

                {/* Server Banner */}
                <div className="p-4 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] space-y-3">
                  <span className="text-[11px] font-bold text-[#949BA4] uppercase tracking-wider">
                    Banner do Servidor (Foto ou GIF)
                  </span>
                  <div className="w-full h-24 rounded-[6px] bg-[#1E1F22] border border-[#35373C] overflow-hidden relative flex items-center justify-center shadow-inner">
                    {serverBannerUrl ? (
                      <img src={serverBannerUrl} alt="Banner" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xs text-[#949BA4] flex items-center gap-1.5">
                        <ImageIcon size={16} />
                        <span>Nenhum banner configurado</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => bannerInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Upload size={14} />
                      <span>Enviar Banner/GIF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Insira o link direto de imagem ou GIF para o banner:', serverBannerUrl);
                        if (url !== null) setServerBannerUrl(url);
                      }}
                      className="px-3 py-1.5 rounded-[3px] bg-[#383A40] hover:bg-[#404249] text-[#DBDEE1] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <LinkIcon size={14} />
                      <span>Link Banner GIF</span>
                    </button>
                    {serverBannerUrl && (
                      <button
                        type="button"
                        onClick={() => setServerBannerUrl('')}
                        className="text-xs text-[#F23F43] hover:underline ml-auto"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Server Name & Description */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Nome do Servidor <span className="text-[#F23F43]">*</span>
                  </label>
                  <input
                    type="text"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] shadow-inner transition-colors"
                    placeholder="Nome do seu servidor"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Descrição do Servidor
                  </label>
                  <textarea
                    rows={3}
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] shadow-inner transition-colors resize-none"
                    placeholder="Conte um pouco sobre este servidor para novos membros..."
                  />
                </div>
              </div>

              {/* Channels Routing (System Messages & AFK Channel) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#35373C]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Canal de Mensagens do Sistema
                  </label>
                  <select
                    value={systemChannelId}
                    onChange={(e) => setSystemChannelId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] shadow-inner cursor-pointer"
                  >
                    <option value="">Nenhum canal do sistema</option>
                    {textChannels.map((c) => (
                      <option key={c.id} value={c.id}>
                        #{c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-[#949BA4] mt-1.5">
                    O canal onde mensagens de boas-vindas automáticas serão postadas.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Canal Inativo (AFK) & Tempo Limite
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={afkChannelId}
                      onChange={(e) => setAfkChannelId(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] shadow-inner cursor-pointer"
                    >
                      <option value="">Nenhum canal AFK</option>
                      {voiceChannels.map((c) => (
                        <option key={c.id} value={c.id}>
                          🔊 {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={afkTimeout}
                      onChange={(e) => setAfkTimeout(Number(e.target.value))}
                      className="w-28 px-3 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] shadow-inner cursor-pointer"
                    >
                      <option value={300}>5 minutos</option>
                      <option value={900}>15 minutos</option>
                      <option value={1800}>30 minutos</option>
                      <option value={3600}>1 hora</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Verification Level & Notification Defaults */}
              <div className="pt-4 border-t border-[#35373C] space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Nível de Verificação de Segurança
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { id: 'none', title: 'Nenhum', desc: 'Sem restrições para novos membros.' },
                      { id: 'low', title: 'Baixo', desc: 'Deve ter e-mail verificado.' },
                      { id: 'medium', title: 'Médio', desc: 'Registrado há mais de 5 minutos.' },
                      { id: 'high', title: 'Alto', desc: 'Membro do servidor há mais de 10 min.' },
                    ].map((lvl) => (
                      <div
                        key={lvl.id}
                        onClick={() => setVerificationLevel(lvl.id)}
                        className={`p-3 rounded-[6px] border cursor-pointer transition-all ${
                          verificationLevel === lvl.id
                            ? 'bg-[#5865F2]/20 border-[#5865F2] text-white'
                            : 'bg-[#2B2D31] border-[#1F2023] text-[#949BA4] hover:border-[#383A40]'
                        }`}
                      >
                        <div className="font-bold text-xs mb-1 text-[#F2F3F5]">{lvl.title}</div>
                        <div className="text-[10px] leading-tight">{lvl.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Configurações Padrão de Notificação
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#DBDEE1]">
                      <input
                        type="radio"
                        name="notif"
                        checked={defaultNotifications === 'all'}
                        onChange={() => setDefaultNotifications('all')}
                        className="accent-[#5865F2]"
                      />
                      <span>Todas as mensagens</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#DBDEE1]">
                      <input
                        type="radio"
                        name="notif"
                        checked={defaultNotifications === 'mentions'}
                        onChange={() => setDefaultNotifications('mentions')}
                        className="accent-[#5865F2]"
                      />
                      <span>Apenas @menções</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARGOS (ROLES) */}
          {activeTab === 'roles' && (
            <div className="space-y-6 animate-msg-enter">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F2F3F5]">Cargos do Servidor</h4>
                  <p className="text-xs text-[#949BA4]">Use cargos para organizar membros e definir permissões.</p>
                </div>
                <button
                  type="button"
                  onClick={handleCreateRole}
                  className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Plus size={14} />
                  <span>Criar Cargo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Roles List with Hierarchy Order */}
                <div className="bg-[#2B2D31] border border-[#1F2023] rounded-[8px] p-2 space-y-1 max-h-96 overflow-y-auto">
                  {roles.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[#949BA4]">Nenhum cargo criado</div>
                  ) : (
                    roles.map((r, index) => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedRole(r)}
                        className={`flex items-center justify-between px-3 py-2 rounded-[4px] cursor-pointer transition-colors ${
                          selectedRole?.id === r.id
                            ? 'bg-[#404249] text-white font-bold'
                            : 'text-[#DBDEE1] hover:bg-[#35373C]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: r.color || '#99AAB5' }}
                          />
                          <span className="text-xs truncate">{r.icon ? `${r.icon} ` : ''}{r.name}</span>
                        </div>

                        {/* Role Hierarchy Move Buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveRole(index, 'up');
                            }}
                            disabled={index === 0}
                            className="p-1 hover:bg-[#1E1F22] rounded text-[#949BA4] hover:text-white disabled:opacity-20 transition-colors"
                            title="Mover para cima (Hierarquia maior)"
                          >
                            <MoveUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveRole(index, 'down');
                            }}
                            disabled={index === roles.length - 1}
                            className="p-1 hover:bg-[#1E1F22] rounded text-[#949BA4] hover:text-white disabled:opacity-20 transition-colors"
                            title="Mover para baixo (Hierarquia menor)"
                          >
                            <MoveDown size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Selected Role Editor */}
                {selectedRole ? (
                  <div className="md:col-span-2 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] p-6 space-y-5">
                    <div className="flex items-center justify-between border-b border-[#35373C] pb-3">
                      <h5 className="font-bold text-sm text-[#F2F3F5] flex items-center gap-2">
                        <span>Editando Cargo: {selectedRole.name}</span>
                        {selectedRole.icon && <span className="text-base">{selectedRole.icon}</span>}
                      </h5>
                      <button
                        type="button"
                        onClick={() => handleDeleteRole(selectedRole.id)}
                        className="text-xs text-[#F23F43] hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Excluir Cargo</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                        Nome do Cargo
                      </label>
                      <input
                        type="text"
                        value={selectedRole.name}
                        onChange={(e) =>
                          setSelectedRole((prev) => ({ ...prev, name: e.target.value }))
                        }
                        onBlur={() => handleUpdateRole(selectedRole.id, selectedRole)}
                        className="w-full px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5]"
                      />
                    </div>

                    {/* Role Emoji / Icon */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                        Ícone / Emoji do Cargo
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={selectedRole.icon || ''}
                          onChange={(e) => {
                            const newIcon = e.target.value;
                            setSelectedRole((prev) => ({ ...prev, icon: newIcon }));
                            handleUpdateRole(selectedRole.id, { ...selectedRole, icon: newIcon });
                          }}
                          placeholder="Ex: 👑"
                          className="w-20 px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-sm text-[#F2F3F5] text-center"
                        />
                        <div className="flex flex-wrap gap-1">
                          {['👑', '🛡️', '💎', '🚀', '⭐', '⚡', '🔥', '🎮'].map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => {
                                setSelectedRole((prev) => ({ ...prev, icon: em }));
                                handleUpdateRole(selectedRole.id, { ...selectedRole, icon: em });
                              }}
                              className="p-1.5 rounded hover:bg-[#1E1F22] text-sm"
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                        Cor do Cargo
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={selectedRole.color || '#99AAB5'}
                          onChange={(e) => {
                            const newCol = e.target.value;
                            setSelectedRole((prev) => ({ ...prev, color: newCol }));
                            handleUpdateRole(selectedRole.id, { ...selectedRole, color: newCol });
                          }}
                          className="w-9 h-9 rounded-[4px] cursor-pointer bg-transparent border-0"
                        />
                        <div className="flex flex-wrap gap-2">
                          {['#5865F2', '#23A55A', '#F0B232', '#F23F43', '#9B59B6', '#E91E63', '#1ABC9C', '#3498DB', '#E67E22', '#2ECC71'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setSelectedRole((prev) => ({ ...prev, color: c }));
                                handleUpdateRole(selectedRole.id, { ...selectedRole, color: c });
                              }}
                              className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#35373C] space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedRole.hoist)}
                          onChange={(e) => {
                            const newHoist = e.target.checked;
                            setSelectedRole((prev) => ({ ...prev, hoist: newHoist }));
                            handleUpdateRole(selectedRole.id, { ...selectedRole, hoist: newHoist });
                          }}
                          className="w-4 h-4 accent-[#5865F2]"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#F2F3F5]">
                            Exibir membros do cargo separadamente dos membros online
                          </div>
                          <div className="text-[10px] text-[#949BA4]">
                            Membros com este cargo aparecerão em uma categoria própria na lista lateral.
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Categorized Permissions */}
                    <div className="pt-3 border-t border-[#35373C] space-y-3">
                      <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1]">
                        Permissões do Cargo
                      </h6>
                      <div className="space-y-3">
                        <div className="p-3 bg-[#1E1F22] rounded-[4px] border border-[#1F2023] space-y-2">
                          <span className="text-[10px] font-bold uppercase text-[#5865F2] tracking-wider">
                            Gerais do Servidor
                          </span>
                          {[
                            { key: 'ADMINISTRATOR', label: 'Administrador (Acesso Total)' },
                            { key: 'MANAGE_SERVER', label: 'Gerenciar Servidor' },
                            { key: 'MANAGE_ROLES', label: 'Gerenciar Cargos' },
                            { key: 'MANAGE_CHANNELS', label: 'Gerenciar Canais' },
                            { key: 'KICK_MEMBERS', label: 'Expulsar Membros' },
                          ].map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#DBDEE1]">
                              <input
                                type="checkbox"
                                defaultChecked={true}
                                className="accent-[#5865F2] rounded"
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>

                        <div className="p-3 bg-[#1E1F22] rounded-[4px] border border-[#1F2023] space-y-2">
                          <span className="text-[10px] font-bold uppercase text-[#23A55A] tracking-wider">
                            Permissões de Texto
                          </span>
                          {[
                            { key: 'SEND_MESSAGES', label: 'Enviar Mensagens' },
                            { key: 'ATTACH_FILES', label: 'Anexar Arquivos e Mídias' },
                            { key: 'ADD_REACTIONS', label: 'Adicionar Reações' },
                            { key: 'MENTION_EVERYONE', label: 'Mencionar @everyone e Cargos' },
                          ].map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#DBDEE1]">
                              <input
                                type="checkbox"
                                defaultChecked={true}
                                className="accent-[#23A55A] rounded"
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>

                        <div className="p-3 bg-[#1E1F22] rounded-[4px] border border-[#1F2023] space-y-2">
                          <span className="text-[10px] font-bold uppercase text-[#F0B232] tracking-wider">
                            Permissões de Voz
                          </span>
                          {[
                            { key: 'CONNECT', label: 'Conectar aos Canais de Voz' },
                            { key: 'SPEAK', label: 'Falar' },
                            { key: 'STREAM', label: 'Transmitir Tela (Ao Vivo)' },
                          ].map((perm) => (
                            <label key={perm.key} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#DBDEE1]">
                              <input
                                type="checkbox"
                                defaultChecked={true}
                                className="accent-[#F0B232] rounded"
                              />
                              <span>{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Members with this Role Manager */}
                    <div className="pt-3 border-t border-[#35373C] space-y-3">
                      <div className="flex items-center justify-between">
                        <h6 className="text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1]">
                          Membros com este Cargo ({members.filter((m) => m.roles?.some((r) => (r.id || r.role_id) === selectedRole.id)).length})
                        </h6>
                        <span className="text-[10px] text-[#5865F2] font-semibold">Atribuição Direta</span>
                      </div>
                      <div className="p-3 bg-[#1E1F22] rounded-[6px] border border-[#1F2023] max-h-48 overflow-y-auto space-y-1">
                        {members.length === 0 ? (
                          <div className="text-xs text-[#80848E] text-center py-2">Nenhum membro no servidor</div>
                        ) : (
                          members.map((m) => {
                            const hasThisRole = m.roles?.some((r) => (r.id || r.role_id) === selectedRole.id);
                            return (
                              <div
                                key={m.id || m.user_id}
                                className={`flex items-center justify-between p-2 rounded-[4px] transition-colors ${
                                  hasThisRole ? 'bg-[#5865F2]/15 border border-[#5865F2]/30' : 'hover:bg-[#2B2D31]'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <DiscordUserAvatar user={m} size={24} />
                                  <span className="text-xs font-medium text-[#F2F3F5] truncate">
                                    {m.display_name || m.username} {m.user_id === currentUser?.id ? '(Você)' : ''}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleToggleMemberRole(m.user_id || m.id, selectedRole.id)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                                    hasThisRole
                                      ? 'bg-[#DA373C]/20 hover:bg-[#DA373C] text-[#DA373C] hover:text-white'
                                      : 'bg-[#5865F2] hover:bg-[#4752C4] text-white'
                                  }`}
                                >
                                  {hasThisRole ? 'Remover' : 'Atribuir'}
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2 flex items-center justify-center p-8 text-xs text-[#949BA4]">
                    Selecione um cargo para editar suas configurações.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EMOJIS CUSTOMIZADOS */}
          {activeTab === 'emojis' && (
            <div className="space-y-6 animate-msg-enter">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F2F3F5]">Emojis do Servidor</h4>
                  <p className="text-xs text-[#949BA4]">Adicione emojis personalizados (fotos ou GIFs animados) para seus membros usarem.</p>
                </div>
                <button
                  type="button"
                  onClick={() => emojiInputRef.current?.click()}
                  className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Upload size={14} />
                  <span>Enviar Emoji / GIF</span>
                </button>
              </div>

              {/* Add Emoji by URL / Form */}
              <div className="p-4 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Nome do Emoji (ex: pepedance)"
                  value={newEmojiName}
                  onChange={(e) => setNewEmojiName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-xs text-[#F2F3F5]"
                />
                <input
                  type="text"
                  placeholder="URL da Imagem / GIF"
                  value={newEmojiUrl}
                  onChange={(e) => setNewEmojiUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-xs text-[#F2F3F5]"
                />
                <button
                  type="button"
                  onClick={handleAddEmoji}
                  className="px-4 py-2 rounded-[3px] bg-[#23A55A] hover:bg-[#1D8848] text-white text-xs font-semibold transition-colors"
                >
                  Adicionar
                </button>
              </div>

              {/* Emojis Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {emojis.length === 0 ? (
                  <div className="col-span-full p-8 text-center text-xs text-[#949BA4] bg-[#2B2D31] rounded-[8px]">
                    Nenhum emoji personalizado ainda. Faça upload ou adicione um link de GIF acima!
                  </div>
                ) : (
                  emojis.map((em) => (
                    <div
                      key={em.id}
                      className="p-3 bg-[#2B2D31] border border-[#1F2023] rounded-[6px] flex flex-col items-center gap-2 group relative hover:border-[#5865F2] transition-colors"
                    >
                      <img src={em.url} alt={em.name} className="w-10 h-10 object-contain rounded" />
                      <span className="text-[11px] font-mono text-[#DBDEE1] truncate max-w-full">
                        :{em.name}:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEmoji(em.id)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-[#1E1F22] text-[#F23F43] opacity-0 group-hover:opacity-100 hover:bg-[#F23F43] hover:text-white transition-all shadow"
                        title="Remover Emoji"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CANAIS & CATEGORIAS */}
          {activeTab === 'channels' && (
            <div className="space-y-6 animate-msg-enter">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F2F3F5]">Canais do Servidor</h4>
                  <p className="text-xs text-[#949BA4]">Gerencie os canais de texto e de voz do seu servidor.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4]">
                    Canais de Texto ({textChannels.length})
                  </span>
                  <div className="space-y-1">
                    {textChannels.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-[4px] bg-[#1E1F22] hover:bg-[#35373C] text-xs text-[#DBDEE1] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Hash size={14} className="text-[#80848E]" />
                          <span className="font-semibold text-[#F2F3F5]">{c.name}</span>
                          <span className="text-[10px] text-[#949BA4] truncate">{c.topic}</span>
                        </div>
                        <span className="text-[10px] text-[#949BA4] font-mono">ID: {c.id}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4]">
                    Canais de Voz ({voiceChannels.length})
                  </span>
                  <div className="space-y-1">
                    {voiceChannels.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2 rounded-[4px] bg-[#1E1F22] hover:bg-[#35373C] text-xs text-[#DBDEE1] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Volume2 size={14} className="text-[#23A55A]" />
                          <span className="font-semibold text-[#F2F3F5]">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-[#949BA4] font-mono">64 kbps • ID: {c.id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REGISTRO DE AUDITORIA (AUDIT LOG) */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-msg-enter">
              <div>
                <h4 className="text-sm font-bold text-[#F2F3F5]">Registro de Auditoria</h4>
                <p className="text-xs text-[#949BA4]">Histórico das ações administrativas recentes realizadas no servidor.</p>
              </div>

              <div className="bg-[#2B2D31] border border-[#1F2023] rounded-[8px] divide-y divide-[#35373C] overflow-hidden">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#949BA4]">
                    Nenhum registro de auditoria gravado ainda.
                  </div>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-3.5 flex items-center justify-between hover:bg-[#35373C] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-full bg-[#1E1F22] text-[#5865F2]">
                          <FileText size={16} />
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#F2F3F5] uppercase tracking-wide mr-2">
                            {log.action}
                          </span>
                          <span className="text-xs text-[#DBDEE1]">{log.details}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#949BA4]">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MEMBROS (MEMBERS) */}
          {activeTab === 'members' && (
            <div className="space-y-6 animate-msg-enter">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#F2F3F5]">Membros do Servidor ({members.length})</h4>
                  <p className="text-xs text-[#949BA4]">Gerencie cargos, permissões e moderação de membros.</p>
                </div>
                <input
                  type="text"
                  placeholder="Buscar membros..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="px-3.5 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1F2023] focus:border-[#5865F2] outline-none text-xs text-[#F2F3F5] w-64 shadow-inner"
                />
              </div>

              <div className="bg-[#2B2D31] border border-[#1F2023] rounded-[8px] divide-y divide-[#35373C] overflow-hidden">
                {filteredMembers.map((m) => {
                  const isMemberOwner = m.user_id === server.owner_id || m.role === 'owner';
                  return (
                    <div
                      key={m.id}
                      className="p-3 flex items-center justify-between hover:bg-[#35373C] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <DiscordUserAvatar user={m} size={36} />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-[#F2F3F5]">
                              {m.display_name || m.username}
                            </span>
                            <span className="text-[10px] text-[#949BA4] font-mono">{m.tag}</span>
                            {isMemberOwner && (
                              <Crown size={13} className="text-[#F0B232] fill-current" title="Dono do Servidor" />
                            )}
                          </div>
                          <span className="text-[10px] text-[#949BA4]">
                            Entrou em {new Date(m.joined_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Assigned Role Pills */}
                        <div className="flex flex-wrap items-center gap-1 max-w-[260px]">
                          {m.roles && m.roles.map((r) => (
                            <span
                              key={r.id || r.role_id}
                              className="role-pill"
                              style={{ color: r.role_color || r.color || '#DBDEE1' }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: r.role_color || r.color || '#5865F2' }}
                              />
                              <span>{r.role_name || r.name}</span>
                              {isOwner && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleMemberRole(m.user_id || m.id, r.id || r.role_id)}
                                  className="text-[#949BA4] hover:text-[#F23F43]"
                                  title="Remover cargo"
                                >
                                  <X size={10} />
                                </button>
                              )}
                            </span>
                          ))}

                          {/* Quick Add Role Dropdown */}
                          {isOwner && roles.length > 0 && (
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleToggleMemberRole(m.user_id || m.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="px-1.5 py-0.5 rounded bg-[#1E1F22] border border-[#2B2D31] text-[10px] text-[#5865F2] font-bold cursor-pointer outline-none hover:border-[#5865F2]"
                            >
                              <option value="">+ Cargo</option>
                              {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        {/* Kick Member */}
                        {!isMemberOwner && isOwner && (
                          <button
                            type="button"
                            onClick={() => handleKickMember(m.id, m.display_name || m.username)}
                            className="p-1.5 rounded text-[#949BA4] hover:text-[#F23F43] hover:bg-[#1E1F22] transition-colors"
                            title="Expulsar Membro"
                          >
                            <UserMinus size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: CONVITES (INVITES) */}
          {activeTab === 'invites' && (
            <div className="space-y-6 animate-msg-enter">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#F2F3F5]">Convites do Servidor</h4>
                  <p className="text-xs text-[#949BA4]">Gere links oficiais de convite para trazer amigos e novos membros.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleGetInvite(true)}
                  className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <LinkIcon size={14} />
                  <span>Gerar Novo Link</span>
                </button>
              </div>

              {currentInviteUrl && (
                <div className="p-4 bg-[#2B2D31] border border-[#5865F2] rounded-[8px] flex items-center justify-between shadow-md">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[#5865F2] uppercase">Link Oficial de Convite</span>
                    <span className="text-sm font-mono text-white mt-0.5 select-all">{currentInviteUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentInviteUrl);
                      triggerToast('Link copiado para a área de transferência!');
                    }}
                    className="px-3.5 py-1.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Copy size={13} />
                    <span>Copiar</span>
                  </button>
                </div>
              )}

              <div className="bg-[#2B2D31] border border-[#1F2023] rounded-[8px] p-4">
                <span className="text-[11px] font-bold text-[#949BA4] uppercase mb-2 block">
                  Links Criados ({invites.length})
                </span>
                {invites.length === 0 ? (
                  <div className="text-xs text-[#949BA4]">Nenhum convite gerado ainda. Clique em "Gerar Novo Link" acima.</div>
                ) : (
                  <div className="space-y-2">
                    {invites.map((inv) => {
                      const fullUrl = `${window.location.origin}/?invite=${inv.code}`;
                      return (
                        <div
                          key={inv.code}
                          className="flex items-center justify-between p-2.5 rounded-[4px] bg-[#1E1F22] text-xs font-mono text-[#DBDEE1]"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <span className="text-[#5865F2] font-bold">{inv.code}</span>
                            <span className="text-[#949BA4] truncate">{fullUrl}</span>
                            <span className="text-[10px] bg-[#2B2D31] text-[#B5BAC1] px-2 py-0.5 rounded-full font-sans">
                              {inv.uses || 0} {inv.uses === 1 ? 'uso' : 'usos'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(fullUrl);
                                triggerToast('Link copiado!');
                              }}
                              className="text-[#5865F2] hover:underline px-2 py-1 text-xs"
                            >
                              Copiar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteInvite(inv.code)}
                              className="text-[#949BA4] hover:text-[#F23F43] p-1 transition-colors"
                              title="Excluir convite"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: EXCLUIR SERVIDOR */}
          {activeTab === 'delete' && isOwner && (
            <div className="space-y-6 animate-msg-enter">
              <div className="p-6 rounded-[8px] bg-[#F23F43]/10 border border-[#F23F43] space-y-4">
                <div className="flex items-center gap-3 text-[#F23F43]">
                  <AlertTriangle size={24} />
                  <h4 className="text-base font-bold">Zona de Perigo: Exclusão Permanente</h4>
                </div>
                <p className="text-xs text-[#DBDEE1] leading-relaxed">
                  Tem certeza que deseja excluir o servidor <strong>{server.name}</strong>? Essa ação é irreversível e todos os canais, mensagens, cargos e configurações serão permanentemente removidos.
                </p>
                <form onSubmit={handleDeleteServer} className="space-y-3 pt-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1]">
                    Digite o nome do servidor para confirmar ({server.name}):
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmName}
                    onChange={(e) => setDeleteConfirmName(e.target.value)}
                    placeholder={server.name}
                    className="w-full px-3.5 py-2.5 rounded-[4px] bg-[#1E1F22] border border-[#F23F43] focus:border-[#DA373C] outline-none text-sm text-white shadow-inner font-medium"
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={deleteConfirmName.trim() !== server.name || isDeleting}
                      className="px-6 py-2.5 rounded-[3px] bg-[#DA373C] hover:bg-[#A12828] disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
                    >
                      {isDeleting ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                      <span>Excluir Servidor Permanentemente</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Floating Unsaved Changes Bottom Notice (Discord Style) */}
        {activeTab === 'overview' && isDirty && (
          <div className="discord-unsaved-bar absolute bottom-4 left-6 right-6 p-3 bg-[#111214] border border-[#232428] rounded-[8px] flex items-center justify-between shadow-2xl z-50">
            <span className="text-xs font-semibold text-[#F2F3F5]">
              Cuidado — você tem alterações não salvas no servidor!
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetOverview}
                className="text-xs font-semibold text-[#DBDEE1] hover:underline px-2 py-1"
              >
                Redefinir
              </button>
              <button
                type="button"
                onClick={handleSaveOverview}
                disabled={isSaving}
                className="px-5 py-2 rounded-[3px] bg-[#23A55A] hover:bg-[#1D8848] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                {isSaving ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Salvar Alterações</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  // ==========================================
  // AUTH STATE
  // ==========================================
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('discord_user');
      if (!saved || saved === 'undefined' || saved === 'null') return null;
      return JSON.parse(saved);
    } catch (e) {
      try { localStorage.removeItem('discord_user'); } catch (err) {}
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ==========================================
  // APP NAVIGATION & DATA STATE
  // ==========================================
  const [socket, setSocket] = useState(null);
  const [servers, setServers] = useState([]);
  const [activeServerId, setActiveServerId] = useState('dms'); // 'dms' or server.id
  const [currentServerData, setCurrentServerData] = useState(null);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendsTab, setFriendsTab] = useState('online'); // 'online', 'all', 'pending', 'blocked', 'add_friend'
  const [activeDmFriend, setActiveDmFriend] = useState(null);
  const [dmMessages, setDmMessages] = useState([]);

  // Voice & Screen Share State
  const [connectedVoiceChannelId, setConnectedVoiceChannelId] = useState(null);
  const [voiceSessions, setVoiceSessions] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);

  // Camera & Video State
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [showVoiceChatSidebar, setShowVoiceChatSidebar] = useState(false);
  const [voiceViewMode, setVoiceViewMode] = useState('grid'); // 'grid' | 'focus'

  // Screen Sharing
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteScreenStreams, setRemoteScreenStreams] = useState({}); // { [socketId]: { stream, userId } }
  const [fullscreenStream, setFullscreenStream] = useState(null);
  const [isStageCollapsed, setIsStageCollapsed] = useState(false);

  // Modals & Forms
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [serverModalStep, setServerModalStep] = useState('templates'); // 'templates' | 'customize'
  const [newServerName, setNewServerName] = useState('');
  const [newServerTemplate, setNewServerTemplate] = useState('Create My Own');
  
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [newChannelType, setNewChannelType] = useState('text');
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelTopic, setNewChannelTopic] = useState('');
  const [isChannelPrivate, setIsChannelPrivate] = useState(false);
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const [showChannelEmojiPicker, setShowChannelEmojiPicker] = useState(false);

  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCategoryPrivate, setIsCategoryPrivate] = useState(false);
  const [showCategoryEmojiPicker, setShowCategoryEmojiPicker] = useState(false);

  const [hideMutedChannels, setHideMutedChannels] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const [addFriendInput, setAddFriendInput] = useState('');
  const [addFriendStatus, setAddFriendStatus] = useState({ msg: '', type: '' });
  const [messageInput, setMessageInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMemberSidebar, setShowMemberSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // User Profile Viewer & Customization States
  const [viewingUserProfile, setViewingUserProfile] = useState(null); // { user, serverMemberInfo, mutualServers, friendshipStatus, loading }
  const [showUserDockPopout, setShowUserDockPopout] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Server Settings States
  const [showServerSettingsModal, setShowServerSettingsModal] = useState(false);
  const [showServerHeaderDropdown, setShowServerHeaderDropdown] = useState(false);

  // Server Discovery & Invite States
  const [discoverServers, setDiscoverServers] = useState([]);
  const [discoverCategory, setDiscoverCategory] = useState('Todos');
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [isDiscoverLoading, setIsDiscoverLoading] = useState(false);

  // Invite Modal States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteModalServer, setInviteModalServer] = useState(null);
  const [inviteLinkData, setInviteLinkData] = useState(null); // { code, url }
  const [isCopiedInvite, setIsCopiedInvite] = useState(false);

  // Incoming / Pending Invite Link State (Auto-join via URL)
  const [pendingInviteData, setPendingInviteData] = useState(null); // { invite, server, inviter }
  const [showPendingInviteModal, setShowPendingInviteModal] = useState(false);
  const [isJoiningInvite, setIsJoiningInvite] = useState(false);

  // Join by Invite code in Add Server Modal
  const [joinInviteInput, setJoinInviteInput] = useState('');
  const [joinInviteError, setJoinInviteError] = useState('');
  const [isJoiningByInput, setIsJoiningByInput] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef({}); // WebRTC { [socketId]: { pc, audio, userId } }
  const typingTimeoutRef = useRef(null);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  // Open Detailed User Profile Modal
  const handleOpenUserProfile = useCallback(async (targetUser, serverId = null) => {
    if (!targetUser) return;
    const targetId = targetUser.id || targetUser.user_id || targetUser.sender_id;
    if (!targetId) return;

    const effectiveServerId = serverId || (activeServerId !== 'dms' ? activeServerId : '');

    setViewingUserProfile({
      user: targetUser,
      serverMemberInfo: null,
      serverProfile: null,
      assignedRoles: [],
      mutualServers: [],
      friendshipStatus: null,
      loading: true,
    });

    try {
      const res = await fetch(
        `${API_BASE}/api/users/${targetId}/profile?currentUserId=${currentUser?.id || ''}&serverId=${effectiveServerId}`
      );
      const data = await res.json();
      if (data.success && data.user) {
        setViewingUserProfile({
          user: { ...targetUser, ...data.user },
          serverMemberInfo: data.serverMemberInfo,
          serverProfile: data.serverProfile,
          assignedRoles: data.assignedRoles || [],
          mutualServers: data.mutualServers || [],
          friendshipStatus: data.friendshipStatus,
          loading: false,
        });
      } else {
        setViewingUserProfile((prev) => (prev ? { ...prev, loading: false } : null));
      }
    } catch (err) {
      console.error('Fetch profile error:', err);
      setViewingUserProfile((prev) => (prev ? { ...prev, loading: false } : null));
    }
  }, [currentUser, activeServerId]);

  // Open Edit Profile Customizer
  const handleOpenEditProfile = useCallback(() => {
    if (!currentUser) return;
    setShowEditProfileModal(true);
    if (viewingUserProfile && viewingUserProfile.user?.id === currentUser.id) {
      setViewingUserProfile(null);
    }
  }, [currentUser, viewingUserProfile]);

  // Save Profile Customization
  const handleSaveProfile = useCallback(async (updatedFields) => {
    if (!currentUser) return;
    setIsSavingProfile(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ...updatedFields,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        try {
          localStorage.setItem('discord_user', JSON.stringify(data.user));
        } catch (e) {}
        triggerToast('Perfil do Orbit Br atualizado com sucesso!');
        setShowEditProfileModal(false);
      } else {
        triggerToast(data.error || 'Erro ao salvar alterações do perfil.');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      triggerToast('Falha na comunicação com o servidor.');
    } finally {
      setIsSavingProfile(false);
    }
  }, [currentUser, triggerToast]);

  // Save Server-Specific Profile Customization
  const handleSaveServerProfile = useCallback(
    async ({ serverId, nickname, avatar_url, banner_url, bio }) => {
      if (!currentUser || !serverId) return;
      try {
        const res = await fetch(`${API_BASE}/api/users/server-profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            serverId,
            nickname,
            avatar_url,
            banner_url,
            bio,
          }),
        });
        const data = await res.json();
        if (data.success) {
          triggerToast('Perfil específico do servidor salvo!');
          setShowEditProfileModal(false);
          // Refresh active server data
          if (activeServerId === serverId) {
            fetch(`${API_BASE}/api/servers/${serverId}`)
              .then((r) => r.json())
              .then((sData) => {
                if (sData.success) setCurrentServerData(sData);
              })
              .catch(console.error);
          }
        } else {
          triggerToast(data.error || 'Erro ao salvar perfil de servidor.');
        }
      } catch (err) {
        console.error('Save server profile error:', err);
        triggerToast('Falha na comunicação com o servidor.');
      }
    },
    [currentUser, activeServerId, triggerToast]
  );

  // Toggle Member Role from Profile Modal or Context Menu
  const handleToggleMemberRoleGlobal = useCallback(
    async (targetUserId, roleId, serverId) => {
      const sId = serverId || (activeServerId !== 'dms' ? activeServerId : null);
      if (!currentUser || !sId) return;
      try {
        const res = await fetch(`${API_BASE}/api/servers/${sId}/members/${targetUserId}/roles/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roleId, admin_id: currentUser.id }),
        });
        const data = await res.json();
        if (data.success) {
          triggerToast('Cargos do membro atualizados!');
          // Re-fetch profile if viewing this user
          handleOpenUserProfile({ id: targetUserId }, sId);
          fetch(`${API_BASE}/api/servers/${sId}`)
            .then((r) => r.json())
            .then((sData) => {
              if (sData.success) setCurrentServerData(sData);
            })
            .catch(console.error);
        }
      } catch (err) {
        console.error('Error toggling member role:', err);
      }
    },
    [currentUser, activeServerId, triggerToast, handleOpenUserProfile]
  );

  // Close all WebRTC Peer Connections
  const closeAllVoiceConnections = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenStream(null);
      setIsScreenSharing(false);
    }
    setRemoteScreenStreams({});
    Object.values(peersRef.current).forEach((peer) => {
      try {
        if (peer.pc) peer.pc.close();
        if (peer.audio) {
          peer.audio.pause();
          peer.audio.srcObject = null;
        }
      } catch (e) {}
    });
    peersRef.current = {};
  }, []);

  // Create WebRTC PeerConnection for 1:1 Mesh Audio & Video Screen Share
  const createPeerConnection = useCallback((peerSocketId, peerUserId, initiator, socketInstance) => {
    if (peersRef.current[peerSocketId]) {
      try {
        peersRef.current[peerSocketId].pc.close();
      } catch (e) {}
      delete peersRef.current[peerSocketId];
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local microphone audio track if connected
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((track) => {
        pc.addTrack(track, mediaStreamRef.current);
      });
    }

    // Add local screen share video track if sharing
    if (screenStreamRef.current) {
      screenStreamRef.current.getVideoTracks().forEach((track) => {
        pc.addTrack(track, screenStreamRef.current);
      });
    }

    const remoteAudio = new Audio();
    remoteAudio.autoplay = true;
    remoteAudio.muted = isDeafened;

    pc.ontrack = (event) => {
      if (event.track.kind === 'video') {
        if (event.streams && event.streams[0]) {
          const stream = event.streams[0];
          setRemoteScreenStreams((prev) => ({
            ...prev,
            [peerSocketId]: { stream, userId: peerUserId }
          }));
          event.track.onended = () => {
            setRemoteScreenStreams((prev) => {
              const updated = { ...prev };
              delete updated[peerSocketId];
              return updated;
            });
          };
        }
      } else if (event.track.kind === 'audio') {
        if (event.streams && event.streams[0]) {
          remoteAudio.srcObject = event.streams[0];
          remoteAudio.play().catch((err) => console.warn('Audio auto-play policy guard:', err));
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketInstance) {
        socketInstance.emit('voice_ice_candidate', {
          toSocketId: peerSocketId,
          candidate: event.candidate
        });
      }
    };

    peersRef.current[peerSocketId] = { pc, audio: remoteAudio, userId: peerUserId };

    if (initiator && socketInstance && currentUser) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socketInstance.emit('voice_offer', {
            toSocketId: peerSocketId,
            fromUserId: currentUser.id,
            offer: pc.localDescription
          });
        })
        .catch((err) => console.error('Error creating WebRTC offer:', err));
    }

    return pc;
  }, [isDeafened, currentUser]);

  // Save / Clear user
  const handleSetUser = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('discord_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('discord_user');
    }
  };

  const handleLogout = () => {
    closeAllVoiceConnections();
    handleSetUser(null);
    setServers([]);
    setFriends([]);
    setActiveServerId('dms');
    setActiveChannelId(null);
    triggerToast('Logged out of Orbit Br');
  };

  // Custom Context Menu State
  const [contextMenu, setContextMenu] = useState(null);

  const openCustomContextMenu = useCallback((e, type = 'app', target = null) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 230;
    const menuHeight = 360;
    let x = e.clientX;
    let y = e.clientY;

    if (x + menuWidth > window.innerWidth) x = Math.max(10, window.innerWidth - menuWidth - 10);
    if (y + menuHeight > window.innerHeight) y = Math.max(10, window.innerHeight - menuHeight - 10);

    setContextMenu({ x, y, type, target });
  }, []);

  useEffect(() => {
    const handleGlobalContextMenu = (e) => {
      openCustomContextMenu(e, 'app', null);
    };

    const handleGlobalClick = () => {
      setContextMenu(null);
    };

    window.addEventListener('contextmenu', handleGlobalContextMenu);
    window.addEventListener('click', handleGlobalClick);

    return () => {
      window.removeEventListener('contextmenu', handleGlobalContextMenu);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [openCustomContextMenu]);

  // ==========================================
  // 1. LOAD USER SERVERS & FRIENDS ON LOGIN
  // ==========================================
  const loadUserAppState = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/me?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setServers(data.servers || []);
        setFriends(data.friends || []);
      }
    } catch (err) {
      console.error('Error loading user state:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadUserAppState();
    }
  }, [currentUser, loadUserAppState]);

  // ==========================================
  // 2. SOCKET.IO & WEBRTC VOICE ENGINE
  // ==========================================
  useEffect(() => {
    const s = io(API_BASE);
    setSocket(s);

    s.on('new_channel_message', (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    s.on('new_direct_message', (msg) => {
      setDmMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    s.on('reaction_updated', ({ messageId, reactions }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions } : m))
      );
    });

    s.on('user_typing_start', ({ username }) => {
      setTypingUsers((prev) => (prev.includes(username) ? prev : [...prev, username]));
    });

    s.on('user_typing_stop', ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    s.on('voice_sessions_updated', (sessions) => {
      setVoiceSessions(sessions);
    });

    s.on('voice_speaking_updated', ({ userId, isSpeaking }) => {
      setVoiceSessions((prev) =>
        prev.map((vs) => (vs.user_id === userId ? { ...vs, is_speaking: isSpeaking } : vs))
      );
    });

    // WebRTC Mesh Signaling Handlers
    s.on('voice_existing_peers', ({ peers }) => {
      peers.forEach(({ socketId, userId }) => {
        createPeerConnection(socketId, userId, true, s);
      });
    });

    s.on('voice_peer_joined', ({ socketId, userId }) => {
      createPeerConnection(socketId, userId, false, s);
    });

    s.on('voice_offer', async ({ fromSocketId, fromUserId, offer }) => {
      const pc = createPeerConnection(fromSocketId, fromUserId, false, s);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        s.emit('voice_answer', {
          toSocketId: fromSocketId,
          fromUserId: currentUser?.id,
          answer: pc.localDescription
        });
      } catch (err) {
        console.error('Error handling WebRTC offer:', err);
      }
    });

    s.on('voice_answer', async ({ fromSocketId, answer }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer && peer.pc) {
        try {
          await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('Error handling WebRTC answer:', err);
        }
      }
    });

    s.on('voice_ice_candidate', async ({ fromSocketId, candidate }) => {
      const peer = peersRef.current[fromSocketId];
      if (peer && peer.pc) {
        try {
          await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    s.on('voice_peer_left', ({ socketId }) => {
      if (peersRef.current[socketId]) {
        try {
          peersRef.current[socketId].pc.close();
          peersRef.current[socketId].audio.pause();
          peersRef.current[socketId].audio.srcObject = null;
        } catch (e) {}
        delete peersRef.current[socketId];
      }
      setRemoteScreenStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    s.on('voice_screenshare_started', ({ socketId, userId, username }) => {
      triggerToast(`${username || 'A member'} started sharing screen!`);
      createPeerConnection(socketId, userId, true, s);
    });

    s.on('voice_screenshare_stopped', ({ socketId }) => {
      setRemoteScreenStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    s.on('server_created', ({ owner_id }) => {
      if (currentUser && owner_id === currentUser.id) {
        loadUserAppState();
      }
    });

    s.on('friend_request_sent', ({ toUserId }) => {
      if (currentUser && toUserId === currentUser.id) {
        loadUserAppState();
        triggerToast('You received a new friend request!');
      }
    });

    s.on('friend_request_accepted', () => {
      loadUserAppState();
    });

    s.on('category_created', () => {
      if (activeServerId && activeServerId !== 'dms') {
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
      }
    });

    s.on('category_deleted', () => {
      if (activeServerId && activeServerId !== 'dms') {
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
      }
    });

    s.on('channel_created', () => {
      if (activeServerId && activeServerId !== 'dms') {
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
      }
    });

    s.on('user_profile_updated', ({ userId, user: updatedUser }) => {
      // Update currentUser if matching
      setCurrentUser((prev) => {
        if (prev?.id === userId) {
          const merged = { ...prev, ...updatedUser };
          try {
            localStorage.setItem('discord_user', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        }
        return prev;
      });

      // Update friends list
      setFriends((prev) =>
        prev.map((f) => (f.id === userId ? { ...f, ...updatedUser } : f))
      );

      // Update server members
      setCurrentServerData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: (prev.members || []).map((m) =>
            m.id === userId || m.user_id === userId ? { ...m, ...updatedUser } : m
          ),
        };
      });

      // Update channel messages
      setMessages((prev) =>
        prev.map((m) =>
          (m.user_id === userId || m.author_id === userId)
            ? {
                ...m,
                author_name: updatedUser.display_name || updatedUser.username,
                author_username: updatedUser.username,
                avatar_url: updatedUser.avatar_url,
                avatar_color: updatedUser.avatar_color,
              }
            : m
        )
      );

      // Update DM messages
      setDmMessages((prev) =>
        prev.map((m) =>
          (m.sender_id === userId || m.user_id === userId)
            ? {
                ...m,
                author_name: updatedUser.display_name || updatedUser.username,
                author_username: updatedUser.username,
                avatar_url: updatedUser.avatar_url,
                avatar_color: updatedUser.avatar_color,
              }
            : m
        )
      );

      // Update active viewing profile if currently open
      setViewingUserProfile((prev) => {
        if (!prev || prev.user?.id !== userId) return prev;
        return { ...prev, user: { ...prev.user, ...updatedUser } };
      });
    });

    s.on('server_updated', ({ serverId, server: updatedServer }) => {
      setServers((prev) =>
        prev.map((srv) => (srv.id === serverId ? { ...srv, ...updatedServer } : srv))
      );
      setCurrentServerData((prev) => {
        if (prev?.server?.id === serverId) {
          return { ...prev, server: { ...prev.server, ...updatedServer } };
        }
        return prev;
      });
    });

    s.on('server_deleted', ({ serverId }) => {
      setServers((prev) => prev.filter((srv) => srv.id !== serverId));
      setActiveServerId((prev) => {
        if (prev === serverId) {
          setCurrentServerData(null);
          return 'dms';
        }
        return prev;
      });
      setShowServerSettingsModal(false);
      triggerToast('Um servidor foi excluído.');
    });

    s.on('server_members_updated', ({ serverId, members }) => {
      setCurrentServerData((prev) => {
        if (prev?.server?.id === serverId) {
          return { ...prev, members };
        }
        return prev;
      });
    });

    s.on('server_member_roles_updated', ({ serverId, members }) => {
      setCurrentServerData((prev) => {
        if (prev?.server?.id === serverId) {
          return { ...prev, members };
        }
        return prev;
      });
    });

    s.on('server_roles_updated', ({ serverId }) => {
      if (activeServerId === serverId) {
        fetch(`${API_BASE}/api/servers/${serverId}`)
          .then((r) => r.json())
          .then((sData) => {
            if (sData.success) setCurrentServerData(sData);
          })
          .catch(console.error);
      }
    });

    s.on('server_profile_updated', ({ serverId }) => {
      if (activeServerId === serverId) {
        fetch(`${API_BASE}/api/servers/${serverId}`)
          .then((r) => r.json())
          .then((sData) => {
            if (sData.success) setCurrentServerData(sData);
          })
          .catch(console.error);
      }
    });

    return () => {
      s.disconnect();
    };
  }, [currentUser, loadUserAppState, triggerToast, createPeerConnection]);

  // Load server details when activeServerId changes
  useEffect(() => {
    if (activeServerId === 'dms' || activeServerId === 'discover') {
      setCurrentServerData(null);
      setActiveChannelId(null);
      return;
    }

    fetch(`${API_BASE}/api/servers/${activeServerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentServerData(data);
          const firstText = data.channels.find((c) => c.type === 'text') || data.channels[0];
          if (firstText) setActiveChannelId(firstText.id);
        }
      })
      .catch((err) => console.error('Error fetching server details:', err));
  }, [activeServerId]);

  // Fetch discoverable servers
  const fetchDiscoverServers = useCallback(async (category = 'Todos', search = '') => {
    setIsDiscoverLoading(true);
    try {
      let url = `${API_BASE}/api/servers/discover?`;
      if (category && category !== 'Todos') url += `category=${encodeURIComponent(category)}&`;
      if (search && search.trim()) url += `q=${encodeURIComponent(search.trim())}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setDiscoverServers(data.servers || []);
      }
    } catch (err) {
      console.error('Error fetching discover servers:', err);
    } finally {
      setIsDiscoverLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeServerId === 'discover') {
      fetchDiscoverServers(discoverCategory, discoverSearch);
    }
  }, [activeServerId, discoverCategory, discoverSearch, fetchDiscoverServers]);

  // Check URL for invite link (?invite=OB-XXXXX or /invite/OB-XXXXX) on app load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('invite') || (
      window.location.pathname.startsWith('/invite/')
        ? window.location.pathname.replace('/invite/', '').split('/')[0]
        : null
    );

    if (code) {
      fetch(`${API_BASE}/api/invites/${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setPendingInviteData(data);
            setShowPendingInviteModal(true);
          } else {
            triggerToast(data.error || 'Convite inválido ou expirado');
          }
        })
        .catch(() => {});
    }
  }, [triggerToast]);

  // Fetch messages when channel changes
  useEffect(() => {
    if (!activeChannelId) return;

    if (socket) socket.emit('join_channel', activeChannelId);

    fetch(`${API_BASE}/api/channels/${activeChannelId}/messages`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error('Error fetching messages:', err));

    return () => {
      if (socket) socket.emit('leave_channel', activeChannelId);
    };
  }, [activeChannelId, socket]);

  // Load DMs when active DM friend changes
  useEffect(() => {
    if (!activeDmFriend || !currentUser) return;

    fetch(`${API_BASE}/api/dms/${activeDmFriend.id}?userId=${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDmMessages(data.messages);
        }
      })
      .catch((err) => console.error('Error fetching DMs:', err));
  }, [activeDmFriend, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, dmMessages]);

  // ==========================================
  // 3. REAL MICROPHONE AUDIO DETECTION
  // ==========================================
  useEffect(() => {
    let animationFrame;
    let audioContext;
    let analyser;
    let microphone;

    if (connectedVoiceChannelId && !isMuted && currentUser) {
      navigator.mediaDevices
        ?.getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const checkAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const speaking = average > 18;

            if (speaking !== isUserSpeaking) {
              setIsUserSpeaking(speaking);
              if (socket) {
                socket.emit('voice_speaking_change', {
                  userId: currentUser.id,
                  isSpeaking: speaking,
                });
              }
            }
            animationFrame = requestAnimationFrame(checkAudioLevel);
          };

          checkAudioLevel();
        })
        .catch((err) => {
          console.warn('Microphone error:', err);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (isUserSpeaking && currentUser) {
        setIsUserSpeaking(false);
        if (socket) {
          socket.emit('voice_speaking_change', {
            userId: currentUser.id,
            isSpeaking: false,
          });
        }
      }
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
      }
    };
  }, [connectedVoiceChannelId, isMuted, currentUser, isUserSpeaking, socket]);

  // ==========================================
  // 4. AUTH HANDLERS
  // ==========================================
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      authMode === 'login'
        ? { login: authEmail || authUsername, password: authPassword }
        : {
            email: authEmail,
            username: authUsername,
            display_name: authDisplayName || authUsername,
            password: authPassword,
          };

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        handleSetUser(data.user);
        triggerToast(`Welcome to Orbit Br, ${data.user.display_name || data.user.username}!`);
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth request error:', err);
      setAuthError('Unable to reach MariaDB backend. Please check server.');
    } finally {
      setAuthLoading(false);
    }
  };

  // ==========================================
  // 5. SERVER CREATION & CHANNELS
  // ==========================================
  const handleCreateServer = async (e) => {
    e?.preventDefault();
    if (!newServerName.trim() || !currentUser) return;

    try {
      const res = await fetch(`${API_BASE}/api/servers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newServerName.trim(),
          owner_id: currentUser.id,
        }),
      });
      const data = await res.json();

      if (data.success) {
        triggerToast(`Server "${data.server.name}" created in MariaDB!`);
        setShowAddServerModal(false);
        setNewServerName('');
        setServerModalStep('templates');
        loadUserAppState();
        setActiveServerId(data.server.id);
      } else {
        triggerToast(data.error || 'Failed to create server');
      }
    } catch (err) {
      console.error('Create server error:', err);
      triggerToast('Error creating server');
    }
  };

  const getChannelIcon = (type, size = 18, className = '') => {
    switch (type) {
      case 'voice':
        return <Volume2 size={size} className={className} />;
      case 'forum':
        return <MessagesSquare size={size} className={className} />;
      case 'announcement':
        return <Megaphone size={size} className={className} />;
      case 'stage':
        return <Radio size={size} className={className} />;
      case 'text':
      default:
        return <Hash size={size} className={className} />;
    }
  };

  const handleCreateCategory = async (e) => {
    e?.preventDefault();
    if (!newCategoryName.trim() || !activeServerId) return;

    try {
      const res = await fetch(`${API_BASE}/api/servers/${activeServerId}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          is_private: isCategoryPrivate,
        }),
      });
      const data = await res.json();

      if (data.success) {
        triggerToast(`Categoria '${data.category.name}' criada!`);
        setShowCreateCategoryModal(false);
        setNewCategoryName('');
        setIsCategoryPrivate(false);
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
      } else {
        triggerToast(data.error || 'Erro ao criar categoria');
      }
    } catch (err) {
      console.error('Category creation error:', err);
      triggerToast('Erro ao criar categoria');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!categoryId || !activeServerId) return;
    try {
      const res = await fetch(`${API_BASE}/api/servers/${activeServerId}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Categoria removida');
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
      }
    } catch (err) {
      console.error('Delete category error:', err);
    }
  };

  const handleCreateChannel = async (e) => {
    e?.preventDefault();
    if (!newChannelName.trim() || !activeServerId) return;

    try {
      const targetCat = currentServerData?.categories?.find((c) => c.id === targetCategoryId);
      const defaultCat = newChannelType === 'voice' ? 'VOICE CHANNELS' : (newChannelType === 'stage' ? 'PALCO' : 'TEXT CHANNELS');

      const res = await fetch(`${API_BASE}/api/servers/${activeServerId}/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newChannelName.trim(),
          topic: newChannelTopic.trim(),
          type: newChannelType,
          is_private: isChannelPrivate,
          category_id: targetCategoryId || null,
          category: targetCat ? targetCat.name : defaultCat,
        }),
      });
      const data = await res.json();

      if (data.success) {
        triggerToast(`Canal #${data.channel.name} criado!`);
        setShowCreateChannelModal(false);
        setNewChannelName('');
        setNewChannelTopic('');
        setIsChannelPrivate(false);
        setTargetCategoryId(null);
        // Reload server data
        fetch(`${API_BASE}/api/servers/${activeServerId}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success) setCurrentServerData(d);
          });
        if (data.channel.type !== 'voice' && data.channel.type !== 'stage') {
          setActiveChannelId(data.channel.id);
        }
      } else {
        triggerToast(data.error || 'Erro ao criar canal');
      }
    } catch (err) {
      console.error('Channel creation error:', err);
      triggerToast('Erro ao criar canal');
    }
  };

  // Open Invite Modal for a server
  const handleOpenInviteModal = async (targetServer = currentServerData?.server || servers.find(s => s.id === activeServerId)) => {
    if (!targetServer) return;
    setInviteModalServer(targetServer);
    setShowInviteModal(true);
    setIsCopiedInvite(false);
    try {
      const res = await fetch(`${API_BASE}/api/servers/${targetServer.id}/invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviter_id: currentUser?.id })
      });
      const data = await res.json();
      if (data.success) {
        const fullUrl = `${window.location.origin}/?invite=${data.code}`;
        setInviteLinkData({ code: data.code, url: fullUrl });
      }
    } catch (err) {
      console.error('Error getting invite link:', err);
    }
  };

  // Accept / Join from incoming Invite Modal
  const handleAcceptInvite = async (code) => {
    if (!currentUser) {
      triggerToast('Faça login ou crie uma conta para aceitar o convite!');
      return;
    }

    setIsJoiningInvite(true);
    try {
      const res = await fetch(`${API_BASE}/api/invites/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Você entrou em ${data.server.name}!`);
        setShowPendingInviteModal(false);
        setPendingInviteData(null);
        window.history.replaceState({}, document.title, window.location.pathname);
        await loadUserAppState();
        setActiveServerId(data.server.id);
      } else {
        triggerToast(data.error || 'Falha ao entrar no servidor');
      }
    } catch (err) {
      console.error('Accept invite error:', err);
      triggerToast('Erro ao aceitar convite');
    } finally {
      setIsJoiningInvite(false);
    }
  };

  // Join Public Server from Discovery View
  const handleJoinPublicServer = async (serverId) => {
    if (!currentUser) {
      triggerToast('Faça login para entrar nos servidores!');
      return;
    }

    if (servers.some((s) => s.id === serverId)) {
      setActiveServerId(serverId);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/servers/${serverId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Você entrou em ${data.server.name}!`);
        await loadUserAppState();
        setActiveServerId(serverId);
      } else {
        triggerToast(data.error || 'Falha ao entrar no servidor');
      }
    } catch (err) {
      console.error('Join public server error:', err);
      triggerToast('Erro ao entrar no servidor');
    }
  };

  // Join by Invite code from Add Server Modal input
  const handleJoinByInviteInput = async (e) => {
    e?.preventDefault();
    if (!joinInviteInput.trim()) return;

    let code = joinInviteInput.trim();
    if (code.includes('?invite=')) {
      code = code.split('?invite=')[1].split('&')[0];
    } else if (code.includes('/invite/')) {
      code = code.split('/invite/')[1].split('?')[0].split('/')[0];
    }

    setIsJoiningByInput(true);
    setJoinInviteError('');

    try {
      const res = await fetch(`${API_BASE}/api/invites/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      if (data.success) {
        triggerToast(`Você entrou em ${data.server.name}!`);
        setShowAddServerModal(false);
        setJoinInviteInput('');
        setServerModalStep('templates');
        await loadUserAppState();
        setActiveServerId(data.server.id);
      } else {
        setJoinInviteError(data.error || 'Convite inválido ou expirado');
      }
    } catch (err) {
      console.error('Join invite input error:', err);
      setJoinInviteError('Erro ao entrar no servidor. Verifique o código.');
    } finally {
      setIsJoiningByInput(false);
    }
  };

  // ==========================================
  // 6. MESSAGING & FRIENDS HANDLERS
  // ==========================================
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() && !selectedFile) return;
    if (!currentUser) return;

    let attachmentUrl = null;
    let attachmentName = null;
    let attachmentType = null;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const uploadRes = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          attachmentUrl = uploadData.url;
          attachmentName = uploadData.name;
          attachmentType = uploadData.type;
        }
      } catch (err) {
        console.error('File upload error:', err);
      } finally {
        setSelectedFile(null);
      }
    }

    if (activeServerId === 'dms' && activeDmFriend) {
      // Send Direct Message
      if (socket) {
        socket.emit('send_direct_message', {
          senderId: currentUser.id,
          receiverId: activeDmFriend.id,
          text: messageInput.trim(),
          attachmentUrl,
        });
      }
    } else if (activeChannelId) {
      // Send Server Channel Message
      if (socket) {
        socket.emit('send_channel_message', {
          channelId: activeChannelId,
          userId: currentUser.id,
          text: messageInput.trim(),
          attachmentUrl,
          attachmentName,
          attachmentType,
        });
      }
    }

    setMessageInput('');
    setShowEmojiPicker(false);
  };

  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    if (!addFriendInput.trim() || !currentUser) return;

    setAddFriendStatus({ msg: 'Sending request...', type: 'info' });

    try {
      const res = await fetch(`${API_BASE}/api/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_user_id: currentUser.id,
          target_username: addFriendInput.trim(),
        }),
      });
      const data = await res.json();

      if (data.success) {
        setAddFriendStatus({ msg: data.message, type: 'success' });
        setAddFriendInput('');
        loadUserAppState();
      } else {
        setAddFriendStatus({ msg: data.error, type: 'error' });
      }
    } catch (err) {
      setAddFriendStatus({ msg: 'Error connecting to database', type: 'error' });
    }
  };

  const handleAcceptFriend = async (friendId) => {
    try {
      const res = await fetch(`${API_BASE}/api/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_user_id: currentUser.id,
          friend_id: friendId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerToast('Friend request accepted!');
        loadUserAppState();
      }
    } catch (err) {
      console.error('Accept friend error:', err);
    }
  };

  const handleToggleReaction = (messageId, emoji) => {
    if (socket && currentUser) {
      socket.emit('toggle_reaction', {
        messageId,
        userId: currentUser.id,
        emoji,
        channelId: activeChannelId,
      });
    }
  };

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    if (!socket || !currentUser) return;
    if (activeChannelId) {
      socket.emit('typing_start', {
        channelId: activeChannelId,
        username: currentUser.display_name || currentUser.username,
      });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', {
          channelId: activeChannelId,
          username: currentUser.display_name || currentUser.username,
        });
      }, 2000);
    }
  };

  const handleMessageKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      playDiscordSound(next ? 'mute' : 'unmute');
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((t) => {
          t.enabled = !next;
        });
      }
      if (socket && currentUser) {
        socket.emit('voice_mute_change', {
          userId: currentUser.id,
          isMuted: next,
          isDeafened,
        });
      }
      return next;
    });
  };

  const toggleDeafen = () => {
    setIsDeafened((prev) => {
      const next = !prev;
      playDiscordSound(next ? 'mute' : 'unmute');
      Object.values(peersRef.current).forEach(({ audio }) => {
        if (audio) audio.muted = next;
      });
      if (next) {
        setIsMuted(true);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getAudioTracks().forEach((t) => {
            t.enabled = false;
          });
        }
      }
      if (socket && currentUser) {
        socket.emit('voice_mute_change', {
          userId: currentUser.id,
          isMuted: next || isMuted,
          isDeafened: next,
        });
      }
      return next;
    });
  };

  const handleVoiceToggle = (channelId) => {
    setActiveChannelId(channelId);
    if (connectedVoiceChannelId === channelId) {
      // Just select and view the voice lounge
      return;
    }

    if (connectedVoiceChannelId && connectedVoiceChannelId !== channelId) {
      // Switch voice channels cleanly
      playDiscordSound('join');
      closeAllVoiceConnections();
      setConnectedVoiceChannelId(channelId);
      if (socket && currentUser) {
        socket.emit('voice_join', {
          channelId,
          userId: currentUser.id,
          isMuted,
          isDeafened,
        });
      }
      triggerToast('Alternado para o novo canal de voz');
      return;
    }

    playDiscordSound('join');
    setConnectedVoiceChannelId(channelId);
    if (socket && currentUser) {
      socket.emit('voice_join', {
        channelId,
        userId: currentUser.id,
        isMuted,
        isDeafened,
      });
    }
    triggerToast('Conectado à Voz');
  };

  const handleDisconnectVoice = () => {
    if (connectedVoiceChannelId) {
      playDiscordSound('leave');
      if (socket && currentUser) {
        socket.emit('voice_leave', { userId: currentUser.id });
      }
      closeAllVoiceConnections();
      setConnectedVoiceChannelId(null);
      if (isCameraOn && cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
        setCameraStream(null);
        setIsCameraOn(false);
      }
      triggerToast('Desconectado da voz');
    }
  };

  const handleToggleCamera = async () => {
    if (isCameraOn) {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
        cameraStreamRef.current = null;
      }
      setCameraStream(null);
      setIsCameraOn(false);
      triggerToast('Câmera desativada');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        cameraStreamRef.current = stream;
        setCameraStream(stream);
        setIsCameraOn(true);
        triggerToast('Câmera ativada');

        const videoTrack = stream.getVideoTracks()[0];
        Object.values(peersRef.current).forEach((peer) => {
          if (peer.pc) {
            try {
              peer.pc.addTrack(videoTrack, stream);
            } catch (e) {}
          }
        });
      } catch (err) {
        console.warn('Camera error or permission denied:', err);
        triggerToast('Não foi possível acessar a câmera');
      }
    }
  };

  const handleStopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setScreenStream(null);
    setIsScreenSharing(false);
    playDiscordSound('leave');
    triggerToast('Screen sharing stopped');

    if (socket && currentUser && connectedVoiceChannelId) {
      socket.emit('voice_screenshare_stop', {
        channelId: connectedVoiceChannelId,
        userId: currentUser.id,
      });
    }
  }, [socket, currentUser, connectedVoiceChannelId, triggerToast]);

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      handleStopScreenShare();
      return;
    }

    let targetVoiceId = connectedVoiceChannelId;
    if (!targetVoiceId) {
      const voiceList = (currentServerData?.channels || []).filter((c) => c.type === 'voice');
      if (voiceList.length > 0) {
        handleVoiceToggle(voiceList[0].id);
        targetVoiceId = voiceList[0].id;
      } else {
        triggerToast('Please connect to a voice channel first to share screen');
        return;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
        },
        audio: true,
      });

      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);
      playDiscordSound('join');
      triggerToast('Screen sharing started (LIVE)');

      const videoTrack = stream.getVideoTracks()[0];

      // Add track to existing peers and renegotiate
      Object.entries(peersRef.current).forEach(([peerSocketId, peer]) => {
        if (peer.pc) {
          try {
            peer.pc.addTrack(videoTrack, stream);
            peer.pc.createOffer()
              .then((offer) => peer.pc.setLocalDescription(offer))
              .then(() => {
                if (socket && currentUser) {
                  socket.emit('voice_offer', {
                    toSocketId: peerSocketId,
                    fromUserId: currentUser.id,
                    offer: peer.pc.localDescription,
                  });
                }
              })
              .catch(console.error);
          } catch (e) {
            console.error('Error adding screen share track to peer:', e);
          }
        }
      });

      if (socket && currentUser && targetVoiceId) {
        socket.emit('voice_screenshare_start', {
          channelId: targetVoiceId,
          userId: currentUser.id,
          username: currentUser.display_name || currentUser.username,
        });
      }

      videoTrack.onended = () => {
        handleStopScreenShare();
      };
    } catch (err) {
      console.warn('User cancelled screen share or error:', err);
      setIsScreenSharing(false);
      setScreenStream(null);
    }
  };
  if (!currentUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center discord-auth-bg font-sans select-none relative overflow-hidden p-4">
        {/* Background Orbit Br Branding Assets */}
        <div className="absolute top-7 left-7 flex items-center gap-2.5 text-white">
          <OrbitBrLogo size={38} className="object-contain drop-shadow-md" />
          <span className="font-bold text-xl tracking-tight text-[#F2F3F5]">
            Orbit Br
          </span>
        </div>

        {/* Discord Authentic Auth Card */}
        <div className="bg-[#313338] text-[#DBDEE1] w-full max-w-[480px] rounded-[5px] shadow-[0_2px_10px_0_rgba(0,0,0,0.2)] p-8 relative z-10 animate-msg-enter">
          {/* Top Logo and Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#F2F3F5] tracking-tight">
              {authMode === 'login' ? 'Boas-vindas de volta!' : 'Criar uma conta'}
            </h2>
            <p className="text-[#949BA4] text-sm mt-1.5">
              {authMode === 'login'
                ? 'Estamos muito animados em ver você novamente!'
                : 'Crie sua conta para começar a usar o Orbit Br.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-2.5 rounded-[4px] bg-[#F23F43]/15 border border-[#F23F43]/40 text-[#F23F43] text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    E-mail <span className="text-[#F23F43]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Nome de Exibição
                  </label>
                  <input
                    type="text"
                    placeholder="Como você quer ser chamado?"
                    value={authDisplayName}
                    onChange={(e) => setAuthDisplayName(e.target.value)}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm placeholder-[#80848E] transition-colors"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                {authMode === 'login' ? 'E-mail ou Nome de Usuário' : 'Nome de Usuário'}{' '}
                <span className="text-[#F23F43]">*</span>
              </label>
              <input
                type="text"
                required
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                Senha <span className="text-[#F23F43]">*</span>
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
              />
            </div>

            {authMode === 'login' && (
              <button
                type="button"
                onClick={() => triggerToast('Redefinição de senha não configurada.')}
                className="text-xs text-[#00A8FC] hover:underline block -mt-1 font-medium"
              >
                Esqueceu sua senha?
              </button>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full h-11 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold text-sm transition-colors shadow-sm mt-2 flex items-center justify-center"
            >
              {authLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : authMode === 'login' ? (
                'Entrar'
              ) : (
                'Continuar'
              )}
            </button>
          </form>

          <div className="mt-5 text-xs text-[#949BA4] text-left">
            {authMode === 'login' ? (
              <>
                Precisando de uma conta?{' '}
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthError('');
                  }}
                  className="text-[#00A8FC] hover:underline font-medium ml-1"
                >
                  Registre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="text-[#00A8FC] hover:underline font-medium ml-1"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: 2. AUTHENTICATED ORBIT BR CLIENT (ZERO-STATE READY)
  // =========================================================================
  const activeServer = servers.find((s) => s.id === activeServerId);
  const serverChannels = currentServerData?.channels || [];
  const serverMembers = currentServerData?.members || [];
  const textChannels = serverChannels.filter((c) => c.type === 'text');
  const voiceChannels = serverChannels.filter((c) => c.type === 'voice');

  const currentChannel = serverChannels.find((c) => c.id === activeChannelId) || textChannels[0];

  const onlineFriends = friends.filter((f) => f.status === 'online' && f.friendship_status === 'accepted');
  const allFriends = friends.filter((f) => f.friendship_status === 'accepted');
  const pendingFriends = friends.filter((f) => f.friendship_status === 'pending');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#313338] text-[#DBDEE1] font-sans select-none">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-[4px] shadow-2xl bg-[#111214] border border-[#232428] text-[#F2F3F5] text-sm font-medium animate-msg-enter">
          <Sparkles size={16} className="text-[#5865F2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SERVER RAIL (72px, #1E1F22) */}
      {/* ========================================================================= */}
      <nav aria-label="Servers sidebar" className="w-[72px] flex-shrink-0 bg-[#1E1F22] flex flex-col items-center py-3 gap-2 z-20">
        {/* Direct Messages (Home) Button with Orbit Br Logo */}
        <div className="relative group flex items-center justify-center w-full">
          <span
            className={`server-pill absolute left-0 w-1 bg-white rounded-r-full ${
              activeServerId === 'dms' ? 'h-10' : 'h-0 group-hover:h-5'
            }`}
          />
          <button
            onClick={() => setActiveServerId('dms')}
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 overflow-hidden ${
              activeServerId === 'dms'
                ? 'rounded-[16px] bg-[#5865F2] text-white shadow-md'
                : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] hover:bg-[#5865F2] text-[#DBDEE1] hover:text-white'
            }`}
            title="Mensagens Diretas"
          >
            <OrbitBrLogo size={32} className="w-8 h-8 object-contain" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-8 h-[2px] bg-[#35363C] rounded-full my-0.5" />

        {/* User's Created/Joined Servers List */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-2">
          {servers.map((srv) => {
            const isActive = activeServerId === srv.id;
            const initials = srv.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .substring(0, 3)
              .toUpperCase();

            return (
              <div key={srv.id} className="relative group flex items-center justify-center w-full">
                <span
                  className={`server-pill absolute left-0 w-1 bg-white rounded-r-full ${
                    isActive ? 'h-10' : 'h-0 group-hover:h-5'
                  }`}
                />
                <button
                  onClick={() => setActiveServerId(srv.id)}
                  onContextMenu={(e) => openCustomContextMenu(e, 'server', srv)}
                  className={`w-12 h-12 flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? 'rounded-[16px] bg-[#5865F2] text-white shadow-md'
                      : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] group-hover:bg-[#5865F2] text-[#DBDEE1] group-hover:text-white'
                  }`}
                  title={srv.name}
                >
                  {initials}
                </button>
              </div>
            );
          })}

          {/* Add a Server Button */}
          <div className="relative group flex items-center justify-center w-full">
            <span className="server-pill absolute left-0 w-1 bg-white rounded-r-full h-0 group-hover:h-5" />
            <button
              onClick={() => {
                setShowAddServerModal(true);
                setServerModalStep('templates');
              }}
              className="w-12 h-12 rounded-[24px] group-hover:rounded-[16px] bg-[#313338] hover:bg-[#23A55A] text-[#23A55A] hover:text-white flex items-center justify-center transition-all duration-200"
              title="Adicionar um Servidor"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Explore Button */}
          <div className="relative group flex items-center justify-center w-full">
            <span
              className={`server-pill absolute left-0 w-1 bg-white rounded-r-full ${
                activeServerId === 'discover' ? 'h-10' : 'h-0 group-hover:h-5'
              }`}
            />
            <button
              onClick={() => setActiveServerId('discover')}
              className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
                activeServerId === 'discover'
                  ? 'rounded-[16px] bg-[#23A55A] text-white shadow-md'
                  : 'rounded-[24px] group-hover:rounded-[16px] bg-[#313338] hover:bg-[#23A55A] text-[#23A55A] hover:text-white'
              }`}
              title="Explorar Servidores Descobríveis"
            >
              <Compass size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. CHANNELS / DM SUB-SIDEBAR (240px, #2B2D31) */}
      {/* ========================================================================= */}
      <aside className="w-60 flex-shrink-0 bg-[#2B2D31] flex flex-col h-full relative z-10">
        {activeServerId === 'discover' ? (
          /* Discovery Categories Sub-Sidebar */
          <>
            <div className="h-12 px-4 flex items-center border-b border-[#1F2023] shadow-sm font-bold text-sm text-[#F2F3F5] gap-2">
              <Compass size={18} className="text-[#23A55A]" />
              <span>Descobrir</span>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {[
                { id: 'Todos', label: 'Início / Todos', icon: <Compass size={18} /> },
                { id: 'Jogos', label: 'Jogos', icon: <Gamepad2 size={18} /> },
                { id: 'Música', label: 'Música', icon: <Music size={18} /> },
                { id: 'Educação', label: 'Educação & Estudos', icon: <GraduationCap size={18} /> },
                { id: 'Tecnologia', label: 'Ciência & Tecnologia', icon: <Globe size={18} /> },
                { id: 'Criadores', label: 'Criadores & Arte', icon: <Sparkles size={18} /> },
                { id: 'Geral', label: 'Comunidades & Geral', icon: <Users size={18} /> },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setDiscoverCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-sm font-medium transition-all ${
                    discoverCategory === cat.id
                      ? 'bg-[#404249] text-white shadow-sm font-semibold'
                      : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : activeServerId === 'dms' ? (
          /* DM Sub-Sidebar Header */
          <>
            <div className="h-12 px-2.5 flex items-center border-b border-[#1F2023] shadow-sm">
              <button
                onClick={() => triggerToast('Buscar conversa')}
                className="w-full h-7 px-2 rounded-[4px] bg-[#1E1F22] text-[#949BA4] hover:text-[#DBDEE1] text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Buscar ou iniciar uma conversa</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {/* Friends Tab Button */}
              <button
                onClick={() => setActiveDmFriend(null)}
                className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-[4px] text-sm font-medium transition-all ${
                  !activeDmFriend
                    ? 'bg-[#404249] text-white shadow-sm'
                    : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                }`}
              >
                <Users size={20} className={!activeDmFriend ? 'text-white' : 'text-[#949BA4]'} />
                <span>Amigos</span>
                {pendingFriends.length > 0 && (
                  <span className="ml-auto px-1.5 py-0.2 rounded-full bg-[#F23F43] text-white text-[10px] font-bold">
                    {pendingFriends.length}
                  </span>
                )}
              </button>

              {/* Direct Messages List */}
              <div>
                <div className="flex items-center justify-between px-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4]">
                    Mensagens Diretas
                  </span>
                  <button
                    onClick={() => {
                      setActiveDmFriend(null);
                      setFriendsTab('add_friend');
                    }}
                    className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors"
                    title="Criar MD"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {allFriends.length === 0 ? (
                  <div className="px-2 py-4 text-xs text-[#949BA4] text-center">
                    Nenhuma conversa ativa
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {allFriends.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveDmFriend(f)}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-[4px] transition-all ${
                          activeDmFriend?.id === f.id
                            ? 'bg-[#404249] text-white'
                            : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                        }`}
                      >
                        <DiscordUserAvatar user={f} size={32} />
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="text-sm font-medium truncate text-[#DBDEE1]">
                            {f.display_name || f.username}
                          </span>
                          <span className="text-[11px] text-[#949BA4] truncate">
                            {f.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Server Sub-Sidebar */
          <>
            {/* Server Header & Dropdown */}
            <div className="relative">
              <header
                className="h-12 px-4 flex items-center justify-between border-b border-[#1F2023] hover:bg-[#35373C] cursor-pointer transition-colors shadow-sm font-bold text-sm text-[#F2F3F5]"
                onClick={() => setShowServerHeaderDropdown((p) => !p)}
              >
                <span className="truncate">{activeServer?.name}</span>
                {showServerHeaderDropdown ? (
                  <X size={18} className="text-[#DBDEE1]" />
                ) : (
                  <ChevronDown size={18} className="text-[#949BA4]" />
                )}
              </header>

              {/* Server Header Dropdown Menu */}
              {showServerHeaderDropdown && (
                <div
                  className="absolute top-13 left-2 right-2 bg-[#111214] border border-[#232428] rounded-[8px] shadow-2xl p-1.5 z-50 text-xs font-semibold text-[#DBDEE1] space-y-0.5 animate-msg-enter select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setHideMutedChannels((p) => !p)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#35373C] text-[#DBDEE1] hover:text-white transition-colors text-left font-medium"
                  >
                    <span>Ocultar canais silenciados</span>
                    <div
                      className={`w-4 h-4 rounded-[4px] border transition-colors flex items-center justify-center ${
                        hideMutedChannels ? 'border-[#5865F2] bg-[#5865F2]' : 'border-[#4E5058] bg-[#1E1F22]'
                      }`}
                    >
                      {hideMutedChannels && <Check size={12} className="text-white stroke-[3]" />}
                    </div>
                  </button>

                  <div className="my-1 h-[1px] bg-[#232428]" />

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      setTargetCategoryId(null);
                      setNewChannelType('text');
                      setShowCreateChannelModal(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#5865F2] hover:text-white transition-colors text-left text-sm font-medium"
                  >
                    <span>Criar canal</span>
                    <Plus size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      setShowCreateCategoryModal(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#5865F2] hover:text-white transition-colors text-left text-sm font-medium"
                  >
                    <span>Criar categoria</span>
                    <FolderPlus size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      handleOpenInviteModal(activeServer);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-[#5865F2] hover:text-white transition-colors text-left text-sm font-medium"
                  >
                    <span>Convidar para o servidor</span>
                    <UserPlus size={16} />
                  </button>

                  <div className="my-1 h-[1px] bg-[#232428]" />

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      setShowServerSettingsModal(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-[4px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left text-xs font-medium"
                  >
                    <span>Configurações do Servidor</span>
                    <Settings size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      triggerToast('Configurações de Notificação do Servidor');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-[4px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left text-xs font-medium"
                  >
                    <span>Configurações de Notificação</span>
                    <Bell size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setShowServerHeaderDropdown(false);
                      triggerToast('Configurações de Privacidade');
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-[4px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left text-xs font-medium"
                  >
                    <span>Privacidade do Servidor</span>
                    <Shield size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {(() => {
                const rawCategories = currentServerData?.categories || [];
                const allChannels = serverChannels.filter((c) => {
                  if (hideMutedChannels && c.is_muted) return false;
                  return true;
                });

                const renderChannelRow = (ch) => {
                  const isVoiceLike = ch.type === 'voice' || ch.type === 'stage';
                  if (!isVoiceLike) {
                    const isActive = ch.id === activeChannelId;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannelId(ch.id)}
                        onContextMenu={(e) => openCustomContextMenu(e, 'channel', ch)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[4px] text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-[#404249] text-white shadow-sm'
                            : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getChannelIcon(ch.type, 18, isActive ? 'text-[#DBDEE1]' : 'text-[#80848E]')}
                          <span className="truncate">{ch.name}</span>
                        </div>
                        {ch.is_private ? <Lock size={12} className="text-[#80848E] flex-shrink-0" /> : null}
                      </button>
                    );
                  }

                  const isConnected = connectedVoiceChannelId === ch.id;
                  const isSelected = activeChannelId === ch.id;
                  const participants = voiceSessions.filter((vs) => vs.channel_id === ch.id);

                  return (
                    <div key={ch.id} className="group/vch">
                      <div
                        onClick={() => handleVoiceToggle(ch.id)}
                        onContextMenu={(e) => openCustomContextMenu(e, 'channel', ch)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[4px] text-sm font-medium transition-all cursor-pointer select-none ${
                          isSelected || isConnected
                            ? 'bg-[#404249] text-white'
                            : 'text-[#949BA4] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getChannelIcon(ch.type, 18, isSelected || isConnected ? 'text-[#DBDEE1]' : 'text-[#80848E]')}
                          <span className="truncate">{ch.name}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {ch.is_private ? <Lock size={12} className="text-[#80848E] mr-1" /> : null}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveChannelId(ch.id);
                              setShowVoiceChatSidebar(true);
                            }}
                            className="p-1 hover:bg-[#404249] rounded text-[#949BA4] hover:text-[#DBDEE1] transition-colors opacity-0 group-hover/vch:opacity-100"
                            title="Abrir Bate-papo de Texto"
                          >
                            <MessageSquare size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Connected members tree */}
                      {participants.length > 0 && (
                        <div className="pl-6 pr-2 mt-0.5 space-y-0.5 animate-msg-enter">
                          {participants.map((p) => {
                            const isSpeaking = p.is_speaking;
                            const isPeerSharing =
                              Object.values(remoteScreenStreams).some((r) => r.userId === p.user_id) ||
                              (p.user_id === currentUser?.id && isScreenSharing);

                            return (
                              <div
                                key={p.user_id}
                                className="flex items-center justify-between py-1 px-2 rounded-[4px] hover:bg-[#35373C] transition-colors group/p"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={isSpeaking ? 'ring-2 ring-[#23A55A] rounded-full' : ''}>
                                    <DiscordUserAvatar
                                      user={p}
                                      size={22}
                                      isSpeaking={isSpeaking}
                                      showStatus={false}
                                    />
                                  </div>
                                  <span className="text-xs text-[#DBDEE1] truncate font-medium">
                                    {p.display_name || p.username} {p.user_id === currentUser?.id ? '(Você)' : ''}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1">
                                  {isPeerSharing && (
                                    <span className="px-1.5 py-0.2 rounded bg-[#F23F43] text-white text-[9px] font-bold uppercase tracking-wider">
                                      LIVE
                                    </span>
                                  )}
                                  {p.is_muted && (
                                    <span className="text-[#F23F43]" title="Microfone mutado">
                                      <MicOff size={12} />
                                    </span>
                                  )}
                                  {p.is_deafened && (
                                    <span className="text-[#F23F43]" title="Áudio ensurdecido">
                                      <Headphones size={12} />
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                };

                // If server has custom categories
                if (rawCategories.length > 0) {
                  const unassignedText = allChannels.filter(
                    (c) => !c.category_id && (c.type === 'text' || c.type === 'forum' || c.type === 'announcement' || !c.type) && !rawCategories.some((cat) => cat.name === c.category)
                  );
                  const unassignedVoice = allChannels.filter(
                    (c) => !c.category_id && (c.type === 'voice' || c.type === 'stage') && !rawCategories.some((cat) => cat.name === c.category)
                  );

                  return (
                    <>
                      {rawCategories.map((cat) => {
                        const catChannels = allChannels.filter(
                          (c) => c.category_id === cat.id || c.category === cat.name
                        );
                        const isCollapsed = collapsedCategories[cat.id];

                        return (
                          <div key={cat.id} onContextMenu={(e) => openCustomContextMenu(e, 'category', cat)}>
                            <div
                              className="flex items-center justify-between px-2 mb-1 group cursor-pointer select-none"
                              onClick={() =>
                                setCollapsedCategories((prev) => ({
                                  ...prev,
                                  [cat.id]: !prev[cat.id],
                                }))
                              }
                            >
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-[#949BA4] group-hover:text-[#DBDEE1] transition-transform">
                                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4] group-hover:text-[#DBDEE1] truncate">
                                  {cat.name}
                                </span>
                                {cat.is_private ? <Lock size={12} className="text-[#80848E] ml-1 flex-shrink-0" /> : null}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTargetCategoryId(cat.id);
                                  setNewChannelType('text');
                                  setShowCreateChannelModal(true);
                                }}
                                className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors opacity-0 group-hover:opacity-100"
                                title="Criar Canal"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {!isCollapsed && (
                              <div className="space-y-0.5">
                                {catChannels.map((ch) => renderChannelRow(ch))}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {unassignedText.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between px-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4] hover:text-[#DBDEE1] cursor-pointer">
                              Canais de Texto
                            </span>
                            <button
                              onClick={() => {
                                setTargetCategoryId(null);
                                setNewChannelType('text');
                                setShowCreateChannelModal(true);
                              }}
                              className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors"
                              title="Criar Canal"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="space-y-0.5">
                            {unassignedText.map((ch) => renderChannelRow(ch))}
                          </div>
                        </div>
                      )}

                      {unassignedVoice.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between px-2 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4] hover:text-[#DBDEE1] cursor-pointer">
                              Canais de Voz
                            </span>
                            <button
                              onClick={() => {
                                setTargetCategoryId(null);
                                setNewChannelType('voice');
                                setShowCreateChannelModal(true);
                              }}
                              className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors"
                              title="Criar Canal de Voz"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="space-y-0.5">
                            {unassignedVoice.map((vch) => renderChannelRow(vch))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                }

                // Default Categories view
                const textLikeChannels = allChannels.filter(
                  (c) => c.type === 'text' || c.type === 'forum' || c.type === 'announcement' || !c.type
                );
                const voiceLikeChannels = allChannels.filter(
                  (c) => c.type === 'voice' || c.type === 'stage'
                );

                return (
                  <>
                    {/* Text Channels Category */}
                    <div>
                      <div className="flex items-center justify-between px-2 mb-1 group">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4] hover:text-[#DBDEE1] cursor-pointer">
                          Canais de Texto
                        </span>
                        <button
                          onClick={() => {
                            setTargetCategoryId(null);
                            setNewChannelType('text');
                            setShowCreateChannelModal(true);
                          }}
                          className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors"
                          title="Criar Canal"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="space-y-0.5">
                        {textLikeChannels.map((ch) => renderChannelRow(ch))}
                      </div>
                    </div>

                    {/* Voice Channels Category */}
                    <div>
                      <div className="flex items-center justify-between px-2 mb-1 group">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#949BA4] hover:text-[#DBDEE1] cursor-pointer">
                          Canais de Voz
                        </span>
                        <button
                          onClick={() => {
                            setTargetCategoryId(null);
                            setNewChannelType('voice');
                            setShowCreateChannelModal(true);
                          }}
                          className="text-[#949BA4] hover:text-[#DBDEE1] p-0.5 transition-colors"
                          title="Criar Canal de Voz"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="space-y-0.5">
                        {voiceLikeChannels.map((vch) => renderChannelRow(vch))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}

        {/* VOICE CONNECTED DOCK */}
        {connectedVoiceChannelId && (
          <div className="p-2.5 bg-[#232428] border-t border-[#1F2023] flex items-center justify-between animate-msg-enter">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#23A55A] shadow-[0_0_8px_#23A55A] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#23A55A] leading-tight truncate">
                  Voz Conectada
                </span>
                <span className="text-[10px] text-[#949BA4] truncate">
                  {isScreenSharing ? 'Transmissão AO VIVO' : 'RTC Conectado / 64kbps'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleScreenShare}
                className={`p-1.5 rounded-[4px] transition-all ${
                  isScreenSharing
                    ? 'bg-[#F23F43] text-white'
                    : 'hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]'
                }`}
                title={isScreenSharing ? 'Parar Transmissão' : 'Compartilhar Tela'}
              >
                <MonitorUp size={16} />
              </button>
              <button
                onClick={() => handleVoiceToggle(connectedVoiceChannelId)}
                className="p-1.5 rounded-[4px] hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#F23F43] transition-colors"
                title="Desconectar"
              >
                <PhoneOff size={16} />
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM USER DOCK (52px, #232428) */}
        <footer className="h-[52px] px-2 bg-[#232428] flex items-center justify-between border-t border-[#1F2023] flex-shrink-0 relative">
          <div
            onClick={() => setShowUserDockPopout((p) => !p)}
            className="flex items-center gap-2 p-1 -ml-0.5 rounded-[4px] hover:bg-[#35373C] cursor-pointer min-w-0 flex-1 transition-colors group"
            title="Menu do Perfil"
          >
            <DiscordUserAvatar user={currentUser} size={32} status={currentUser.status} />
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-semibold text-[#F2F3F5] group-hover:text-white leading-tight truncate">
                {currentUser.display_name || currentUser.username}
              </span>
              <span className="text-[11px] text-[#949BA4] leading-none mt-0.5 font-mono truncate">
                {currentUser.custom_status ? currentUser.custom_status : currentUser.tag}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-[#B5BAC1]">
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded-[4px] hover:bg-[#35373C] transition-colors ${isMuted ? 'text-[#F23F43] hover:text-[#F23F43]' : 'hover:text-[#DBDEE1]'}`}
              title={isMuted ? 'Desativar Mudo' : 'Ativar Mudo'}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              onClick={toggleDeafen}
              className={`p-1.5 rounded-[4px] hover:bg-[#35373C] transition-colors ${isDeafened ? 'text-[#F23F43] hover:text-[#F23F43]' : 'hover:text-[#DBDEE1]'}`}
              title={isDeafened ? 'Desensurdecer' : 'Ensurdecer'}
            >
              {isDeafened ? <Headphones size={16} /> : <Headphones size={16} />}
            </button>
            <button
              onClick={handleOpenEditProfile}
              className="p-1.5 rounded-[4px] hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1] transition-colors"
              title="Editar Perfil / Configurações"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-[4px] hover:bg-[#35373C] hover:text-[#F23F43] transition-colors"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </footer>
      </aside>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT (#313338) */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT VIEWPORT (Cosmic Ambient Glow) */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#313338] relative overflow-hidden text-[#DBDEE1]">
        {activeServerId === 'discover' ? (
          /* ===================================================================== */
          /* SERVER DISCOVERY VIEW */
          /* ===================================================================== */
          <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#313338]">
            {/* Discovery Hero Banner */}
            <div className="relative p-8 md:p-12 overflow-hidden bg-gradient-to-r from-[#242938] via-[#1E1F29] to-[#1B1D24] border-b border-[#1F2023] flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5865F2]/20 via-transparent to-transparent pointer-events-none" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] text-xs font-semibold mb-3">
                <Compass size={14} />
                <span>Explorar Comunidades</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#F2F3F5] tracking-tight max-w-xl">
                Encontre sua comunidade no Orbit Br
              </h1>
              <p className="text-sm text-[#949BA4] mt-2 max-w-lg">
                De jogos, música e estudos a programação e amizades, encontre seu espaço no Orbit.
              </p>

              {/* Search Bar */}
              <div className="mt-6 w-full max-w-lg relative">
                <input
                  type="text"
                  placeholder="Explorar servidores públicos (ex: Jogos, FiveM, Programação...)"
                  value={discoverSearch}
                  onChange={(e) => setDiscoverSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-10 rounded-[8px] bg-[#1E1F22] border border-[#2B2D31] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm shadow-lg transition-colors placeholder:text-[#949BA4]"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#949BA4]" />
                {discoverSearch && (
                  <button
                    onClick={() => setDiscoverSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#949BA4] hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Discover Grid Content */}
            <div className="p-6 md:p-8 flex-1 max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#F2F3F5] flex items-center gap-2">
                    <span>{discoverCategory === 'Todos' ? 'Servidores em Destaque' : `Servidores de ${discoverCategory}`}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#2B2D31] text-[#949BA4] font-normal">
                      {discoverServers.length} {discoverServers.length === 1 ? 'servidor' : 'servidores'}
                    </span>
                  </h2>
                  <p className="text-xs text-[#949BA4] mt-0.5">Clique em um servidor para explorar ou entrar diretamente.</p>
                </div>
              </div>

              {isDiscoverLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#949BA4] gap-3">
                  <RefreshCw size={28} className="animate-spin text-[#5865F2]" />
                  <span className="text-sm">Carregando servidores disponíveis...</span>
                </div>
              ) : discoverServers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-[#2B2D31]/40 rounded-[12px] border border-[#1F2023] p-8">
                  <div className="w-16 h-16 rounded-full bg-[#1E1F22] flex items-center justify-center text-[#949BA4] mb-4">
                    <Search size={28} />
                  </div>
                  <h3 className="text-base font-bold text-[#F2F3F5]">Nenhum servidor encontrado</h3>
                  <p className="text-xs text-[#949BA4] mt-1 max-w-sm">
                    {discoverSearch ? `Não encontramos nenhum resultado para "${discoverSearch}".` : 'Nenhum servidor público nesta categoria ainda. Que tal criar o primeiro?'}
                  </p>
                  <button
                    onClick={() => {
                      setShowAddServerModal(true);
                      setServerModalStep('templates');
                    }}
                    className="mt-4 px-4 py-2 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition-colors"
                  >
                    Criar um Servidor
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {discoverServers.map((srv) => {
                    const isMember = servers.some((s) => s.id === srv.id);
                    const initials = srv.name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();

                    return (
                      <div
                        key={srv.id}
                        className="bg-[#2B2D31] hover:bg-[#35373C] border border-[#1F2023] rounded-[8px] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
                      >
                        {/* Server Card Banner */}
                        <div
                          className="h-28 w-full bg-cover bg-center relative"
                          style={{
                            background: srv.banner_url
                              ? `url(${srv.banner_url}) center/cover`
                              : 'linear-gradient(135deg, #5865F2 0%, #23A55A 100%)'
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex-1 flex flex-col relative -mt-8">
                          <div className="flex items-end justify-between mb-3">
                            <div className="w-14 h-14 rounded-[16px] bg-[#1E1F22] border-4 border-[#2B2D31] group-hover:border-[#35373C] flex items-center justify-center font-bold text-white shadow-md text-base transition-colors overflow-hidden">
                              {srv.icon_url ? (
                                <img src={srv.icon_url} alt={srv.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1E1F22] text-[#5865F2] border border-[#5865F2]/30">
                              {srv.category || 'Geral'}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-[#F2F3F5] truncate group-hover:text-[#5865F2] transition-colors" title={srv.name}>
                            {srv.name}
                          </h3>

                          <p className="text-xs text-[#949BA4] mt-1.5 line-clamp-2 min-h-[32px] leading-relaxed">
                            {srv.description || 'Comunidade acolhedora e ativa no Orbit Br. Entre e venha conversar!'}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[#1F2023] text-[11px] text-[#949BA4]">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#23A55A]" />
                              <span>{srv.online_count || 1} Online</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#80848E]" />
                              <span>{srv.member_count || 1} Membros</span>
                            </span>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => (isMember ? setActiveServerId(srv.id) : handleJoinPublicServer(srv.id))}
                            className={`w-full mt-3 py-2 px-3 rounded-[4px] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                              isMember
                                ? 'bg-[#404249] hover:bg-[#5865F2] text-white'
                                : 'bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-md'
                            }`}
                          >
                            {isMember ? (
                              <>
                                <Check size={14} />
                                <span>Já participa (Abrir)</span>
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>Entrar no Servidor</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : activeServerId === 'dms' && !activeDmFriend ? (
          /* ===================================================================== */
          /* FRIENDS ZERO-STATE TAB VIEW */
          /* ===================================================================== */
          <>
            {/* Friends Header */}
            <header className="h-12 px-5 flex items-center justify-between border-b border-[#1F2023] bg-[#313338] shadow-sm flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#949BA4]">
                  <Users size={20} />
                  <span className="font-bold text-sm text-[#F2F3F5]">Amigos</span>
                </div>
                <div className="w-[1px] h-4 bg-[#3F4147]" />

                {/* Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFriendsTab('online')}
                    className={`px-2 py-1 rounded-[4px] text-sm font-medium transition-all ${
                      friendsTab === 'online' ? 'bg-[#404249] text-white' : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                    }`}
                  >
                    Disponível ({onlineFriends.length})
                  </button>
                  <button
                    onClick={() => setFriendsTab('all')}
                    className={`px-2 py-1 rounded-[4px] text-sm font-medium transition-all ${
                      friendsTab === 'all' ? 'bg-[#404249] text-white' : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                    }`}
                  >
                    Todos ({allFriends.length})
                  </button>
                  <button
                    onClick={() => setFriendsTab('pending')}
                    className={`px-2 py-1 rounded-[4px] text-sm font-medium transition-all ${
                      friendsTab === 'pending' ? 'bg-[#404249] text-white' : 'text-[#B5BAC1] hover:bg-[#35373C] hover:text-[#DBDEE1]'
                    }`}
                  >
                    Pendente ({pendingFriends.length})
                  </button>
                  <button
                    onClick={() => setFriendsTab('add_friend')}
                    className={`px-2 py-1 rounded-[4px] text-sm font-semibold transition-all ${
                      friendsTab === 'add_friend' ? 'text-[#23A55A] bg-transparent font-bold' : 'bg-[#23A55A] hover:bg-[#1D8848] text-white'
                    }`}
                  >
                    Adicionar amigo
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#B5BAC1]">
                <Inbox size={20} className="cursor-pointer hover:text-[#DBDEE1] transition-colors" title="Caixa de Entrada" />
                <HelpCircle size={20} className="cursor-pointer hover:text-[#DBDEE1] transition-colors" title="Ajuda" />
              </div>
            </header>

            {/* Friends Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              {friendsTab === 'add_friend' ? (
                /* ADD FRIEND PANEL */
                <div className="max-w-xl animate-msg-enter">
                  <h3 className="font-bold text-base text-[#F2F3F5] uppercase tracking-wide">
                    Adicionar Amigo
                  </h3>
                  <p className="text-xs text-[#949BA4] mt-1 mb-4">
                    Você pode adicionar amigos usando o nome de usuário do Orbit Br (ex: <code>usuario</code> ou <code>usuario#1234</code>).
                  </p>

                  <form
                    onSubmit={handleSendFriendRequest}
                    className="p-3 bg-[#1E1F22] rounded-[8px] border border-[#1E1F22] focus-within:border-[#5865F2] flex items-center justify-between transition-colors"
                  >
                    <input
                      type="text"
                      value={addFriendInput}
                      onChange={(e) => setAddFriendInput(e.target.value)}
                      placeholder="Você pode adicionar amigos com o nome de usuário"
                      className="bg-transparent border-none outline-none text-sm text-[#F2F3F5] placeholder-[#80848E] flex-1 mr-3"
                    />
                    <button
                      type="submit"
                      disabled={!addFriendInput.trim()}
                      className="px-4 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white text-xs font-semibold transition-colors"
                    >
                      Enviar pedido de amizade
                    </button>
                  </form>

                  {addFriendStatus.msg && (
                    <div
                      className={`mt-3 text-xs font-semibold ${
                        addFriendStatus.type === 'success' ? 'text-[#23A55A]' : 'text-[#F23F43]'
                      }`}
                    >
                      {addFriendStatus.msg}
                    </div>
                  )}
                </div>
              ) : friendsTab === 'pending' ? (
                /* PENDING REQUESTS */
                <div>
                  <h4 className="text-xs font-bold text-[#949BA4] uppercase mb-3">
                    Pedidos Pendentes — {pendingFriends.length}
                  </h4>
                  {pendingFriends.length === 0 ? (
                    <p className="text-xs text-[#949BA4]">Não há pedidos de amizade pendentes.</p>
                  ) : (
                    <div className="space-y-2">
                      {pendingFriends.map((f) => (
                        <div
                          key={f.id}
                          className="flex items-center justify-between p-3 rounded-[8px] bg-[#2B2D31] border border-[#1F2023] shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <DiscordUserAvatar user={f} size={36} />
                            <div>
                              <span className="font-semibold text-sm text-[#F2F3F5]">
                                {f.display_name || f.username}
                              </span>
                              <span className="text-xs text-[#949BA4] ml-1 font-mono">{f.tag}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {f.requester_id !== currentUser.id ? (
                              <button
                                onClick={() => handleAcceptFriend(f.id)}
                                className="p-2 rounded-full bg-[#23A55A] hover:bg-[#1D8848] text-white font-bold shadow-md transition-colors"
                                title="Aceitar Amigo"
                              >
                                <Check size={16} />
                              </button>
                            ) : (
                              <span className="text-xs text-[#949BA4]">Pedido enviado</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : allFriends.length === 0 ? (
                /* WUMPUS EMPTY STATE */
                <div className="flex-1 flex flex-col items-center justify-center">
                  <WumpusEmptyFriends />
                  <button
                    onClick={() => setFriendsTab('add_friend')}
                    className="px-6 py-2.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-semibold transition-colors shadow-sm"
                  >
                    Adicionar Amigo
                  </button>
                </div>
              ) : (
                /* FRIENDS LIST */
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#949BA4] uppercase mb-3">
                    {friendsTab === 'online' ? 'Disponível' : 'Todos os Amigos'} —{' '}
                    {friendsTab === 'online' ? onlineFriends.length : allFriends.length}
                  </h4>
                  {(friendsTab === 'online' ? onlineFriends : allFriends).map((f) => (
                    <div
                      key={f.id}
                      onClick={() => setActiveDmFriend(f)}
                      onContextMenu={(e) => openCustomContextMenu(e, 'user', f)}
                      className="flex items-center justify-between p-2.5 rounded-[8px] hover:bg-[#35373C] cursor-pointer transition-all border-t border-[#3F4147]/20"
                    >
                      <div className="flex items-center gap-3">
                        <DiscordUserAvatar user={f} size={36} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm text-[#F2F3F5]">
                              {f.display_name || f.username}
                            </span>
                            <span className="text-xs text-[#949BA4] font-mono">{f.tag}</span>
                          </div>
                          <span className="text-xs text-[#949BA4]">{f.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[#B5BAC1]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDmFriend(f);
                          }}
                          className="p-2 rounded-full hover:bg-[#2B2D31] hover:text-white transition-colors"
                          title="Enviar Mensagem"
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : currentChannel?.type === 'voice' ? (
          /* ===================================================================== */
          /* 3.1 DISCORD VOICE CHANNEL LOUNGE / STAGE VIEW */
          /* ===================================================================== */
          <div className="flex-1 flex flex-col h-full min-w-0 bg-[#1E1F22] relative overflow-hidden">
            {/* Voice Channel Header */}
            <header className="h-12 px-4 flex items-center justify-between border-b border-[#1F2023] bg-[#313338] shadow-sm flex-shrink-0 z-10">
              <div className="flex items-center gap-2 min-w-0">
                <Volume2 size={20} className="text-[#23A55A]" />
                <span className="font-bold text-sm text-[#F2F3F5] truncate">
                  {currentChannel?.name}
                </span>
                <div className="w-[1px] h-4 bg-[#3F4147] mx-2" />
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#23A55A]/15 text-[#23A55A] text-[11px] font-semibold">
                  <Signal size={12} className="text-[#23A55A]" />
                  <span>RTC Conectado / 24ms</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[#B5BAC1]">
                {/* Toggle Voice Text Chat Drawer Button */}
                <button
                  onClick={() => setShowVoiceChatSidebar((p) => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-[4px] text-xs font-semibold transition-all ${
                    showVoiceChatSidebar
                      ? 'bg-[#404249] text-white font-bold'
                      : 'hover:bg-[#35373C] hover:text-white text-[#B5BAC1]'
                  }`}
                  title="Bate-papo do Canal de Voz"
                >
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Bate-papo</span>
                </button>

                {/* View Mode Toggle */}
                <button
                  onClick={() => setVoiceViewMode((p) => (p === 'grid' ? 'focus' : 'grid'))}
                  className={`p-1.5 rounded-[4px] transition-colors ${
                    voiceViewMode === 'focus' ? 'text-white bg-[#404249]' : 'text-[#B5BAC1] hover:text-white'
                  }`}
                  title={voiceViewMode === 'grid' ? 'Modo Foco' : 'Modo Grade'}
                >
                  <LayoutGrid size={18} />
                </button>

                {/* Member Sidebar Toggle */}
                <button
                  onClick={() => setShowMemberSidebar((p) => !p)}
                  className={`p-1.5 rounded-[4px] transition-colors ${
                    showMemberSidebar ? 'text-white bg-[#404249]' : 'text-[#B5BAC1] hover:text-white'
                  }`}
                  title="Lista de Membros"
                >
                  <Users size={18} />
                </button>
              </div>
            </header>

            {/* Voice Lounge Main Grid & Drawer Container */}
            <div className="flex-1 flex min-h-0 relative overflow-hidden">
              {/* Voice Stage Grid */}
              <div className="flex-1 flex flex-col p-6 overflow-y-auto relative items-center justify-center">
                {/* If no participants are in this voice channel and current user is not connected */}
                {voiceSessions.filter((vs) => vs.channel_id === currentChannel.id).length === 0 &&
                connectedVoiceChannelId !== currentChannel.id ? (
                  <div className="flex flex-col items-center justify-center text-center max-w-md animate-msg-enter">
                    <div className="w-16 h-16 rounded-full bg-[#2B2D31] flex items-center justify-center text-[#23A55A] mb-4 shadow-md">
                      <Volume2 size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-[#F2F3F5] mb-1.5">
                      {currentChannel.name}
                    </h3>
                    <p className="text-xs text-[#949BA4] mb-6 leading-relaxed">
                      Ninguém está conversando neste canal agora. Conecte-se e comece a falar com seus amigos!
                    </p>
                    <button
                      onClick={() => handleVoiceToggle(currentChannel.id)}
                      className="px-6 py-2.5 rounded-[3px] bg-[#23A55A] hover:bg-[#1D8848] text-white text-sm font-semibold shadow-sm flex items-center gap-2 transition-colors"
                    >
                      <Volume2 size={18} />
                      <span>Conectar à Voz</span>
                    </button>
                  </div>
                ) : (
                  /* Active Voice Participants & Screen Shares */
                  <div className="w-full h-full flex flex-col justify-center items-center gap-4 max-w-6xl pb-20">
                    {/* Live Screen Share Stage if Active */}
                    {(isScreenSharing || Object.keys(remoteScreenStreams).length > 0) && (
                      <div className="w-full flex-1 max-h-[55vh] flex items-center justify-center gap-4 animate-msg-enter">
                        {isScreenSharing && screenStream && (
                          <ScreenShareVideoTile
                            stream={screenStream}
                            username={currentUser.display_name || currentUser.username}
                            isLocal={true}
                            onToggleFullscreen={(data) => setFullscreenStream(data)}
                          />
                        )}
                        {Object.entries(remoteScreenStreams).map(([socketId, remoteData]) => {
                          const peerUser =
                            serverMembers.find((m) => m.id === remoteData.userId || m.user_id === remoteData.userId) ||
                            friends.find((f) => f.id === remoteData.userId) || {
                              username: 'Membro',
                              display_name: 'Membro',
                            };
                          return (
                            <ScreenShareVideoTile
                              key={socketId}
                              stream={remoteData.stream}
                              username={peerUser.display_name || peerUser.username}
                              isLocal={false}
                              onToggleFullscreen={(data) => setFullscreenStream(data)}
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Participant Cards Grid */}
                    <div
                      className={`w-full grid gap-4 ${
                        voiceSessions.filter((vs) => vs.channel_id === currentChannel.id).length <= 2
                          ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl'
                          : voiceSessions.filter((vs) => vs.channel_id === currentChannel.id).length <= 4
                          ? 'grid-cols-2 max-w-4xl'
                          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-6xl'
                      }`}
                    >
                      {/* Local user card if connected to this channel */}
                      {connectedVoiceChannelId === currentChannel.id && (
                        <DiscordVoiceParticipantCard
                          participant={currentUser}
                          isLocal={true}
                          isSpeaking={isUserSpeaking}
                          isMuted={isMuted}
                          isDeafened={isDeafened}
                          isSharingScreen={isScreenSharing}
                          cameraStream={cameraStream}
                          onClick={() => handleOpenUserProfile(currentUser, activeServerId)}
                        />
                      )}

                      {/* Remote participants */}
                      {voiceSessions
                        .filter((vs) => vs.channel_id === currentChannel.id && vs.user_id !== currentUser?.id)
                        .map((p) => (
                          <DiscordVoiceParticipantCard
                            key={p.user_id}
                            participant={p}
                            isLocal={false}
                            isSpeaking={p.is_speaking}
                            isMuted={p.is_muted}
                            isDeafened={p.is_deafened}
                            isSharingScreen={Object.values(remoteScreenStreams).some((r) => r.userId === p.user_id)}
                            onClick={() => handleOpenUserProfile(p, activeServerId)}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* FLOATING DISCORD VOICE CONTROLS DOCK */}
                {connectedVoiceChannelId === currentChannel.id && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#2B2D31] shadow-2xl border border-[#1E1F22] z-20 animate-msg-enter">
                    {/* Camera Toggle */}
                    <button
                      onClick={handleToggleCamera}
                      className={`p-3 rounded-full transition-all ${
                        isCameraOn
                          ? 'bg-white text-[#2B2D31]'
                          : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#35373C] hover:text-white'
                      }`}
                      title={isCameraOn ? 'Desativar Câmera' : 'Ativar Câmera'}
                    >
                      {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                    </button>

                    {/* Screen Share Toggle */}
                    <button
                      onClick={handleToggleScreenShare}
                      className={`p-3 rounded-full transition-all ${
                        isScreenSharing
                          ? 'bg-[#F23F43] text-white'
                          : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#35373C] hover:text-white'
                      }`}
                      title={isScreenSharing ? 'Parar Transmissão' : 'Compartilhar Tela'}
                    >
                      <MonitorUp size={20} />
                    </button>

                    {/* Activities */}
                    <button
                      onClick={() => triggerToast('Atividades do Orbit')}
                      className="p-3 rounded-full bg-[#313338] text-[#B5BAC1] hover:bg-[#35373C] hover:text-white transition-all"
                      title="Atividades"
                    >
                      <Sparkles size={20} />
                    </button>

                    <div className="w-[1px] h-6 bg-[#3F4147] mx-1" />

                    {/* Mute Toggle */}
                    <button
                      onClick={toggleMute}
                      className={`p-3 rounded-full transition-all ${
                        isMuted
                          ? 'bg-[#F23F43] text-white'
                          : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#35373C] hover:text-white'
                      }`}
                      title={isMuted ? 'Desativar Mudo' : 'Ativar Mudo'}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    {/* Deafen Toggle */}
                    <button
                      onClick={toggleDeafen}
                      className={`p-3 rounded-full transition-all ${
                        isDeafened
                          ? 'bg-[#F23F43] text-white'
                          : 'bg-[#313338] text-[#B5BAC1] hover:bg-[#35373C] hover:text-white'
                      }`}
                      title={isDeafened ? 'Desensurdecer' : 'Ensurdecer'}
                    >
                      <Headphones size={20} />
                    </button>

                    {/* Disconnect Button */}
                    <button
                      onClick={handleDisconnectVoice}
                      className="px-5 py-2.5 rounded-full bg-[#DA373C] hover:bg-[#A12828] text-white font-semibold transition-colors flex items-center gap-2 shadow-md"
                      title="Desconectar"
                    >
                      <PhoneOff size={18} />
                      <span className="text-xs hidden sm:inline">Desconectar</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Embedded Voice Text Chat Drawer */}
              {showVoiceChatSidebar && (
                <div className="w-80 sm:w-96 flex-shrink-0 bg-[#2B2D31] border-l border-[#1F2023] flex flex-col h-full animate-msg-enter">
                  <div className="h-12 px-4 flex items-center justify-between border-b border-[#1F2023] bg-[#2B2D31]">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#949BA4]" />
                      <span className="text-xs font-bold text-[#F2F3F5]">Bate-papo de #{currentChannel?.name}</span>
                    </div>
                    <button
                      onClick={() => setShowVoiceChatSidebar(false)}
                      className="p-1 text-[#949BA4] hover:text-white rounded"
                      title="Fechar Bate-papo"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-10 text-[#949BA4] text-xs">
                        Nenhuma mensagem no bate-papo de voz ainda. Envie a primeira mensagem!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-2.5">
                          <DiscordUserAvatar user={msg} size={28} showStatus={false} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs text-[#F2F3F5] truncate">{msg.author_name || msg.author_username || 'User'}</span>
                              <span className="text-[9px] text-[#949BA4]">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-xs text-[#DBDEE1] mt-0.5 break-words">{msg.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3 bg-[#2B2D31] flex items-center gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleMessageInputChange}
                      placeholder={`Conversar em #${currentChannel?.name}`}
                      className="flex-1 bg-[#383A40] px-3 py-2 rounded-[8px] text-xs text-[#DBDEE1] placeholder-[#80848E] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-2 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] text-white disabled:opacity-30 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ===================================================================== */
          /* 3.2 SERVER TEXT CHANNEL OR DM ACTIVE CHAT VIEW */
          /* ===================================================================== */
          <>
            {/* Header */}
            <header className="h-12 px-4 flex items-center justify-between border-b border-[#1F2023] bg-[#313338] shadow-sm flex-shrink-0 z-10">
              <div className="flex items-center gap-2 min-w-0 mr-4">
                {activeServerId === 'dms' ? (
                  <>
                    <DiscordUserAvatar user={activeDmFriend} size={24} showStatus={false} />
                    <span className="font-bold text-sm text-[#F2F3F5] truncate">
                      {activeDmFriend?.display_name || activeDmFriend?.username}
                    </span>
                  </>
                ) : (
                  <>
                    {getChannelIcon(currentChannel?.type, 20, 'text-[#80848E]')}
                    <span className="font-bold text-sm text-[#F2F3F5] truncate">
                      {currentChannel?.name}
                    </span>
                    <div className="w-[1px] h-4 bg-[#3F4147] mx-2" />
                    <p className="text-xs text-[#949BA4] truncate hidden sm:block">
                      {currentChannel?.topic || 'Bem-vindo ao canal!'}
                    </p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 text-[#B5BAC1]">
                {activeServerId === 'dms' ? (
                  <>
                    <button
                      onClick={handleToggleScreenShare}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold transition-all ${
                        isScreenSharing
                          ? 'bg-[#F23F43] text-white'
                          : 'hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]'
                      }`}
                      title={isScreenSharing ? 'Parar Transmissão' : 'Compartilhar Tela'}
                    >
                      <MonitorUp size={16} />
                      <span className="hidden sm:inline">{isScreenSharing ? 'AO VIVO' : 'Transmitir Tela'}</span>
                    </button>
                    <Phone size={18} className="cursor-pointer hover:text-[#DBDEE1] transition-colors" title="Iniciar Chamada de Voz" />
                    <Video size={18} className="cursor-pointer hover:text-[#DBDEE1] transition-colors" title="Iniciar Chamada de Vídeo" />
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleToggleScreenShare}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold transition-all ${
                        isScreenSharing
                          ? 'bg-[#F23F43] text-white'
                          : 'hover:bg-[#35373C] text-[#B5BAC1] hover:text-[#DBDEE1]'
                      }`}
                      title={isScreenSharing ? 'Parar Transmissão' : 'Compartilhar Tela'}
                    >
                      <MonitorUp size={16} />
                      <span className="hidden sm:inline">{isScreenSharing ? 'AO VIVO' : 'Transmitir Tela'}</span>
                    </button>
                    <button
                      onClick={() => setShowMemberSidebar((p) => !p)}
                      className={`p-1 rounded-[4px] transition-colors ${showMemberSidebar ? 'text-white bg-[#404249]' : 'text-[#B5BAC1] hover:text-[#DBDEE1]'}`}
                      title="Ocultar/Exibir Lista de Membros"
                    >
                      <Users size={19} />
                    </button>
                  </>
                )}
              </div>
            </header>

            {/* LIVE SCREEN SHARE STAGE */}
            {(isScreenSharing || Object.keys(remoteScreenStreams).length > 0) && (
              <div className="p-4 bg-[#1E1F22] border-b border-[#1F2023] flex flex-col gap-3 flex-shrink-0 animate-msg-enter">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F23F43] shadow-[0_0_8px_#F23F43] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F2F3F5]">
                      Transmissão de Tela Ao Vivo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsStageCollapsed((p) => !p)}
                      className="p-1 text-[#949BA4] hover:text-white rounded-[4px] transition-colors"
                      title={isStageCollapsed ? 'Expandir' : 'Minimizar'}
                    >
                      {isStageCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                    </button>
                  </div>
                </div>

                {!isStageCollapsed && (
                  <div className="flex flex-wrap gap-4 items-center justify-center">
                    {/* Local Screen Stream */}
                    {isScreenSharing && screenStream && (
                      <ScreenShareVideoTile
                        stream={screenStream}
                        username={currentUser.display_name || currentUser.username}
                        isLocal={true}
                        onToggleFullscreen={(data) => setFullscreenStream(data)}
                      />
                    )}

                    {/* Remote Screen Streams */}
                    {Object.entries(remoteScreenStreams).map(([socketId, remoteData]) => {
                      const peerUser =
                        serverMembers.find((m) => m.id === remoteData.userId || m.user_id === remoteData.userId) ||
                        friends.find((f) => f.id === remoteData.userId) || {
                          username: 'Membro',
                          display_name: 'Membro',
                        };

                      return (
                        <ScreenShareVideoTile
                          key={socketId}
                          stream={remoteData.stream}
                          username={peerUser.display_name || peerUser.username}
                          isLocal={false}
                          onToggleFullscreen={(data) => setFullscreenStream(data)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Channel Welcome Banner */}
              <div className="pt-4 pb-2">
                <div className="w-16 h-16 rounded-full bg-[#4E5058] flex items-center justify-center text-white mb-3">
                  {activeServerId === 'dms' ? (
                    <DiscordUserAvatar user={activeDmFriend} size={48} showStatus={false} />
                  ) : (
                    getChannelIcon(currentChannel?.type, 40, 'text-white')
                  )}
                </div>
                <h3 className="text-3xl font-bold text-[#F2F3F5]">
                  {activeServerId === 'dms'
                    ? activeDmFriend?.display_name || activeDmFriend?.username
                    : `Boas-vindas a #${currentChannel?.name}!`}
                </h3>
                <p className="text-sm text-[#949BA4] mt-1">
                  {activeServerId === 'dms'
                    ? `Este é o começo do seu histórico de mensagens diretas com ${activeDmFriend?.display_name}.`
                    : `Este é o início do canal #${currentChannel?.name}.`}
                </p>
                <div className="w-full h-[1px] bg-[#3F4147] mt-4" />
              </div>

              {/* Message Feed */}
              <div className="space-y-0.5">
                {(activeServerId === 'dms' ? dmMessages : messages).map((msg, index) => {
                  const author =
                    (currentUser?.id === (msg.user_id || msg.sender_id) ? currentUser : null) ||
                    serverMembers.find((m) => m.id === msg.user_id || m.user_id === msg.user_id) ||
                    friends.find((f) => f.id === msg.user_id || f.id === msg.sender_id) || {
                      id: msg.user_id || msg.sender_id,
                      username: msg.author_username || 'User',
                      display_name: msg.author_name || msg.author_username || 'User',
                      avatar_color: msg.avatar_color || '#5865F2',
                      avatar_url: msg.avatar_url,
                    };

                  const timeStr = new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg.id}
                      onContextMenu={(e) => openCustomContextMenu(e, 'message', { ...msg, author_username: author.username })}
                      className="group relative flex items-start gap-4 px-4 py-1 hover:bg-[#2E3035] rounded-[2px] transition-colors"
                    >
                      {/* Message Hover Quick Actions Bar */}
                      <div className="absolute right-4 -top-3.5 hidden group-hover:flex items-center bg-[#313338] border border-[#232428] rounded-[4px] shadow-md py-0.5 px-1.5 gap-1 text-[#B5BAC1] z-10 animate-msg-enter">
                        {['👍', '❤️', '🔥'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleToggleReaction(msg.id, emoji)}
                            className="hover:bg-[#35373C] p-1 rounded hover:scale-125 transition-transform text-xs"
                            title={`Reagir com ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setMessageInput((p) => `Respondendo a @${author.username}: ` + p);
                            inputRef.current?.focus();
                          }}
                          className="hover:bg-[#35373C] p-1 rounded hover:text-white transition-colors"
                          title="Responder"
                        >
                          <CornerUpLeft size={14} />
                        </button>
                      </div>

                      <DiscordUserAvatar
                        user={author}
                        size={40}
                        showStatus={false}
                        onClick={() => handleOpenUserProfile(author, activeServerId)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            onClick={() => handleOpenUserProfile(author, activeServerId)}
                            className="font-semibold text-sm hover:underline cursor-pointer flex items-center gap-1.5"
                            style={{ color: author.role_color || msg.role_color || '#F2F3F5' }}
                          >
                            <span>{author.display_name || author.username}</span>
                            {author.role === 'owner' && (
                              <Crown size={12} className="text-[#F0B232] fill-current" title="Dono do Servidor" />
                            )}
                          </span>
                          <span className="text-[11px] text-[#949BA4]">Hoje às {timeStr}</span>
                        </div>

                        {msg.text && (
                          <p className="text-sm text-[#DBDEE1] leading-relaxed break-words whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        )}

                        {msg.attachment_url && (
                          <div className="mt-2">
                            {msg.attachment_type === 'image' || msg.attachment_url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                              <img
                                src={msg.attachment_url}
                                alt="Upload"
                                onClick={() => setPreviewImageModal(msg.attachment_url)}
                                className="max-w-md max-h-72 rounded-[8px] border border-[#1F2023] cursor-pointer hover:opacity-95 transition-opacity shadow-sm"
                              />
                            ) : (
                              <a
                                href={msg.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#2B2D31] hover:bg-[#35373C] text-xs text-[#00A8FC] border border-[#1F2023] shadow-sm transition-colors"
                              >
                                <Paperclip size={14} />
                                <span>{msg.attachment_name || 'Baixar Arquivo'}</span>
                              </a>
                            )}
                          </div>
                        )}

                        {/* Reaction Pills */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {msg.reactions.map((r) => {
                              const userReacted = currentUser && r.users?.includes(currentUser.username);
                              return (
                                <button
                                  key={r.emoji}
                                  onClick={() => handleToggleReaction(msg.id, r.emoji)}
                                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] text-xs border transition-all ${
                                    userReacted
                                      ? 'bg-[#5865F2]/20 border-[#5865F2] text-[#5865F2] font-semibold'
                                      : 'bg-[#2B2D31] border-[#383A40] text-[#B5BAC1] hover:bg-[#35373C]'
                                  }`}
                                  title={`${r.users?.join(', ') || ''} reagiram`}
                                >
                                  <span>{r.emoji}</span>
                                  <span className="text-[11px] font-bold">{r.count}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="px-4 h-5 flex items-center gap-1.5 text-xs text-[#949BA4]">
              {typingUsers.length > 0 && (
                <>
                  <div className="flex items-center gap-1 text-[#DBDEE1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DBDEE1] typing-dot-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DBDEE1] typing-dot-2" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DBDEE1] typing-dot-3" />
                  </div>
                  <span className="text-[#DBDEE1] font-medium">{typingUsers.join(', ')} {typingUsers.length === 1 ? 'está' : 'estão'} digitando…</span>
                </>
              )}
            </div>

            {/* Composer */}
            <div className="px-4 pb-6 pt-1 flex-shrink-0 relative">
              {/* Selected File Floating Preview */}
              {selectedFile && (
                <div className="mb-2 p-2.5 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] flex items-center justify-between shadow-lg max-w-sm animate-msg-enter">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[4px] bg-[#1E1F22] flex items-center justify-center text-[#5865F2] flex-shrink-0">
                      <Paperclip size={16} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-[#F2F3F5] truncate">{selectedFile.name}</span>
                      <span className="text-[10px] text-[#949BA4]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1 text-[#949BA4] hover:text-[#F23F43] rounded transition-colors"
                    title="Remover anexo"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 right-6 bg-[#2B2D31] border border-[#1F2023] rounded-[8px] p-3 shadow-2xl z-40 w-64 animate-msg-enter">
                  <div className="text-[11px] font-bold text-[#949BA4] uppercase mb-2 tracking-wider">Escolha um Emoji</div>
                  <div className="grid grid-cols-6 gap-2 text-xl">
                    {['😀', '😂', '😍', '🔥', '👍', '🎉', '🚀', '✨', '👀', '💯', '❤️', '😎', '🥳', '🤔', '🙌', '💀', '👽', '⭐'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setMessageInput((p) => p + emoji);
                          setShowEmojiPicker(false);
                          inputRef.current?.focus();
                        }}
                        className="p-1 hover:bg-[#35373C] rounded-[4px] hover:scale-125 transition-transform text-center"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="bg-[#383A40] rounded-[8px] px-4 py-2.5 flex items-center gap-3 shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 rounded-full bg-[#4E5058] hover:bg-[#B5BAC1] text-[#DBDEE1] hover:text-[#313338] transition-colors flex items-center justify-center"
                  title="Enviar arquivo"
                >
                  <Plus size={16} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
                  }}
                  className="hidden"
                />

                <input
                  ref={inputRef}
                  type="text"
                  value={messageInput}
                  onChange={handleMessageInputChange}
                  onKeyDown={handleMessageKeyDown}
                  placeholder={
                    activeServerId === 'dms'
                      ? `Conversar com @${activeDmFriend?.display_name || activeDmFriend?.username}`
                      : `Conversar em #${currentChannel?.name}`
                  }
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[#DBDEE1] placeholder-[#80848E]"
                />

                <div className="flex items-center gap-2 text-[#B5BAC1]">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((p) => !p)}
                    className="p-1 hover:text-[#DBDEE1] transition-colors"
                    title="Emoji"
                  >
                    <Smile size={20} />
                  </button>
                  <button
                    type="submit"
                    disabled={!messageInput.trim() && !selectedFile}
                    className="p-1.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] text-white disabled:opacity-30 transition-all shadow-sm"
                    title="Enviar Mensagem"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. SERVER MEMBERS SIDEBAR (240px, #2B2D31) */}
      {/* ========================================================================= */}
      {activeServerId !== 'dms' && showMemberSidebar && (
        <aside className="w-60 flex-shrink-0 bg-[#2B2D31] flex flex-col h-full border-l border-[#1F2023] p-3 overflow-y-auto space-y-4 select-none">
          {(() => {
            // Group members by their highest hoisted role
            const groups = {};
            const standardMembers = [];

            serverMembers.forEach((member) => {
              const hoistedRole = member.roles?.find((r) => Boolean(r.hoist)) || (member.highest_role?.hoist ? member.highest_role : null);
              if (member.role === 'owner') {
                if (!groups['owner']) groups['owner'] = { name: 'Dono do Servidor', icon: '👑', color: '#F0B232', members: [] };
                groups['owner'].members.push(member);
              } else if (hoistedRole) {
                const groupKey = `role_${hoistedRole.id || hoistedRole.role_id}`;
                if (!groups[groupKey]) {
                  groups[groupKey] = {
                    name: hoistedRole.role_name || hoistedRole.name,
                    icon: hoistedRole.icon || '🛡️',
                    color: hoistedRole.role_color || hoistedRole.color || '#99AAB5',
                    members: []
                  };
                }
                groups[groupKey].members.push(member);
              } else {
                standardMembers.push(member);
              }
            });

            return (
              <>
                {/* Hoisted Role Groups */}
                {Object.entries(groups).map(([key, group]) => (
                  <div key={key}>
                    <h4
                      className="text-[11px] font-bold uppercase mb-2 px-2 flex items-center justify-between"
                      style={{ color: group.color }}
                    >
                      <span className="truncate flex items-center gap-1">
                        <span>{group.icon}</span>
                        <span>{group.name}</span>
                      </span>
                      <span>— {group.members.length}</span>
                    </h4>
                    <div className="space-y-0.5">
                      {group.members.map((member) => (
                        <div
                          key={member.id || member.user_id}
                          onClick={() => handleOpenUserProfile(member, activeServerId)}
                          onContextMenu={(e) => openCustomContextMenu(e, 'user', member)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] hover:bg-[#35373C] cursor-pointer transition-colors group"
                        >
                          <DiscordUserAvatar user={member} size={32} />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span
                              className="text-sm font-semibold truncate group-hover:underline"
                              style={{ color: member.role_color || group.color || '#DBDEE1' }}
                            >
                              {member.display_name || member.username}
                            </span>
                            {member.custom_activity && (
                              <span className="text-[10px] text-[#949BA4] truncate flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#23A55A]" />
                                {member.custom_activity}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Default Available Members */}
                {standardMembers.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-bold text-[#949BA4] uppercase mb-2 px-2">
                      Disponível — {standardMembers.length}
                    </h4>
                    <div className="space-y-0.5">
                      {standardMembers.map((member) => (
                        <div
                          key={member.id || member.user_id}
                          onClick={() => handleOpenUserProfile(member, activeServerId)}
                          onContextMenu={(e) => openCustomContextMenu(e, 'user', member)}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-[4px] hover:bg-[#35373C] cursor-pointer transition-colors group"
                        >
                          <DiscordUserAvatar user={member} size={32} />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span
                              className="text-sm font-medium truncate group-hover:underline"
                              style={{ color: member.role_color || '#DBDEE1' }}
                            >
                              {member.display_name || member.username}
                            </span>
                            {member.custom_activity && (
                              <span className="text-[10px] text-[#949BA4] truncate flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#23A55A]" />
                                {member.custom_activity}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </aside>
      )}

      {/* ========================================================================= */}
      {/* 5. CREATE SERVER MODAL WIZARD */}
      {/* ========================================================================= */}
      {showAddServerModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-msg-enter"
          onClick={() => setShowAddServerModal(false)}
        >
          <div
            className="w-[440px] bg-[#313338] text-[#DBDEE1] rounded-[5px] shadow-2xl overflow-hidden p-6 relative border border-[#1F2023]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddServerModal(false)}
              className="absolute top-4 right-4 text-[#949BA4] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {serverModalStep === 'templates' ? (
              <>
                <h3 className="text-2xl font-bold text-center text-[#F2F3F5]">
                  Criar seu servidor
                </h3>
                <p className="text-xs text-center text-[#949BA4] mt-1.5 mb-5 leading-relaxed">
                  Seu servidor é onde você e seus amigos se reúnem. Crie o seu e comece a conversar no Orbit Br.
                </p>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {[
                    { name: 'Criar o meu', icon: '✨' },
                    { name: 'Jogos', icon: '🎮' },
                    { name: 'Clube Escolar', icon: '🎓' },
                    { name: 'Grupo de Estudos', icon: '📚' },
                    { name: 'Amigos', icon: '💬' },
                    { name: 'Artistas e Criadores', icon: '🎨' },
                  ].map((tpl) => (
                    <button
                      key={tpl.name}
                      onClick={() => {
                        setNewServerTemplate(tpl.name);
                        setNewServerName(`Servidor de ${currentUser.display_name || currentUser.username}`);
                        setServerModalStep('customize');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-[8px] border border-[#1F2023] bg-[#2B2D31] hover:bg-[#35373C] transition-all shadow-sm"
                    >
                      <div className="flex items-center gap-3 font-semibold text-sm text-[#F2F3F5]">
                        <span className="text-xl">{tpl.icon}</span>
                        <span>{tpl.name}</span>
                      </div>
                      <ArrowRight size={18} className="text-[#949BA4]" />
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#1F2023] text-center">
                  <h4 className="text-xs font-semibold text-[#B5BAC1] mb-2">Já tem um convite de um amigo?</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setJoinInviteInput('');
                      setJoinInviteError('');
                      setServerModalStep('join');
                    }}
                    className="w-full py-2.5 px-4 rounded-[4px] bg-[#404249] hover:bg-[#35373C] text-white text-xs font-semibold transition-colors"
                  >
                    Entrar em um servidor
                  </button>
                </div>
              </>
            ) : serverModalStep === 'join' ? (
              <form onSubmit={handleJoinByInviteInput}>
                <h3 className="text-2xl font-bold text-center text-[#F2F3F5]">
                  Entrar em um servidor
                </h3>
                <p className="text-xs text-center text-[#949BA4] mt-1.5 mb-5 leading-relaxed">
                  Insira um código ou link de convite para participar de um servidor existente.
                </p>

                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Código ou Link do Convite <span className="text-[#F23F43]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: OB-ABCDE ou https://orbitbr.vercel.app/?invite=OB-ABCDE"
                    value={joinInviteInput}
                    onChange={(e) => setJoinInviteInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                  />
                  <p className="text-[11px] text-[#949BA4] mt-2">
                    Os convites possuem formato <strong>OB-XXXXX</strong> ou o link enviado pelo seu amigo.
                  </p>
                </div>

                {joinInviteError && (
                  <div className="mb-4 p-2.5 rounded-[4px] bg-[#F23F43]/10 border border-[#F23F43]/30 text-xs text-[#F23F43] font-medium">
                    {joinInviteError}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-[#1F2023]">
                  <button
                    type="button"
                    onClick={() => setServerModalStep('templates')}
                    className="text-xs font-semibold text-[#949BA4] hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={isJoiningByInput || !joinInviteInput.trim()}
                    className="px-6 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    {isJoiningByInput && <RefreshCw size={12} className="animate-spin" />}
                    <span>Entrar no Servidor</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateServer}>
                <h3 className="text-2xl font-bold text-center text-[#F2F3F5]">
                  Personalize seu servidor
                </h3>
                <p className="text-xs text-center text-[#949BA4] mt-1.5 mb-5">
                  Dê uma personalidade ao seu novo servidor com um nome. Você sempre pode alterá-lo depois.
                </p>

                <div className="mb-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                    Nome do Servidor <span className="text-[#F23F43]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    className="w-full h-10 px-3 rounded-[3px] bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] outline-none text-[#F2F3F5] text-sm transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1F2023]">
                  <button
                    type="button"
                    onClick={() => setServerModalStep('templates')}
                    className="text-xs font-semibold text-[#949BA4] hover:text-white"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    Criar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.1 DEDICATED SERVER INVITE GENERATOR MODAL */}
      {/* ========================================================================= */}
      {showInviteModal && inviteModalServer && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-msg-enter"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="w-[460px] bg-[#313338] text-[#DBDEE1] rounded-[6px] shadow-2xl overflow-hidden p-6 relative border border-[#1F2023]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-[#949BA4] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-[#5865F2] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                {inviteModalServer.icon_url ? (
                  <img src={inviteModalServer.icon_url} alt={inviteModalServer.name} className="w-full h-full object-cover rounded-[12px]" />
                ) : (
                  inviteModalServer.name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#F2F3F5] leading-tight">
                  Convidar amigos para {inviteModalServer.name}
                </h3>
                <p className="text-xs text-[#949BA4]">Envie este link para qualquer amigo entrar no servidor.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                  Link de Convite Oficial
                </label>
                <div className="flex items-center gap-2 p-1 bg-[#1E1F22] rounded-[4px] border border-[#2B2D31] focus-within:border-[#5865F2]">
                  <input
                    type="text"
                    readOnly
                    value={inviteLinkData?.url || `${window.location.origin}/?invite=${inviteLinkData?.code || '...'}`}
                    className="bg-transparent flex-1 text-xs font-mono text-[#F2F3F5] px-2.5 py-1.5 outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const urlToCopy = inviteLinkData?.url || `${window.location.origin}/?invite=${inviteLinkData?.code}`;
                      navigator.clipboard.writeText(urlToCopy);
                      setIsCopiedInvite(true);
                      triggerToast('Link de convite copiado para a área de transferência!');
                      setTimeout(() => setIsCopiedInvite(false), 3000);
                    }}
                    className={`px-4 py-2 rounded-[3px] text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                      isCopiedInvite
                        ? 'bg-[#23A55A] text-white'
                        : 'bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-sm'
                    }`}
                  >
                    {isCopiedInvite ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopiedInvite ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#2B2D31] rounded-[6px] border border-[#1F2023] flex items-center justify-between text-xs text-[#949BA4]">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#23A55A]" />
                  <span>Seu link de convite nunca expira.</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch(`${API_BASE}/api/servers/${inviteModalServer.id}/invites`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ inviter_id: currentUser?.id, force_new: true })
                      });
                      const data = await res.json();
                      if (data.success) {
                        const fullUrl = `${window.location.origin}/?invite=${data.code}`;
                        setInviteLinkData({ code: data.code, url: fullUrl });
                        triggerToast('Novo código de convite gerado!');
                      }
                    } catch (e) {}
                  }}
                  className="text-[#5865F2] hover:underline text-xs flex items-center gap-1"
                >
                  <RefreshCw size={12} />
                  <span>Gerar novo</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5.2 INCOMING INVITE ACCEPTANCE MODAL (Triggered via ?invite=OB-XXXXX) */}
      {/* ========================================================================= */}
      {showPendingInviteModal && pendingInviteData && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-msg-enter"
          onClick={() => setShowPendingInviteModal(false)}
        >
          <div
            className="w-[420px] bg-[#313338] text-[#DBDEE1] rounded-[8px] shadow-2xl overflow-hidden p-6 relative border border-[#1F2023] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowPendingInviteModal(false);
                window.history.replaceState({}, document.title, window.location.pathname);
              }}
              className="absolute top-4 right-4 text-[#949BA4] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 mx-auto mb-4 rounded-[20px] bg-[#5865F2] text-white font-bold flex items-center justify-center text-xl shadow-lg border-2 border-[#1F2023] overflow-hidden">
              {pendingInviteData.server?.icon_url ? (
                <img src={pendingInviteData.server.icon_url} alt={pendingInviteData.server.name} className="w-full h-full object-cover" />
              ) : (
                pendingInviteData.server?.name?.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase() || 'OB'
              )}
            </div>

            <span className="text-xs text-[#949BA4] uppercase font-bold tracking-wider block mb-1">
              {pendingInviteData.inviter?.display_name
                ? `${pendingInviteData.inviter.display_name} convidou você para participar de`
                : 'Você foi convidado para entrar em'}
            </span>

            <h2 className="text-xl font-bold text-[#F2F3F5] mb-3">
              {pendingInviteData.server?.name}
            </h2>

            {pendingInviteData.server?.description && (
              <p className="text-xs text-[#B5BAC1] mb-4 line-clamp-2 px-4">
                {pendingInviteData.server.description}
              </p>
            )}

            <div className="flex items-center justify-center gap-6 py-3 px-4 bg-[#2B2D31] rounded-[6px] border border-[#1F2023] mb-6 text-xs text-[#949BA4]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#23A55A]" />
                <span className="text-[#F2F3F5]">{pendingInviteData.server?.online_count || 1}</span> Online
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#80848E]" />
                <span className="text-[#F2F3F5]">{pendingInviteData.server?.member_count || 1}</span> Membros
              </span>
            </div>

            <button
              onClick={() => handleAcceptInvite(pendingInviteData.invite.code)}
              disabled={isJoiningInvite}
              className="w-full py-3 px-4 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white text-sm font-semibold shadow-lg transition-all flex items-center justify-center gap-2"
            >
              {isJoiningInvite && <RefreshCw size={16} className="animate-spin" />}
              <span>{currentUser ? 'Aceitar Convite' : 'Fazer login para entrar'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CREATE CHANNEL MODAL */}
      {/* ========================================================================= */}
      {showCreateChannelModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-msg-enter"
          onClick={() => {
            setShowCreateChannelModal(false);
            setIsChannelPrivate(false);
            setShowChannelEmojiPicker(false);
          }}
        >
          <div
            className="w-full max-w-[460px] bg-[#313338] text-[#DBDEE1] rounded-[8px] shadow-2xl p-6 border border-[#232428]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl font-bold text-[#F2F3F5]">Criar canal</h2>
              <button
                onClick={() => {
                  setShowCreateChannelModal(false);
                  setIsChannelPrivate(false);
                  setShowChannelEmojiPicker(false);
                }}
                className="text-[#949BA4] hover:text-white p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateChannel} className="space-y-4">
              {/* Channel Type Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2.5">
                  Tipo de canal
                </label>

                <div className="space-y-1.5">
                  {[
                    {
                      id: 'text',
                      title: 'Texto',
                      icon: Hash,
                      desc: 'Envie mensagens, imagens, GIFs, emojis, opiniões e piadas',
                    },
                    {
                      id: 'voice',
                      title: 'Voz',
                      icon: Volume2,
                      desc: 'Passe tempo com a turma com voz, vídeo e compartilhamento de tela',
                    },
                    {
                      id: 'forum',
                      title: 'Fórum',
                      icon: MessagesSquare,
                      desc: 'Crie um espaço para discussões organizadas',
                    },
                    {
                      id: 'announcement',
                      title: 'Announcement',
                      icon: Megaphone,
                      desc: 'Atualizações importantes para pessoas dentro e fora do servidor',
                    },
                    {
                      id: 'stage',
                      title: 'Palco',
                      icon: Radio,
                      desc: 'Ofereça eventos, painéis, e P&Rs para uma plateia',
                    },
                  ].map((t) => {
                    const isSelected = newChannelType === t.id;
                    const IconComp = t.icon;

                    return (
                      <div
                        key={t.id}
                        onClick={() => setNewChannelType(t.id)}
                        className={`flex items-center gap-3.5 p-3 rounded-[6px] cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#2B2D31] text-white'
                            : 'bg-[#2B2D31]/40 hover:bg-[#35373C]/60 text-[#DBDEE1]'
                        }`}
                      >
                        {/* Radio indicator */}
                        <div className="flex-shrink-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-[#5865F2] bg-[#5865F2]'
                                : 'border-[#80848E] bg-[#1E1F22]'
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <IconComp
                              size={18}
                              className={isSelected ? 'text-white' : 'text-[#949BA4]'}
                            />
                            <span className="font-semibold text-sm text-[#F2F3F5]">
                              {t.title}
                            </span>
                          </div>
                          <p className="text-xs text-[#949BA4] mt-0.5 leading-snug">
                            {t.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Channel Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                  Nome do canal
                </label>
                <div className="relative flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1E1F22] focus-within:border-[#5865F2] focus-within:ring-1 focus-within:ring-[#5865F2] transition-colors">
                  {getChannelIcon(newChannelType, 18, 'text-[#80848E] flex-shrink-0')}
                  <input
                    type="text"
                    required
                    value={newChannelName}
                    onChange={(e) =>
                      setNewChannelName(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                    }
                    placeholder="novo-canal"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[#F2F3F5] placeholder-[#80848E]"
                    autoFocus
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowChannelEmojiPicker((p) => !p)}
                      className="text-[#949BA4] hover:text-white p-1 rounded transition-colors"
                      title="Inserir Emoji"
                    >
                      <Smile size={18} />
                    </button>
                    {showChannelEmojiPicker && (
                      <div className="absolute right-0 bottom-8 bg-[#111214] border border-[#232428] rounded-[6px] p-2 shadow-2xl z-50 flex gap-1.5 animate-msg-enter">
                        {['💬', '🎮', '🎵', '📢', '🔥', '✨', '🚀', '📌'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setNewChannelName((prev) => (prev ? `${prev}-${emoji}` : emoji));
                              setShowChannelEmojiPicker(false);
                            }}
                            className="hover:scale-125 transition-transform text-base p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Private Channel Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-[#DBDEE1]" />
                    <span className="font-semibold text-sm text-[#F2F3F5]">Canal privado</span>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsChannelPrivate((p) => !p)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isChannelPrivate ? 'bg-[#5865F2]' : 'bg-[#4E5058]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isChannelPrivate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#949BA4] mt-1.5 leading-snug">
                  Somente membros e cargos selecionados poderão visualizar esse canal.
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232428]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateChannelModal(false);
                    setIsChannelPrivate(false);
                    setShowChannelEmojiPicker(false);
                  }}
                  className="px-5 py-2.5 rounded-[4px] bg-[#2B2D31] hover:bg-[#35373C] text-white text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newChannelName.trim()}
                  className="px-6 py-2.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white text-sm font-semibold shadow-md transition-colors"
                >
                  Criar canal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6.1 CREATE CATEGORY MODAL */}
      {/* ========================================================================= */}
      {showCreateCategoryModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-msg-enter"
          onClick={() => {
            setShowCreateCategoryModal(false);
            setIsCategoryPrivate(false);
            setShowCategoryEmojiPicker(false);
          }}
        >
          <div
            className="w-full max-w-[460px] bg-[#313338] text-[#DBDEE1] rounded-[8px] shadow-2xl p-6 border border-[#232428]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-xl font-bold text-[#F2F3F5]">Criar categoria</h2>
              <button
                onClick={() => {
                  setShowCreateCategoryModal(false);
                  setIsCategoryPrivate(false);
                  setShowCategoryEmojiPicker(false);
                }}
                className="text-[#949BA4] hover:text-white p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#B5BAC1] mb-2">
                  Nome da categoria
                </label>
                <div className="relative flex items-center gap-2 px-3 py-2 rounded-[4px] bg-[#1E1F22] border border-[#1E1F22] focus-within:border-[#5865F2] focus-within:ring-1 focus-within:ring-[#5865F2] transition-colors">
                  <input
                    type="text"
                    required
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Nova Categoria"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-[#F2F3F5] placeholder-[#80848E]"
                    autoFocus
                  />
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCategoryEmojiPicker((p) => !p)}
                      className="text-[#949BA4] hover:text-white p-1 rounded transition-colors"
                      title="Inserir Emoji"
                    >
                      <Smile size={18} />
                    </button>
                    {showCategoryEmojiPicker && (
                      <div className="absolute right-0 bottom-8 bg-[#111214] border border-[#232428] rounded-[6px] p-2 shadow-2xl z-50 flex gap-1.5 animate-msg-enter">
                        {['📁', '🎮', '💬', '📢', '🔥', '✨', '⚡', '🏆'].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => {
                              setNewCategoryName((prev) => (prev ? `${prev} ${emoji}` : emoji));
                              setShowCategoryEmojiPicker(false);
                            }}
                            className="hover:scale-125 transition-transform text-base p-1"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Private Category Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-[#DBDEE1]" />
                    <span className="font-semibold text-sm text-[#F2F3F5]">Categoria privada</span>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsCategoryPrivate((p) => !p)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer ${
                      isCategoryPrivate ? 'bg-[#5865F2]' : 'bg-[#4E5058]'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        isCategoryPrivate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-[#949BA4] mt-1.5 leading-snug">
                  Ao tornar uma categoria privada, somente membros e cargos selecionados poderão visualizar essa categoria. Canais vinculados a esta categoria seguirão esta configuração automaticamente.
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232428]">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateCategoryModal(false);
                    setIsCategoryPrivate(false);
                    setShowCategoryEmojiPicker(false);
                  }}
                  className="px-5 py-2.5 rounded-[4px] bg-[#2B2D31] hover:bg-[#35373C] text-white text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-6 py-2.5 rounded-[4px] bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white text-sm font-semibold shadow-md transition-colors"
                >
                  Criar categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. CUSTOM ORBIT BR CONTEXT MENU */}
      {/* ========================================================================= */}
      {contextMenu && (
        <div
          className="fixed z-[99999] w-56 bg-[#111214] text-[#DBDEE1] text-xs font-medium rounded-[4px] shadow-2xl p-1.5 border border-[#232428] select-none animate-msg-enter"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* USER CONTEXT MENU */}
          {contextMenu.type === 'user' && contextMenu.target && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-2.5 p-2 bg-[#1E1F22] rounded-[4px] mb-1">
                <DiscordUserAvatar user={contextMenu.target} size={28} showStatus={true} />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-[#F2F3F5] truncate">
                    {contextMenu.target.display_name || contextMenu.target.username}
                  </span>
                  <span className="text-[10px] text-[#949BA4] font-mono leading-none mt-0.5">
                    {contextMenu.target.tag || '@' + contextMenu.target.username}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleOpenUserProfile(contextMenu.target, activeServerId);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Perfil</span>
                <Users size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveServerId('dms');
                  setActiveDmFriend(contextMenu.target);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Enviar Mensagem</span>
                <MessageSquare size={14} />
              </button>

              <button
                onClick={() => {
                  setMessageInput((prev) => `@${contextMenu.target.username} ` + prev);
                  setContextMenu(null);
                  inputRef.current?.focus();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Mencionar</span>
                <AtSign size={14} />
              </button>

              <button
                onClick={() => {
                  triggerToast(`Ligando para @${contextMenu.target.username}...`);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Ligar</span>
                <Phone size={14} />
              </button>

              {/* SERVER ROLES INTERACTIVE SUBMENU - ONLY IN SERVER CONTEXT */}
              {activeServerId !== 'dms' && currentServerData && (
                <>
                  <div className="my-1 h-[1px] bg-[#232428]" />
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#949BA4] flex items-center justify-between">
                    <span>Cargos no Servidor</span>
                    <Shield size={11} className="text-[#5865F2]" />
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-0.5 px-0.5 py-0.5">
                    {(!currentServerData.roles || currentServerData.roles.length === 0) ? (
                      <div className="px-2 py-1 text-[11px] text-[#80848E] italic">Nenhum cargo criado</div>
                    ) : (
                      currentServerData.roles.map((role) => {
                        const targetId = contextMenu.target.id || contextMenu.target.user_id;
                        const memberObj = currentServerData.members?.find((m) => m.id === targetId || m.user_id === targetId);
                        const hasRole = memberObj?.roles?.some((r) => (r.id || r.role_id) === role.id) || false;
                        const isOwner = currentServerData.server?.owner_id === currentUser?.id || activeServer?.owner_id === currentUser?.id;

                        return (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => {
                              if (isOwner) {
                                handleToggleMemberRoleGlobal(targetId, role.id, activeServerId);
                              } else {
                                triggerToast('Apenas Dono/Admin pode alterar cargos.');
                              }
                            }}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[3px] text-xs transition-colors ${
                              hasRole
                                ? 'bg-[#5865F2]/25 text-white font-semibold'
                                : 'text-[#DBDEE1] hover:bg-[#35373C]'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: role.color || '#99AAB5' }}
                              />
                              <span className="truncate">{role.name}</span>
                            </div>
                            {hasRole && <Check size={13} className="text-[#23A55A] flex-shrink-0" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (contextMenu.target.id) {
                    navigator.clipboard.writeText(String(contextMenu.target.id));
                    triggerToast('ID de Usuário Copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left"
              >
                <span>Copiar ID de Usuário</span>
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* MESSAGE CONTEXT MENU */}
          {contextMenu.type === 'message' && contextMenu.target && (
            <div className="space-y-0.5">
              {/* Quick reactions bar */}
              <div className="flex items-center justify-around p-1 bg-[#1E1F22] rounded-[4px] mb-1">
                {['👍', '❤️', '🔥', '😂', '🎉'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      if (socket && currentUser) {
                        socket.emit('toggle_reaction', {
                          messageId: contextMenu.target.id,
                          userId: currentUser.id,
                          emoji,
                          channelId: activeChannelId,
                        });
                      }
                      triggerToast(`Reagiu com ${emoji}`);
                      setContextMenu(null);
                    }}
                    className="p-1 hover:scale-125 transition-transform text-base"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setMessageInput((prev) => `Respondendo a @${contextMenu.target.author_username || 'User'}: ` + prev);
                  setContextMenu(null);
                  inputRef.current?.focus();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Responder</span>
                <CornerUpLeft size={14} />
              </button>

              <button
                onClick={() => {
                  if (contextMenu.target.text) {
                    navigator.clipboard.writeText(contextMenu.target.text);
                    triggerToast('Texto copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Copiar Texto</span>
                <Copy size={14} />
              </button>

              <button
                onClick={() => {
                  triggerToast('Mensagem fixada!');
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Fixar Mensagem</span>
                <Pin size={14} />
              </button>

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (contextMenu.target.id) {
                    navigator.clipboard.writeText(String(contextMenu.target.id));
                    triggerToast('ID da Mensagem Copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left"
              >
                <span>Copiar ID da Mensagem</span>
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* SERVER CONTEXT MENU */}
          {contextMenu.type === 'server' && contextMenu.target && (
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#F2F3F5] px-2.5 py-1.5 truncate border-b border-[#232428] mb-1">
                {contextMenu.target.name}
              </div>

              <button
                onClick={() => {
                  setNewChannelType('text');
                  setShowCreateChannelModal(true);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Criar Canal</span>
                <Plus size={14} />
              </button>

              <button
                onClick={() => {
                  setActiveServerId(contextMenu.target.id);
                  setShowServerSettingsModal(true);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Configurações do Servidor</span>
                <Settings size={14} />
              </button>

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (contextMenu.target.id) {
                    navigator.clipboard.writeText(String(contextMenu.target.id));
                    triggerToast('ID do Servidor Copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left"
              >
                <span>Copiar ID do Servidor</span>
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* CHANNEL CONTEXT MENU */}
          {contextMenu.type === 'channel' && contextMenu.target && (
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#F2F3F5] px-2.5 py-1.5 truncate border-b border-[#232428] mb-1">
                #{contextMenu.target.name}
              </div>

              <button
                onClick={() => {
                  triggerToast(`Editando canal #${contextMenu.target.name}`);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Editar Canal</span>
                <Edit3 size={14} />
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://orbitbr.app/channels/${contextMenu.target.id}`);
                  triggerToast('Link do Canal Copiado!');
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Copiar Link</span>
                <ExternalLink size={14} />
              </button>

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (contextMenu.target.id) {
                    navigator.clipboard.writeText(String(contextMenu.target.id));
                    triggerToast('ID do Canal Copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left"
              >
                <span>Copiar ID do Canal</span>
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* CATEGORY CONTEXT MENU */}
          {contextMenu.type === 'category' && contextMenu.target && (
            <div className="space-y-0.5">
              <div className="font-bold text-xs text-[#F2F3F5] px-2.5 py-1.5 truncate border-b border-[#232428] mb-1">
                📁 {contextMenu.target.name}
              </div>

              <button
                onClick={() => {
                  setTargetCategoryId(contextMenu.target.id);
                  setNewChannelType('text');
                  setShowCreateChannelModal(true);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Criar Canal</span>
                <Plus size={14} />
              </button>

              <button
                onClick={() => {
                  handleDeleteCategory(contextMenu.target.id);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#DA373C] hover:text-white text-[#F23F43] transition-colors text-left"
              >
                <span>Excluir Categoria</span>
                <Trash2 size={14} />
              </button>

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (contextMenu.target.id) {
                    navigator.clipboard.writeText(String(contextMenu.target.id));
                    triggerToast('ID da Categoria Copiado!');
                  }
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#35373C] text-[#949BA4] hover:text-white transition-colors text-left"
              >
                <span>Copiar ID da Categoria</span>
                <Copy size={13} />
              </button>
            </div>
          )}

          {/* GENERAL APP CONTEXT MENU (DEFAULT) */}
          {contextMenu.type === 'app' && (
            <div className="space-y-0.5">
              {/* Header Branding */}
              <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1E1F22] rounded-[4px] mb-1">
                <OrbitBrLogo size={24} />
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#F2F3F5] leading-tight">Orbit Br</span>
                  <span className="text-[10px] text-[#949BA4]">v1.0.0</span>
                </div>
              </div>

              {/* Status Section */}
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#949BA4] px-2 py-1">
                Mudar Status
              </div>

              <div className="grid grid-cols-2 gap-1 px-1 mb-1">
                {[
                  { id: 'online', name: 'Disponível', color: '#23A55A' },
                  { id: 'idle', name: 'Ausente', color: '#F0B232' },
                  { id: 'dnd', name: 'Ocupado', color: '#F23F43' },
                  { id: 'offline', name: 'Invisível', color: '#80848E' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      if (socket && currentUser) {
                        socket.emit('user_status_change', {
                          userId: currentUser.id,
                          status: st.id,
                        });
                        setCurrentUser((prev) => ({ ...prev, status: st.id }));
                      }
                      triggerToast(`Status definido para ${st.name}`);
                      setContextMenu(null);
                    }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-[2px] bg-[#1E1F22] hover:bg-[#5865F2] text-[11px] text-[#DBDEE1] hover:text-white transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: st.color }} />
                    <span className="truncate">{st.name}</span>
                  </button>
                ))}
              </div>

              <div className="my-1 h-[1px] bg-[#232428]" />

              <button
                onClick={() => {
                  if (currentUser) handleOpenUserProfile(currentUser, activeServerId);
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Meu Perfil</span>
                <Users size={14} />
              </button>

              <button
                onClick={() => {
                  handleOpenEditProfile();
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Editar Perfil</span>
                <Edit3 size={14} />
              </button>

              <button
                onClick={() => {
                  triggerToast('Orbit Br está atualizado (v1.0.0)');
                  setContextMenu(null);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Verificar Atualizações</span>
                <RefreshCw size={14} />
              </button>

              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] hover:bg-[#5865F2] hover:text-white transition-colors text-left"
              >
                <span>Recarregar Orbit Br</span>
                <RefreshCw size={14} />
              </button>

              {currentUser && (
                <>
                  <div className="my-1 h-[1px] bg-[#232428]" />
                  <button
                    onClick={() => {
                      handleLogout();
                      setContextMenu(null);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-[2px] text-[#F23F43] hover:bg-[#DA373C] hover:text-white transition-colors text-left"
                  >
                    <span>Sair</span>
                    <LogOut size={14} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. IMAGE LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {previewImageModal && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100000] flex items-center justify-center p-4 animate-msg-enter cursor-pointer"
          onClick={() => setPreviewImageModal(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Fechar Visualização"
            >
              <X size={20} />
            </button>
            <img
              src={previewImageModal}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-[4px] shadow-2xl object-contain"
            />
            <div className="mt-3 flex items-center gap-3">
              <a
                href={previewImageModal}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 rounded-[3px] bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <ExternalLink size={14} />
                <span>Abrir Original</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. FULLSCREEN SCREEN SHARE THEATER MODAL */}
      {/* ========================================================================= */}
      {fullscreenStream && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100000] flex flex-col p-4 animate-msg-enter select-none"
          onClick={() => setFullscreenStream(null)}
        >
          <div className="flex items-center justify-between mb-3 px-2" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-[3px] bg-[#F23F43] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                AO VIVO
              </span>
              <span className="text-sm font-bold text-[#F2F3F5]">
                Transmissão de {fullscreenStream.username} {fullscreenStream.isLocal ? '(Sua Tela)' : ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setFullscreenStream(null)}
                className="p-2 rounded-[4px] bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Sair da Tela Cheia"
              >
                <Minimize2 size={20} />
              </button>
            </div>
          </div>

          <div
            className="flex-1 rounded-[8px] overflow-hidden bg-black flex items-center justify-center border border-[#1F2023] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              autoPlay
              playsInline
              muted={fullscreenStream.isLocal}
              ref={(el) => {
                if (el && fullscreenStream.stream) el.srcObject = fullscreenStream.stream;
              }}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. USER PROFILE VIEWER MODAL */}
      {/* ========================================================================= */}
      {viewingUserProfile && (
        <DiscordUserProfileModal
          profileData={viewingUserProfile}
          currentUserId={currentUser?.id}
          activeServer={activeServerId !== 'dms' ? currentServerData : null}
          onClose={() => setViewingUserProfile(null)}
          onOpenEditProfile={handleOpenEditProfile}
          onSendMessage={(u) => {
            setActiveServerId('dms');
            setActiveDmFriend(u);
          }}
          onCallUser={(u) => {
            triggerToast(`Iniciando chamada com ${u.display_name || u.username}...`);
          }}
          onAddFriend={(u) => {
            setAddFriendInput(u.username);
            setFriendsTab('add_friend');
          }}
          onToggleMemberRole={(targetUserId, roleId) =>
            handleToggleMemberRoleGlobal(
              targetUserId,
              roleId,
              currentServerData?.server?.id || activeServerId
            )
          }
        />
      )}

      {/* ========================================================================= */}
      {/* 10.1 BOTTOM-LEFT USER DOCK POPOUT DRAWER (Screenshot 3) */}
      {/* ========================================================================= */}
      {showUserDockPopout && currentUser && (
        <DiscordUserDockPopout
          currentUser={currentUser}
          activeServer={activeServerId !== 'dms' ? currentServerData : null}
          connectedVoiceChannel={connectedVoiceChannelId ? channels.find((c) => c.id === connectedVoiceChannelId) : null}
          onClose={() => setShowUserDockPopout(false)}
          onOpenEditProfile={() => {
            setShowUserDockPopout(false);
            handleOpenEditProfile();
          }}
          onChangeStatus={(newStatus) => {
            if (socket) {
              socket.emit('user_status_change', { userId: currentUser.id, status: newStatus });
            }
            setCurrentUser((prev) => (prev ? { ...prev, status: newStatus } : prev));
            try {
              const saved = JSON.parse(localStorage.getItem('discord_user') || '{}');
              localStorage.setItem('discord_user', JSON.stringify({ ...saved, status: newStatus }));
            } catch (e) {}
            triggerToast(`Status alterado para: ${newStatus}`);
          }}
          onCopyId={() => {
            navigator.clipboard.writeText(String(currentUser.id));
            triggerToast('ID de Usuário copiado!');
          }}
          onLogout={handleLogout}
        />
      )}

      {/* ========================================================================= */}
      {/* 11. USER EDIT PROFILE SETTINGS MODAL */}
      {/* ========================================================================= */}
      {showEditProfileModal && currentUser && (
        <DiscordEditProfileModal
          currentUser={currentUser}
          servers={servers}
          onClose={() => setShowEditProfileModal(false)}
          onSaveProfile={handleSaveProfile}
          onSaveServerProfile={handleSaveServerProfile}
          isSaving={isSavingProfile}
        />
      )}

      {/* ========================================================================= */}
      {/* 12. DISCORD SERVER SETTINGS MODAL */}
      {/* ========================================================================= */}
      {showServerSettingsModal && (currentServerData?.server || activeServer) && (
        <DiscordServerSettingsModal
          server={currentServerData?.server || activeServer}
          currentUser={currentUser}
          onClose={() => setShowServerSettingsModal(false)}
          onServerUpdated={(updated) => {
            setCurrentServerData((prev) => ({
              ...prev,
              server: { ...prev?.server, ...updated }
            }));
            setServers((prev) =>
              prev.map((srv) => (srv.id === updated.id ? { ...srv, ...updated } : srv))
            );
          }}
          onServerDeleted={(sId) => {
            setServers((prev) => prev.filter((srv) => srv.id !== sId));
            setActiveServerId('dms');
            setCurrentServerData(null);
          }}
          triggerToast={triggerToast}
        />
      )}
    </div>
  );
}
