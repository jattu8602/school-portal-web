"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, UploadCloud, Image as ImageIcon, Video, X, Tag as TagIcon, Link as LinkIcon, Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MobilePreview from "@/app/components/dashboard/MobilePreview"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function EditBannerPage({ params }) {
  const { id } = params
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
  const [banner, setBanner] = useState(null)
  const [tag, setTag] = useState("")
  const [buttonText, setButtonText] = useState("")
  const [buttonLink, setButtonLink] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        await fetchBanner(currentUser.uid, id)
        setLoading(false)
      } else {
        router.push("/auth/signin")
      }
    })

    return () => unsubscribe()
  }, [router, id])

  const fetchBanner = async (schoolId, bannerId) => {
    try {
      console.log("Fetching banner for edit, school ID:", schoolId, "banner ID:", bannerId);

      // Get the banner from the top-level banners collection
      const bannerDocRef = doc(db, "banners", bannerId);
      const bannerDoc = await getDoc(bannerDocRef);

      if (!bannerDoc.exists()) {
        setError("Banner not found");
        return;
      }

      const bannerData = bannerDoc.data();

      // Verify this banner belongs to this school
      if (bannerData.schoolId !== schoolId) {
        console.error("Banner does not belong to this school");
        setError("You don't have permission to edit this banner");
        return;
      }

      setBanner(bannerData);
      setBannerType(bannerData.type || "image");
      setTitle(bannerData.title || "");
      setDescription(bannerData.description || "");
      setMediaUrl(bannerData.url || "");
      setPreviewUrl(bannerData.url || "");
      setTag(bannerData.tags && bannerData.tags.length > 0 ? bannerData.tags[0] : "");
      setButtonText(bannerData.buttonText || "");
      setButtonLink(bannerData.buttonLink || "");
    } catch (error) {
      console.error("Error fetching banner:", error);
      setError(`Error fetching banner: ${error.message}`);
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

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Upload to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo"
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"

      console.log("Using Cloudinary configuration:", { cloudName, uploadPreset })

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", uploadPreset)

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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

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

      // Update in Firestore
      const bannerData = {
        type: bannerType,
        url: mediaUrl,
        title: title.trim(),
        description: description.trim(),
        tags: tag.trim() ? [tag.trim()] : [],
        buttonText: buttonText.trim(),
        buttonLink: buttonLink.trim(),
        updatedAt: new Date().toISOString()
      }

      console.log("Updating banner in Firestore:", bannerData)
      console.log("Document path:", `banners/${id}`)

      const bannerRef = doc(db, "banners", id)
      await updateDoc(bannerRef, bannerData)

      setSuccess("Banner updated successfully! Redirecting to banner preview...")
      toast.success("Banner updated successfully!")

      // Redirect after a brief delay
      setTimeout(() => {
        router.push("/dashboard/preview-banners")
      }, 2000)
    } catch (error) {
      console.error("Save error:", error)
      setError(`Failed to update banner: ${error.message}`)
      toast.error(`Failed to update banner: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading banner...</p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => router.push("/dashboard/preview-banners")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Banners
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Banner</h1>
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
                <TabsTrigger value="upload">Banner Media</TabsTrigger>
                <TabsTrigger value="details">Banner Details</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={bannerType}
                      onValueChange={setBannerType}
                      className="flex space-x-4 mb-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image" id="option-image" disabled={banner && banner.type !== "image"} />
                        <Label htmlFor="option-image" className="flex items-center">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Image
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="option-video" disabled={banner && banner.type !== "video"} />
                        <Label htmlFor="option-video" className="flex items-center">
                          <Video className="h-4 w-4 mr-2" />
                          Video
                        </Label>
                      </div>
                    </RadioGroup>

                    {mediaUrl ? (
                      <div className="relative">
                        <div className="aspect-video rounded-md overflow-hidden bg-gray-100 relative">
                          {bannerType === "image" ? (
                            <img
                              src={previewUrl || mediaUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={previewUrl || mediaUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveMedia}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-green-600 mt-2">
                          ✓ Media uploaded successfully
                        </p>
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
                      {uploading ? "Saving..." : "Update Banner"}
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