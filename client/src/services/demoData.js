// ============================================
// Demo Mode - client-side mock backend
// ============================================
// Lets visitors explore StackUp without a backend or login.
// When demo mode is ON:
//   - the axios adapter (see api.js) short-circuits every request
//     and returns realistic in-memory data instead of hitting /api
//   - the Socket.IO connection (see SocketContext.jsx) is stubbed
//     so team chat works locally (messages echo back instantly)
// Everything is in-memory: a page refresh resets the demo.

const DEMO_FLAG = 'demoMode';
const DEMO_TOKEN = 'demo-token';

export const isDemoMode = () => localStorage.getItem(DEMO_FLAG) === 'true';

export const enableDemoMode = () => {
    localStorage.setItem(DEMO_FLAG, 'true');
    localStorage.setItem('token', DEMO_TOKEN);
};

export const disableDemoMode = () => {
    localStorage.removeItem(DEMO_FLAG);
    localStorage.removeItem('token');
};

// ---------------------------------------------------------------
// Mock dataset (authentic Indian hackathon context)
// ---------------------------------------------------------------
const now = Date.now();
const ago = (ms) => new Date(now - ms).toISOString();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

const DEMO_USER_ID = 1;

const users = {
    1: { id: 1, name: 'Arjun Mehta', email: 'arjun.dev@gmail.com', college: 'IIT Delhi', skills: ['MERN Stack', 'Next.js', 'Docker', 'AWS'], bio: 'Final year CS student. Won 2 hackathons. Looking to build something in AgriTech for SIH 2024.', resumeUrl: null },
    2: { id: 2, name: 'Priya Sharma', email: 'priya.design@outlook.com', college: 'NID Ahmedabad', skills: ['Figma', 'Adobe XD', 'Protopie', 'Frontend'], bio: 'I turn complex problems into simple, beautiful, accessible interfaces.', resumeUrl: null },
    3: { id: 3, name: 'Rohan Verma', email: 'rohan.blockchain@yahoo.com', college: 'BITS Pilani', skills: ['Solidity', 'Ethers.js', 'Rust', 'Web3'], bio: 'Building decentralized apps on Polygon. Smart contracts are my thing.', resumeUrl: null },
    4: { id: 4, name: 'Ananya Iyer', email: 'ananya.ml@gmail.com', college: 'IIIT Hyderabad', skills: ['Python', 'TensorFlow', 'OpenCV', 'NLP'], bio: 'Researching Computer Vision for rural healthcare. Solving real Indian problems with AI.', resumeUrl: null },
    5: { id: 5, name: 'Vikram Singh', email: 'vikram.backend@gmail.com', college: 'NIT Trichy', skills: ['Go', 'Microservices', 'Kubernetes', 'Redis'], bio: 'Performance-obsessed backend engineer. I scale systems to millions of requests.', resumeUrl: null },
};

const leanCreator = (u) => ({ id: u.id, name: u.name, email: u.email, college: u.college });
const richCreator = (u) => ({ id: u.id, name: u.name, email: u.email, college: u.college, skills: u.skills, bio: u.bio });

let openings = [
    { id: 1, title: 'KisanConnect - Smart Mandi System', description: 'Problem Statement 1284 (SIH 2024): a blockchain-based supply chain app so farmers can sell directly to consumers, eliminating middlemen. Need a blockchain dev and a UI designer.', projectType: 'hackathon', requiredSkills: ['React Native', 'Solidity', 'Supply Chain'], totalSlots: 4, filledSlots: 1, creatorId: 1, status: 'open', createdAt: ago(2 * DAY) },
    { id: 2, title: 'RuralHealth AI - Diagnostics App', description: 'An offline-first mobile app using on-device ML to detect skin diseases in remote villages. Looking for an Android dev comfortable with TensorFlow Lite.', projectType: 'hackathon', requiredSkills: ['Flutter', 'TensorFlow Lite', 'SQLite'], totalSlots: 4, filledSlots: 2, creatorId: 4, status: 'open', createdAt: ago(5 * HOUR) },
    { id: 3, title: 'DeFi Lending Protocol', description: 'A decentralized peer-to-peer lending platform on Polygon. Core contracts ready, need a frontend dev to build the dashboard with RainbowKit + Wagmi.', projectType: 'hackathon', requiredSkills: ['React.js', 'Ethers.js', 'TailwindCSS'], totalSlots: 3, filledSlots: 2, creatorId: 3, status: 'open', createdAt: ago(1 * DAY) },
    { id: 4, title: 'EduSetu - Vernacular Learning', description: 'A gamified learning platform for tier-2/3 city students in local languages. Heavy focus on UX and engagement.', projectType: 'project', requiredSkills: ['MERN Stack', 'Gamification', 'UX'], totalSlots: 4, filledSlots: 2, creatorId: 2, status: 'open', createdAt: ago(3 * DAY) },
];

const withLeanCreator = (o) => ({ ...o, creator: leanCreator(users[o.creatorId]) });
const withRichCreator = (o) => ({ ...o, creator: richCreator(users[o.creatorId]) });
const findOpening = (id) => openings.find((o) => o.id === id);

// Arjun's own applications (My Applications tab) - nest opening.creator.name
let myApplications = [
    { id: 1, openingId: 2, applicantId: 1, message: 'I have shipped offline-first apps before and can help with TF Lite integration.', resumeUrl: null, status: 'pending', createdAt: ago(4 * HOUR), opening: { id: 2, title: 'RuralHealth AI - Diagnostics App', projectType: 'hackathon', status: 'open', creator: { id: 4, name: 'Ananya Iyer' } } },
    { id: 2, openingId: 3, applicantId: 1, message: 'Frontend dev with Wagmi/Ethers experience, happy to build the dashboard.', resumeUrl: null, status: 'accepted', createdAt: ago(1 * DAY), opening: { id: 3, title: 'DeFi Lending Protocol', projectType: 'hackathon', status: 'open', creator: { id: 3, name: 'Rohan Verma' } } },
];

// Applications received on Arjun's opening (#1) - owner view, with applicant detail
const richApplicant = (u, extra = {}) => ({ id: u.id, name: u.name, email: u.email, college: u.college, skills: u.skills, bio: u.bio, resumeUrl: u.resumeUrl, ...extra });
let openingApplications = {
    1: [
        { id: 3, openingId: 1, applicantId: 2, message: 'I can design the farmer-facing UI and the mandi dashboard.', resumeUrl: null, status: 'pending', createdAt: ago(1 * HOUR), applicant: richApplicant(users[2]) },
        { id: 4, openingId: 1, applicantId: 5, message: 'Backend + supply-chain logic is my strength. Count me in.', resumeUrl: null, status: 'pending', createdAt: ago(2 * HOUR), applicant: richApplicant(users[5]) },
    ],
};

const fullUser = (u) => ({ id: u.id, name: u.name, email: u.email, college: u.college, skills: u.skills, bio: u.bio });

// Teams (members are FULL user objects, as the frontend expects)
const buildTeam = (id, openingId, ownerId, memberIds) => {
    const o = findOpening(openingId);
    return {
        id,
        openingId,
        ownerId,
        owner: fullUser(users[ownerId]),
        members: memberIds.map((mid) => fullUser(users[mid])),
        opening: { id: o.id, title: o.title, description: o.description, projectType: o.projectType, status: o.status, requiredSkills: o.requiredSkills, totalSlots: o.totalSlots, filledSlots: o.filledSlots },
        createdAt: ago(2 * DAY),
    };
};

let teams = [
    buildTeam(1, 1, 1, [5]), // Arjun owns KisanConnect, Vikram is a member
    buildTeam(3, 3, 3, [1]), // Rohan owns DeFi, Arjun is a member
];
const myTeams = () => teams.filter((t) => t.ownerId === DEMO_USER_ID || t.members.some((m) => m.id === DEMO_USER_ID));
const findTeam = (id) => teams.find((t) => t.id === id);
const findTeamByOpening = (openingId) => teams.find((t) => t.openingId === openingId);

const sender = (u) => ({ id: u.id, name: u.name, email: u.email });
let messagesByTeam = {
    1: [
        { id: 'm1', teamId: 1, content: "Hey Arjun, excited for KisanConnect! I've set up the repo.", sender: sender(users[5]), readBy: [1, 5], createdAt: ago(3 * HOUR) },
        { id: 'm2', teamId: 1, content: "Awesome Vikram. Let's finalize the supply-chain schema today.", sender: sender(users[1]), readBy: [1, 5], createdAt: ago(2 * HOUR) },
        { id: 'm3', teamId: 1, content: 'Done, pushed the ER diagram. Take a look when free.', sender: sender(users[5]), readBy: [5], createdAt: ago(20 * MIN) },
    ],
    3: [
        { id: 'm4', teamId: 3, content: 'Welcome to the DeFi team, Arjun! 🎉', sender: sender(users[3]), readBy: [1, 3], createdAt: ago(1 * DAY) },
        { id: 'm5', teamId: 3, content: "Thanks Rohan! I'll start the dashboard with Wagmi this week.", sender: sender(users[1]), readBy: [1, 3], createdAt: ago(22 * HOUR) },
    ],
};

const chatStats = [
    { teamId: '1', unreadCount: 1, lastMessageTime: ago(20 * MIN) },
    { teamId: '3', unreadCount: 0, lastMessageTime: ago(22 * HOUR) },
];

let notifications = [
    { id: 1, userId: 1, type: 'application_received', message: 'Priya Sharma applied to your opening "KisanConnect - Smart Mandi System"', read: false, relatedId: 1, relatedModel: 'Opening', createdAt: ago(1 * HOUR) },
    { id: 2, userId: 1, type: 'application_accepted', message: 'Your application to "DeFi Lending Protocol" was accepted! 🎉', read: false, relatedId: 3, relatedModel: 'Team', createdAt: ago(3 * HOUR) },
    { id: 3, userId: 1, type: 'team_message', message: 'New message in the DeFi Lending Protocol team chat', read: true, relatedId: 3, relatedModel: 'Team', createdAt: ago(5 * HOUR) },
];

// ---------------------------------------------------------------
// Axios adapter: map (method, path) -> mock response
// ---------------------------------------------------------------
const safeParse = (d) => {
    if (!d) return {};
    if (typeof d === 'string') { try { return JSON.parse(d); } catch { return {}; } }
    return d;
};

export function demoAdapter(config) {
    const method = (config.method || 'get').toLowerCase();
    const path = (config.url || '').split('?')[0].replace(/\/+$/, '') || '/';
    const body = safeParse(config.data);

    const send = (payload) => Promise.resolve({
        data: payload,
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        request: {},
    });
    const env = (data, extra = {}) => send({ success: true, ...extra, data });

    const m = (re) => path.match(re);

    // ---- Auth ----
    if (path === '/auth/me' && method === 'get') return env(users[DEMO_USER_ID]);
    if (path === '/auth/login' && method === 'post') return send({ success: true, token: DEMO_TOKEN, data: users[DEMO_USER_ID] });
    if (path === '/auth/register' && method === 'post') return send({ success: true, token: DEMO_TOKEN, data: { ...users[DEMO_USER_ID], ...body } });
    if (path === '/auth/profile' && method === 'put') { Object.assign(users[DEMO_USER_ID], body); return env(users[DEMO_USER_ID]); }

    // ---- Openings ----
    if (path === '/openings/user/my' && method === 'get') {
        const mine = openings.filter((o) => o.creatorId === DEMO_USER_ID).map(withLeanCreator);
        return env(mine, { count: mine.length });
    }
    if (path === '/openings' && method === 'get') {
        const list = openings.map(withLeanCreator);
        return env(list, { count: list.length });
    }
    if (path === '/openings' && method === 'post') {
        const id = Math.max(0, ...openings.map((o) => o.id)) + 1;
        const created = { id, title: body.title || 'Untitled', description: body.description || '', projectType: body.projectType || 'project', requiredSkills: body.requiredSkills || [], totalSlots: Number(body.totalSlots) || 1, filledSlots: 0, creatorId: DEMO_USER_ID, status: 'open', createdAt: new Date().toISOString() };
        openings = [created, ...openings];
        teams = [buildTeam(id, id, DEMO_USER_ID, []), ...teams];
        return env(withLeanCreator(created));
    }
    let mm = m(/^\/openings\/(\d+)$/);
    if (mm) {
        const id = +mm[1];
        const o = findOpening(id) || openings[0];
        if (method === 'get') return env(withRichCreator(o));
        if (method === 'put') { Object.assign(o, body); return env(withLeanCreator(o)); }
        if (method === 'delete') { openings = openings.filter((x) => x.id !== id); return env({}); }
    }

    // ---- Applications ----
    if (path === '/applications/my' && method === 'get') return env(myApplications, { count: myApplications.length });
    if (path === '/applications' && method === 'post') {
        const o = findOpening(body.openingId);
        const created = { id: Math.floor(Math.random() * 100000), openingId: body.openingId, applicantId: DEMO_USER_ID, message: body.message || '', resumeUrl: body.resumeUrl || null, status: 'pending', createdAt: new Date().toISOString(), opening: o ? { id: o.id, title: o.title, projectType: o.projectType, status: o.status, creator: { id: o.creatorId, name: users[o.creatorId].name } } : null };
        myApplications = [created, ...myApplications];
        return env(created);
    }
    mm = m(/^\/applications\/opening\/(\d+)$/);
    if (mm && method === 'get') {
        const list = openingApplications[+mm[1]] || [];
        return env(list, { count: list.length });
    }
    mm = m(/^\/applications\/(\d+)\/(accept|reject)$/);
    if (mm && method === 'put') {
        const appId = +mm[1];
        const status = mm[2] === 'accept' ? 'accepted' : 'rejected';
        let found = null;
        Object.values(openingApplications).forEach((arr) => arr.forEach((a) => { if (a.id === appId) { a.status = status; found = a; } }));
        return env(found || { id: appId, status });
    }

    // ---- Teams ----
    if (path === '/teams/my' && method === 'get') { const t = myTeams(); return env(t, { count: t.length }); }
    mm = m(/^\/teams\/opening\/(\d+)$/);
    if (mm && method === 'get') return env(findTeamByOpening(+mm[1]) || null);
    mm = m(/^\/teams\/(\d+)$/);
    if (mm && method === 'get') return env(findTeam(+mm[1]) || teams[0]);

    // ---- Messages ----
    if (path === '/messages/stats' && method === 'get') return env(chatStats);
    mm = m(/^\/messages\/(\d+)$/);
    if (mm) {
        const tid = +mm[1];
        if (method === 'get') { const list = messagesByTeam[tid] || []; return env(list, { count: list.length }); }
        if (method === 'post') {
            const msg = { id: 'demo-' + Date.now(), teamId: tid, content: body.content, sender: sender(users[DEMO_USER_ID]), readBy: [DEMO_USER_ID], createdAt: new Date().toISOString() };
            messagesByTeam[tid] = [...(messagesByTeam[tid] || []), msg];
            return env(msg);
        }
    }

    // ---- Notifications ----
    if (path === '/notifications' && method === 'get') return env(notifications, { count: notifications.length, unreadCount: notifications.filter((n) => !n.read).length });
    mm = m(/^\/notifications\/(\d+)\/read$/);
    if (mm && method === 'put') { const n = notifications.find((x) => x.id === +mm[1]); if (n) n.read = true; return env(n || {}); }
    if (path === '/notifications/read-all' && method === 'put') { notifications.forEach((n) => { n.read = true; }); return send({ success: true, message: 'All notifications marked as read' }); }
    mm = m(/^\/notifications\/(\d+)$/);
    if (mm && method === 'delete') { notifications = notifications.filter((x) => x.id !== +mm[1]); return send({ success: true, message: 'Notification deleted' }); }

    // ---- Files ----
    if (path === '/files/upload' && method === 'post') return env({ filename: 'demo.pdf', originalName: 'demo.pdf', size: 0, mimetype: 'application/pdf', url: '#', path: '#' }, { message: 'Demo upload' });

    // Fallback: don't crash the UI on an unmapped route
    console.warn('[demo] unmapped route:', method.toUpperCase(), path);
    return env([]);
}

// ---------------------------------------------------------------
// Stub Socket.IO client for demo chat (echoes sent messages)
// ---------------------------------------------------------------
export function createDemoSocket() {
    const handlers = {};
    const fire = (ev, payload) => (handlers[ev] || []).forEach((h) => h(payload));
    return {
        connected: true,
        on(ev, cb) { (handlers[ev] = handlers[ev] || []).push(cb); },
        off(ev) { delete handlers[ev]; },
        emit(ev, payload) {
            if (ev === 'send-message') {
                const msg = {
                    id: 'demo-' + Date.now(),
                    teamId: payload.teamId,
                    content: payload.content,
                    sender: sender(users[DEMO_USER_ID]),
                    createdAt: new Date().toISOString(),
                    readBy: [DEMO_USER_ID],
                };
                setTimeout(() => fire('new-message', msg), 200);
            }
            // join-team / leave-team / typing / stop-typing / mark-messages-read -> no-op
        },
        disconnect() {},
    };
}
