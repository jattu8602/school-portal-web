const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '..', 'public')
const optimizedDir = path.join(publicDir, 'optimized')

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true })
}

// Files to optimize
const filesToOptimize = [
  {
    input: path.join(publicDir, 'present_sir_day-logo.jpg'),
    output: path.join(optimizedDir, 'present_sir_day-logo.webp'),
    width: 64,
    height: 64,
    quality: 85,
  },
  {
    input: path.join(publicDir, 'present_sir_night_logo.jpg'),
    output: path.join(optimizedDir, 'present_sir_night_logo.webp'),
    width: 64,
    height: 64,
    quality: 85,
  },
  {
    input: path.join(publicDir, 'team', 'Om_Patel.jpg'),
    output: path.join(optimizedDir, 'Om_Patel.webp'),
    width: 256,
    height: 256,
    quality: 75,
  },
  {
    input: path.join(publicDir, 'team', 'Nitesh_Chaurasiya.jpg'),
    output: path.join(optimizedDir, 'Nitesh_Chaurasiya.webp'),
    width: 256,
    height: 256,
    quality: 75,
  },
  {
    input: path.join(publicDir, 'team', 'Taniya_Patel.jpg'),
    output: path.join(optimizedDir, 'Taniya_Patel.webp'),
    width: 256,
    height: 256,
    quality: 75,
  },
  {
    input: path.join(publicDir, 'team', 'Ajay_Singh_Thakur.jpg'),
    output: path.join(optimizedDir, 'Ajay_Singh_Thakur.webp'),
    width: 256,
    height: 256,
    quality: 75,
  },
]

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...')

  for (const file of filesToOptimize) {
    try {
      if (!fs.existsSync(file.input)) {
        console.log(`⚠️  File not found: ${file.input}`)
        continue
      }

      const inputStats = fs.statSync(file.input)
      const inputSizeKB = Math.round(inputStats.size / 1024)

      await sharp(file.input)
        .resize(file.width, file.height, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: file.quality })
        .toFile(file.output)

      const outputStats = fs.statSync(file.output)
      const outputSizeKB = Math.round(outputStats.size / 1024)
      const savings = Math.round(
        ((inputStats.size - outputStats.size) / inputStats.size) * 100
      )

      console.log(
        `✅ ${path.basename(file.input)} → ${path.basename(file.output)}`
      )
      console.log(
        `   ${inputSizeKB}KB → ${outputSizeKB}KB (${savings}% reduction)`
      )
    } catch (error) {
      console.error(`❌ Error optimizing ${file.input}:`, error.message)
    }
  }

  console.log('\n🎉 Image optimization complete!')
  console.log('\n📝 Next steps:')
  console.log(
    '1. Update your components to use the optimized images from /optimized/ folder'
  )
  console.log(
    '2. Consider replacing the original large images with the optimized versions'
  )
  console.log(
    '3. Use Next.js Image component with the optimized images for best performance'
  )
}

optimizeImages().catch(console.error)
