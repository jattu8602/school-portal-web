"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import PropTypes from "prop-types"
import { ChevronLeft, ChevronRight, Wifi, Battery, Signal } from "lucide-react"

export default function MobilePreview({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Auto-rotate banners
    const interval = setInterval(() => {
      if (banners.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  const formattedTime = () => {
    const now = new Date()
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`
  }

  if (banners.length === 0) {
    return (
      <div className="w-[280px] h-[560px] bg-black rounded-[36px] border-[10px] border-gray-800 overflow-hidden shadow-xl flex items-center justify-center">
        <div className="text-white text-center p-5">
          <p>No banners to preview</p>
          <p className="text-sm text-gray-400">Add banners to see the preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[280px] h-[560px] bg-black rounded-[36px] border-[10px] border-gray-800 overflow-hidden shadow-xl">
      {/* Status Bar */}
      <div className="h-7 bg-black flex items-center justify-between px-4 text-white text-xs">
        <span>{formattedTime()}</span>
        <div className="flex items-center space-x-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>

      {/* Mobile App Header */}
      <div className="h-12 bg-primary text-white flex items-center justify-center relative">
        <h3 className="text-lg font-medium">PresentSir</h3>
      </div>

      {/* Banner Display */}
      <div className="relative h-[200px] overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {banner.type === "image" ? (
              <div className="relative h-full w-full">
                <Image
                  src={banner.url || "/placeholder.svg"}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Banner content with tag, title, description, and button */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 text-white">
                  {/* Top tag */}
                  {banner.tags && banner.tags.length > 0 && (
                    <div className="self-start">
                      <span className="bg-primary/60 text-white text-[8px] px-2 py-0.5 rounded-full font-medium">
                        {banner.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* Content at bottom */}
                  <div className="flex flex-col items-start gap-1">
                    {banner.title && (
                      <h3 className="text-sm font-bold leading-tight line-clamp-1">
                        {banner.title}
                      </h3>
                    )}

                    {banner.description && (
                      <p className="text-xs text-white/90 line-clamp-2">
                        {banner.description}
                      </p>
                    )}

                    {banner.buttonText && (
                      <Link
                        href={banner.buttonLink || "#"}
                        className="mt-1 bg-primary hover:bg-primary/90 text-white px-2 py-1 rounded text-[8px] font-medium z-10 relative"
                      >
                        {banner.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative h-full w-full bg-black">
                <video
                  src={banner.url}
                  className="h-full w-full object-contain"
                  autoPlay={index === currentIndex}
                  muted
                  loop
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Banner content with tag, title, description, and button */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 text-white">
                  {/* Top tag */}
                  {banner.tags && banner.tags.length > 0 && (
                    <div className="self-start">
                      <span className="bg-primary/60 text-white text-[8px] px-2 py-0.5 rounded-full font-medium">
                        {banner.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* Content at bottom */}
                  <div className="flex flex-col items-start gap-1">
                    {banner.title && (
                      <h3 className="text-sm font-bold leading-tight line-clamp-1">
                        {banner.title}
                      </h3>
                    )}

                    {banner.description && (
                      <p className="text-xs text-white/90 line-clamp-2">
                        {banner.description}
                      </p>
                    )}

                    {banner.buttonText && (
                      <Link
                        href={banner.buttonLink || "#"}
                        className="mt-1 bg-primary hover:bg-primary/90 text-white px-2 py-1 rounded text-[8px] font-medium z-10 relative"
                      >
                        {banner.buttonText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center">
          <div className="flex space-x-1">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* App Content Preview */}
      <div className="p-4 bg-gray-100 flex-1 h-[320px]">
        <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
          <h3 className="text-sm font-medium mb-1">Today's Schedule</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Mathematics</span>
              <span className="text-gray-500">8:30 - 9:30 AM</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Science</span>
              <span className="text-gray-500">9:30 - 10:30 AM</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <h3 className="text-sm font-medium mb-1">Announcements</h3>
          <p className="text-xs text-gray-600">Parent-teacher meeting on Friday at 4 PM. All parents are requested to attend.</p>
        </div>
      </div>
    </div>
  )
}

MobilePreview.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["image", "video"]).isRequired,
      url: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      buttonText: PropTypes.string,
      buttonLink: PropTypes.string
    })
  ).isRequired
}
