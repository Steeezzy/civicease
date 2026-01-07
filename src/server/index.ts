import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Initialize Supabase Client (Service Role for Admin checks if needed, or Anon for verifying JWTs technically)
// For auth verification in middleware, we usually use the project URL and ANON key, 
// and then use the user's JWT to create a scoped client or just `getUser(token)`.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper to get Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- Auth Middleware ---
interface AuthRequest extends Request {
    user?: any; // Define proper type based on your User shape
}

const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }
        const token = authHeader.split(' ')[1];

        // 2. Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // 3. Attach user to request
        req.user = user;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(500).json({ error: 'Internal server error during auth' });
    }
};

// --- RBAC Middleware ---
const requireRole = (allowedRole: 'revenue_officer' | 'higher_official') => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            // Check profile for role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', req.user.id)
                .single();

            if (error || !profile) {
                return res.status(403).json({ error: 'Profile not found' });
            }

            // Simple hierarchy check: higher_official can access revenue_officer routes? 
            // strict check for now as per request "Role-based access"
            if (profile.role !== allowedRole && profile.role !== 'higher_official') {
                // Allowing higher_official to access lower roles if that makes sense, 
                // OR strict equality: params.allowedRole === profile.role
                if (profile.role !== allowedRole) {
                    return res.status(403).json({ error: `Access denied. Requires role: ${allowedRole}` });
                }
            }

            next();
        } catch (err) {
            console.error('RBAC Error:', err);
            res.status(500).json({ error: 'Internal server error during RBAC' });
        }
    };
};

// --- Routes ---
import citizenRouter from './routes/citizenRoutes';
import familyRouter from './routes/familyRoutes';

// Public Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', msg: 'Server is running' });
});

// Mount Routes (Protected)
app.use('/api/citizens', requireAuth, citizenRouter);
app.use('/api/families', requireAuth, familyRouter);

// Protected Route (Any authenticated user)
app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
    res.json({ user: req.user });
});

// Protected Route (Revenue Officer only)
app.post('/api/citizens', requireAuth, requireRole('revenue_officer'), (req, res) => {
    // Logic to add citizen...
    res.json({ msg: 'Citizen created successfully' });
});

// Protected Route (Higher Official only)
app.get('/api/admin/stats', requireAuth, requireRole('higher_official'), (req, res) => {
    res.json({ msg: 'Confidential stats for higher official' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
