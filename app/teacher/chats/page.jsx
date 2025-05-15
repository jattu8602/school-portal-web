"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { collection, query, where, getDocs, addDoc, doc, getDoc, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { MessageSquare, Send, Search, Users } from "lucide-react"

export default function TeacherChats() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [chats, setChats] = useState([])
  const [messages, setMessages] = useState([])
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (!userData) {
          router.push('/auth/teacher/login')
          return
        }

        const { schoolId, id: teacherId } = userData

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

        // Fetch students in teacher's classes
        const classIds = classesData.map(c => c.id)
        const studentsQuery = query(
          collection(db, 'schools', schoolId, 'students'),
          where('classId', 'in', classIds)
        )
        const studentsSnapshot = await getDocs(studentsQuery)
        const studentsData = studentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'student'
        }))
        setStudents(studentsData)

        // Fetch other teachers
        const teachersQuery = query(
          collection(db, 'schools', schoolId, 'teachers'),
          where('id', '!=', teacherId)
        )
        const teachersSnapshot = await getDocs(teachersQuery)
        const teachersData = teachersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'teacher'
        }))
        setTeachers(teachersData)

        // Combine students and teachers into chats
        const allChats = [
          ...studentsData.map(student => ({
            id: student.id,
            name: student.name,
            role: `${student.classId} Student`,
            lastMessage: "",
            time: "",
            unread: 0,
            avatar: "/avatars/student.jpg",
            type: 'student'
          })),
          ...teachersData.map(teacher => ({
            id: teacher.id,
            name: teacher.fullName || teacher.name,
            role: `${teacher.subjects?.join(', ') || 'Teacher'}`,
            lastMessage: "",
            time: "",
            unread: 0,
            avatar: "/avatars/teacher.jpg",
            type: 'teacher'
          }))
        ]
        setChats(allChats)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  useEffect(() => {
    if (!selectedChat) return

    const userData = JSON.parse(localStorage.getItem('user'))
    const { schoolId, id: teacherId } = userData

    // Subscribe to messages
    const messagesQuery = query(
      collection(db, 'schools', schoolId, 'messages'),
      where('participants', 'array-contains', selectedChat.id),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setMessages(messagesData)
    })

    return () => unsubscribe()
  }, [selectedChat])

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      const { schoolId, id: teacherId } = userData

      const messageData = {
        content: message,
        senderId: teacherId,
        senderName: userData.fullName || userData.name,
        senderType: 'teacher',
        receiverId: selectedChat.id,
        receiverType: selectedChat.type,
        timestamp: new Date().toISOString(),
        participants: [teacherId, selectedChat.id]
      }

      await addDoc(collection(db, 'schools', schoolId, 'messages'), messageData)
      setMessage("")

    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Chat List */}
      <Card className="w-1/3 border-r">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chats</CardTitle>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search chats..." className="pl-8" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 ${
                  selectedChat?.id === chat.id ? "bg-gray-50" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{chat.name}</p>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">{selectedChat.role}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'teacher' ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.senderType === 'teacher'
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.senderType === 'teacher' ? "text-primary-foreground/70" : "text-gray-500"
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}