export const isAuthenticated = (req: any, res: any, next: any) => {
  console.log("=== isAuthenticated middleware ===");
  console.log("Session ID:", req.sessionID);
  console.log("Session exists:", !!req.session);
  console.log("Session user:", req.session?.user);
  console.log("Session keys:", req.session ? Object.keys(req.session) : 'no session');
  
  if (!req.session || !req.session.user) {
    console.log("Authentication failed - no session or user");
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Set req.user for compatibility with existing code
  req.user = req.session.user;
  console.log("Authentication successful - user set:", req.user);
  next();
};