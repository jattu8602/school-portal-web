// banner.mjs
import chalk from 'chalk'
import figlet from 'figlet'
import ora from 'ora'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 🎯 Config
const projectName = 'PRESENTSIR'
const version = 'v1.0.0'
const port = 3000
const author = '👑 PresentSir Team 👑'

// 📜 Quotes
const quotes = [
  'Take small steps, complete them, celebrate them, and repeat.',
  'Every big thing starts small. Just start!',
  'Discipline outlasts motivation.',
  'Dream big. Start small. Act now.',
  'You don’t have to be great to start, but you have to start to be great.',
]
const quote = quotes[Math.floor(Math.random() * quotes.length)]

// 🧠 Route Counter
function countRoutes(pagesDir) {
  let count = 0
  const walk = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        walk(fullPath)
      } else if (/\.(js|jsx|ts|tsx)$/.test(file) && !file.startsWith('_')) {
        count++
      }
    })
  }
  walk(pagesDir)
  return count
}
const routesCount = countRoutes(path.join(__dirname, 'app'))


// 📊 Emoji Progress Bar
function emojiProgressBar(total, current, width = 20) {
  const percent = Math.floor((current / total) * width)
  const bar = '🟩'.repeat(percent) + '⬜️'.repeat(width - percent)
  return `${bar} ${Math.floor((current / total) * 100)}%`
}

let currentStep = 0
const totalSteps = 5

const line = chalk.gray('='.repeat(70))

// 🎬 Interval-based Output
const interval = setInterval(() => {
  console.clear()

  // Render Banner
  console.log(
    chalk.green(
      figlet.textSync(projectName, {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  )

  // Info Box
  console.log(line)
  console.log(chalk.greenBright(`🚀 PROJECT:`) + ` ${projectName}`)
  console.log(chalk.cyanBright(`📦 VERSION:`) + ` ${version}`)
  console.log(
    chalk.yellowBright(`🌐 RUNNING ON:`) + ` http://localhost:${port}`
  )
  console.log(chalk.blueBright(`🛠️  DEVELOPERS:`) + ` ${author}`)
  console.log(
    chalk.redBright(`🕒 START TIME:`) + ` ${new Date().toLocaleString()}`
  )
  console.log(chalk.yellowBright(`📁 Pages/Routes:`) + ` ${routesCount}`)
  console.log(line)
  console.log(chalk.green(`💡 "${quote}"\n`))

  // Emoji Progress Bar
  currentStep++
  console.log(chalk.blue.bold('🔄 Starting Dev Environment\n'))
  console.log(emojiProgressBar(totalSteps, currentStep))

  if (currentStep === totalSteps) {
    clearInterval(interval)

    // Spinner
    const spinner = ora({
      text: chalk.bold('Launching Presentsir Dev Mode...'),
      spinner: 'earth',
      color: 'cyan',
    }).start()

    setTimeout(() => {
      spinner.succeed(
        chalk.greenBright('✅ Server Ready! Forwarding to Next.js...\n')
      )
    }, 1000)
  }
}, 300)
