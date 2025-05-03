"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import PropTypes from "prop-types"
import { ChevronLeft, ChevronRight, Wifi, Battery, Signal, Loader2 } from "lucide-react"

// Helper function to extract dominant colors from video frames
const extractColors = (videoElement, canvas, callback) => {
  if (!videoElement || !canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  // Draw the current video frame to the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Sample more points for better color variety
  const regions = [
    {x: Math.floor(canvas.width / 2), y: 0}, // top center
    {x: 0, y: Math.floor(canvas.height / 2)}, // middle left
    {x: canvas.width - 1, y: Math.floor(canvas.height / 2)}, // middle right
    {x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2)}, // center
    {x: Math.floor(canvas.width / 2), y: canvas.height - 1} // bottom center
  ];

  // Get raw colors
  const rawColors = regions.map(({x, y}) => {
    const pixel = context.getImageData(x, y, 1, 1).data;
    return {r: pixel[0], g: pixel[1], b: pixel[2]};
  });

  // Sort colors by vibrancy (sum of RGB values) and take the most vibrant ones
  const vibrantColors = [...rawColors]
    .sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b))
    .slice(0, 3)
    .map(color => `rgb(${color.r}, ${color.g}, ${color.b})`);

  callback(vibrantColors);
};

export default function MobilePreview({ banners, onColorsExtracted }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState({})
  const [videoColors, setVideoColors] = useState({})
  const videoRefs = useRef({})
  const canvasRef = useRef(null)
  const colorExtractionTimerRef = useRef(null)

  // Initialize video loading states and canvas
  useEffect(() => {
    const initialLoadState = {}
    banners.forEach((banner, index) => {
      if (banner.type === "video") {
        initialLoadState[index] = false
      }
    })
    setVideoLoaded(initialLoadState)

    // Create canvas for color extraction
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 32;  // small size is enough for color sampling
      canvasRef.current.height = 32;
    }

    // Try to retrieve cached video colors from localStorage
    try {
      const cachedColors = localStorage.getItem('cachedMobileVideoColors')
      if (cachedColors) {
        setVideoColors(JSON.parse(cachedColors))
      }
    } catch (error) {
      console.error("Error retrieving cached video colors:", error)
    }

    return () => {
      if (colorExtractionTimerRef.current) {
        clearInterval(colorExtractionTimerRef.current);
      }
    };
  }, [banners])

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      if (banners.length > 1) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [banners.length])

  // Handle video playback when slide changes
  useEffect(() => {
    // Pause all videos
    Object.keys(videoRefs.current).forEach(index => {
      const videoElement = videoRefs.current[index]
      if (videoElement && !videoElement.paused) {
        videoElement.pause()
      }
    })

    // Play the current video if it's a video slide
    const currentBanner = banners[currentIndex]
    if (currentBanner && currentBanner.type === "video") {
      const videoElement = videoRefs.current[currentIndex]
      if (videoElement) {
        // Set a small timeout to ensure DOM is ready
        setTimeout(() => {
          const playPromise = videoElement.play()
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Error playing video in mobile preview:", error)
            })
          }

          // Start extracting colors periodically
          if (colorExtractionTimerRef.current) {
            clearInterval(colorExtractionTimerRef.current);
          }

          colorExtractionTimerRef.current = setInterval(() => {
            extractColors(videoElement, canvasRef.current, (colors) => {
              const newColors = {...videoColors};
              newColors[currentBanner.url] = colors;
              setVideoColors(newColors);

              // Cache the colors
              try {
                localStorage.setItem('cachedMobileVideoColors', JSON.stringify(newColors));
              } catch (error) {
                console.error("Error caching video colors:", error);
              }

              // If we have a color update handler and new colors differ from stored ones, update in Firebase
              if (onColorsExtracted && (!currentBanner.extractedColors ||
                  !arraysEqual(
                    currentBanner.extractedColors.length === 5
                      ? [currentBanner.extractedColors[0], currentBanner.extractedColors[4], currentBanner.extractedColors[3]]
                      : currentBanner.extractedColors,
                    colors)
                 )) {
                // Convert mobile 3-color format to 5-color format expected by Firebase
                // We do this by duplicating some colors to match the BannerSlideshow format
                const fiveColorFormat = currentBanner.extractedColors?.length === 5
                  ? currentBanner.extractedColors // already in 5-color format
                  : [colors[0], colors[0], colors[2], colors[2], colors[1]]; // convert to 5-color format

                onColorsExtracted(currentBanner.id, fiveColorFormat);
              }
            });
          }, 1000); // Extract colors every second
        }, 50)
      }
    }

    return () => {
      if (colorExtractionTimerRef.current) {
        clearInterval(colorExtractionTimerRef.current);
      }
    };
  }, [currentIndex, banners, videoColors, onColorsExtracted])

  const handleVideoLoad = (index) => {
    setVideoLoaded(prev => ({ ...prev, [index]: true }))
  }

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

  // Get current banner's colors for gradient
  const currentBanner = banners[currentIndex];
  const currentUrl = currentBanner?.url || '';

  // First check if the banner already has extractedColors stored from Firebase
  let currentColors = [];
  if (currentBanner?.extractedColors && currentBanner.extractedColors.length > 0) {
    // For mobile preview, we might need to map the 5 colors to 3 colors format
    if (currentBanner.extractedColors.length >= 5) {
      // Convert from 5 color format to 3 color format
      const [topLeft, topRight, bottomLeft, bottomRight, center] = currentBanner.extractedColors;
      currentColors = [topLeft, center, bottomRight];
    } else {
      currentColors = currentBanner.extractedColors;
    }
  } else {
    // Fall back to colors from localStorage if not available in the banner object
    currentColors = videoColors[currentUrl] || [];
  }

  // Generate a gradient style based on extracted colors
  const gradientStyle = {};
  if (currentBanner?.type === 'video' && currentColors.length > 0) {
    // Create a more vibrant linear gradient using extracted colors
    const [top, middle, bottom] = currentColors;
    gradientStyle.background = `linear-gradient(to bottom,
                               ${top || 'rgba(0,0,0,0.7)'} 10%,
                               ${middle || 'rgba(0,0,0,0.5)'} 50%,
                               ${bottom || 'rgba(0,0,0,0.7)'} 90%)`;
    // Add these to make gradient more visible
    gradientStyle.position = 'absolute';
    gradientStyle.inset = '0';
    gradientStyle.zIndex = '1';
    gradientStyle.opacity = '0.85'; // Make gradient more visible
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
        {/* Gradient Background Layer */}
        {currentBanner?.type === 'video' && currentColors.length > 0 && (
          <div className="absolute inset-0" style={gradientStyle}></div>
        )}

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
              <div className="relative h-full w-full bg-black flex items-center justify-center">
                {!videoLoaded[index] && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-white ml-1 text-[8px]">Loading...</span>
                  </div>
                )}
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={banner.url}
                  className="h-auto max-h-full max-w-[85%] rounded-sm object-contain mx-auto z-10 transform scale-125"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/video-placeholder.jpg"
                  onLoadedData={() => handleVideoLoad(index)}
                  onError={(e) => console.error("Mobile preview video error:", e)}
                  style={{
                    backgroundColor: 'transparent',
                    objectFit: 'cover',
                    transformOrigin: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-20" />

                {/* Banner content with tag, title, description, and button */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 text-white z-30">
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
        <div className="absolute bottom-1 left-0 right-0 flex justify-center items-center z-40">
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

// Helper function to compare arrays
function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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
      buttonLink: PropTypes.string,
      extractedColors: PropTypes.array
    })
  ).isRequired,
  onColorsExtracted: PropTypes.func
}

// Set default props
MobilePreview.defaultProps = {
  onColorsExtracted: null
}
