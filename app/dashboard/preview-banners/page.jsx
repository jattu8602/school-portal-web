"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, orderBy, updateDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Smartphone, Monitor, Trash2, Edit, Video, Plus } from "lucide-react"
import BannerSlideshow from "@/app/components/dashboard/BannerSlideshow"
import MobilePreview from "../../components/dashboard/MobilePreview"
import Image from "next/image"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function PreviewBannersPage() {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState([])
  const [viewMode, setViewMode] = useState("web")
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          await fetchBanners(currentUser.uid)
        } catch (error) {
          console.error("Error fetching banners:", error)
          setError("Failed to load banners. Using sample banners instead.")
          setBanners(getDefaultBanners())
        } finally {
          setLoading(false)
        }
      } else {
        router.push("/auth/signin")
      }
    })

    return () => unsubscribe()
  }, [router])

  const fetchBanners = async (schoolId) => {
    try {
      console.log("Fetching banners for preview for school ID:", schoolId);

      // Check if the school document exists first
      const schoolDocRef = doc(db, "schools", schoolId);
      const schoolDoc = await getDoc(schoolDocRef);

      if (!schoolDoc.exists()) {
        console.error("School document not found");
        setBanners([]);
        return;
      }

      // Simple query to get all banners for this school
      const bannersQuery = query(
        collection(db, 'banners'),
        where('schoolId', '==', schoolId)
      );

      console.log("Executing banners query");
      const bannersSnapshot = await getDocs(bannersQuery);
      console.log(`Found ${bannersSnapshot.size} banners`);

      const fetchedBanners = [];

      bannersSnapshot.forEach((doc) => {
        const bannerData = doc.data();
        // Add all banners to the preview list
        fetchedBanners.push({
          id: doc.id,
          title: bannerData.title,
          description: bannerData.description,
          type: bannerData.type,
          url: bannerData.url,
          tags: bannerData.tags || [],
          buttonText: bannerData.buttonText,
          buttonLink: bannerData.buttonLink,
          status: bannerData.status || 'active',
          startDate: bannerData.startDate || new Date().toISOString(),
          endDate: bannerData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: bannerData.createdAt || new Date().toISOString(),
          updatedAt: bannerData.updatedAt || new Date().toISOString()
        });
      });

      // Sort by createdAt in memory
      fetchedBanners.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBanners(fetchedBanners);
      console.log("Banners set in state:", fetchedBanners.length);
    } catch (error) {
      console.error("Error fetching banners for preview:", error);
      setBanners([]);
    }
  };

  const getDefaultBanners = () => {
    return [
      {
        id: "1",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        title: "Welcome to Our School",
        description: "Providing quality education since 1995",
        createdAt: new Date(),
      },
      {
        id: "2",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1547634631/samples/landscapes/architecture-signs.jpg",
        title: "Annual Sports Day",
        description: "Join us on December 15th for our annual sports event",
        createdAt: new Date(),
      },
      {
        id: "3",
        type: "image",
        url: "https://res.cloudinary.com/demo/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1547634631/samples/landscapes/nature-mountains.jpg",
        title: "New Science Lab",
        description: "Explore our newly renovated science laboratory",
        createdAt: new Date(),
      },
    ];
  };

  const handleDelete = async (id) => {
    if (!user) return;

    try {
      // Delete from Firestore if it's not a default banner
      if (id !== "1" && id !== "2" && id !== "3") {
        await deleteDoc(doc(db, "banners", id));
      }

      // Update UI
      setBanners(banners.filter((banner) => banner.id !== id));
      setSuccess("Banner deleted successfully");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting banner:", error);
      setError("Failed to delete banner. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  const handleEdit = (id) => {
    console.log("Editing banner with ID:", id);
    router.push(`/dashboard/edit-banner/${id}`);
  };

  // Function to update banner colors in Firebase
  const updateBannerColors = useCallback(async (bannerId, colors) => {
    if (!user || colors.length === 0) return;

    try {
      const bannerRef = doc(db, "banners", bannerId);
      await updateDoc(bannerRef, {
        extractedColors: colors,
        updatedAt: new Date().toISOString()
      });
      console.log(`Updated colors for banner ${bannerId}`);

      // Update local state to reflect the change without refetching
      setBanners(prev =>
        prev.map(banner =>
          banner.id === bannerId
            ? { ...banner, extractedColors: colors }
            : banner
        )
      );
    } catch (error) {
      console.error("Error updating banner colors:", error);
    }
  }, [user]);

  // Function to handle color extraction from videos
  const handleColorExtraction = useCallback((bannerId, colors) => {
    if (colors.length > 0) {
      updateBannerColors(bannerId, colors);
    }
  }, [updateBannerColors]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg">Loading banners...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banners Manager</h1>
          </div>
          <Button onClick={() => router.push("/dashboard/add-banner")} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add New Banner
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

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Banner Preview</CardTitle>
                    <CardDescription>See how your banners will appear to users</CardDescription>
                  </div>
                  <Tabs value={viewMode} onValueChange={setViewMode} className="md:block">
                    <TabsList>
                      <TabsTrigger value="web" className="flex items-center">
                        <Monitor className="mr-2 h-4 w-4" />
                        Web
                      </TabsTrigger>
                      <TabsTrigger value="mobile" className="flex items-center">
                        <Smartphone className="mr-2 h-4 w-4" />
                        Mobile
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {viewMode === "web" ? (
                  <div className="h-[400px]">
                    <BannerSlideshow banners={banners} onColorsExtracted={handleColorExtraction} />
                  </div>
                ) : (
                  <div className="flex justify-center py-8">
                    <MobilePreview banners={banners} onColorsExtracted={handleColorExtraction} />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Banners</CardTitle>
                <CardDescription>Edit or delete your existing banners</CardDescription>
              </CardHeader>
              <CardContent>
                {banners.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No banners available</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {banners.map((banner) => (
                      <div key={banner.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="relative h-16 w-24 rounded overflow-hidden flex-shrink-0">
                          {banner.type === "image" ? (
                            <img
                              src={banner.url}
                              alt={banner.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-200 dark:bg-gray-800 h-full w-full flex items-center justify-center">
                              <Video className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-gray-900 dark:text-white">{banner.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{banner.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(banner.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(banner.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/3">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Mobile Preview</CardTitle>
                <CardDescription>How banners appear on mobile devices</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <MobilePreview banners={banners} onColorsExtracted={handleColorExtraction} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
