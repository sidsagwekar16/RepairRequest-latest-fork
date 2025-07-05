import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";

// Check if Google credentials are available
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  // Determine if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  console.log("Session configuration - isDevelopment:", isDevelopment, "NODE_ENV:", process.env.NODE_ENV);
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Force false for Replit deployment compatibility
      maxAge: sessionTtl,
      sameSite: 'lax', // Use lax for better OAuth compatibility
      domain: undefined, // Let browser handle domain automatically
    },
  });
}

// Email access control for the application
function isAllowedEmail(email: string | null | undefined): boolean {
  // Allow all emails - Google OAuth will manage user access
  if (!email) return false;
  return true;
}

// Determine organization based on email domain
async function determineOrganization(email: string): Promise<number> {
  // Super admins belong to SchoolHouse Logistics
  const superAdminEmails = [
    "fluxincltc@gmail.com",
    "deshdeepakbajpai8@gmail.com"
  ];
  
  // Canterbury School test users
  const canterburyTestUsers = [
    "carstensphysics@gmail.com",
    "jeffemail111@gmail.com"
  ];
  
  if (superAdminEmails.includes(email.toLowerCase())) {
    const schoolhouseOrg = await storage.getOrganizationBySlug('schoolhouse-logistics');
    if (schoolhouseOrg) {
      return schoolhouseOrg.id;
    }
  }
  
  // Canterbury School test users go to Canterbury
  if (canterburyTestUsers.includes(email.toLowerCase())) {
    const canterburyOrg = await storage.getOrganizationBySlug('canterbury');
    if (canterburyOrg) {
      return canterburyOrg.id;
    }
  }
  
  const domain = email.split('@')[1];
  
  // Try to find organization by domain
  const orgByDomain = await storage.getOrganizationByDomain(domain);
  if (orgByDomain) {
    return orgByDomain.id;
  }
  
  // Default to Canterbury School organization for regular users
  const canterburyOrg = await storage.getOrganizationBySlug('canterbury');
  if (canterburyOrg) {
    return canterburyOrg.id;
  }
  
  // Fallback to organization ID 1
  return 1;
}

// Determine user role based on email address
function determineUserRole(email: string): string {
  // Super admin emails for multi-tenant management
  const superAdminEmails = [
    "jeffacarstens@gmail.com",
    "info@schoolhouselogistics.com"
  ];
  
  // Canterbury School specific admins
  const canterburyAdminEmails = [
    "carstensphysics@gmail.com"
  ];
  
  // Canterbury School regular users
  const canterburyUserEmails = [
    "jeffemail111@gmail.com"
  ];
  
  // Check for admin emails from environment variables or common patterns
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
  
  // Common maintenance staff email prefixes
  const maintenanceStaffPrefixes = [
    "maintenance",
    "facility", 
    "facilities",
    "custodian",
    "grounds",
    "admin"
  ];
  
  // Default role for all users
  let role = "requester";
  
  if (superAdminEmails.includes(email.toLowerCase())) {
    // Super administrators for multi-tenant management
    role = "super_admin";
  } else if (canterburyAdminEmails.includes(email.toLowerCase())) {
    // Canterbury School administrators
    role = "admin";
  } else if (canterburyUserEmails.includes(email.toLowerCase())) {
    // Canterbury School regular users
    role = "requester";
  } else if (adminEmails.includes(email.toLowerCase())) {
    // Explicitly defined administrators
    role = "admin";
  } else if (maintenanceStaffPrefixes.some(prefix => 
    email.toLowerCase().startsWith(prefix))) {
    // Maintenance staff based on email prefix
    role = "maintenance";
  }
  
  console.log(`Assigned role ${role} to ${email}`);
  return role;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Google Strategy for authentication
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Dynamically determine callback URL based on environment
  let callbackURL;
  if (process.env.REPLIT_DOMAINS) {
    // For Replit deployments - use the primary domain
    const domain = process.env.REPLIT_DOMAINS.split(',')[0];
    callbackURL = `https://${domain}/api/auth/callback/google`;
  } else if (isDevelopment) {
    // Local development
    callbackURL = "http://localhost:5000/api/auth/callback/google";
  } else {
    // Production fallback - check for production domain
    const prodDomain = process.env.PRODUCTION_DOMAIN || "repairrequest.org";
    
    // Handle case where PRODUCTION_DOMAIN might already include protocol
    let cleanDomain = prodDomain;
    if (prodDomain.startsWith('https://')) {
      cleanDomain = prodDomain.replace('https://', '');
    } else if (prodDomain.startsWith('http://')) {
      cleanDomain = prodDomain.replace('http://', '');
    }
    
    callbackURL = `https://${cleanDomain}/api/auth/callback/google`;
  }
  
  console.log("Environment check:");
  console.log("- REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS);
  console.log("- NODE_ENV:", process.env.NODE_ENV);
  console.log("- isDevelopment:", isDevelopment);
  
  console.log("Using Google callback URL:", callbackURL);
  console.log("Callback URL length:", callbackURL.length);
  console.log("Full callback URL breakdown:");
  console.log("- Protocol: https://");
  console.log("- Domain:", callbackURL.split('/')[2]);
  console.log("- Path: /api/auth/callback/google");
    
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: callbackURL,
    scope: ["profile", "email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Google OAuth callback processing started");
      console.log("Profile received:", {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails?.map(e => e.value)
      });
      
      // Extract user information from Google profile
      const email = profile.emails?.[0]?.value;
      
      // Always log the login attempt
      console.log(`Google login attempt from: ${email}`);
      
      if (!email) {
        console.warn("No email provided in Google profile");
        return done(new Error("Email is required for authentication"));
      }
      
      // Check if email is allowed
      if (!isAllowedEmail(email)) {
        console.warn(`Access denied for email: ${email}`);
        return done(new Error("Access denied. Email authentication failed."));
      }
      
      // Determine user role and organization
      const role = determineUserRole(email);
      const organizationId = await determineOrganization(email);
      
      console.log(`Creating/updating user: ${email}, role: ${role}, org: ${organizationId}`);
      
      // Create or update user in the database
      const user = await storage.upsertUser({
        id: profile.id,
        email: email,
        firstName: profile.name?.givenName || "",
        lastName: profile.name?.familyName || "",
        profileImageUrl: profile.photos?.[0]?.value || null,
        role: role,
        organizationId: organizationId
      });
      
      console.log("User created/updated successfully:", { id: user.id, email: user.email, role: user.role });
      
      // Return the user for serialization
      return done(null, user);
    } catch (error) {
      console.error("Error in Google authentication:", error);
      return done(error as Error);
    }
  }));

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    console.log("Serializing user to session:", user.id);
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("=== DESERIALIZING USER FROM SESSION ===");
      console.log("User ID to deserialize:", id);
      console.log("ID type:", typeof id);
      console.log("ID length:", id?.length);
      
      // Attempt to get user from database
      const user = await storage.getUser(id);
      
      if (user) {
        console.log("User successfully deserialized:", { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          organizationId: user.organizationId
        });
        done(null, user);
      } else {
        console.log("Primary lookup failed, trying fallback methods...");
        done(null, false);
      }
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(error);
    }
  });

  // Login route - initiates Google OAuth flow
  app.get("/api/login", (req, res) => {
    console.log("Login request received, redirecting to Google OAuth");
    console.log("Session ID:", req.sessionID);
    console.log("Session data:", req.session);
    
    // Store the session ID for debugging
    console.log("Storing session ID for OAuth flow:", req.sessionID);
    
    passport.authenticate("google", { 
      scope: ["profile", "email"],
      state: req.sessionID // Include session ID in state for tracking
    })(req, res);
  });

  // Test route to verify OAuth callback route is accessible
  app.get("/api/auth/test-callback", (req, res) => {
    console.log("TEST CALLBACK ROUTE HIT - OAuth routing is working");
    res.json({ message: "OAuth callback route is accessible", timestamp: new Date().toISOString() });
  });

  // Debug route to manually test user authentication
  app.get("/api/auth/debug-login/:email", async (req, res) => {
    try {
      const email = req.params.email;
      console.log("Debug login attempt for email:", email);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      console.log("Found user for debug login:", user);
      
      // Manually log in the user
      req.logIn(user, (err) => {
        if (err) {
          console.error("Debug login failed:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        
        console.log("Debug login successful");
        res.json({ 
          message: "Debug login successful", 
          user: { id: user.id, email: user.email, role: user.role },
          sessionId: req.sessionID
        });
      });
    } catch (error) {
      console.error("Debug login error:", error);
      res.status(500).json({ error: "Debug login failed" });
    }
  });

  // Google OAuth callback route with enhanced error handling
  app.get("/api/auth/callback/google", (req, res, next) => {
    console.log("=== GOOGLE OAUTH CALLBACK RECEIVED ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Query params:", req.query);
    console.log("User-Agent:", req.headers['user-agent']);
    console.log("Referer:", req.headers['referer']);
    console.log("Session ID:", req.sessionID);
    console.log("Session before auth:", JSON.stringify(req.session, null, 2));
    console.log("Is authenticated before:", req.isAuthenticated());
    console.log("Cookies:", req.headers.cookie);
    
    // Check if this is an error callback from Google
    if (req.query.error) {
      console.error("Google OAuth error:", req.query.error);
      console.error("Error description:", req.query.error_description);
      console.error("Error URI:", req.query.error_uri);
      return res.redirect("/?error=oauth_error");
    }
    
    // Check if we have an authorization code
    if (!req.query.code) {
      console.error("No authorization code received from Google");
      console.error("All query params:", req.query);
      return res.redirect("/?error=no_code");
    }
    
    console.log("Authorization code received (first 10 chars):", (req.query.code as string)?.substring(0, 10) + "...");
    console.log("State parameter:", req.query.state);
    
    passport.authenticate("google", { 
      failureRedirect: "/?error=passport_failure"
    }, (err: any, user: any, info: any) => {
      console.log("=== PASSPORT AUTHENTICATE CALLBACK ===");
      console.log("Callback timestamp:", new Date().toISOString());
      console.log("Error:", err);
      console.log("User:", user ? { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        organizationId: user.organizationId 
      } : null);
      console.log("Info:", info);
      
      if (err) {
        console.error("Authentication error details:", err);
        console.error("Error type:", err.constructor.name);
        console.error("Error stack:", err.stack);
        return res.redirect("/?error=auth_failed&details=" + encodeURIComponent(err.message));
      }
      
      if (!user) {
        console.error("Authentication failed - no user returned");
        console.error("Info details:", info);
        return res.redirect("/?error=no_user&info=" + encodeURIComponent(JSON.stringify(info || {})));
      }
      
      console.log("User received from passport, attempting login...");
      console.log("Session ID during login:", req.sessionID);
      
      req.logIn(user, (err: any) => {
        if (err) {
          console.error("Login error details:", err);
          console.error("Login error type:", err.constructor.name);
          return res.redirect("/?error=login_failed&details=" + encodeURIComponent(err.message));
        }
        
        console.log("=== LOGIN SUCCESSFUL ===");
        console.log("Login timestamp:", new Date().toISOString());
        console.log("User successfully logged in:", { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          organizationId: user.organizationId
        });
        console.log("Session after login:", JSON.stringify(req.session, null, 2));
        console.log("Is authenticated after:", req.isAuthenticated());
        console.log("Final session ID:", req.sessionID);
        
        // Force session save before redirect
        req.session.save((saveErr) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
          } else {
            console.log("Session saved successfully");
          }
          return res.redirect("/");
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect("/");
      });
    });
  });
}

// Authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
};