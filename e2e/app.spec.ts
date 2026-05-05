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
      'Today',
      'Plate System',
      'Daily Plan',
      'Coach',
      'Food Swaps',
      'Food Database',
      'Meal Builder',
      'Overview',
      'Your Numbers',
      'Phases',
      'Rules',
      'Safety',
      'Biomarkers',
      'Synergies',
      'Support Stack',
      'Supplements',
      'Eating Out',
      'Shopping List',
      'Resources',
      'Troubleshoot',
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

  test('plate page: narrow column uses overflow menu to open foods and custom', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await expect(page.getByTestId('meal-source-overflow')).toBeVisible()
    await expect(page.getByTestId('meal-db-toggle')).toBeHidden()
    await page.getByTestId('meal-source-overflow').click()
    await page.getByTestId('meal-source-overflow-foods').click()
    await page.getByTestId('meal-custom-label').fill('Overflow path')
    await page.getByTestId('meal-custom-kcal').fill('77')
    await page.getByLabel('P (g)').fill('7')
    await page.getByLabel('F (g)').fill('3')
    await page.getByLabel('C (g)').fill('9')
    await page.getByTestId('meal-add-custom').click()
    await expect(page.getByTestId('meal-total-kcal')).toContainText('77 kcal')
  })

  test('plate page: meal builder custom line updates total kcal', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('E2E test item')
    await page.getByTestId('meal-custom-kcal').fill('100')
    await page.getByLabel('P (g)').fill('10')
    await page.getByLabel('F (g)').fill('5')
    await page.getByLabel('C (g)').fill('12')
    await page.getByTestId('meal-add-custom').click()
    await expect(page.getByTestId('meal-total-kcal')).toContainText('100 kcal')
  })

  test('plate page: portion slider updates line kcal, readout, and macro totals', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('Portion math')
    await page.getByTestId('meal-custom-kcal').fill('40')
    await page.getByLabel('P (g)').fill('4')
    await page.getByLabel('F (g)').fill('2')
    await page.getByLabel('C (g)').fill('8')
    await page.getByTestId('meal-add-custom').click()

    const line = page.locator('.plate-meal-builder__line').filter({ hasText: 'Portion math' })
    await expect(line).toContainText('40 kcal')
    await expect(page.getByTestId('meal-total-kcal')).toContainText('40 kcal')
    await expect(page.getByTestId('meal-total-macros')).toHaveText('P 4 · F 2 · C 8')

    await line.getByRole('slider').fill('2.5')
    await expect(line).toContainText('100 kcal')
    await expect(line.getByText('2.5×')).toBeVisible()
    await expect(page.getByTestId('meal-total-kcal')).toContainText('100 kcal')
    await expect(page.getByTestId('meal-total-macros')).toHaveText('P 10 · F 5 · C 20')

    await line.getByRole('slider').evaluate((el: HTMLInputElement) => {
      el.value = '15'
      el.dispatchEvent(new Event('input', { bubbles: true }))
      el.dispatchEvent(new Event('change', { bubbles: true }))
    })
    await expect(line.getByText('10.0×')).toBeVisible()
    await expect(page.getByTestId('meal-total-kcal')).toContainText('400 kcal')
    await expect(page.getByTestId('meal-total-macros')).toHaveText('P 40 · F 20 · C 80')
  })

  test('plate page: hide worksheet hides line list; show worksheet restores', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('Worksheet toggle')
    await page.getByTestId('meal-custom-kcal').fill('50')
    await page.getByLabel('P (g)').fill('5')
    await page.getByLabel('F (g)').fill('2')
    await page.getByLabel('C (g)').fill('6')
    await page.getByTestId('meal-add-custom').click()
    const slider = page
      .locator('.plate-meal-builder__line')
      .filter({ hasText: 'Worksheet toggle' })
      .getByRole('slider')
    await expect(slider).toBeVisible()
    await page.getByTestId('meal-lines-hide-worksheet').click()
    await expect(slider).toBeHidden()
    await page.getByTestId('meal-lines-show-worksheet').click()
    await expect(slider).toBeVisible()
  })

  test('plate page: ?template= query selects template then clears from URL', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate?template=soup')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Soup bowl' })).toHaveClass(/is-active/)
    await expect(page).toHaveURL(/#\/plate(\?|$)/)
    await expect(page).not.toHaveURL(/template=/)
  })

  test('daily plan: meal row links to plate with matching template', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/daily')
    await page.getByRole('tab', { name: 'African emphasis' }).click()
    await page.getByRole('link', { name: /Plate builder · .*Soup bowl/ }).first().click()
    await expect(page.getByRole('button', { name: 'Soup bowl' })).toHaveClass(/is-active/)
    await expectHashPath(page, '/plate')
  })

  test('plate page: food database search adds a line', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    const dbPanel = page.getByTestId('meal-db-panel')
    await dbPanel.getByRole('textbox', { name: 'Search' }).fill('spinach')
    await expect(dbPanel.getByRole('button', { name: /Add Spinach to/i })).toBeVisible()
    await dbPanel.getByRole('button', { name: /Add Spinach to/i }).click()
    await expect(page.locator('.plate-meal-builder__line').filter({ hasText: 'Spinach' })).toBeVisible()
  })

  test('plate page: switching template confirms and drops mismatched lines', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('E2E slot veg')
    await page.getByTestId('meal-custom-kcal').fill('50')
    await page.getByLabel('P (g)').fill('1')
    await page.getByLabel('F (g)').fill('1')
    await page.getByLabel('C (g)').fill('1')
    await page.getByTestId('meal-add-custom').click()
    await expect(page.locator('.plate-meal-builder__line').filter({ hasText: 'E2E slot veg' })).toBeVisible()

    await page.getByRole('button', { name: 'Soup bowl' }).click()
    await expect(page.getByTestId('meal-template-confirm')).toBeVisible()
    await page.getByTestId('meal-template-confirm').click()
    await expect(page.getByRole('button', { name: 'Soup bowl' })).toHaveClass(/is-active/)
    await expect(page.locator('.plate-meal-builder__notice')).toContainText(/removed/)
    await expect(page.locator('.plate-meal-builder__line').filter({ hasText: 'E2E slot veg' })).toHaveCount(0)
  })

  test('plate page: save to today lists meal on Today page', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.removeItem('vat_meal_log_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('Save to today E2E')
    await page.getByTestId('meal-custom-kcal').fill('250')
    await page.getByLabel('P (g)').fill('25')
    await page.getByLabel('F (g)').fill('10')
    await page.getByLabel('C (g)').fill('30')
    await page.getByTestId('meal-add-custom').click()
    await page.getByTestId('meal-save-to-today').click()
    await expect(page.getByTestId('meal-saved-banner')).toContainText('Saved to today')
    await page.goto('/#/today')
    await expect(page.getByTestId('today-meals-card')).toBeVisible()
    const row = page.getByTestId('today-meals-row').filter({ hasText: 'Rest plate · 1 line · 250 kcal' })
    await expect(row).toHaveCount(1)
  })

  test('plate page: scenario load applies soup preset and lines', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.removeItem('vat_meal_log_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByText('Swaps & scenarios', { exact: false }).click()
    await page.getByTestId('plate-scenario-load-0').click()
    await expect(page.getByRole('button', { name: 'Soup bowl' })).toHaveClass(/is-active/)
    await expect(
      page.locator('.plate-meal-builder__line').filter({ hasText: 'Pepper soup / light broth base' }),
    ).toBeVisible()
  })

  test('plate page: scenario load confirms before replacing existing lines', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.removeItem('vat_meal_log_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('Before scenario')
    await page.getByTestId('meal-custom-kcal').fill('50')
    await page.getByLabel('P (g)').fill('5')
    await page.getByLabel('F (g)').fill('2')
    await page.getByLabel('C (g)').fill('6')
    await page.getByTestId('meal-add-custom').click()
    await page.getByText('Swaps & scenarios', { exact: false }).click()
    await page.getByTestId('plate-scenario-load-0').click()
    await expect(page.getByTestId('plate-preset-confirm')).toBeVisible()
    await page.getByTestId('plate-preset-confirm').click()
    await expect(page.getByRole('button', { name: 'Soup bowl' })).toHaveClass(/is-active/)
    await expect(page.locator('.plate-meal-builder__line').filter({ hasText: 'Before scenario' })).toHaveCount(0)
    await expect(
      page.locator('.plate-meal-builder__line').filter({ hasText: 'Pepper soup / light broth base' }),
    ).toBeVisible()
  })

  test('plate page: reset all restores defaults after confirm', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('vat_plate_builder_v1')
      localStorage.removeItem('vat_meal_log_v1')
      localStorage.setItem('vat_plate_collapsible_hint_v1', '1')
    })
    await page.goto('/#/plate')
    await expect(page.getByTestId('plate-meal-builder')).toBeVisible()
    await page.getByRole('button', { name: 'Training day' }).click()
    await page.getByTestId('meal-db-toggle').click()
    await page.getByTestId('meal-custom-label').fill('Reset E2E line')
    await page.getByTestId('meal-custom-kcal').fill('180')
    await page.getByLabel('P (g)').fill('18')
    await page.getByLabel('F (g)').fill('6')
    await page.getByLabel('C (g)').fill('20')
    await page.getByTestId('meal-add-custom').click()
    await expect(page.getByTestId('meal-total-kcal')).toContainText('180 kcal')
    await page.getByTestId('meal-reset-all').click()
    await expect(page.getByTestId('meal-reset-confirm')).toBeVisible()
    await page.getByTestId('meal-reset-confirm').click()
    await expect(page.getByRole('button', { name: 'Rest day' })).toHaveClass(/is-active/)
    await expect(page.locator('.plate-meal-builder__line').filter({ hasText: 'Reset E2E line' })).toHaveCount(0)
    await expect(page.getByTestId('meal-total-kcal')).toContainText('0 kcal')
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
