#!/usr/bin/env node

/**
 * Dictionary Validation Script
 *
 * Validates that all dictionary entries have:
 * - All 8 required language keys (EN, DE, TR, IR, FR, SP, DU, TH)
 * - Non-empty translations for each language
 * - Consistent lowercase keys
 *
 * Usage: node scripts/validate-dictionary.js
 */

import process from "process";
import dictionary from "../src/utils/dictionary.js";

const REQUIRED_LANGUAGES = ["EN", "DE", "TR", "IR", "FR", "SP", "DU", "TH"];

const errors = [];
const warnings = [];

console.log("🔍 Validating dictionary...\n");

Object.entries(dictionary).forEach(([word, translations]) => {
  // Check 1: Word key should be lowercase
  if (word !== word.toLowerCase()) {
    warnings.push(`"${word}" should be lowercase`);
  }

  // Check 2: All required languages present
  REQUIRED_LANGUAGES.forEach((lang) => {
    if (!(lang in translations)) {
      errors.push(`Missing ${lang} translation for "${word}"`);
    }
  });

  // Check 3: No empty translations
  Object.entries(translations).forEach(([lang, value]) => {
    if (!value || value.trim().length === 0) {
      errors.push(`Empty ${lang} translation for "${word}"`);
    }
  });

  // Check 4: No extra languages
  Object.keys(translations).forEach((lang) => {
    if (!REQUIRED_LANGUAGES.includes(lang)) {
      errors.push(`Unexpected language "${lang}" for "${word}"`);
    }
  });
});

// Print results
const wordCount = Object.keys(dictionary).length;
console.log(`📊 Dictionary contains ${wordCount} words\n`);

if (warnings.length > 0) {
  console.log(`⚠️  ${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log(`   - ${w}`));
  console.log();
}

if (errors.length > 0) {
  console.log(`❌ ${errors.length} error(s):`);
  errors.forEach((e) => console.log(`   - ${e}`));
  console.log();
  process.exit(1);
} else {
  console.log("✅ All validations passed!");
  process.exit(0);
}
