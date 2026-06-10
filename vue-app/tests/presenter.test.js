/**
 * E2E Tests for Presenter View UX
 * Tests the complete user flow for quiz presentation
 *
 * Run with: npm run test:e2e
 * Run with browser visible: npm run test:e2e:headed
 */

const { openBrowser, goto, closeBrowser, press, text, screenshot, waitFor, $, write } = require('taiko');
const assert = require('assert');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

(async () => {
  try {
    // Open browser
    console.log('🚀 Opening browser...');
    await openBrowser({
      headless: process.env.HEADLESS !== 'false',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // Test 1: Load presenter view
    console.log('\n✅ Test 1: Loading presenter view...');
    await goto(`${BASE_URL}/#/presenter`);
    await waitFor(2000);
    assert(await text('Foto 1 / 23').exists(), 'Photo counter should be visible');
    console.log('✓ Presenter view loaded successfully');

    // Test 2: Photo fullscreen initially
    console.log('\n✅ Test 2: Checking initial fullscreen state...');
    assert(await text('Mezerník zobrazí otázky').exists(), 'Fullscreen hint should be visible');
    console.log('✓ Photo is fullscreen initially');

    // Test 3: Toggle questions with spacebar
    console.log('\n✅ Test 3: Toggling questions with spacebar...');
    await press('Space');
    await waitFor(1000);

    // Check if any question text is visible
    const questionVisible = await text(/Který|Kde|Co|Jak/).exists();
    assert(questionVisible, 'Question should be visible after pressing spacebar');

    assert(await text('Mezerník skryje').exists(), 'Hide hint should be visible');
    console.log('✓ Questions toggle with spacebar works');

    // Take screenshot
    await screenshot({ path: 'tests/screenshots/presenter-questions.png' });
    console.log('📸 Screenshot saved: presenter-questions.png');

    // Test 4: Navigate between questions
    console.log('\n✅ Test 4: Navigating between questions...');
    await press('ArrowDown');
    await waitFor(500);
    console.log('✓ Pressed down arrow (question 2)');

    await press('ArrowDown');
    await waitFor(500);
    console.log('✓ Pressed down arrow (question 3)');

    await press('ArrowUp');
    await waitFor(500);
    console.log('✓ Pressed up arrow (back to question 2)');

    await press('ArrowUp');
    await waitFor(500);
    console.log('✓ Pressed up arrow (back to question 1)');

    // Test 5: Reveal answer
    console.log('\n✅ Test 5: Revealing correct answer...');
    await press('a');
    await waitFor(1000);

    // Check for checkmark (correct answer indicator)
    const answerRevealed = await text('✓').exists();
    assert(answerRevealed, 'Correct answer should be revealed with checkmark');
    console.log('✓ Answer revealed successfully');

    // Take screenshot
    await screenshot({ path: 'tests/screenshots/presenter-answer.png' });
    console.log('📸 Screenshot saved: presenter-answer.png');

    // Test 6: Hide questions
    console.log('\n✅ Test 6: Hiding questions...');
    await press('Space');
    await waitFor(500);
    assert(await text('Mezerník zobrazí otázky').exists(), 'Questions should be hidden');
    console.log('✓ Questions hidden successfully');

    // Test 7: Navigate to next photo
    console.log('\n✅ Test 7: Navigating to next photo...');
    await press('ArrowRight');
    await waitFor(1000);
    assert(await text('Foto 2 / 23').exists(), 'Should navigate to photo 2');
    console.log('✓ Navigated to next photo');

    // Test 8: Navigate back
    console.log('\n✅ Test 8: Navigating back to previous photo...');
    await press('ArrowLeft');
    await waitFor(1000);
    assert(await text('Foto 1 / 23').exists(), 'Should navigate back to photo 1');
    console.log('✓ Navigated back to previous photo');

    // Test 9: Photo navigation blocked when questions visible
    console.log('\n✅ Test 9: Testing navigation block with visible questions...');
    await press('Space');
    await waitFor(500);
    await press('ArrowRight');
    await waitFor(500);
    assert(await text('Foto 1 / 23').exists(), 'Should still be on photo 1');
    console.log('✓ Photo navigation correctly blocked when questions visible');

    // Test 10: ESC to hide questions
    console.log('\n✅ Test 10: Testing ESC to hide questions...');
    await press('Escape');
    await waitFor(500);
    assert(await text('Mezerník zobrazí otázky').exists(), 'Questions should be hidden');
    console.log('✓ ESC hides questions successfully');

    // Test 11: Complete user flow
    console.log('\n✅ Test 11: Running complete user flow...');
    console.log('  1. Showing questions...');
    await press('Space');
    await waitFor(500);

    console.log('  2. Cycling through all 3 questions...');
    for (let i = 0; i < 2; i++) {
      await press('ArrowDown');
      await waitFor(300);
    }

    console.log('  3. Revealing answer...');
    await press('a');
    await waitFor(500);

    console.log('  4. Hiding questions...');
    await press('Space');
    await waitFor(500);

    console.log('  5. Navigating to next photo...');
    await press('ArrowRight');
    await waitFor(1000);

    assert(await text('Foto 2 / 23').exists(), 'Should be on photo 2');
    console.log('✓ Complete user flow executed successfully');

    // Take final screenshot
    await screenshot({ path: 'tests/screenshots/presenter-initial.png' });
    console.log('📸 Screenshot saved: presenter-initial.png');

    console.log('\n🎉 All tests passed!');
    console.log('📊 Summary: 11 tests executed successfully');
    console.log('📸 3 screenshots saved in tests/screenshots/');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    await screenshot({ path: 'tests/screenshots/error.png' });
    console.error('📸 Error screenshot saved: error.png');
    process.exit(1);
  } finally {
    await closeBrowser();
    console.log('\n👋 Browser closed');
  }
})();
