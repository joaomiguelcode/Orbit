import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { query, pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 3001;

// Uploads directory
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Initialize Database Migrations
async function initDatabaseMigrations() {
  try {
    // Users table migrations
    await query(`ALTER TABLE users ADD COLUMN banner_url TEXT DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN pronouns VARCHAR(100) DEFAULT ''`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN badges TEXT DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN custom_status VARCHAR(255) DEFAULT ''`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN avatar_decoration VARCHAR(100) DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN theme_primary VARCHAR(20) DEFAULT '#5865F2'`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN theme_accent VARCHAR(20) DEFAULT '#EB459E'`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN custom_activity VARCHAR(255) DEFAULT ''`).catch(() => {});
    await query(`ALTER TABLE users ADD COLUMN connections TEXT DEFAULT NULL`).catch(() => {});

    // Servers table migrations
    await query(`ALTER TABLE servers ADD COLUMN banner_url TEXT DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN description TEXT DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN system_channel_id VARCHAR(50) DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN afk_channel_id VARCHAR(50) DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN afk_timeout INT DEFAULT 300`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN verification_level VARCHAR(20) DEFAULT 'none'`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN default_notifications VARCHAR(20) DEFAULT 'all'`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN explicit_content_filter VARCHAR(20) DEFAULT 'disabled'`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN is_public BOOLEAN DEFAULT TRUE`).catch(() => {});
    await query(`ALTER TABLE servers ADD COLUMN category VARCHAR(50) DEFAULT 'Geral'`).catch(() => {});

    // Server Roles table
    await query(`
      CREATE TABLE IF NOT EXISTS server_roles (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        color VARCHAR(20) DEFAULT '#99AAB5',
        hoist BOOLEAN DEFAULT FALSE,
        position INT DEFAULT 1,
        icon VARCHAR(50) DEFAULT NULL,
        mentionable BOOLEAN DEFAULT FALSE,
        permissions TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});
    await query(`ALTER TABLE server_roles ADD COLUMN icon VARCHAR(50) DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE server_roles ADD COLUMN position INT DEFAULT 1`).catch(() => {});
    await query(`ALTER TABLE server_roles ADD COLUMN mentionable BOOLEAN DEFAULT FALSE`).catch(() => {});

    // Member Roles Mapping table (Multi-role support)
    await query(`
      CREATE TABLE IF NOT EXISTS member_roles (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        role_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id),
        INDEX (user_id),
        UNIQUE KEY srv_user_role (server_id, user_id, role_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Server Specific Profiles (Server Nickname, Avatar, Banner, Bio)
    await query(`
      CREATE TABLE IF NOT EXISTS server_profiles (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        nickname VARCHAR(100) DEFAULT NULL,
        avatar_url TEXT DEFAULT NULL,
        banner_url TEXT DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id),
        INDEX (user_id),
        UNIQUE KEY srv_user_prof (server_id, user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Server Emojis table
    await query(`
      CREATE TABLE IF NOT EXISTS server_emojis (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        name VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Server Invites table
    await query(`
      CREATE TABLE IF NOT EXISTS server_invites (
        code VARCHAR(20) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        inviter_id VARCHAR(50) NOT NULL,
        uses INT DEFAULT 0,
        max_uses INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Server Audit Logs table
    await query(`
      CREATE TABLE IF NOT EXISTS server_audit_logs (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        user_id VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        details TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Server Categories table
    await query(`
      CREATE TABLE IF NOT EXISTS server_categories (
        id VARCHAR(50) PRIMARY KEY,
        server_id VARCHAR(50) NOT NULL,
        name VARCHAR(100) NOT NULL,
        is_private BOOLEAN DEFAULT FALSE,
        position INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (server_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `).catch(() => {});

    // Channels table migrations
    await query(`ALTER TABLE channels ADD COLUMN is_private BOOLEAN DEFAULT FALSE`).catch(() => {});
    await query(`ALTER TABLE channels ADD COLUMN category_id VARCHAR(50) DEFAULT NULL`).catch(() => {});
    await query(`ALTER TABLE channels MODIFY COLUMN type VARCHAR(50) DEFAULT 'text'`).catch(() => {});

    console.log('[DB] Enhanced database tables and migrations verified successfully.');
  } catch (e) {
    console.log('[DB] Migration log:', e.message);
  }
}
initDatabaseMigrations();

// Discord Avatar Colors
const DISCORD_AVATAR_COLORS = ['#5865F2', '#57F287', '#FEE75C', '#EB459E', '#ED4245'];

// ==========================================
// AUTHENTICATION & USER PROFILE ENDPOINTS
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { email, username, display_name, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username and password are required' });
  }

  const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '');
  const cleanDisplayName = (display_name || username).trim();
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Check if email or username already exists
    const [existing] = await query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [cleanEmail, cleanUsername]
    );

    if (existing) {
      return res.status(400).json({ error: 'Email or Username is already registered' });
    }

    const userId = `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const randomTag = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const avatarColor = DISCORD_AVATAR_COLORS[Math.floor(Math.random() * DISCORD_AVATAR_COLORS.length)];

    await query(
      `INSERT INTO users (id, email, username, display_name, password, tag, status, avatar_color, banner_color, bio, pronouns, custom_status)
       VALUES (?, ?, ?, ?, ?, ?, 'online', ?, ?, ?, ?, ?)`,
      [
        userId,
        cleanEmail,
        cleanUsername,
        cleanDisplayName,
        password,
        randomTag,
        avatarColor,
        avatarColor,
        'Olá! Estou usando o Orbit Br.',
        '',
        ''
      ]
    );

    const [user] = await query('SELECT id, email, username, display_name, tag, status, custom_status, avatar_color, avatar_url, banner_color, banner_url, bio, pronouns, badges, created_at FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      user,
      token: userId
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to create account in database' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: 'Login and password are required' });
  }

  const cleanLogin = login.trim().toLowerCase();

  try {
    const [user] = await query(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?',
      [cleanLogin, cleanLogin, password]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email/username or password' });
    }

    // Update status to online
    await query('UPDATE users SET status = "online" WHERE id = ?', [user.id]);
    delete user.password;

    res.json({
      success: true,
      user,
      token: user.id
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Current User State & Data (Servers, Friends, DMs)
app.get('/api/auth/me', async (req, res) => {
  const userId = req.headers['x-user-id'] || req.query.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const [user] = await query(
      'SELECT id, email, username, display_name, tag, status, custom_status, avatar_color, avatar_url, banner_color, banner_url, bio, pronouns, badges, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Fetch user's servers
    const servers = await query(
      `SELECT s.*, sm.role as member_role 
       FROM servers s
       JOIN server_members sm ON s.id = sm.server_id
       WHERE sm.user_id = ?
       ORDER BY s.created_at ASC`,
      [userId]
    );

    // Fetch user's friends
    const friends = await query(
      `SELECT u.id, u.username, u.display_name, u.tag, u.status, u.custom_status, u.avatar_color, u.avatar_url, u.banner_color, u.banner_url, u.bio, u.pronouns, f.status as friendship_status, f.requester_id
       FROM friendships f
       JOIN users u ON (f.user_id_1 = u.id OR f.user_id_2 = u.id) AND u.id != ?
       WHERE (f.user_id_1 = ? OR f.user_id_2 = ?)`,
      [userId, userId, userId]
    );

    res.json({
      success: true,
      user,
      servers,
      friends
    });
  } catch (err) {
    console.error('Auth me error:', err);
    res.status(500).json({ error: 'Failed to load user state' });
  }
});

// GET Detailed User Profile
app.get('/api/users/:userId/profile', async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.headers['x-user-id'] || req.query.currentUserId;
  const serverId = req.query.serverId;

  try {
    const [targetUser] = await query(
      'SELECT id, username, display_name, tag, status, custom_status, avatar_color, avatar_url, banner_color, banner_url, bio, pronouns, badges, avatar_decoration, theme_primary, theme_accent, custom_activity, connections, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (!targetUser) return res.status(404).json({ error: 'User not found' });

    // Check server membership & server profile if serverId provided
    let serverMemberInfo = null;
    let serverProfile = null;
    let assignedRoles = [];

    if (serverId && serverId !== 'dms') {
      const [sm] = await query(
        'SELECT role, joined_at FROM server_members WHERE server_id = ? AND user_id = ?',
        [serverId, userId]
      );
      if (sm) serverMemberInfo = sm;

      // Server specific profile
      const [sp] = await query(
        'SELECT nickname, avatar_url as server_avatar, banner_url as server_banner, bio as server_bio FROM server_profiles WHERE server_id = ? AND user_id = ?',
        [serverId, userId]
      );
      if (sp) serverProfile = sp;

      // Assigned server roles
      assignedRoles = await query(
        `SELECT sr.* 
         FROM member_roles mr
         JOIN server_roles sr ON mr.role_id = sr.id
         WHERE mr.server_id = ? AND mr.user_id = ?
         ORDER BY sr.position ASC, sr.created_at ASC`,
        [serverId, userId]
      );
    }

    // Mutual Servers
    let mutualServers = [];
    if (currentUserId && currentUserId !== userId) {
      mutualServers = await query(
        `SELECT s.id, s.name, s.icon_url 
         FROM servers s
         JOIN server_members sm1 ON s.id = sm1.server_id AND sm1.user_id = ?
         JOIN server_members sm2 ON s.id = sm2.server_id AND sm2.user_id = ?`,
        [currentUserId, userId]
      );
    }

    // Friendship Status
    let friendshipStatus = null;
    if (currentUserId && currentUserId !== userId) {
      const [fr] = await query(
        `SELECT status, requester_id FROM friendships 
         WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)`,
        [currentUserId, userId, userId, currentUserId]
      );
      if (fr) friendshipStatus = fr;
    }

    res.json({
      success: true,
      user: targetUser,
      serverMemberInfo,
      serverProfile,
      assignedRoles,
      mutualServers,
      friendshipStatus
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// UPDATE Global User Profile
app.put('/api/users/profile', async (req, res) => {
  const {
    userId,
    display_name,
    pronouns,
    bio,
    custom_status,
    avatar_url,
    avatar_color,
    banner_url,
    banner_color,
    avatar_decoration,
    theme_primary,
    theme_accent,
    custom_activity,
    badges,
    connections
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await query(
      `UPDATE users SET 
        display_name = COALESCE(?, display_name),
        pronouns = COALESCE(?, pronouns),
        bio = COALESCE(?, bio),
        custom_status = COALESCE(?, custom_status),
        avatar_url = ?,
        avatar_color = COALESCE(?, avatar_color),
        banner_url = ?,
        banner_color = COALESCE(?, banner_color),
        avatar_decoration = ?,
        theme_primary = COALESCE(?, theme_primary),
        theme_accent = COALESCE(?, theme_accent),
        custom_activity = COALESCE(?, custom_activity),
        badges = COALESCE(?, badges),
        connections = COALESCE(?, connections)
       WHERE id = ?`,
      [
        display_name?.trim() || null,
        pronouns?.trim() || '',
        bio !== undefined ? bio : null,
        custom_status !== undefined ? custom_status : null,
        avatar_url !== undefined ? (avatar_url || null) : null,
        avatar_color || '#5865F2',
        banner_url !== undefined ? (banner_url || null) : null,
        banner_color || '#5865F2',
        avatar_decoration !== undefined ? (avatar_decoration || null) : null,
        theme_primary || '#5865F2',
        theme_accent || '#EB459E',
        custom_activity !== undefined ? custom_activity : '',
        badges !== undefined ? badges : null,
        connections !== undefined ? (typeof connections === 'string' ? connections : JSON.stringify(connections)) : null,
        userId
      ]
    );

    const [updatedUser] = await query(
      'SELECT id, email, username, display_name, tag, status, custom_status, avatar_color, avatar_url, banner_color, banner_url, bio, pronouns, badges, avatar_decoration, theme_primary, theme_accent, custom_activity, connections, created_at FROM users WHERE id = ?',
      [userId]
    );

    // Broadcast update in real time to all clients
    io.emit('user_profile_updated', {
      userId,
      user: updatedUser
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// UPDATE Server-Specific Profile (Per-Server Nickname, Avatar, Banner, Bio)
app.put('/api/users/server-profile', async (req, res) => {
  const { userId, serverId, nickname, avatar_url, banner_url, bio } = req.body;
  if (!userId || !serverId) return res.status(400).json({ error: 'User ID and Server ID are required' });

  try {
    const profId = `sp_${serverId}_${userId}`;
    await query(
      `INSERT INTO server_profiles (id, server_id, user_id, nickname, avatar_url, banner_url, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        nickname = VALUES(nickname),
        avatar_url = VALUES(avatar_url),
        banner_url = VALUES(banner_url),
        bio = VALUES(bio)`,
      [profId, serverId, userId, nickname?.trim() || null, avatar_url || null, banner_url || null, bio || null]
    );

    const [updatedServerProf] = await query(
      'SELECT * FROM server_profiles WHERE server_id = ? AND user_id = ?',
      [serverId, userId]
    );

    io.emit('server_profile_updated', { serverId, userId, profile: updatedServerProf });

    res.json({ success: true, profile: updatedServerProf });
  } catch (err) {
    console.error('Update server profile error:', err);
    res.status(500).json({ error: 'Failed to update server profile' });
  }
});

// ==========================================
// SERVERS & CHANNELS ENDPOINTS
// ==========================================

// Create Server (Wizard)
app.post('/api/servers', async (req, res) => {
  const { name, icon_url, owner_id } = req.body;
  if (!name || !owner_id) {
    return res.status(400).json({ error: 'Server name and owner ID are required' });
  }

  const serverId = `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const memberId = `sm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const textChannelId = `ch_gen_${Date.now()}`;
  const voiceChannelId = `ch_voi_${Date.now()}`;

  try {
    // 1. Insert Server
    await query(
      'INSERT INTO servers (id, name, icon_url, owner_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [serverId, name.trim(), icon_url || null, owner_id]
    );

    // 2. Add owner as server member
    await query(
      'INSERT INTO server_members (id, server_id, user_id, role, joined_at) VALUES (?, ?, ?, "owner", NOW())',
      [memberId, serverId, owner_id]
    );

    // 3. Create default Text Channel
    await query(
      'INSERT INTO channels (id, server_id, name, topic, type, category, position) VALUES (?, ?, "general", "General chatter and discussion", "text", "TEXT CHANNELS", 1)',
      [textChannelId, serverId]
    );

    // 4. Create default Voice Channel
    await query(
      'INSERT INTO channels (id, server_id, name, topic, type, category, position) VALUES (?, ?, "General", "Voice lounge", "voice", "VOICE CHANNELS", 2)',
      [voiceChannelId, serverId]
    );

    // Fetch full server details
    const [serverData] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    const channels = await query('SELECT * FROM channels WHERE server_id = ? ORDER BY position ASC', [serverId]);
    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?`,
      [serverId]
    );

    io.emit('server_created', { server: serverData, channels, members, owner_id });

    res.json({
      success: true,
      server: serverData,
      channels,
      members
    });
  } catch (err) {
    console.error('Create server error:', err);
    res.status(500).json({ error: 'Failed to create server in database' });
  }
});

// Get Server Channels, Members & Voice Sessions
app.get('/api/servers/:serverId', async (req, res) => {
  const { serverId } = req.params;
  try {
    const [serverData] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    if (!serverData) return res.status(404).json({ error: 'Server not found' });

    const channels = await query('SELECT * FROM channels WHERE server_id = ? ORDER BY position ASC, created_at ASC', [serverId]);
    const categories = await query('SELECT * FROM server_categories WHERE server_id = ? ORDER BY position ASC, created_at ASC', [serverId]).catch(() => []);
    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC, created_at ASC', [serverId]);
    const memberRoles = await query(
      `SELECT mr.*, sr.name as role_name, sr.color as role_color, sr.hoist, sr.position as role_position, sr.icon as role_icon 
       FROM member_roles mr 
       JOIN server_roles sr ON mr.role_id = sr.id 
       WHERE mr.server_id = ? 
       ORDER BY sr.position ASC`,
      [serverId]
    );
    const serverProfiles = await query('SELECT * FROM server_profiles WHERE server_id = ?', [serverId]);

    const rawMembers = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.custom_status, u.avatar_color, u.avatar_url, u.avatar_decoration, u.bio
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?
       ORDER BY sm.joined_at ASC`,
      [serverId]
    );

    const members = rawMembers.map((m) => {
      const assigned = memberRoles.filter((mr) => mr.user_id === m.user_id || mr.user_id === m.id);
      const sp = serverProfiles.find((p) => p.user_id === m.user_id || p.user_id === m.id);
      const highestHoistRole = assigned.find((r) => r.hoist) || assigned[0] || null;

      return {
        ...m,
        nickname: sp?.nickname || m.display_name || m.username,
        server_avatar: sp?.avatar_url || m.avatar_url,
        server_banner: sp?.banner_url || null,
        server_bio: sp?.bio || m.bio,
        roles: assigned,
        highest_role: highestHoistRole,
        role_color: highestHoistRole?.role_color || null
      };
    });

    const voiceSessions = await query(`
      SELECT vs.*, u.username, u.display_name, u.status, u.avatar_color, u.avatar_url, u.avatar_decoration
      FROM voice_sessions vs
      JOIN users u ON vs.user_id = u.id
    `);

    res.json({
      success: true,
      server: serverData,
      channels,
      categories,
      roles,
      members,
      voiceSessions
    });
  } catch (err) {
    console.error('Get server error:', err);
    res.status(500).json({ error: 'Failed to load server data' });
  }
});

// Create Category inside Server
app.post('/api/servers/:serverId/categories', async (req, res) => {
  const { serverId } = req.params;
  const { name, is_private } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

  const categoryId = `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  try {
    await query(
      'INSERT INTO server_categories (id, server_id, name, is_private, position) VALUES (?, ?, ?, ?, 10)',
      [categoryId, serverId, name.trim(), is_private ? 1 : 0]
    );

    const [newCategory] = await query('SELECT * FROM server_categories WHERE id = ?', [categoryId]);
    io.emit('category_created', { serverId, category: newCategory });
    res.json({ success: true, category: newCategory });
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Delete Category
app.delete('/api/servers/:serverId/categories/:categoryId', async (req, res) => {
  const { serverId, categoryId } = req.params;
  try {
    await query('DELETE FROM server_categories WHERE id = ? AND server_id = ?', [categoryId, serverId]);
    await query('UPDATE channels SET category_id = NULL WHERE category_id = ? AND server_id = ?', [categoryId, serverId]);
    io.emit('category_deleted', { serverId, categoryId });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Create Channel inside Server
app.post('/api/servers/:serverId/channels', async (req, res) => {
  const { serverId } = req.params;
  const { name, topic, type, is_private, category_id, category } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Channel name is required' });

  const channelId = `ch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const validTypes = ['text', 'voice', 'forum', 'announcement', 'stage'];
  const channelType = validTypes.includes(type) ? type : 'text';
  const defaultCategory = channelType === 'voice' ? 'VOICE CHANNELS' : (channelType === 'stage' ? 'PALCO' : 'TEXT CHANNELS');
  const catName = category || defaultCategory;
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, '-');

  try {
    await query(
      'INSERT INTO channels (id, server_id, name, topic, type, category, category_id, is_private, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 10)',
      [channelId, serverId, cleanName, topic || '', channelType, catName, category_id || null, is_private ? 1 : 0]
    );

    const [newChannel] = await query('SELECT * FROM channels WHERE id = ?', [channelId]);
    io.emit('channel_created', newChannel);
    res.json({ success: true, channel: newChannel });
  } catch (err) {
    console.error('Create channel error:', err);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

// ==========================================
// DETAILED SERVER SETTINGS ENDPOINTS
// ==========================================

// Get Full Server Settings Bundle
app.get('/api/servers/:serverId/settings', async (req, res) => {
  const { serverId } = req.params;
  try {
    const [serverData] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    if (!serverData) return res.status(404).json({ error: 'Server not found' });

    const channels = await query('SELECT * FROM channels WHERE server_id = ? ORDER BY position ASC, created_at ASC', [serverId]);
    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url, u.created_at as user_created_at
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?
       ORDER BY sm.joined_at ASC`,
      [serverId]
    );

    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC, created_at ASC', [serverId]);
    const emojis = await query('SELECT * FROM server_emojis WHERE server_id = ? ORDER BY created_at DESC', [serverId]);
    const invites = await query('SELECT * FROM server_invites WHERE server_id = ? ORDER BY created_at DESC', [serverId]);
    const auditLogs = await query('SELECT * FROM server_audit_logs WHERE server_id = ? ORDER BY created_at DESC LIMIT 50', [serverId]);

    res.json({
      success: true,
      server: serverData,
      channels,
      members,
      roles,
      emojis,
      invites,
      auditLogs
    });
  } catch (err) {
    console.error('Get server settings error:', err);
    res.status(500).json({ error: 'Failed to load server settings' });
  }
});

// Update Server Overview Settings
app.put('/api/servers/:serverId', async (req, res) => {
  const { serverId } = req.params;
  const {
    name,
    icon_url,
    banner_url,
    description,
    system_channel_id,
    afk_channel_id,
    afk_timeout,
    verification_level,
    default_notifications,
    user_id
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Server name cannot be empty' });
  }

  try {
    await query(
      `UPDATE servers SET 
        name = ?,
        icon_url = ?,
        banner_url = ?,
        description = ?,
        system_channel_id = ?,
        afk_channel_id = ?,
        afk_timeout = ?,
        verification_level = ?,
        default_notifications = ?
       WHERE id = ?`,
      [
        name.trim(),
        icon_url !== undefined ? (icon_url || null) : null,
        banner_url !== undefined ? (banner_url || null) : null,
        description !== undefined ? (description || '') : '',
        system_channel_id || null,
        afk_channel_id || null,
        parseInt(afk_timeout || 300),
        verification_level || 'none',
        default_notifications || 'all',
        serverId
      ]
    );

    // Audit log
    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CONFIGURAÇÃO_ATUALIZADA', `Servidor "${name}" atualizado.`]
      );
    }

    const [updatedServer] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);

    io.emit('server_updated', { serverId, server: updatedServer });

    res.json({ success: true, server: updatedServer });
  } catch (err) {
    console.error('Update server error:', err);
    res.status(500).json({ error: 'Failed to update server' });
  }
});

// Delete Server
app.delete('/api/servers/:serverId', async (req, res) => {
  const { serverId } = req.params;
  const { user_id } = req.body;

  try {
    const [server] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    if (!server) return res.status(404).json({ error: 'Server not found' });

    if (user_id && server.owner_id !== user_id) {
      return res.status(403).json({ error: 'Only the server owner can delete this server' });
    }

    // Delete server dependencies
    await query('DELETE FROM messages WHERE channel_id IN (SELECT id FROM channels WHERE server_id = ?)', [serverId]);
    await query('DELETE FROM channels WHERE server_id = ?', [serverId]);
    await query('DELETE FROM server_members WHERE server_id = ?', [serverId]);
    await query('DELETE FROM server_roles WHERE server_id = ?', [serverId]);
    await query('DELETE FROM server_emojis WHERE server_id = ?', [serverId]);
    await query('DELETE FROM server_invites WHERE server_id = ?', [serverId]);
    await query('DELETE FROM server_audit_logs WHERE server_id = ?', [serverId]);
    await query('DELETE FROM servers WHERE id = ?', [serverId]);

    io.emit('server_deleted', { serverId });

    res.json({ success: true, message: 'Server deleted successfully' });
  } catch (err) {
    console.error('Delete server error:', err);
    res.status(500).json({ error: 'Failed to delete server' });
  }
});

// Create Server Role
app.post('/api/servers/:serverId/roles', async (req, res) => {
  const { serverId } = req.params;
  const { name, color, hoist, icon, permissions, user_id } = req.body;

  const roleId = `role_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const roleName = name?.trim() || 'Novo Cargo';

  try {
    await query(
      'INSERT INTO server_roles (id, server_id, name, color, hoist, icon, position, permissions) VALUES (?, ?, ?, ?, ?, ?, 10, ?)',
      [roleId, serverId, roleName, color || '#99AAB5', hoist ? 1 : 0, icon || null, permissions || 'ALL']
    );

    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CARGO_CRIADO', `Cargo "${roleName}" criado.`]
      );
    }

    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC', [serverId]);
    io.emit('server_roles_updated', { serverId, roles });

    res.json({ success: true, roleId, roles });
  } catch (err) {
    console.error('Create role error:', err);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// Update Server Role
app.put('/api/servers/:serverId/roles/:roleId', async (req, res) => {
  const { serverId, roleId } = req.params;
  const { name, color, hoist, icon, permissions, user_id } = req.body;

  try {
    const roleName = (name || 'Cargo').trim();
    await query(
      'UPDATE server_roles SET name = ?, color = ?, hoist = ?, icon = ?, permissions = ? WHERE id = ? AND server_id = ?',
      [roleName, color || '#99AAB5', hoist ? 1 : 0, icon || null, permissions || 'ALL', roleId, serverId]
    );

    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CARGO_ATUALIZADO', `Cargo "${roleName}" atualizado.`]
      );
    }

    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC', [serverId]);
    io.emit('server_roles_updated', { serverId, roles });

    res.json({ success: true, roles });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// Delete Server Role
app.delete('/api/servers/:serverId/roles/:roleId', async (req, res) => {
  const { serverId, roleId } = req.params;
  const { user_id } = req.body;

  try {
    await query('DELETE FROM server_roles WHERE id = ? AND server_id = ?', [roleId, serverId]);

    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CARGO_EXCLUÍDO', `Cargo ID ${roleId} removido.`]
      );
    }

    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC', [serverId]);
    io.emit('server_roles_updated', { serverId, roles });

    res.json({ success: true, roles });
  } catch (err) {
    console.error('Delete role error:', err);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// Reorder Server Roles (Hierarchy Drag & Drop)
app.put('/api/servers/:serverId/roles/order', async (req, res) => {
  const { serverId } = req.params;
  const { rolesOrder, user_id } = req.body;

  try {
    if (Array.isArray(rolesOrder)) {
      for (const item of rolesOrder) {
        await query('UPDATE server_roles SET position = ? WHERE id = ? AND server_id = ?', [
          item.position,
          item.id,
          serverId,
        ]);
      }
    }

    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CARGOS_REORDENADOS', 'Hierarquia de cargos atualizada.']
      );
    }

    const roles = await query('SELECT * FROM server_roles WHERE server_id = ? ORDER BY position ASC', [serverId]);
    io.emit('server_roles_updated', { serverId, roles });

    res.json({ success: true, roles });
  } catch (err) {
    console.error('Reorder roles error:', err);
    res.status(500).json({ error: 'Failed to reorder roles' });
  }
});

// Toggle Member Role (Assign or Remove Role from Member)
app.post('/api/servers/:serverId/members/:userId/roles/toggle', async (req, res) => {
  const { serverId, userId } = req.params;
  const { roleId, admin_id } = req.body;

  try {
    const [existing] = await query(
      'SELECT * FROM member_roles WHERE server_id = ? AND user_id = ? AND role_id = ?',
      [serverId, userId, roleId]
    );

    if (existing) {
      await query('DELETE FROM member_roles WHERE server_id = ? AND user_id = ? AND role_id = ?', [
        serverId,
        userId,
        roleId,
      ]);
    } else {
      const mrId = `mr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await query('INSERT INTO member_roles (id, server_id, user_id, role_id) VALUES (?, ?, ?, ?)', [
        mrId,
        serverId,
        userId,
        roleId,
      ]);
    }

    if (admin_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [
          `log_${Date.now()}`,
          serverId,
          admin_id,
          existing ? 'CARGO_REMOVIDO' : 'CARGO_ATRIBUÍDO',
          `Cargo ${roleId} ${existing ? 'removido de' : 'atribuído a'} membro ${userId}.`,
        ]
      );
    }

    // Fetch updated members list with roles
    const memberRoles = await query(
      `SELECT mr.*, sr.name as role_name, sr.color as role_color, sr.hoist, sr.position as role_position, sr.icon as role_icon 
       FROM member_roles mr 
       JOIN server_roles sr ON mr.role_id = sr.id 
       WHERE mr.server_id = ? 
       ORDER BY sr.position ASC`,
      [serverId]
    );
    const serverProfiles = await query('SELECT * FROM server_profiles WHERE server_id = ?', [serverId]);

    const rawMembers = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.custom_status, u.avatar_color, u.avatar_url, u.avatar_decoration, u.bio
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?
       ORDER BY sm.joined_at ASC`,
      [serverId]
    );

    const members = rawMembers.map((m) => {
      const assigned = memberRoles.filter((mr) => mr.user_id === m.user_id || mr.user_id === m.id);
      const sp = serverProfiles.find((p) => p.user_id === m.user_id || p.user_id === m.id);
      const highestHoistRole = assigned.find((r) => r.hoist) || assigned[0] || null;

      return {
        ...m,
        nickname: sp?.nickname || m.display_name || m.username,
        server_avatar: sp?.avatar_url || m.avatar_url,
        server_banner: sp?.banner_url || null,
        server_bio: sp?.bio || m.bio,
        roles: assigned,
        highest_role: highestHoistRole,
        role_color: highestHoistRole?.role_color || null
      };
    });

    io.emit('server_members_updated', { serverId, members });
    io.emit('server_member_roles_updated', { serverId, members });

    res.json({ success: true, members });
  } catch (err) {
    console.error('Toggle member role error:', err);
    res.status(500).json({ error: 'Failed to toggle member role' });
  }
});

// Create Server Custom Emoji
app.post('/api/servers/:serverId/emojis', async (req, res) => {
  const { serverId } = req.params;
  const { name, url, user_id } = req.body;
  if (!name || !url) return res.status(400).json({ error: 'Emoji name and URL are required' });

  const emojiId = `emj_${Date.now()}`;
  const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

  try {
    await query(
      'INSERT INTO server_emojis (id, server_id, name, url) VALUES (?, ?, ?, ?)',
      [emojiId, serverId, cleanName, url]
    );

    if (user_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'EMOJI_CRIADO', `Emoji :${cleanName}: adicionado.`]
      );
    }

    const emojis = await query('SELECT * FROM server_emojis WHERE server_id = ? ORDER BY created_at DESC', [serverId]);
    io.emit('server_emojis_updated', { serverId, emojis });

    res.json({ success: true, emojis });
  } catch (err) {
    console.error('Create emoji error:', err);
    res.status(500).json({ error: 'Failed to add emoji' });
  }
});

// Delete Server Emoji
app.delete('/api/servers/:serverId/emojis/:emojiId', async (req, res) => {
  const { serverId, emojiId } = req.params;
  try {
    await query('DELETE FROM server_emojis WHERE id = ? AND server_id = ?', [emojiId, serverId]);
    const emojis = await query('SELECT * FROM server_emojis WHERE server_id = ? ORDER BY created_at DESC', [serverId]);
    io.emit('server_emojis_updated', { serverId, emojis });
    res.json({ success: true, emojis });
  } catch (err) {
    console.error('Delete emoji error:', err);
    res.status(500).json({ error: 'Failed to delete emoji' });
  }
});

// Create / Get Server Invite Link
app.post('/api/servers/:serverId/invites', async (req, res) => {
  const { serverId } = req.params;
  const { inviter_id, force_new } = req.body;

  try {
    if (!force_new) {
      const [existing] = await query('SELECT * FROM server_invites WHERE server_id = ? ORDER BY created_at DESC LIMIT 1', [serverId]);
      if (existing) {
        return res.json({ success: true, invite: existing, code: existing.code });
      }
    }

    const inviteCode = `OB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await query(
      'INSERT INTO server_invites (code, server_id, inviter_id) VALUES (?, ?, ?)',
      [inviteCode, serverId, inviter_id || 'system']
    );

    const [newInvite] = await query('SELECT * FROM server_invites WHERE code = ?', [inviteCode]);
    res.json({ success: true, invite: newInvite, code: inviteCode });
  } catch (err) {
    console.error('Create invite error:', err);
    res.status(500).json({ error: 'Failed to create invite' });
  }
});

// Delete Invite Link
app.delete('/api/servers/:serverId/invites/:code', async (req, res) => {
  const { serverId, code } = req.params;
  try {
    await query('DELETE FROM server_invites WHERE server_id = ? AND code = ?', [serverId, code]);
    const invites = await query('SELECT * FROM server_invites WHERE server_id = ? ORDER BY created_at DESC', [serverId]);
    res.json({ success: true, invites });
  } catch (err) {
    console.error('Delete invite error:', err);
    res.status(500).json({ error: 'Failed to delete invite' });
  }
});

// Inspect Invite Code (Preview invite details)
app.get('/api/invites/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const [invite] = await query('SELECT * FROM server_invites WHERE code = ?', [code]);
    if (!invite) {
      return res.status(404).json({ error: 'Convite inválido ou expirado' });
    }

    const [server] = await query(`
      SELECT 
        s.*,
        u.username as owner_username,
        u.display_name as owner_display_name,
        (SELECT COUNT(*) FROM server_members WHERE server_id = s.id) as member_count,
        (SELECT COUNT(*) FROM server_members sm JOIN users usr ON sm.user_id = usr.id WHERE sm.server_id = s.id AND usr.status != 'offline') as online_count
      FROM servers s
      JOIN users u ON s.owner_id = u.id
      WHERE s.id = ?
    `, [invite.server_id]);

    if (!server) {
      return res.status(404).json({ error: 'Servidor associado ao convite não foi encontrado' });
    }

    const [inviter] = await query(
      'SELECT id, username, display_name, avatar_color, avatar_url FROM users WHERE id = ?',
      [invite.inviter_id]
    );

    res.json({
      success: true,
      invite,
      server,
      inviter: inviter || { id: 'system', username: 'Sistema', display_name: 'Orbit' }
    });
  } catch (err) {
    console.error('Inspect invite error:', err);
    res.status(500).json({ error: 'Erro ao verificar convite' });
  }
});

// Join Server via Invite Code
app.post('/api/invites/:code/join', async (req, res) => {
  const { code } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Usuário não autenticado' });
  }

  try {
    const [invite] = await query('SELECT * FROM server_invites WHERE code = ?', [code]);
    if (!invite) {
      return res.status(404).json({ error: 'Convite inválido ou expirado' });
    }

    const serverId = invite.server_id;
    const [existingMember] = await query(
      'SELECT * FROM server_members WHERE server_id = ? AND user_id = ?',
      [serverId, user_id]
    );

    if (!existingMember) {
      const memberId = `sm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await query(
        'INSERT INTO server_members (id, server_id, user_id, role, joined_at) VALUES (?, ?, ?, "member", NOW())',
        [memberId, serverId, user_id]
      );
      await query('UPDATE server_invites SET uses = uses + 1 WHERE code = ?', [code]).catch(() => {});
      
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'CONVITE_UTILIZADO', `Entrou no servidor pelo convite ${code}`]
      ).catch(() => {});
    }

    const [serverData] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    const channels = await query('SELECT * FROM channels WHERE server_id = ? ORDER BY position ASC', [serverId]);
    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?`,
      [serverId]
    );

    io.emit('server_members_updated', { serverId, members });

    res.json({
      success: true,
      server: serverData,
      channels,
      members,
      already_member: !!existingMember
    });
  } catch (err) {
    console.error('Join invite error:', err);
    res.status(500).json({ error: 'Falha ao entrar no servidor pelo convite' });
  }
});

// Discover Public Servers
app.get('/api/servers/discover', async (req, res) => {
  const { q, category } = req.query;

  try {
    let sql = `
      SELECT 
        s.id, 
        s.name, 
        s.icon_url, 
        s.banner_url, 
        s.description, 
        s.created_at,
        COALESCE(s.category, 'Geral') as category,
        (SELECT COUNT(*) FROM server_members WHERE server_id = s.id) as member_count,
        (SELECT COUNT(*) FROM server_members sm JOIN users u ON sm.user_id = u.id WHERE sm.server_id = s.id AND u.status != 'offline') as online_count,
        (SELECT COUNT(*) FROM channels WHERE server_id = s.id) as channel_count
      FROM servers s
      WHERE (s.is_public IS NULL OR s.is_public = 1)
    `;
    const params = [];

    if (category && category !== 'Todos') {
      sql += ' AND s.category = ?';
      params.push(category);
    }

    if (q && q.trim()) {
      sql += ' AND (s.name LIKE ? OR s.description LIKE ?)';
      params.push(`%${q.trim()}%`, `%${q.trim()}%`);
    }

    sql += ' ORDER BY member_count DESC, s.created_at DESC LIMIT 50';

    const servers = await query(sql, params);
    res.json({ success: true, servers });
  } catch (err) {
    console.error('Discover servers error:', err);
    res.status(500).json({ error: 'Falha ao buscar servidores públicos' });
  }
});

// Join Public Server Directly
app.post('/api/servers/:serverId/join', async (req, res) => {
  const { serverId } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Usuário não autenticado' });
  }

  try {
    const [serverData] = await query('SELECT * FROM servers WHERE id = ?', [serverId]);
    if (!serverData) {
      return res.status(404).json({ error: 'Servidor não encontrado' });
    }

    const [existingMember] = await query(
      'SELECT * FROM server_members WHERE server_id = ? AND user_id = ?',
      [serverId, user_id]
    );

    if (!existingMember) {
      const memberId = `sm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await query(
        'INSERT INTO server_members (id, server_id, user_id, role, joined_at) VALUES (?, ?, ?, "member", NOW())',
        [memberId, serverId, user_id]
      );
      
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, user_id, 'ENTROU_DESCOBERTA', 'Entrou pelo Descobrir Servidores']
      ).catch(() => {});
    }

    const channels = await query('SELECT * FROM channels WHERE server_id = ? ORDER BY position ASC', [serverId]);
    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?`,
      [serverId]
    );

    io.emit('server_members_updated', { serverId, members });

    res.json({
      success: true,
      server: serverData,
      channels,
      members,
      already_member: !!existingMember
    });
  } catch (err) {
    console.error('Join public server error:', err);
    res.status(500).json({ error: 'Falha ao entrar no servidor' });
  }
});

// Kick Member from Server
app.post('/api/servers/:serverId/members/:memberId/kick', async (req, res) => {
  const { serverId, memberId } = req.params;
  const { admin_id } = req.body;

  try {
    await query('DELETE FROM server_members WHERE server_id = ? AND (id = ? OR user_id = ?)', [serverId, memberId, memberId]);

    if (admin_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, admin_id, 'MEMBRO_EXPULSO', `Membro ${memberId} expulso.`]
      );
    }

    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?`,
      [serverId]
    );

    io.emit('server_members_updated', { serverId, members });

    res.json({ success: true, members });
  } catch (err) {
    console.error('Kick member error:', err);
    res.status(500).json({ error: 'Failed to kick member' });
  }
});

// Update Member Role in Server
app.put('/api/servers/:serverId/members/:memberId/role', async (req, res) => {
  const { serverId, memberId } = req.params;
  const { role, admin_id } = req.body;

  try {
    await query('UPDATE server_members SET role = ? WHERE server_id = ? AND (id = ? OR user_id = ?)', [role, serverId, memberId, memberId]);

    if (admin_id) {
      await query(
        'INSERT INTO server_audit_logs (id, server_id, user_id, action, details) VALUES (?, ?, ?, ?, ?)',
        [`log_${Date.now()}`, serverId, admin_id, 'CARGO_ATRIBUÍDO', `Cargo de ${memberId} alterado para "${role}".`]
      );
    }

    const members = await query(
      `SELECT sm.*, u.username, u.display_name, u.tag, u.status, u.avatar_color, u.avatar_url
       FROM server_members sm
       JOIN users u ON sm.user_id = u.id
       WHERE sm.server_id = ?`,
      [serverId]
    );

    io.emit('server_members_updated', { serverId, members });

    res.json({ success: true, members });
  } catch (err) {
    console.error('Update member role error:', err);
    res.status(500).json({ error: 'Failed to update member role' });
  }
});

// ==========================================
// MESSAGES & ATTACHMENTS
// ==========================================

// Channel Messages
app.get('/api/channels/:channelId/messages', async (req, res) => {
  const { channelId } = req.params;
  try {
    const messages = await query(
      `SELECT m.*, u.username as author_username, u.display_name as author_name, 
              u.tag as author_tag, u.avatar_color, u.avatar_url
       FROM messages m
       JOIN users u ON m.user_id = u.id
       WHERE m.channel_id = ?
       ORDER BY m.created_at ASC`,
      [channelId]
    );

    if (messages.length === 0) {
      return res.json({ success: true, messages: [] });
    }

    const messageIds = messages.map(m => m.id);
    const placeholders = messageIds.map(() => '?').join(',');

    const reactions = await query(
      `SELECT r.*, u.username as user_username
       FROM reactions r
       JOIN users u ON r.user_id = u.id
       WHERE r.message_id IN (${placeholders})`,
      messageIds
    );

    const reactionsByMsg = {};
    for (const r of reactions) {
      if (!reactionsByMsg[r.message_id]) reactionsByMsg[r.message_id] = {};
      if (!reactionsByMsg[r.message_id][r.emoji]) {
        reactionsByMsg[r.message_id][r.emoji] = { emoji: r.emoji, count: 0, users: [] };
      }
      reactionsByMsg[r.message_id][r.emoji].count += 1;
      reactionsByMsg[r.message_id][r.emoji].users.push(r.user_username);
    }

    const formatted = messages.map(m => ({
      ...m,
      reactions: reactionsByMsg[m.id] ? Object.values(reactionsByMsg[m.id]) : []
    }));

    res.json({ success: true, messages: formatted });
  } catch (err) {
    console.error('Fetch channel messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Upload File / Image
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    name: req.file.originalname,
    type: req.file.mimetype.startsWith('image/') ? 'image' : 'file',
    size: req.file.size
  });
});

// ==========================================
// FRIENDS & DIRECT MESSAGES
// ==========================================

// Send Friend Request
app.post('/api/friends/request', async (req, res) => {
  const { current_user_id, target_username } = req.body;
  if (!current_user_id || !target_username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const cleanTarget = target_username.trim().toLowerCase().replace(/^@/, '');

  try {
    const [targetUser] = await query(
      'SELECT id, username, display_name, tag, status, avatar_color FROM users WHERE username = ? OR CONCAT(username, tag) = ?',
      [cleanTarget, cleanTarget]
    );

    if (!targetUser) {
      return res.status(404).json({ error: "Hm, didn't work. Double check that the username is correct." });
    }

    if (targetUser.id === current_user_id) {
      return res.status(400).json({ error: 'You cannot add yourself as a friend!' });
    }

    // Check if already friends
    const [existing] = await query(
      'SELECT * FROM friendships WHERE (user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?)',
      [current_user_id, targetUser.id, targetUser.id, current_user_id]
    );

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ error: 'You are already friends with this user!' });
      }
      return res.status(400).json({ error: 'A friend request is already pending between you two.' });
    }

    const friendshipId = `fr_${Date.now()}`;
    await query(
      'INSERT INTO friendships (id, user_id_1, user_id_2, status, requester_id, created_at) VALUES (?, ?, ?, "pending", ?, NOW())',
      [friendshipId, current_user_id, targetUser.id, current_user_id]
    );

    io.emit('friend_request_sent', {
      fromUserId: current_user_id,
      toUserId: targetUser.id,
      friendship: { id: friendshipId, status: 'pending', requester_id: current_user_id }
    });

    res.json({ success: true, message: `Friend request sent to ${targetUser.display_name || targetUser.username}!` });
  } catch (err) {
    console.error('Friend request error:', err);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// Accept Friend Request
app.post('/api/friends/accept', async (req, res) => {
  const { current_user_id, friend_id } = req.body;
  try {
    await query(
      'UPDATE friendships SET status = "accepted" WHERE ((user_id_1 = ? AND user_id_2 = ?) OR (user_id_1 = ? AND user_id_2 = ?))',
      [current_user_id, friend_id, friend_id, current_user_id]
    );

    io.emit('friend_request_accepted', { userId1: current_user_id, userId2: friend_id });
    res.json({ success: true });
  } catch (err) {
    console.error('Accept friend error:', err);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});

// Get Direct Messages with a Friend
app.get('/api/dms/:friendId', async (req, res) => {
  const { friendId } = req.params;
  const currentUserId = req.headers['x-user-id'] || req.query.userId;
  if (!currentUserId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const messages = await query(
      `SELECT dm.*, u.username as author_username, u.display_name as author_name, u.avatar_color, u.avatar_url
       FROM direct_messages dm
       JOIN users u ON dm.sender_id = u.id
       WHERE (dm.sender_id = ? AND dm.receiver_id = ?) OR (dm.sender_id = ? AND dm.receiver_id = ?)
       ORDER BY dm.created_at ASC`,
      [currentUserId, friendId, friendId, currentUserId]
    );

    res.json({ success: true, messages });
  } catch (err) {
    console.error('Fetch DMs error:', err);
    res.status(500).json({ error: 'Failed to fetch direct messages' });
  }
});

// ==========================================
// SOCKET.IO REAL-TIME ENGINE
// ==========================================
io.on('connection', (socket) => {
  // Join Channel Room
  socket.on('join_channel', (channelId) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on('leave_channel', (channelId) => {
    socket.leave(`channel:${channelId}`);
  });

  // Send Message in Server Channel
  socket.on('send_channel_message', async (data) => {
    const { channelId, userId, text, attachmentUrl, attachmentName, attachmentType } = data;
    if (!channelId || !userId || (!text && !attachmentUrl)) return;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      await query(
        `INSERT INTO messages (id, channel_id, user_id, text, attachment_url, attachment_name, attachment_type, is_pinned, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, NOW())`,
        [messageId, channelId, userId, text || '', attachmentUrl || null, attachmentName || null, attachmentType || null]
      );

      const [fullMessage] = await query(
        `SELECT m.*, u.username as author_username, u.display_name as author_name, 
                u.tag as author_tag, u.avatar_color, u.avatar_url
         FROM messages m
         JOIN users u ON m.user_id = u.id
         WHERE m.id = ?`,
        [messageId]
      );

      fullMessage.reactions = [];
      io.emit('new_channel_message', fullMessage);
    } catch (err) {
      console.error('Socket send_channel_message error:', err);
    }
  });

  // Send Direct Message
  socket.on('send_direct_message', async (data) => {
    const { senderId, receiverId, text, attachmentUrl } = data;
    if (!senderId || !receiverId || !text) return;

    const dmId = `dm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    try {
      await query(
        'INSERT INTO direct_messages (id, sender_id, receiver_id, text, attachment_url, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [dmId, senderId, receiverId, text, attachmentUrl || null]
      );

      const [fullDm] = await query(
        `SELECT dm.*, u.username as author_username, u.display_name as author_name, u.avatar_color, u.avatar_url
         FROM direct_messages dm
         JOIN users u ON dm.sender_id = u.id
         WHERE dm.id = ?`,
        [dmId]
      );

      io.emit('new_direct_message', fullDm);
    } catch (err) {
      console.error('Socket send_direct_message error:', err);
    }
  });

  // Toggle Reaction
  socket.on('toggle_reaction', async ({ messageId, userId, emoji, channelId }) => {
    try {
      const [existing] = await query(
        'SELECT id FROM reactions WHERE message_id = ? AND user_id = ? AND emoji = ?',
        [messageId, userId, emoji]
      );

      if (existing) {
        await query('DELETE FROM reactions WHERE id = ?', [existing.id]);
      } else {
        const reactionId = `r_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await query(
          'INSERT INTO reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)',
          [reactionId, messageId, userId, emoji]
        );
      }

      const reactions = await query(
        `SELECT r.*, u.username as user_username
         FROM reactions r
         JOIN users u ON r.user_id = u.id
         WHERE r.message_id = ?`,
        [messageId]
      );

      const reactionsGrouped = {};
      for (const r of reactions) {
        if (!reactionsGrouped[r.emoji]) {
          reactionsGrouped[r.emoji] = { emoji: r.emoji, count: 0, users: [] };
        }
        reactionsGrouped[r.emoji].count += 1;
        reactionsGrouped[r.emoji].users.push(r.user_username);
      }

      io.emit('reaction_updated', {
        messageId,
        channelId,
        reactions: Object.values(reactionsGrouped)
      });
    } catch (err) {
      console.error('Socket toggle_reaction error:', err);
    }
  });

  // Typing
  socket.on('typing_start', ({ channelId, username }) => {
    socket.to(`channel:${channelId}`).emit('user_typing_start', { channelId, username });
  });

  socket.on('typing_stop', ({ channelId, username }) => {
    socket.to(`channel:${channelId}`).emit('user_typing_stop', { channelId, username });
  });

  // WebRTC Voice Channels Engine
  socket.on('voice_join', async ({ channelId, userId, isMuted, isDeafened }) => {
    socket.join(`voice:${channelId}`);
    socket.data.voiceChannelId = channelId;
    socket.data.userId = userId;

    try {
      await query('DELETE FROM voice_sessions WHERE user_id = ?', [userId]);
      const sessionKey = `vs_${userId}_${channelId}`;
      await query(
        `INSERT INTO voice_sessions (id, channel_id, user_id, is_speaking, is_muted, is_deafened)
         VALUES (?, ?, ?, FALSE, ?, ?)
         ON DUPLICATE KEY UPDATE channel_id = VALUES(channel_id), is_muted = VALUES(is_muted), is_deafened = VALUES(is_deafened)`,
        [sessionKey, channelId, userId, !!isMuted, !!isDeafened]
      );

      // Get existing sockets in this voice room (except current socket)
      const socketsInRoom = await io.in(`voice:${channelId}`).fetchSockets();
      const existingPeers = socketsInRoom
        .filter((s) => s.id !== socket.id && s.data.userId)
        .map((s) => ({ socketId: s.id, userId: s.data.userId }));

      socket.emit('voice_existing_peers', { peers: existingPeers, channelId });

      // Notify others in room
      socket.to(`voice:${channelId}`).emit('voice_peer_joined', {
        socketId: socket.id,
        userId
      });

      // Broadcast updated sessions to everyone
      const sessions = await query(`
        SELECT vs.*, u.username, u.display_name, u.status, u.avatar_color, u.avatar_url
        FROM voice_sessions vs
        JOIN users u ON vs.user_id = u.id
      `);
      io.emit('voice_sessions_updated', sessions);
    } catch (err) {
      console.error('voice_join error:', err);
    }
  });

  // WebRTC Signaling Relay
  socket.on('voice_offer', ({ toSocketId, offer, fromUserId }) => {
    io.to(toSocketId).emit('voice_offer', {
      fromSocketId: socket.id,
      fromUserId,
      offer
    });
  });

  socket.on('voice_answer', ({ toSocketId, answer, fromUserId }) => {
    io.to(toSocketId).emit('voice_answer', {
      fromSocketId: socket.id,
      fromUserId,
      answer
    });
  });

  socket.on('voice_ice_candidate', ({ toSocketId, candidate }) => {
    io.to(toSocketId).emit('voice_ice_candidate', {
      fromSocketId: socket.id,
      candidate
    });
  });

  // Voice Leave
  socket.on('voice_leave', async ({ userId }) => {
    const channelId = socket.data.voiceChannelId;
    if (channelId) {
      socket.leave(`voice:${channelId}`);
      socket.to(`voice:${channelId}`).emit('voice_peer_left', {
        socketId: socket.id,
        userId: userId || socket.data.userId
      });
      socket.data.voiceChannelId = null;
    }

    try {
      const uId = userId || socket.data.userId;
      if (uId) {
        await query('DELETE FROM voice_sessions WHERE user_id = ?', [uId]);
        const sessions = await query(`
          SELECT vs.*, u.username, u.display_name, u.status, u.avatar_color, u.avatar_url
          FROM voice_sessions vs
          JOIN users u ON vs.user_id = u.id
        `);
        io.emit('voice_sessions_updated', sessions);
      }
    } catch (err) {
      console.error('voice_leave error:', err);
    }
  });

  socket.on('voice_speaking_change', async ({ userId, isSpeaking }) => {
    try {
      await query('UPDATE voice_sessions SET is_speaking = ? WHERE user_id = ?', [isSpeaking, userId]);
      io.emit('voice_speaking_updated', { userId, isSpeaking });
    } catch (err) {
      console.error('voice_speaking_change error:', err);
    }
  });

  socket.on('voice_mute_change', async ({ userId, isMuted, isDeafened }) => {
    try {
      await query('UPDATE voice_sessions SET is_muted = ?, is_deafened = ? WHERE user_id = ?', [
        !!isMuted,
        !!isDeafened,
        userId
      ]);
      const sessions = await query(`
        SELECT vs.*, u.username, u.display_name, u.status, u.avatar_color, u.avatar_url
        FROM voice_sessions vs
        JOIN users u ON vs.user_id = u.id
      `);
      io.emit('voice_sessions_updated', sessions);
    } catch (err) {
      console.error('voice_mute_change error:', err);
    }
  });

  socket.on('voice_screenshare_start', ({ channelId, userId, username }) => {
    socket.to(`voice:${channelId}`).emit('voice_screenshare_started', {
      socketId: socket.id,
      userId,
      username
    });
  });

  socket.on('voice_screenshare_stop', ({ channelId, userId }) => {
    socket.to(`voice:${channelId}`).emit('voice_screenshare_stopped', {
      socketId: socket.id,
      userId
    });
  });

  socket.on('user_status_change', async ({ userId, status }) => {
    try {
      await query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
      io.emit('user_status_updated', { userId, status });
    } catch (err) {
      console.error('user_status_change error:', err);
    }
  });

  socket.on('disconnect', async () => {
    const channelId = socket.data.voiceChannelId;
    const userId = socket.data.userId;

    if (channelId && userId) {
      socket.to(`voice:${channelId}`).emit('voice_peer_left', {
        socketId: socket.id,
        userId
      });
      try {
        await query('DELETE FROM voice_sessions WHERE user_id = ?', [userId]);
        const sessions = await query(`
          SELECT vs.*, u.username, u.display_name, u.status, u.avatar_color, u.avatar_url
          FROM voice_sessions vs
          JOIN users u ON vs.user_id = u.id
        `);
        io.emit('voice_sessions_updated', sessions);
      } catch (err) {
        console.error('Disconnect voice cleanup error:', err);
      }
    }
  });
});

// Serve frontend static files from dist folder if built
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/socket.io')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Discord Replica Backend running at http://localhost:${PORT}`);
  console.log(`📊 Connected to MariaDB database: orbit_db (Clean Zero-State)`);
});
