"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Search } from "lucide-react"

export default function StudentChats() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [chats] = useState([
    {
      id: 1,
      name: "Mr. Smith",
      role: "Mathematics Teacher",
      lastMessage: "Don't forget to submit your assignment",
      time: "10:30 AM",
      unread: 2,
      avatar: "/avatars/teacher1.jpg",
    },
    {
      id: 2,
      name: "Class 10-A Group",
      role: "Group Chat",
      lastMessage: "John: When is the next test?",
      time: "Yesterday",
      unread: 0,
      avatar: "/avatars/group1.jpg",
    },
    {
      id: 3,
      name: "Ms. Johnson",
      role: "Physics Teacher",
      lastMessage: "Great work on the lab report!",
      time: "2 days ago",
      unread: 0,
      avatar: "/avatars/teacher2.jpg",
    },
  ])

  const [messages] = useState([
    {
      id: 1,
      sender: "Mr. Smith",
      content: "Hello! How can I help you today?",
      time: "10:00 AM",
      isTeacher: true,
    },
    {
      id: 2,
      sender: "You",
      content: "Hi! I have a question about the math assignment",
      time: "10:05 AM",
      isTeacher: false,
    },
    {
      id: 3,
      sender: "Mr. Smith",
      content: "Sure, what's your question?",
      time: "10:10 AM",
      isTeacher: true,
    },
  ])

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Chat List */}
      <Card className="w-1/3 border-r">
        <CardHeader>
          <CardTitle>Chats</CardTitle>
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

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isTeacher ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.isTeacher
                        ? "bg-gray-100 text-gray-900"
                        : "bg-primary text-white"
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.isTeacher ? "text-gray-500" : "text-primary-foreground/70"
                      }`}
                    >
                      {msg.time}
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