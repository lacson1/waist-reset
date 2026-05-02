import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const htmlPath = '/Users/lacbis/Documents/co-work-OS/Start1/visceral-fat-loss-dashboard.html'
const outPath = path.join(__dirname, '../public/foods.json')

const html = fs.readFileSync(htmlPath, 'utf8')
const startMarker = 'const FOODS = '
const endMarker = '\n\nconst TIMELINE_GENERAL'
const i = html.indexOf(startMarker)
const j = html.indexOf(endMarker, i)
if (i < 0 || j < 0) {
  console.error('Could not find FOODS block markers')
  process.exit(1)
}
const literal = html.slice(i + startMarker.length, j).trim()
const foods = new Function(`return ${literal}`)()
fs.writeFileSync(outPath, JSON.stringify(foods, null, 0))
console.log('Wrote', foods.length, 'foods to', outPath)
