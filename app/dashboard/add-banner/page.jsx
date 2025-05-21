"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, collection, addDoc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UploadCloud, Image as ImageIcon, Video, X, Tag as TagIcon, Plus, Link as LinkIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MobilePreview from "@/app/components/dashboard/MobilePreview"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Helper function to extract dominant colors from video frames
const extractColors = (videoElement, canvas, callback) => {
  if (!videoElement || !canvas) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  // Draw the current video frame to the canvas
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  // Extract color data from 4 different regions (4 corners)
  const regions = [
    {x: 0, y: 0}, // top-left
    {x: canvas.width - 1, y: 0}, // top-right
    {x: 0, y: canvas.height - 1}, // bottom-left
    {x: canvas.width - 1, y: canvas.height - 1} // bottom-right
  ];

  const colors = regions.map(({x, y}) => {
    const pixel = context.getImageData(x, y, 1, 1).data;
    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  });

  // Get central region color too
  const centerX = Math.floor(canvas.width / 2);
  const centerY = Math.floor(canvas.height / 2);
  const centerPixel = context.getImageData(centerX, centerY, 1, 1).data;
  const centerColor = `rgb(${centerPixel[0]}, ${centerPixel[1]}, ${centerPixel[2]})`;

  // Pass extracted colors to callback
  callback([...colors, centerColor]);
};

// Add these environment variables to your .env.local file
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
// NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

export default function AddBannerPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [bannerType, setBannerType] = useState("image")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [tag, setTag] = useState("")
  const [buttonText, setButtonText] = useState("")
  const [buttonLink, setButtonLink] = useState("")
  const [extractedColors, setExtractedColors] = useState([])
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const colorExtractionTimerRef = useRef(null)
  const router = useRouter()

  // Create canvas for color extraction when component mounts
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Verify if the user is a school admin
        try {
          const schoolDoc = await getDoc(doc(db, "schools", currentUser.uid))
          if (!schoolDoc.exists()) {
            console.error("User is not a school admin")
            router.push("/auth/signin")
            return
          }
          setUser(currentUser)
          await fetchSchoolInfo(currentUser.uid)
          setLoading(false)
        } catch (error) {
          console.error("Error verifying school admin:", error)
          router.push("/auth/signin")
        }
      } else {
        router.push("/auth/signin")
      }
    })

    return () => unsubscribe()
  }, [router])

  // Update colors when the video element changes
  useEffect(() => {
    if (bannerType === "video" && videoRef.current && previewUrl) {
      // Clear any existing timer
      if (colorExtractionTimerRef.current) {
        clearInterval(colorExtractionTimerRef.current);
      }

      // Extract colors periodically to update as the video plays
      videoRef.current.addEventListener('loadeddata', () => {
        colorExtractionTimerRef.current = setInterval(() => {
          extractColors(videoRef.current, canvasRef.current, (colors) => {
            setExtractedColors(colors);
          });
        }, 1000);
      });
    }

    return () => {
      if (colorExtractionTimerRef.current) {
        clearInterval(colorExtractionTimerRef.current);
      }
    };
  }, [bannerType, previewUrl]);

  const fetchSchoolInfo = async (schoolId) => {
    try {
      const schoolDoc = await getDoc(doc(db, "schools", schoolId))
      if (schoolDoc.exists()) {
        setSchoolInfo(schoolDoc.data())
      }
    } catch (error) {
      console.error("Error fetching school info:", error)
      setError("Failed to fetch school information")
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic validation
    if (bannerType === "image" && !file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    if (bannerType === "video" && !file.type.startsWith("video/")) {
      setError("Please select a video file")
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)
      setError("")
      setExtractedColors([])

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload to Cloudinary
      // Using demo cloud for testing purposes - in production you should use your own Cloudinary account
      // These values can be set in .env.local file
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"

      console.log("Using Cloudinary configuration:", { cloudName, uploadPreset })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

      // For regular cloudinary account with proper folder structure:
      if (user && user.uid) {
        formData.append("folder", `school-banners/${user.uid}`)
      }

      const resourceType = bannerType === "image" ? "image" : "video"
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

      console.log(`Uploading to: ${uploadUrl}`)

      // Create toast for uploading progress
      let toastId = null;
      if (bannerType === "video") {
        toastId = toast.info("Starting video upload...", {
          autoClose: false,
          closeButton: false,
          draggable: false,
          closeOnClick: false,
          progress: 0
        });
      }

      // Use XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);

          // Update toast progress for video uploads
          if (bannerType === "video" && toastId) {
            toast.update(toastId, {
              render: `Uploading video: ${percentComplete}%`,
              progress: percentComplete / 100,
            });
          }
        }
      });

      // Setup promise to handle completion
      const uploadPromise = new Promise((resolve, reject) => {
        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Failed to parse response"));
            }
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error occurred")));
        xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));
      });

      // Open and send request
      xhr.open("POST", uploadUrl);
      xhr.send(formData);

      // Wait for completion
      const data = await uploadPromise;

      // Success - update toast for video
      if (bannerType === "video" && toastId) {
        toast.update(toastId, {
          render: "Video uploaded successfully!",
          type: "success",
          autoClose: 3000,
          closeButton: true,
          closeOnClick: true,
          progress: 1,
        });
      } else if (bannerType === "image") {
        // For image, just show a simple success toast
        toast.success("Image uploaded successfully!");
      }

      console.log("Upload successful:", data);
      setMediaUrl(data.secure_url);
      setUploading(false);
      setUploadProgress(100);

      // Save video colors to localStorage for later use
      if (bannerType === "video" && extractedColors.length > 0) {
        try {
          const cachedColors = JSON.parse(localStorage.getItem('cachedVideoColors') || '{}');
          cachedColors[data.secure_url] = extractedColors;
          localStorage.setItem('cachedVideoColors', JSON.stringify(cachedColors));
        } catch (error) {
          console.error("Error caching video colors:", error);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(`Failed to upload file: ${error.message}. Please try again.`);
      setUploading(false);
      setUploadProgress(0);

      // Show error toast
      toast.error(`Upload failed: ${error.message}`);
    }
  }

  const handleRemoveMedia = () => {
    setMediaUrl("")
    setPreviewUrl("")
    setUploadProgress(0)
    setExtractedColors([])

    if (colorExtractionTimerRef.current) {
      clearInterval(colorExtractionTimerRef.current);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("You must be logged in to create a banner")
      return
    }

    if (!title.trim()) {
      setError("Please enter a title")
      return
    }

    if (!description.trim()) {
      setError("Please enter a description")
      return
    }

    if (!mediaUrl) {
      setError("Please upload a file")
      return
    }

    try {
      setUploading(true)
      setError("")

      // Save to Firestore
      const bannerData = {
        type: bannerType,
        url: mediaUrl,
        title: title.trim(),
        description: description.trim(),
        tags: tag.trim() ? [tag.trim()] : [],
        buttonText: buttonText.trim(),
        buttonLink: buttonLink.trim(),
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        schoolId: user.uid
      }

      // Add extracted colors to banner data if available
      if (bannerType === "video" && extractedColors.length > 0) {
        bannerData.extractedColors = extractedColors;
      }

      console.log("Saving banner to Firestore:", bannerData);
      console.log("User ID (school ID):", user.uid);
      console.log("Collection path:", 'banners');

      // Create the document in the top-level banners collection
      const docRef = await addDoc(collection(db, "banners"), bannerData);
      console.log("Banner saved with ID:", docRef.id);

      setSuccess("Banner added successfully! Redirecting to banner preview...");
      toast.success("Banner added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setMediaUrl("");
      setPreviewUrl("");
      setTag("");
      setButtonText("");
      setButtonLink("");
      setUploadProgress(0);
      setExtractedColors([]);

      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/dashboard/preview-banners");
      }, 2000);
    } catch (error) {
      console.error("Save error:", error);
      setError(`Failed to save banner: ${error.message}. Please try again.`);
      toast.error(`Failed to save banner: ${error.message}`);
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // For preview
  const previewBanner = {
    id: "preview",
    type: bannerType,
    url: previewUrl || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    title: title || "Banner Title",
    description: description || "Banner Description",
    tags: tag ? [tag] : [],
    buttonText: buttonText || "",
    buttonLink: buttonLink || "#",
  }

  // Generate a gradient background style if video colors are available
  const gradientStyle = {};
  if (bannerType === 'video' && extractedColors.length >= 5) {
    const [topLeft, topRight, bottomLeft, bottomRight, center] = extractedColors;
    gradientStyle.background = `radial-gradient(circle at center, ${center} 30%, ${topLeft} 70%, ${bottomRight} 100%)`;
    // Add these properties to make gradient visible
    gradientStyle.position = 'absolute';
    gradientStyle.inset = '0';
    gradientStyle.zIndex = '1';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Banner</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/preview-banners")}
          >
            View All Banners
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload">Upload Media</TabsTrigger>
                <TabsTrigger value="details">Banner Details</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Banner Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={bannerType}
                      onValueChange={setBannerType}
                      className="flex space-x-4 mb-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image" id="option-image" />
                        <Label htmlFor="option-image" className="flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Image
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="option-video" />
                        <Label htmlFor="option-video" className="flex items-center">
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Label>
                      </div>
                    </RadioGroup>

                    {mediaUrl ? (
                      <div className="relative">
                        <div className="aspect-video rounded-md overflow-hidden bg-gray-100 relative">
                          {bannerType === 'video' && extractedColors.length >= 5 && (
                            <div className="absolute inset-0" style={gradientStyle}></div>
                          )}
                          {bannerType === "image" ? (
                            <img
                              src={previewUrl || mediaUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <video
                                ref={videoRef}
                                src={previewUrl || mediaUrl}
                                className="h-auto max-h-full max-w-[90%] rounded-md object-contain mx-auto z-10 transform scale-115"
                                controls
                                autoPlay
                                muted
                                loop
                                style={{
                                  backgroundColor: 'transparent',
                                  objectFit: 'cover',
                                  transformOrigin: 'center',
                                }}
                              />
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 z-20"
                            onClick={handleRemoveMedia}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex justify-between mt-3">
                          <p className="text-sm text-green-600">
                            ✓ Media uploaded successfully
                          </p>

                          {bannerType === 'video' && extractedColors.length > 0 && (
                            <div className="flex space-x-1">
                              {extractedColors.map((color, index) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded-full border border-gray-300"
                                  style={{ backgroundColor: color }}
                                  title={`Extracted color ${index + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <p className="mt-2 block text-sm text-gray-600">
                            {bannerType === "image"
                              ? "Upload an image for your banner (PNG, JPG, WEBP)"
                              : "Upload a video for your banner (MP4, WEBM)"}
                          </p>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept={bannerType === "image" ? "image/*" : "video/*"}
                            className="hidden"
                            onChange={handleFileChange}
                            disabled={uploading}
                          />
                          <Button
                            disabled={uploading}
                            className="mt-4"
                            variant="secondary"
                            type="button"
                            onClick={() => document.getElementById('file-upload').click()}
                          >
                            {uploading ? "Uploading..." : "Select File"}
                          </Button>

                          {uploading && uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                Uploading: {uploadProgress}%
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form id="bannerForm" onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="Enter banner title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={uploading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Enter banner description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            disabled={uploading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tag" className="flex items-center">
                            <TagIcon className="h-4 w-4 mr-2" />
                            Banner Tag
                          </Label>
                          <Input
                            id="tag"
                            placeholder="Enter a tag (e.g., Announcement, Event)"
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            disabled={uploading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buttonText" className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Button Text (Optional)
                          </Label>
                          <Input
                            id="buttonText"
                            placeholder="Enter button text (e.g., Learn More)"
                            value={buttonText}
                            onChange={(e) => setButtonText(e.target.value)}
                            disabled={uploading}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="buttonLink" className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Button Link (Optional)
                          </Label>
                          <Input
                            id="buttonLink"
                            placeholder="Enter button link (e.g., https://example.com)"
                            value={buttonLink}
                            onChange={(e) => setButtonLink(e.target.value)}
                            disabled={uploading}
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter>
                    <Button
                      form="bannerForm"
                      type="submit"
                      className="w-full"
                      disabled={uploading || !mediaUrl}
                    >
                      {uploading ? "Saving..." : "Save Banner"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Preview & Navigation</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-center py-6">
                  <MobilePreview banners={[previewBanner]} />
                </div>

                <div className="space-y-2 mt-4">
                  <h3 className="font-medium text-sm">Quick Navigation</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/dashboard/preview-banners")}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      View All Banners
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
