'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'Type:', selectedType)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search students, teachers, classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

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

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-gray-100' : ''}
        >
          <Filter className="h-4 w-4" />
        </Button>

        <Button type="submit">Search</Button>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow border">
          <h3 className="text-sm font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Add more filters here as needed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {/* Add class options dynamically */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}