"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Pause, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import PropTypes from "prop-types"

// Helper function to extract dominant colors from video frames
const extractColors = (videoElement, canvas, callback) => {
  if (!videoElement || !canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  // Draw the current video frame to the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Sample more points for better color extraction
  const regions = [
    {x: 0, y: 0}, // top-left
    {x: canvas.width - 1, y: 0}, // top-right
    {x: 0, y: canvas.height - 1}, // bottom-left
    {x: canvas.width - 1, y: canvas.height - 1}, // bottom-right
    {x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 2)}, // center
    {x: Math.floor(canvas.width / 2), y: Math.floor(canvas.height / 4)}, // upper middle
    {x: Math.floor(canvas.width / 2), y: Math.floor(3 * canvas.height / 4)}, // lower middle
  ];

  // Get raw colors
  const rawColors = regions.map(({x, y}) => {
    const pixel = context.getImageData(x, y, 1, 1).data;
    return {r: pixel[0], g: pixel[1], b: pixel[2]};
  });

  // Sort colors by vibrancy (sum of RGB values) and take the most vibrant ones
  const vibrantColors = [...rawColors]
    .sort((a, b) => (b.r + b.g + b.b) - (a.r + a.g + a.b))
    .slice(0, 5)
    .map(color => `rgb(${color.r}, ${color.g}, ${color.b})`);

  // Pass extracted colors to callback
  callback(vibrantColors);
};

/**
 * Banner slideshow component for displaying school banners
 */
export default function BannerSlideshow({ banners, onColorsExtracted }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [videoLoaded, setVideoLoaded] = useState({})
  const [cachedVideos, setCachedVideos] = useState({})
  const [videoColors, setVideoColors] = useState({})
  const intervalRef = useRef(null)
  const videoRefs = useRef({})
  const canvasRef = useRef(null)
  const colorExtractionTimerRef = useRef(null)

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Initialize video loading states and cache on mount
  useEffect(() => {
    // Initialize loading states for all videos
    const initialLoadState = {}
    banners.forEach((banner, index) => {
      if (banner.type === "video") {
        initialLoadState[index] = false
      }
    })
    setVideoLoaded(initialLoadState)

    // Try to retrieve cached video URLs from localStorage
    try {
      const cachedData = localStorage.getItem('cachedBannerVideos')
      if (cachedData) {
        setCachedVideos(JSON.parse(cachedData))
      }

      // Try to retrieve cached video colors from localStorage
      const cachedColors = localStorage.getItem('cachedVideoColors')
      if (cachedColors) {
        setVideoColors(JSON.parse(cachedColors))
      }
    } catch (error) {
      console.error("Error retrieving cached videos:", error)
    }

    // Create canvas for color extraction
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 64;  // small size is enough for color sampling
      canvasRef.current.height = 36;
    }

    return () => {
      if (colorExtractionTimerRef.current) {
        clearInterval(colorExtractionTimerRef.current);
      }
    };
  }, [banners])

  // Handle slideshow autoplay
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(goToNext, 5000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying])

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
              console.error("Error playing video:", error)
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

              // Cache the colors locally
              try {
                localStorage.setItem('cachedVideoColors', JSON.stringify(newColors));
              } catch (error) {
                console.error("Error caching video colors:", error);
              }

              // If the banner doesn't already have colors stored or we have a color update handler, update in Firebase
              if (onColorsExtracted && (!currentBanner.extractedColors || !arraysEqual(currentBanner.extractedColors, colors))) {
                onColorsExtracted(currentBanner.id, colors);
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

  // Cache video URLs when they're successfully loaded
  const handleVideoLoad = (index, url) => {
    setVideoLoaded(prev => ({ ...prev, [index]: true }))

    // Cache the video URL in localStorage
    try {
      const updatedCache = { ...cachedVideos, [url]: true }
      setCachedVideos(updatedCache)
      localStorage.setItem('cachedBannerVideos', JSON.stringify(updatedCache))
    } catch (error) {
      console.error("Error caching video:", error)
    }
  }

  if (banners.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-gray-100 dark:bg-gray-800 text-center p-6">
        <div className="text-4xl mb-4">📷</div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No Banners Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">
          Add your first banner to showcase important announcements to teachers and students in the mobile app.
        </p>
      </div>
    )
  }

  // Get current banner's colors for gradient
  const currentBanner = banners[currentIndex];
  const currentUrl = currentBanner?.url || '';

  // First check if the banner already has extractedColors stored from Firebase
  let currentColors = [];
  if (currentBanner?.extractedColors && currentBanner.extractedColors.length > 0) {
    currentColors = currentBanner.extractedColors;
  } else {
    // Fall back to colors from localStorage if not available in the banner object
    currentColors = videoColors[currentUrl] || [];
  }

  // Generate a gradient style based on extracted colors
  const gradientStyle = {};
  if (currentBanner?.type === 'video' && currentColors.length > 0) {
    // Create a more vibrant gradient using extracted colors
    const [color1, color2, color3, color4, color5] = currentColors;
    gradientStyle.background = `radial-gradient(circle at center,
                                ${color1 || 'rgba(0,0,0,0.8)'} 20%,
                                ${color3 || 'rgba(0,0,0,0.7)'} 50%,
                                ${color5 || 'rgba(0,0,0,0.6)'} 80%)`;
    // Add these to make sure gradient is visible
    gradientStyle.position = 'absolute';
    gradientStyle.inset = '0';
    gradientStyle.zIndex = '1';
    gradientStyle.opacity = '0.9'; // Make gradient more visible but not fully opaque
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Gradient Background Layer - separated from content for proper layering */}
      {currentBanner?.type === 'video' && currentColors.length > 0 && (
        <div className="absolute inset-0" style={gradientStyle}></div>
      )}

      {/* Banner Content */}
      <div className="h-full w-full relative">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {banner.type === "image" ? (
              <div className="relative h-full w-full">
                <img
                  src={banner.url || "/placeholder.svg"}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6">
                  {/* Top tag */}
                  {banner.tags && banner.tags.length > 0 && (
                    <div className="self-start">
                      <span className="bg-primary/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
                        {banner.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* Content at bottom */}
                  <div className="flex flex-col items-start gap-3 sm:gap-4">
                    {banner.title && (
                      <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-bold leading-tight">
                        {banner.title}
                      </h3>
                    )}

                    {banner.description && (
                      <p className="text-sm sm:text-base text-white/90 max-w-lg">
                        {banner.description}
                      </p>
                    )}

                    {banner.buttonText && (
                      <Link
                        href={banner.buttonLink || "#"}
                        className="mt-1 sm:mt-3 inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors z-20 relative"
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
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    <span className="text-white ml-2 text-sm">Loading video...</span>
                  </div>
                )}
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={banner.url}
                  className="h-auto max-h-full max-w-[90%] rounded-md object-contain mx-auto z-10 transform scale-110"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={videoLoaded[index] ? undefined : "/video-placeholder.jpg"}
                  onLoadedData={() => handleVideoLoad(index, banner.url)}
                  onError={(e) => console.error("Video error:", e)}
                  style={{
                    backgroundColor: 'transparent',
                    objectFit: 'cover',
                    transformOrigin: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-20" />

                <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 z-30">
                  {/* Top tag */}
                  {banner.tags && banner.tags.length > 0 && (
                    <div className="self-start">
                      <span className="bg-primary/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full font-medium">
                        {banner.tags[0]}
                      </span>
                    </div>
                  )}

                  {/* Content at bottom */}
                  <div className="flex flex-col items-start gap-3 sm:gap-4">
                    {banner.title && (
                      <h3 className="text-xl sm:text-2xl md:text-3xl text-white font-bold leading-tight">
                        {banner.title}
                      </h3>
                    )}

                    {banner.description && (
                      <p className="text-sm sm:text-base text-white/90 max-w-lg">
                        {banner.description}
                      </p>
                    )}

                    {banner.buttonText && (
                      <Link
                        href={banner.buttonLink || "#"}
                        className="mt-1 sm:mt-3 inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm sm:text-base font-medium transition-colors z-20 relative"
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
      </div>

      {/* Navigation Controls - Side arrows positioned to not overlap with content */}
      <div className="absolute inset-0 flex items-center justify-between pointer-events-none z-40">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/20 text-white hover:bg-black/40 ml-2 sm:ml-4 pointer-events-auto"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/20 text-white hover:bg-black/40 mr-2 sm:mr-4 pointer-events-auto"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Indicators and Controls */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center items-center space-x-2 sm:space-x-4 pointer-events-none z-40">
        <div className="flex space-x-1 sm:space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 sm:h-2 w-4 sm:w-8 rounded-full transition-all pointer-events-auto ${index === currentIndex ? "bg-white" : "bg-white/40"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-black/20 text-white hover:bg-black/40 pointer-events-auto"
          onClick={togglePlayPause}
        >
          {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
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

BannerSlideshow.propTypes = {
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
BannerSlideshow.defaultProps = {
  onColorsExtracted: null
}
