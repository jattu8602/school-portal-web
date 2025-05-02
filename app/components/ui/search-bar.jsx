'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SearchBar() {
  // Core states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Placeholders list
  const placeholders = [
    'Search students...',
    'Search for classes...',
    'Search teachers...',
    'Search for fees...',
    'Search for attendance...',
    'Search for timetable...',
  ]

  // Animation states
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [count, setCount] = useState(0) // 0 to 100
  const phaseRef = useRef('countUp')
  const intervalRef = useRef(null)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blink effect
  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 500)
    return () => clearInterval(blink)
  }, [])

  // Detect mobile for styling only
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Faster percent-based placeholder animation on all screens when input empty
  useEffect(() => {
    if (searchQuery) {
      setDisplayText('')
      return
    }

    if (intervalRef.current) clearInterval(intervalRef.current)

    const current = placeholders[placeholderIndex]
    phaseRef.current = 'countUp'
    setCount(0)

    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (phaseRef.current === 'countUp') {
          if (c < 100) {
            const pct = c + 2
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            phaseRef.current = 'countDown'
            return c
          }
        } else {
          if (c > 0) {
            const pct = c - 2
            const len = Math.floor((pct / 100) * current.length)
            setDisplayText(current.slice(0, len))
            return pct
          } else {
            setPlaceholderIndex((idx) => (idx + 1) % placeholders.length)
            phaseRef.current = 'countUp'
            return 0
          }
        }
      })
    }, 40)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [searchQuery, placeholderIndex])

  // Input change handler
  const onChange = (e) => {
    setSearchQuery(e.target.value)
    setIsLoading(true)
    clearTimeout(window._searchTimeout)
    window._searchTimeout = setTimeout(() => setIsLoading(false), 500)
  }

  // Form submit handler
  const onSubmit = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery, 'Type:', selectedType)
  }

  // Combine display text and cursor
  const placeholderToShow = displayText + (showCursor && !searchQuery ? ' |' : '')

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          {/* Search icon for desktop */}
          {!isMobile && (
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          )}

          {/* Input field */}
          <Input
            type="text"
            placeholder={placeholderToShow}
            value={searchQuery}
            onChange={onChange}
            className={`py-2 text-sm w-full rounded-lg border border-gray-300 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${
              isMobile ? 'pl-3 pr-8' : 'pl-10 pr-12'
            }`}
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Loader or submit */}
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin" />
            ) : (
              <Button type="submit" className="h-8 p-2">
                <span className="hidden sm:inline">Search</span>
                <Search className="h-4 w-4 sm:inline sm:hidden" />
              </Button>
            )}
          </div>
        </div>

        {/* Type selector for desktop */}
        <div className="hidden sm:block">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Search in..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="teachers">Teachers</SelectItem>
              <SelectItem value="classes">Classes</SelectItem>

            </SelectContent>
          </Select>
        </div>
      </form>
    </div>
  )
}
