"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QrCode, Phone, Mail, MapPin } from "lucide-react"

export default function IdCardShowcase() {
  const [activeTab, setActiveTab] = useState("student")

  return (
    <div>
      <Tabs defaultValue="student" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="student">Student ID</TabsTrigger>
            <TabsTrigger value="teacher">Teacher ID</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <TabsContent value="student" className="mt-0">
              <div className="w-full max-w-md mx-auto">
                {/* Student ID Card */}
                <div className="bg-card border-2 border-primary rounded-xl overflow-hidden shadow-lg">
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground p-4 text-center">
                    <h3 className="text-xl font-bold text-white">Delhi Public School</h3>
                    <p className="text-sm">Student Identification Card</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg bg-muted overflow-hidden mx-auto">
                          <img
                            src="https://media.istockphoto.com/id/1336063208/photo/single-portrait-of-smiling-confident-male-student-teenager-looking-at-camera-in-library.webp?a=1&b=1&s=612x612&w=0&k=20&c=mhn5OF-O2KzY66AXIOHD944al_6zp6pz4AQBnw60kbA="
                            alt="Student"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* QR Code */}
                        <div className="mt-4 bg-white p-2 rounded-lg mx-auto w-32 h-32 flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-primary" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-grow">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-lg font-bold">Rahul Sharma</h4>
                            <p className="text-sm text-muted-foreground">Class X-A | Roll No: 15</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-medium">Admission No</p>
                              <p className="text-muted-foreground">DPS/2023/1234</p>
                            </div>
                            <div>
                              <p className="font-medium">Date of Birth</p>
                              <p className="text-muted-foreground">15 Aug 2008</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-medium">Blood Group</p>
                              <p className="text-muted-foreground">B+</p>
                            </div>
                            <div>
                              <p className="font-medium">Valid Till</p>
                              <p className="text-muted-foreground">31 Mar 2026</p>
                            </div>
                          </div>

                          <div className="pt-2">
                            <p className="font-medium text-sm">Contact</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>rahul.s@example.com</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>123 Main Street, New Delhi</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency contact */}
                    <div className="mt-6 pt-4 border-t text-sm">
                      <p className="font-medium">Emergency Contact</p>
                      <p className="text-muted-foreground">Rajesh Sharma (Father): +91 98765 12345</p>
                    </div>

                    {/* Signature */}
                    <div className="mt-4 flex justify-between items-end">
                      <div className="w-24 border-t border-dashed border-muted-foreground pt-1">
                        <p className="text-xs text-muted-foreground">Student Signature</p>
                      </div>
                      <div className="w-24 border-t border-dashed border-muted-foreground pt-1">
                        <p className="text-xs text-muted-foreground">Principal Signature</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-muted p-3 text-center text-xs text-muted-foreground">
                    <p>If found, please return to Delhi Public School, Sector 45, Gurugram</p>
                    <p>Powered by PresentSir</p>
                  </div>
                </div>

                {/* Digital badge */}
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <svg className="mr-1 h-2 w-2 fill-current" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified Digital ID
                  </span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="teacher" className="mt-0">
              <div className="w-full max-w-md mx-auto">
                {/* Teacher ID Card */}
                <div className="bg-card border-2 border-primary rounded-xl overflow-hidden shadow-lg">
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground p-4 text-center">
                    <h3 className="text-xl font-bold text-white">Delhi Public School</h3>
                    <p className="text-sm">Teacher Identification Card</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-lg bg-muted overflow-hidden mx-auto">
                          <img
                            src="https://media.istockphoto.com/id/2045189569/photo/portrait-of-indian-young-woman-wearing-casual-kurta-on-white-background-stock-photo.webp?a=1&b=1&s=612x612&w=0&k=20&c=4Xnw99ovfFgR1fMGEQoxOiIwH2V1dLpfZs0_A_QnfFA="
                            alt="Teacher"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* QR Code */}
                        <div className="mt-4 bg-white p-2 rounded-lg mx-auto w-32 h-32 flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-primary" />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-grow">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-lg font-bold">Mrs. Priya Sharma</h4>
                            <p className="text-sm text-muted-foreground">Physics Teacher | Faculty ID: T-108</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-medium">Employee ID</p>
                              <p className="text-muted-foreground">DPS/FAC/2020/108</p>
                            </div>
                            <div>
                              <p className="font-medium">Joining Date</p>
                              <p className="text-muted-foreground">15 Jun 2020</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="font-medium">Blood Group</p>
                              <p className="text-muted-foreground">A+</p>
                            </div>
                            <div>
                              <p className="font-medium">Valid Till</p>
                              <p className="text-muted-foreground">31 Mar 2026</p>
                            </div>
                          </div>

                          <div className="pt-2">
                            <p className="font-medium text-sm">Contact</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              <span>+91 98765 87654</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              <span>priya.s@dpsschool.edu</span>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>456 Park Avenue, New Delhi</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Emergency contact */}
                    <div className="mt-6 pt-4 border-t text-sm">
                      <p className="font-medium">Emergency Contact</p>
                      <p className="text-muted-foreground">Vikram Sharma (Spouse): +91 98765 98765</p>
                    </div>

                    {/* Signature */}
                    <div className="mt-4 flex justify-between items-end">
                      <div className="w-24 border-t border-dashed border-muted-foreground pt-1">
                        <p className="text-xs text-muted-foreground">Teacher Signature</p>
                      </div>
                      <div className="w-24 border-t border-dashed border-muted-foreground pt-1">
                        <p className="text-xs text-muted-foreground">Principal Signature</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="bg-muted p-3 text-center text-xs text-muted-foreground">
                    <p>If found, please return to Delhi Public School, Sector 45, Gurugram</p>
                    <p>Powered by PresentSir</p>
                  </div>
                </div>

                {/* Digital badge */}
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400">
                    <svg className="mr-1 h-2 w-2 fill-current" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    Verified Digital ID
                  </span>
                </div>
              </div>
            </TabsContent>

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-4">Digital ID Cards</h3>
                <p className="text-muted-foreground">
                  PresentSir provides secure digital ID cards for both students and teachers. These cards can be
                  accessed through the mobile app and used for:
                </p>

                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>School entry and verification</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Library book checkouts</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Event attendance tracking</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Emergency contact information</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Tamper-proof QR codes</span>
                      <p className="text-sm text-muted-foreground">Secure verification with encrypted QR technology</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Always accessible</span>
                      <p className="text-sm text-muted-foreground">Available offline in the mobile app</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium">Customizable design</span>
                      <p className="text-sm text-muted-foreground">
                        Schools can customize ID card design with their branding
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
