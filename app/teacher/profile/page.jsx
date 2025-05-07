"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Mr. Smith",
    email: "smith@school.com",
    phone: "+1 234 567 890",
    employeeId: "TCH2024001",
    subjects: ["Mathematics", "Physics"],
    classes: ["Class 10-A", "Class 11-B"],
    joinDate: "2024-01-15",
    qualifications: "M.Sc. in Mathematics, B.Ed.",
    experience: "5 years",
    avatar: "/avatars/teacher1.jpg",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    // TODO: Implement profile update logic
    setProfile(editedProfile)
    setIsEditing(false)
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
                <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.employeeId}</p>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {profile.subjects.join(", ")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {profile.classes.join(", ")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined: {profile.joinDate}
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
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, name: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center mt-1 text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {profile.name}
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