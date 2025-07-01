/**
 * Photo Recovery Utility
 * 
 * This utility helps recover missing photo files by creating placeholder images
 * for database records that lost their physical files.
 */

import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { requestPhotos } from '../shared/schema.js';

export async function recoverMissingPhotos() {
  try {
    console.log("🔧 Starting photo recovery process...");
    
    // Get all photo records from database
    const photos = await db.select().from(requestPhotos);
    console.log(`Found ${photos.length} photo records in database`);
    
    const uploadDir = path.resolve(process.cwd(), 'uploads/photos');
    let missingCount = 0;
    let recoveredCount = 0;
    
    for (const photo of photos) {
      const expectedPath = path.join(uploadDir, photo.filename);
      const fileExists = fs.existsSync(expectedPath);
      
      if (!fileExists) {
        console.log(`Missing file: ${photo.filename} (original: ${photo.originalFilename})`);
        missingCount++;
        
        // Create a placeholder file with metadata
        const placeholderContent = `Photo file missing for request #${photo.requestId}
Original filename: ${photo.originalFilename}
Upload time: ${photo.uploadedAt}
Size: ${photo.size} bytes
MIME type: ${photo.mimeType}

This is a placeholder. The original photo was uploaded but the file was not properly saved to disk.
Contact system administrator to recover from backup if available.`;
        
        try {
          fs.writeFileSync(expectedPath + '.txt', placeholderContent);
          console.log(`Created placeholder for ${photo.filename}`);
          recoveredCount++;
        } catch (error) {
          console.error(`Failed to create placeholder for ${photo.filename}:`, error);
        }
      }
    }
    
    console.log(`📊 Photo recovery summary:`);
    console.log(`- Total photos in database: ${photos.length}`);
    console.log(`- Missing physical files: ${missingCount}`);
    console.log(`- Placeholders created: ${recoveredCount}`);
    
    return { total: photos.length, missing: missingCount, recovered: recoveredCount };
    
  } catch (error) {
    console.error("Photo recovery failed:", error);
    throw error;
  }
}