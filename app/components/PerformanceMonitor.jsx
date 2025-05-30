'use client'

import { useEffect } from 'react'

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return

    // Web Vitals monitoring
    const reportWebVitals = (metric) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric)
      }

      // Send to analytics service (replace with your analytics)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(
            metric.name === 'CLS' ? metric.value * 1000 : metric.value
          ),
          non_interaction: true,
        })
      }
    }

    // Import and use web-vitals
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(reportWebVitals)
        getFID(reportWebVitals)
        getFCP(reportWebVitals)
        getLCP(reportWebVitals)
        getTTFB(reportWebVitals)
      })
      .catch(console.error)

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms')
          }
        }
      })

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // Longtask API not supported
      }

      // Monitor layout shifts
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput && entry.value > 0.1) {
            console.warn('Layout shift detected:', entry.value)
          }
        }
      })

      try {
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // Layout shift API not supported
      }
    }

    // Monitor resource loading
    const checkResourceTiming = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const resources = performance.getEntriesByType('resource')
        const largeResources = resources.filter(
          (resource) => resource.transferSize > 500000 // > 500KB
        )

        if (largeResources.length > 0) {
          console.warn(
            'Large resources detected:',
            largeResources.map((r) => ({
              name: r.name,
              size: Math.round(r.transferSize / 1024) + 'KB',
              duration: Math.round(r.duration) + 'ms',
            }))
          )
        }
      }
    }

    // Check after page load
    if (document.readyState === 'complete') {
      setTimeout(checkResourceTiming, 1000)
    } else {
      window.addEventListener('load', () => {
        setTimeout(checkResourceTiming, 1000)
      })
    }
  }, [])

  return null // This component doesn't render anything
}

// Export a function to manually report custom metrics
export const reportCustomMetric = (name, value, unit = 'ms') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'custom_metric', {
      event_category: 'Performance',
      event_label: name,
      value: value,
      custom_parameter_1: unit,
    })
  }

  console.log(`Custom metric - ${name}: ${value}${unit}`)
}
