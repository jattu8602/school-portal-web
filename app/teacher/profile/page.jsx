"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Edit2,
  Save,
  BookOpen,
  Award,
} from "lucide-react"

export default function TeacherProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [editedProfile, setEditedProfile] = useState(null)
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/teacher/login')
          return
        }

        const { schoolId, id: teacherId } = userData

        // Fetch teacher profile
        const teacherDoc = await getDoc(doc(db, 'schools', schoolId, 'teachers', teacherId))
        if (teacherDoc.exists()) {
          const teacherData = teacherDoc.data()
          setProfile(teacherData)
          setEditedProfile(teacherData)
        }

        // Fetch teacher's classes
        const classesQuery = query(
          collection(db, 'schools', schoolId, 'classes'),
          where('teachers', 'array-contains', teacherId)
        )
        const classesSnapshot = await getDocs(classesQuery)
        const classesData = classesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setClasses(classesData)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSave = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const { schoolId, id: teacherId } = userData

      // Update teacher profile in Firestore
      await updateDoc(doc(db, 'schools', schoolId, 'teachers', teacherId), editedProfile)

      // Update local state
      setProfile(editedProfile)
      setIsEditing(false)

    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">{profile.fullName?.[0] || profile.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{profile.fullName || profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.employeeId}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {profile.subjects?.join(", ") || 'No subjects assigned'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {classes.map(c => c.name).join(", ") || 'No classes assigned'}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {new Date(profile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.fullName || editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, fullName: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1 text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {profile.fullName || profile.name}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Email Address</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, email: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1 text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {profile.email}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editedProfile.phone}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, phone: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1 text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {profile.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Employee ID</label>
                <div className="flex items-center mt-1 text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {profile.employeeId}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Qualifications</label>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.qualifications}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, qualifications: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-start mt-1 text-gray-600">
                    <Award className="h-4 w-4 mr-2 mt-1" />
                    {profile.qualifications}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Experience</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.experience}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, experience: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1 text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {profile.experience}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}