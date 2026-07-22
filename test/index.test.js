const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const indexHtmlPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(indexHtmlPath, 'utf8');

// Extracts the inner text of the first element with class="ai-box"
function getAiBoxText(markup) {
  const match = markup.match(/<div class="ai-box">([\s\S]*?)<\/div>/);
  return match ? match[1].trim() : null;
}

test('public/index.html - AI Assistant readiness message', async (t) => {
  await t.test('contains a div with class "ai-box"', () => {
    assert.match(html, /<div class="ai-box">[\s\S]*?<\/div>/);
  });

  await t.test('ai-box displays the updated "AI Assistant is Ready" text', () => {
    const text = getAiBoxText(html);
    assert.equal(text, '🤖 AI Assistant is Ready');
  });

  await t.test('ai-box does not contain the old "AI Assistant Ready" wording', () => {
    const text = getAiBoxText(html);
    assert.notEqual(text, '🤖 AI Assistant Ready');
    // Ensure "Assistant" is directly followed by "is Ready", not "Ready" alone.
    assert.match(text, /Assistant is Ready$/);
    assert.doesNotMatch(text, /Assistant\s+Ready$/);
  });

  await t.test('ai-box still includes the robot emoji', () => {
    const text = getAiBoxText(html);
    assert.match(text, /^🤖/);
  });

  await t.test('the exact updated string appears exactly once in the document', () => {
    const occurrences = html.split('🤖 AI Assistant is Ready').length - 1;
    assert.equal(occurrences, 1);
  });

  await t.test('the old exact string no longer appears anywhere in the document', () => {
    assert.ok(!html.includes('🤖 AI Assistant Ready'));
  });
});