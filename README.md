# School Portal Web

A comprehensive web portal for schools to manage teachers and students with optimized performance and mobile-first design.

## Features

- **School Registration**: Schools can sign up with their name, code, email, and password
- **School Dashboard**: Schools can log in and manage their portal
- **Teacher Management**: Add teachers via email and generate passwords
- **Student Management**: Add students with roll numbers, names, usernames, and passwords
- **Secure Authentication**: Firebase authentication for secure login and user management
- **Database**: Firestore database for storing school, teacher, and student information
- **Banner Management**: Manage school announcements
- **Responsive Design**: Designed for all device sizes

## 🚀 Performance Optimizations

This project has been optimized to meet modern web performance standards:

### 📊 Performance Metrics

- **Page Size**: Reduced from 4.7MB to < 3MB
- **Page Requests**: Optimized from 48 to < 30 requests
- **Page Speed**: Improved from 15s to < 5.3s
- **Image Optimization**: WebP format with responsive sizing
- **Mobile Usability**: 48px+ tap targets with proper spacing

### 🖼️ Image Optimization

- **Next.js Image Component**: Automatic optimization and lazy loading
- **WebP Format**: 90%+ size reduction for team photos and logos
- **Responsive Images**: Adaptive sizing for different screen sizes
- **Blur Placeholders**: Smooth loading experience

### 📱 Mobile Usability

- **Tap Target Sizing**: Minimum 48px × 48px with 8px spacing
- **Touch-Friendly**: `touch-manipulation` CSS for better responsiveness
- **Responsive Design**: Mobile-first approach with proper breakpoints

### ⚡ Performance Features

- **Lazy Loading**: Components load only when in viewport
- **Bundle Splitting**: Optimized code splitting for faster loads
- **Compression**: Gzip compression enabled
- **Caching**: Aggressive caching for static assets
- **Tree Shaking**: Unused code elimination

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Media Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form
- **Mobile App**: React Native with Expo
- **State Management**: React Context API
- **Performance**: Web Vitals monitoring
- **Image Optimization**: Sharp, Next.js Image

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd school-portal-web

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Optimization
npm run optimize-images    # Compress and convert images to WebP
npm run analyze           # Analyze bundle size

# Utilities
npm run generate-secret   # Generate Firebase secret
```

## 📈 Performance Monitoring

The project includes built-in performance monitoring:

- **Core Web Vitals**: LCP, FID, CLS, FCP, TTFB
- **Resource Monitoring**: Large asset detection
- **Long Task Detection**: Performance bottleneck identification
- **Layout Shift Monitoring**: Visual stability tracking

## 🖼️ Image Optimization Guide

### Automatic Optimization

Images are automatically optimized using the `scripts/optimize-images.js` script:

```bash
npm run optimize-images
```

This script:

- Converts images to WebP format
- Resizes images to appropriate dimensions
- Reduces file sizes by 80-99%
- Maintains visual quality

### Manual Optimization

For new images:

1. Add image paths to `scripts/optimize-images.js`
2. Run the optimization script
3. Update components to use optimized images
4. Use Next.js Image component with proper sizing

## 📱 Mobile Optimization Checklist

- ✅ Tap targets minimum 48px × 48px
- ✅ 8px spacing between interactive elements
- ✅ Touch-friendly form inputs
- ✅ Responsive images and layouts
- ✅ Fast loading on mobile networks
- ✅ Proper viewport configuration

## 🔍 Bundle Analysis

To analyze your bundle size:

```bash
npm run analyze
```

This opens an interactive bundle analyzer showing:

- Bundle composition
- Largest dependencies
- Optimization opportunities
- Code splitting effectiveness

## 🚀 Deployment Optimizations

### Production Build

```bash
npm run build
```

The production build includes:

- Code minification
- Tree shaking
- Bundle splitting
- Asset optimization
- Compression

### Environment Variables

Create `.env.local` for environment-specific settings:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📊 Performance Best Practices

### Images

- Use Next.js Image component
- Implement lazy loading
- Provide appropriate sizes
- Use WebP format when possible

### Code

- Implement code splitting
- Use dynamic imports for heavy components
- Minimize bundle size
- Remove unused dependencies

### Caching

- Leverage browser caching
- Use CDN for static assets
- Implement service worker (future)

### Monitoring

- Track Core Web Vitals
- Monitor bundle size
- Analyze performance regularly
- Set performance budgets

## 🔧 Configuration Files

### Next.js Config (`next.config.mjs`)

- Image optimization settings
- Bundle analyzer integration
- Webpack optimizations
- Security headers

### Tailwind Config

- Optimized for production
- Purged unused styles
- Custom breakpoints

### Package.json

- Optimized dependencies
- Performance scripts
- Build configurations

## 📝 Contributing

When contributing:

1. Run performance tests
2. Optimize new images
3. Check bundle size impact
4. Test mobile usability
5. Verify Core Web Vitals

## 🐛 Performance Issues

If you encounter performance issues:

1. Run bundle analyzer
2. Check image sizes
3. Monitor network requests
4. Verify lazy loading
5. Check for memory leaks

## 📚 Resources

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [Bundle Analysis](https://nextjs.org/docs/advanced-features/analyzing-bundles)

## 📄 License

This project is licensed under the MIT License.

## Getting Started

First, set up your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase configuration and update the `.env` file

Then, set up Cloudinary:

1. Sign up for a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
2. From your dashboard, get your cloud name
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll to "Upload presets" and click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Add a folder name if desired
   - Save the preset
4. Copy the cloud name and upload preset name to your `.env.local` file

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
school-portal-web/
├── app/                 # Next.js App Router
│   ├── api/             # API Routes
│   ├── auth/            # Authentication Pages
│   ├── dashboard/       # School Dashboard
│   ├── components/      # Shared Components
│   └── ...
├── lib/                 # Utility functions
│   ├── firebase.js      # Firebase configuration
│   └── ...
├── public/              # Static assets
└── ...
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA Support

This project includes Progressive Web App (PWA) support, allowing users to install it as a native app on their devices:

- Add to Home Screen on iOS
- Install as app on Android
- Desktop app on Windows/Mac/Linux

The PWA features include:

- Offline support via Service Worker
- App icons and splash screens
- Home screen installation
