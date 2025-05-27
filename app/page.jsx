'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { auth } from '../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { Button } from '@/components/ui/button'
import { CheckCircle, Users, BarChart3, Calendar, Bell, MessageSquare, School, Smartphone, Zap } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import IdCardShowcase from './components/IdCardShowcase'
import MobileAppShowcase from './components/MobileAppShowcase'
import HeroImage from './components/HeroImage'
import DeviceSpecifications from './components/DeviceSpecifications'
import TeamSection from './components/TeamSection'
import PermanentInstallButton from './components/PermanentInstallButton'
import Footer from '@/components/Footer'
export default function LandingPage() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("schools")

  const testimonials = [
    {
      quote:
        "PresentSir has completely transformed how we track attendance. The offline device is a game-changer for our school where mobile phones are restricted.",
      author: "Dr. Rajesh Sharma",
      position: "Principal, Delhi Public School",
      image: "https://img.freepik.com/premium-photo/man-wearing-glasses-blue-shirt-with-shirt-that-says-hes-wearing-glasses_1314467-61643.jpg?semt=ais_hybrid&w=740",
    },
    {
      quote:
        "The seamless sync between the device and our school management system has saved our teachers countless hours. Highly recommended!",
      author: "Priya Mehta",
      position: "Vice Principal, St. Mary's Academy",
      image: "https://imgs.search.brave.com/iUNC4Tz0w-g7rry_qqJedSZlba1LYV6NQWo2a4zt6Rk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/aXMtdGhpcy1hLWdv/b2QtcHJvZmVzc2lv/bmFsLXByb2ZpbGUt/cGljLXYwLXFyaDdi/a3VwOHZ1ZTEucG5n/P3dpZHRoPTY0MCZj/cm9wPXNtYXJ0JmF1/dG89d2VicCZzPWYx/NDcyYmQxYTE4Yjdj/NzEyYzY0ZGNhMmYz/ODFjOGUwMDZmMjY5/NGM",
    },
    {
      quote:
        "Parents love the real-time attendance updates. Our teachers find the device intuitive and easy to use even without technical knowledge.",
      author: "Amit Patel",
      position: "IT Administrator, Modern School",
      image: "https://imgs.search.brave.com/bqrckQVWCvA0tiLj7LCG12Op1tSpGsxlSXQf-8QyaBM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9wb3J0cmFpdC1i/YW5nbGFkZXNoaS1t/YW5fNTM4NzYtMzkx/NzguanBnP3NlbXQ9/YWlzX2h5YnJpZCZ3/PTc0MA",
    },
    {
      quote:
        "The analytics provided by PresentSir have helped us identify attendance patterns and improve student engagement across all grades.",
      author: "Sunita Verma",
      position: "Academic Coordinator, Greenfield International",
      image: "https://imgs.search.brave.com/DPPCp8E1pZXOioXkdJyLYr3QKH_WrjvgClvuuw6LPfs/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTE2/NTQyNDQyMC9waG90/by9wcm9maWxlLXZp/ZXctb2YtYmVhdXRp/ZnVsLWJ1c2luZXNz/d29tYW4tYWdhaW5z/dC13aGl0ZS1iYWNr/Z3JvdW5kLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1MMzRw/RDJFMEN3ZnFZT3o5/N2NwcHI4X2l5cUNy/Nm5lT3RydnZhOVlh/QmdNPQ",
    },
  ]

  const faqs = [
    {
      question: "How does the offline attendance device work?",
      answer:
        "The PresentSir device works completely offline. Teachers select their class, then mark attendance using the device's intuitive interface. Later, when convenient, they can connect the device to their mobile phone via Bluetooth and sync the attendance data to the school's management system.",
    },
    {
      question: "Do teachers and students need to pay for the app?",
      answer:
        "No. Only schools need to subscribe to PresentSir. The subscription includes access for all teachers and students. They can download the app for free and log in using credentials provided by their school.",
    },
    {
      question: "How secure is the attendance data?",
      answer:
        "Very secure. All data is encrypted both on the device and during transmission. The school admin panel has role-based access controls, and we comply with all relevant data protection regulations.",
    },
    {
      question: "Can the system handle multiple classes and subjects?",
      answer:
        "PresentSir is designed to handle complex school structures with multiple grades, sections, subjects, and teachers. The system can be customized to match your school's specific organizational structure.",
    },
    {
      question: "What happens if the device runs out of battery?",
      answer:
        "The PresentSir device has a long-lasting battery that can work for up to a week on a single charge. It also stores all attendance data locally, so no information is lost even if the battery runs out. Simply recharge and continue.",
    },
    {
      question: "Can parents access the attendance information?",
      answer:
        "Yes, schools can enable parent access through a separate parent portal or app. Parents can view their child's attendance, performance, and receive notifications about absences or important announcements.",
    },
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 relative hidden md:block">
                  <img
                    src="/present_sir_day-logo.jpg"
                    alt="Present Sir Logo"
                    className="h-full w-full object-contain rounded-md"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://via.placeholder.com/32?text=PS'
                    }}
                  />
                </div>
              <span className="text-2xl font-bold text-gray-900">
                PresentSir
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Go to Dashboard
                </Link>
              ) : (
                  <>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    School Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-primary">Transform Your School Management</h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Streamline attendance, manage classes, track performance, and more with our comprehensive school
              management system that works offline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <>
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg w-full sm:w-auto">
                    Go to Dashboard
                  </Button>
                </Link>
                <PermanentInstallButton size="lg" className="text-lg w-full sm:w-auto bg-black hover:bg-gray-800 text-white" />
                </>
              ) : (
                <>
                  <Link href="/auth/student/login">
                    <Button size="lg" className="text-lg w-full sm:w-auto">
                      Student Login
                    </Button>
                  </Link>
                  <Link href="/auth/teacher/login">
                    <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto">
                      Teacher Login
                    </Button>
                  </Link>
                  <PermanentInstallButton size="lg" className="text-lg w-full sm:w-auto bg-black hover:bg-gray-800 text-white" />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center mb-[-100px] mt-[-30px] md:mt-[1px] md:mb-[1px] ">
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Class Management</h3>
            <p className="text-gray-600">
              Easily manage classes, students, and teachers in one place.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Attendance Tracking</h3>
            <p className="text-gray-600">
              Track attendance efficiently with our digital system.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              Performance Analytics
            </h3>
            <p className="text-gray-600">
              Monitor and analyze student performance with detailed insights.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How PresentSir Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our innovative solution combines hardware and software to make attendance tracking seamless
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Take Attendance Offline</h3>
                <p className="text-muted-foreground">
                  Teachers use our device to mark attendance without needing internet or mobile phones
                </p>
              </div>

              <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Sync When Convenient</h3>
                <p className="text-muted-foreground">
                  Connect the device to a mobile phone via Bluetooth at any time to sync the attendance data
                </p>
              </div>

              <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <School className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Auto-Update to School Panel</h3>
                <p className="text-muted-foreground">
                  Data automatically updates to the school's panel and respective applications
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Device Specifications */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The PresentSir Device</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compact, durable, and designed specifically for classroom attendance
            </p>
          </div>

          <DeviceSpecifications />
        </section>

      {/* Mobile App Showcase */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Mobile Applications</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful apps for teachers and students to manage all aspects of school life
              </p>
            </div>

            <MobileAppShowcase />
          </div>
      </section>

      {/* Features Section */}
        <section className="bg-muted py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Comprehensive Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                PresentSir offers tailored solutions for schools, teachers, and students
              </p>
            </div>

            <Tabs defaultValue="schools" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="schools" onClick={() => setActiveTab("schools")}>
                    Schools
                  </TabsTrigger>
                  <TabsTrigger value="teachers" onClick={() => setActiveTab("teachers")}>
                    Teachers
                  </TabsTrigger>
                  <TabsTrigger value="students" onClick={() => setActiveTab("students")}>
                    Students
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="schools" className={activeTab === "schools" ? "block" : "hidden"}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Users className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Class Management</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Easily manage classes, students, and teachers in one place with our intuitive admin panel.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Performance Analytics</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Monitor and analyze student performance with detailed insights and reports.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Bell className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Notifications</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Send announcements and updates to teachers and students in real-time.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="teachers" className={activeTab === "teachers" ? "block" : "hidden"}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Attendance Tracking</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Take attendance offline with our device and sync it later with your mobile phone.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Calendar className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Homework Management</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Assign and track homework, assignments, and projects for your classes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Communication</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Chat with students and parents, share updates, and collaborate effectively.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="students" className={activeTab === "students" ? "block" : "hidden"}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Attendance Records</h3>
                      </div>
                      <p className="text-muted-foreground">
                        View your attendance history and get notified about absences or late arrivals.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <BarChart3 className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Results & Performance</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Access your academic results, performance metrics, and improvement suggestions.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        <Bell className="h-6 w-6 text-primary mr-2" />
                        <h3 className="text-xl font-semibold">Notifications</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Receive real-time notifications about homework, events, and important announcements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>


      {/* ID Card Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Digital ID Cards</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Modern, secure digital identification for teachers and students
            </p>
          </div>

          <IdCardShowcase />
        </section>



      {/* Testimonials Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Schools Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by educational institutions across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <p className="text-lg italic">"{testimonial.quote}"</p>
                    </div>
                    <div className="mt-auto flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about PresentSir
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
      </section>


       {/* Subscription Plans */}
        {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Subscription Plans</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Only schools need to subscribe. Teachers and students get access through the school's plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-border">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Starter</h3>
                  <div className="text-4xl font-bold mb-2">
                    ₹9,999<span className="text-lg font-normal text-muted-foreground">/year</span>
                  </div>
                  <p className="text-muted-foreground">Perfect for small schools</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Device for 1 class</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Admin panel access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Up to 20 teachers/students</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Basic reporting</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg">
                Popular
              </div>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Standard</h3>
                  <div className="text-4xl font-bold mb-2">
                    ₹24,999<span className="text-lg font-normal text-muted-foreground">/year</span>
                  </div>
                  <p className="text-muted-foreground">Ideal for medium schools</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Devices for up to 10 classes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Full admin panel access</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Up to 200 teachers/students</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button className="w-full">Get Started</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-border">
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="text-4xl font-bold mb-2">
                    Custom<span className="text-lg font-normal text-muted-foreground"></span>
                  </div>
                  <p className="text-muted-foreground">For large institutions</p>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Custom device setup</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Unlimited users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-2" />
                    <span>On-site training</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
      </section> */}




      {/* Team Section */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-[-100px]">
            <TeamSection />
          </section>






      {/* CTA Section */}
        <section className="bg-slate-700 text-primary-foreground py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Join hundreds of schools already using PresentSir to streamline their operations
            </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/request-demo">
               <Button size="lg" variant="secondary" className="text-lg">
                Request Demo
              </Button>
            </Link>
            <Link href="/contact-sales">
             <Button
                size="lg"
                variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg"

              >
                Contact Sales
              </Button>
            </Link>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">PresentSir</h3>
                <p className="text-muted-foreground">Smart, Simple & Secure Attendance Solution for Modern Schools</p>
            </div>




              <div>
                 <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: Team.presentsir@gmail.com</li>
              <li>Phone: +91 8602074069</li>
              <li>Address: LNCT Bhopal, Madhya Pradesh, India</li>
            </ul>
            </div>



              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-primary">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/team" className="text-muted-foreground hover:text-primary">
                      Team
                    </Link>
                  </li>

                  <li>
                    <Link href="/contact-sales" className="text-muted-foreground hover:text-primary">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
          </div>



          {/* links section */}
          <Footer />




          </div>
        </footer>

    </div>
  )
}
