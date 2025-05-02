"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Bluetooth, Cpu, Smartphone, Wifi, Clock, Shield, Zap } from "lucide-react"


export default function DeviceSpecifications() {
  const [rotateDevice, setRotateDevice] = useState(false)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="flex justify-center">
        <div className="relative">
          {/* Device mockup */}
          <div
            className={`relative bg-card border-4 border-border rounded-xl shadow-xl overflow-hidden w-64 h-96 transition-transform duration-1000 ${
              rotateDevice ? "rotate-[30deg]" : ""
            }`}
          >
            {/* Device screen */}
            <div className="p-4 bg-primary">
              <div className="flex justify-between items-center">
                <div className="text-primary-foreground font-semibold">PresentSir</div>
                <div className="text-primary-foreground text-sm">09:41</div>
              </div>
            </div>
            <div className="p-4 h-full flex flex-col">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Select Class</h3>
              </div>
              <div className="space-y-3 flex-1">
                <button className="w-full p-2 border rounded-md hover:bg-primary/10 transition-colors">
                  Grade 10 - Physics
                </button>
                <button className="w-full p-2 border rounded-md hover:bg-primary/10 transition-colors">
                  Grade 10 - Chemistry
                </button>
                <button className="w-full p-2 border rounded-md hover:bg-primary/10 transition-colors">
                  Grade 11 - Mathematics
                </button>
                <button className="w-full p-2 border rounded-md hover:bg-primary/10 transition-colors">
                  Grade 9 - English
                </button>
              </div>

              {/* Device buttons */}
              <div className="mt-auto grid grid-cols-3 gap-2">
                <button className="p-2 border rounded-md bg-muted">◀</button>
                <button className="p-2 border rounded-md bg-primary text-primary-foreground">✓</button>
                <button className="p-2 border rounded-md bg-muted">▶</button>
              </div>
            </div>
          </div>

          {/* Bluetooth indicator when syncing */}
          <div className="absolute -right-4 top-1/4 bg-blue-500 text-white p-2 rounded-full shadow-lg">
            <Bluetooth className="h-6 w-6" />
          </div>

          {/* Battery indicator */}
          <div className="absolute -left-4 top-1/3 bg-green-500 text-white p-2 rounded-full shadow-lg">
            <Battery className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4">Compact & Powerful</h3>
          <p className="text-muted-foreground mb-4">
            The PresentSir device is designed specifically for classroom use. It's small enough to hold in your hand,
            yet powerful enough to manage attendance for all your classes.
          </p>
          <Button onClick={() => setRotateDevice(!rotateDevice)} variant="outline">
            {rotateDevice ? "Reset View" : "Rotate Device"}
          </Button>
        </div>

        <Tabs defaultValue="hardware" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
          </TabsList>

          <TabsContent value="hardware" className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Powerful Processor</h4>
                <p className="text-sm text-muted-foreground">
                  ARM Cortex-M4 processor for fast and efficient operation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Battery className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Long Battery Life</h4>
                <p className="text-sm text-muted-foreground">Up to 7 days of battery life on a single charge</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Durable Design</h4>
                <p className="text-sm text-muted-foreground">
                  Rugged construction with high-quality buttons for daily use
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="software" className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Real-time Clock</h4>
                <p className="text-sm text-muted-foreground">Keeps accurate time even when powered off</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Secure Storage</h4>
                <p className="text-sm text-muted-foreground">Encrypted storage for attendance data</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Fast Operation</h4>
                <p className="text-sm text-muted-foreground">Intuitive interface for quick attendance marking</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="connectivity" className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bluetooth className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Bluetooth 5.0</h4>
                <p className="text-sm text-muted-foreground">Fast and secure connection to mobile devices</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Optional Wi-Fi</h4>
                <p className="text-sm text-muted-foreground">Available in premium models for direct cloud sync</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Mobile App Sync</h4>
                <p className="text-sm text-muted-foreground">Seamless synchronization with the PresentSir mobile app</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
