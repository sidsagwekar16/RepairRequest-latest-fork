#!/usr/bin/env tsx

/**
 * Photo Recovery Script
 * Run this to recover missing photo files
 */

import { recoverMissingPhotos } from './photo-recovery.js';

async function main() {
  try {
    console.log("Starting photo recovery...");
    const result = await recoverMissingPhotos();
    console.log("Photo recovery completed:", result);
    process.exit(0);
  } catch (error) {
    console.error("Photo recovery failed:", error);
    process.exit(1);
  }
}

main();