"use client"

import { useEffect, useState } from "react"

export default function HeroImage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Device mockup */}
      <div className="relative z-10 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 bg-primary">
          <div className="flex justify-between items-center">
            <div className="text-primary-foreground font-semibold">PresentSir Device</div>
            <div className="text-primary-foreground text-sm">09:41</div>
          </div>
        </div>
        <div className="p-4">
          <div className="text-center mb-4">
            <h3 className="font-bold text-lg">Class Attendance</h3>
            <p className="text-sm text-muted-foreground">Physics - Grade 10A</p>
          </div>
          <div className="space-y-3">
            {["John Smith", "Emily Johnson", "Michael Brown", "Sarah Davis", "David Wilson"].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-medium">{student.charAt(0)}</span>
                  </div>
                  <span>{student}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    ✓
                  </button>
                  <button className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">Save Attendance</button>
          </div>
        </div>
      </div>

      {/* Mobile app mockup */}
      <div className="absolute -bottom-10 -right-10 w-48 h-96 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden transform rotate-6 z-0">
        <div className="p-2 bg-accent">
          <div className="flex justify-between items-center">
            <div className="text-accent-foreground text-xs font-semibold">PresentSir App</div>
            <div className="text-accent-foreground text-xs">09:41</div>
          </div>
        </div>
        <div className="p-2">
          <div className="text-center mb-2">
            <h3 className="font-bold text-xs">Teacher Dashboard</h3>
          </div>
          <div className="space-y-2">
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Today's Classes</div>
              <div className="text-xs text-muted-foreground">3 classes</div>
            </div>
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Attendance</div>
              <div className="text-xs text-muted-foreground">95% present</div>
            </div>
            <div className="bg-muted p-1 rounded-md">
              <div className="text-xs font-medium">Homework</div>
              <div className="text-xs text-muted-foreground">2 pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* School panel mockup */}
      <div className="absolute -bottom-6 -left-10 w-48 h-32 bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden transform -rotate-6 z-0">
        <div className="p-1 bg-secondary">
          <div className="text-secondary-foreground text-xs font-semibold">School Panel</div>
        </div>
        <div className="p-2">
          <div className="text-xs font-medium">Attendance Overview</div>
          <div className="flex justify-between mt-1">
            <div className="text-xs">
              Present: <span className="font-medium">85%</span>
            </div>
            <div className="text-xs">
              Absent: <span className="font-medium">15%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-1">
            <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
