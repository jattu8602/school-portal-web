'use client'

import { useState, useEffect, useRef } from 'react'

export default function LazySection({
  children,
  fallback = <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
  rootMargin = '100px',
  threshold = 0.1,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [rootMargin, threshold, hasLoaded])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  )
}

// Higher-order component for lazy loading
export function withLazyLoading(Component, fallbackComponent) {
  return function LazyComponent(props) {
    return (
      <LazySection fallback={fallbackComponent}>
        <Component {...props} />
      </LazySection>
    )
  }
}

// Hook for lazy loading
export function useLazyLoading(rootMargin = '100px', threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true)
          setHasLoaded(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [rootMargin, threshold, hasLoaded])

  return [ref, isVisible, hasLoaded]
}
