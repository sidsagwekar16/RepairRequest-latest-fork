import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from './server/db.js';
import { users } from './shared/schema.js';

// This script creates the first super admin user
// Run this with: node create-super-admin.js

async function createSuperAdmin() {
  try {
    // Super admin details
    const superAdminData = {
      id: crypto.randomUUID(),
      email: 'superadmin@repairrequest.com', // Change this to your email
      firstName: 'Super',
      lastName: 'Admin',
      password: await bcrypt.hash('admin123', 10), // Change this password
      role: 'super_admin',
      organizationId: null, // Super admins don't belong to any organization
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Check if super admin already exists
    const existingUser = await db.query.users.findFirst({ 
      where: (users, { eq }) => eq(users.email, superAdminData.email) 
    });
    
    if (existingUser) {
      console.log('❌ Super admin already exists with this email');
      return;
    }
    
    // Create super admin
    const [newUser] = await db.insert(users).values(superAdminData).returning();
    
    console.log('✅ Super admin created successfully!');
    console.log('Email:', newUser.email);
    console.log('Password: admin123 (change this after first login)');
    console.log('Role:', newUser.role);
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  }
}

createSuperAdmin(); 