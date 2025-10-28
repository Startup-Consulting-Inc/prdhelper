/**
 * BRD Wizard E2E Tests
 * 
 * End-to-end tests for the BRD wizard flow using Playwright
 */

import { test, expect } from '@playwright/test';

// Setup: Mock API responses and seed test data
test.beforeEach(async ({ page, context }) => {
  // Set authentication token in localStorage to bypass auth
  await context.addCookies([{
    name: 'auth_token',
    value: 'test-token-12345',
    domain: 'localhost',
    path: '/',
  }]);
  
  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'test-token-12345');
    localStorage.setItem('user', JSON.stringify({
      id: 'test-user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
    }));
  });
  
  // Mock API responses for consistent testing
  await page.route('**/api/trpc/**', (route) => {
    const url = route.request().url();
    
    // Mock auth check
    if (url.includes('auth.me') || url.includes('auth.getSession')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              id: 'test-user-1',
              email: 'test@example.com',
              name: 'Test User',
              role: 'USER',
              modePreference: 'TECHNICAL',
            },
          },
        }),
      });
    }
    
    // Mock project data
    else if (url.includes('projects.getById')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              id: 'test-project-1',
              title: 'E-commerce Platform',
              mode: 'TECHNICAL',
              status: 'ACTIVE',
              initialIdea: 'Build an online store',
              currentPhase: 'BRD',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }),
      });
    }
    
    // Mock empty conversation initially
    else if (url.includes('conversations.getByProject')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [],
            },
          },
        }),
      });
    }
    
    // Default: continue with actual request
    else {
      route.continue();
    }
  });
});

test.describe('BRD Wizard Page', () => {
  test('should display welcome screen on initial load', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check welcome message
    await expect(page.getByRole('heading', { name: /Welcome to the BRD Wizard!/i })).toBeVisible();
    
    // Check info content
    await expect(page.getByText(/5-10 targeted questions/i)).toBeVisible();
    await expect(page.getByText(/Questions adapt based on your answers/i)).toBeVisible();
    
    // Check start button exists
    const startButton = page.getByRole('button', { name: /Start Wizard/i });
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeEnabled();
  });

  test('should show project information in header', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check project title
    await expect(page.getByText('E-commerce Platform')).toBeVisible();
    
    // Check project mode badge
    await expect(page.getByText('TECHNICAL')).toBeVisible();
    
    // Check progress indicator
    await expect(page.getByText('Questions answered: 0/5+')).toBeVisible();
  });

  test('should have functional back button', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    const backButton = page.getByRole('button', { name: /Back/i });
    await expect(backButton).toBeVisible();
    
    // Click should navigate to project detail
    await backButton.click();
    await expect(page).toHaveURL('/projects/test-project-1');
  });

  test('should start wizard and display first question', async ({ page }) => {
    // Mock first question response
    await page.route('**/api/trpc/ai.askQuestion*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              question: 'What is the main goal of your e-commerce platform?',
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const startButton = page.getByRole('button', { name: /Start Wizard/i });
    await startButton.click();
    
    // Wait for first question to appear
    await expect(page.getByText('What is the main goal of your e-commerce platform?')).toBeVisible();
    
    // Check that input area is now visible
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    await expect(answerInput).toBeVisible();
    await expect(answerInput).toBeEnabled();
  });

  test('should submit answer and receive next question', async ({ page }) => {
    // Setup: Start with existing conversation
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                {
                  role: 'assistant',
                  content: 'What is your target market?',
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          },
        }),
      });
    });

    // Mock next question response
    await page.route('**/api/trpc/ai.askQuestion*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              question: 'Who are your main competitors?',
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Type answer
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    await answerInput.fill('Young adults aged 18-35 interested in fashion');
    
    // Submit answer
    const sendButton = page.getByRole('button').filter({ hasText: '' }).last(); // Icon button
    await sendButton.click();
    
    // Check loading state
    await expect(page.getByText(/Thinking/i)).toBeVisible();
    
    // Wait for next question
    await expect(page.getByText('Who are your main competitors?')).toBeVisible({ timeout: 5000 });
    
    // Input should be cleared
    await expect(answerInput).toHaveValue('');
  });

  test('should submit answer using keyboard shortcut (Cmd+Enter)', async ({ page }) => {
    // Setup with existing question
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                {
                  role: 'assistant',
                  content: 'What features do you need?',
                  timestamp: new Date().toISOString(),
                },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    await answerInput.fill('Shopping cart, payment processing, inventory management');
    
    // Use keyboard shortcut
    await answerInput.press('Meta+Enter');
    
    // Should trigger submission
    await expect(page.getByText(/Thinking/i)).toBeVisible();
  });

  test('should show progress updates as questions are answered', async ({ page }) => {
    // Setup with 3 questions answered
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                { role: 'assistant', content: 'Q1' },
                { role: 'user', content: 'A1' },
                { role: 'assistant', content: 'Q2' },
                { role: 'user', content: 'A2' },
                { role: 'assistant', content: 'Q3' },
                { role: 'user', content: 'A3' },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check progress
    await expect(page.getByText('Questions answered: 3/5+')).toBeVisible();
    await expect(page.getByText('60%')).toBeVisible();
  });

  test('should enable document generation after 3 questions', async ({ page }) => {
    // Setup with 3 questions answered
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                { role: 'assistant', content: 'Q1' },
                { role: 'user', content: 'A1' },
                { role: 'assistant', content: 'Q2' },
                { role: 'user', content: 'A2' },
                { role: 'assistant', content: 'Q3' },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check generate button is visible
    await expect(page.getByText(/You've answered enough questions/i)).toBeVisible();
    
    const generateButton = page.getByRole('button', { name: /Generate BRD/i });
    await expect(generateButton).toBeVisible();
    await expect(generateButton).toBeEnabled();
  });

  test('should generate document and navigate to project detail', async ({ page }) => {
    // Setup with enough questions
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: Array(6).fill(null).map((_, i) => ({
                role: i % 2 === 0 ? 'assistant' : 'user',
                content: `Message ${i}`,
              })),
            },
          },
        }),
      });
    });

    // Mock document generation
    await page.route('**/api/trpc/ai.generateDocument*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              success: true,
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const generateButton = page.getByRole('button', { name: /Generate BRD/i });
    await generateButton.click();
    
    // Should show generating state
    await expect(page.getByText(/Generating Your BRD/i)).toBeVisible();
    
    // Should navigate to project detail
    await expect(page).toHaveURL('/projects/test-project-1', { timeout: 10000 });
  });

  test('should display error message on API failure', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Mock API error
    await page.route('**/api/trpc/ai.askQuestion*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'AI service unavailable',
          },
        }),
      });
    });
    
    const startButton = page.getByRole('button', { name: /Start Wizard/i });
    await startButton.click();
    
    // Should display error
    await expect(page.getByText(/Failed to start wizard/i)).toBeVisible();
  });

  test('should disable inputs while submitting', async ({ page }) => {
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                { role: 'assistant', content: 'Test question?' },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    await answerInput.fill('Test answer');
    
    // Mock slow API response
    await page.route('**/api/trpc/ai.askQuestion*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: { data: { question: 'Next?' } } }),
      });
    });
    
    const sendButton = page.getByRole('button').filter({ hasText: '' }).last();
    await sendButton.click();
    
    // Inputs should be disabled during submission
    await expect(answerInput).toBeDisabled();
    await expect(sendButton).toBeDisabled();
  });

  test('should not allow empty answers', async ({ page }) => {
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                { role: 'assistant', content: 'Question?' },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    const sendButton = page.getByRole('button').filter({ hasText: '' }).last();
    
    // Empty input - button should be disabled
    await expect(sendButton).toBeDisabled();
    
    // Whitespace only - button should still be disabled
    await answerInput.fill('   ');
    await expect(sendButton).toBeDisabled();
    
    // Valid input - button should be enabled
    await answerInput.fill('Valid answer');
    await expect(sendButton).toBeEnabled();
  });

  test('should show character count for answer input', async ({ page }) => {
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [
                { role: 'assistant', content: 'Question?' },
              ],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    
    // Initially 0 characters
    await expect(page.getByText('0 characters')).toBeVisible();
    
    // Type some text
    await answerInput.fill('Hello, world!');
    await expect(page.getByText('13 characters')).toBeVisible();
  });

  test('should auto-scroll to latest message', async ({ page }) => {
    // Setup with multiple messages
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: Array(10).fill(null).map((_, i) => ({
                role: i % 2 === 0 ? 'assistant' : 'user',
                content: `Message number ${i + 1}`,
                timestamp: new Date().toISOString(),
              })),
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Latest message should be visible
    await expect(page.getByText('Message number 10')).toBeVisible();
  });
});

test.describe('BRD Wizard Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check h1 exists
    const h1 = page.getByRole('heading', { level: 1, name: /BRD Wizard/i });
    await expect(h1).toBeVisible();
  });

  test('should have focusable interactive elements', async ({ page }) => {
    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Check start button is keyboard accessible
    const startButton = page.getByRole('button', { name: /Start Wizard/i });
    await startButton.focus();
    await expect(startButton).toBeFocused();
    
    // Check back button
    const backButton = page.getByRole('button', { name: /Back/i });
    await backButton.focus();
    await expect(backButton).toBeFocused();
  });

  test('should have accessible form labels', async ({ page }) => {
    await page.route('**/api/trpc/conversations.getByProject*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: {
              messages: [{ role: 'assistant', content: 'Q?' }],
            },
          },
        }),
      });
    });

    await page.goto('/projects/test-project-1/wizard/brd');
    
    // Textarea should have placeholder text
    const answerInput = page.getByPlaceholder(/Type your answer here/i);
    await expect(answerInput).toBeVisible();
  });
});

