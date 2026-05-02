import { expect, test, type Page } from '@playwright/test'

/** HashRouter: paths live in `location.hash` (e.g. `#/today`). */
function expectHashPath(page: Page, hashSuffix: string) {
  return expect(page).toHaveURL(new RegExp(`#${hashSuffix.replace(/\//g, '\\/')}$`))
}

test.describe('Waist Reset app', () => {
  test('redirects / to Start and shows shell', async ({ page }) => {
    await page.goto('/')
    await expectHashPath(page, '/start')
    await expect(page.getByRole('banner')).toContainText('The Waist Reset')
    await expect(page.getByRole('navigation', { name: 'Guide sections' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Start here.' })).toBeVisible()
  })

  test('unknown hash routes fall back to Start', async ({ page }) => {
    await page.goto('/#/this-route-does-not-exist')
    await expectHashPath(page, '/start')
  })

  test('desktop: every sidebar link navigates and shows main content', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/#/start')

    const nav = page.getByRole('navigation', { name: 'Guide sections' })
    const labels = [
      'Start Here',
      'Plate System',
      'Food Swaps',
      'Today',
      'Daily Plan',
      'Coach',
      'Meal Builder',
      'Overview',
      'Your Numbers',
      'Phases',
      'Rules',
      'Supplements',
      'Eating Out',
      'Shopping List',
      'Resources',
      'Troubleshoot',
      'Food Database',
      'Biomarkers',
      'Synergies',
      'Support Stack',
      'Safety',
      'Weekly Review',
      'My Progress',
    ]

    for (const label of labels) {
      const link = nav.getByRole('link', { name: label })
      const href = await link.getAttribute('href')
      expect(href, `nav link: ${label}`).toMatch(/^#\//)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`${href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`))
      await expect(page.locator('main')).toBeVisible()
    }
  })

  test('mobile drawer: open menu and navigate', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/#/start')

    await page.getByRole('button', { name: 'Menu' }).click()
    const sidebar = page.locator('#sidebar')
    await expect(sidebar).toHaveClass(/open/)

    await page.getByRole('navigation', { name: 'Guide sections' }).getByRole('link', { name: 'Today' }).click()
    await expectHashPath(page, '/today')
    await expect(page.locator('#today-greeting')).toBeVisible()
  })
})
