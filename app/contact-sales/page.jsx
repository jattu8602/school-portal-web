import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, Clock } from "lucide-react"

export default function ContactSales() {
  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Our Sales Team</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about PresentSir? Our education technology experts are here to help you find the right solution
          for your institution.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Mail className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-medium">Email Us</h3>
            <p className="mt-2 text-muted-foreground">For general inquiries and sales questions</p>
            <a href="mailto:sales@presentsir.in" className="mt-4 font-medium text-primary hover:underline">
              sales@presentsir.in
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Phone className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-medium">Call Us</h3>
            <p className="mt-2 text-muted-foreground">Speak directly with our sales representatives</p>
            <a href="tel:+911234567890" className="mt-4 font-medium text-primary hover:underline">
              +91 1234 567 890
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Clock className="h-10 w-10 text-primary" />
            <h3 className="mt-4 text-xl font-medium">Business Hours</h3>
            <p className="mt-2 text-muted-foreground">We're available to assist you</p>
            <p className="mt-4">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="mt-2 text-muted-foreground">
              Fill out the form and our team will get back to you within 24 hours.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="first-name" className="text-sm font-medium">
                  First Name
                </label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <label htmlFor="last-name" className="text-sm font-medium">
                  Last Name
                </label>
                <Input id="last-name" placeholder="Smith" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Work Email
              </label>
              <Input id="email" type="email" placeholder="john.smith@school.edu" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input id="phone" type="tel" placeholder="+91 1234567890" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="institution" className="text-sm font-medium">
                Institution Name
              </label>
              <Input id="institution" placeholder="ABC School" required />
            </div>

            <div className="space-y-2">
              <label htmlFor="inquiry-type" className="text-sm font-medium">
                Inquiry Type
              </label>
              <Select>
                <SelectTrigger id="inquiry-type">
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pricing">Pricing Information</SelectItem>
                  <SelectItem value="product">Product Information</SelectItem>
                  <SelectItem value="implementation">Implementation Support</SelectItem>
                  <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <Textarea id="message" placeholder="Please provide details about your inquiry" rows={4} required />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By submitting this form, you agree to our{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms-of-service" className="underline underline-offset-2">
                Terms of Service
              </Link>
              .
            </p>
          </form>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">Why Choose PresentSir?</h2>
            <p className="mt-2 text-muted-foreground">
              PresentSir is a comprehensive school management system designed to streamline administrative tasks and
              enhance educational outcomes.
            </p>
          </div>

          <div className="space-y-4 rounded-lg bg-muted p-6">
            <h3 className="font-medium">Our Solutions Include:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                </div>
                <span>Attendance Management System</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                </div>
                <span>Class Management Tools</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                </div>
                <span>Student Performance Analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                </div>
                <span>Mobile Applications for Teachers and Students</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 p-1">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                </div>
                <span>Offline Functionality</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-medium">Our Clients Include:</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex h-16 items-center justify-center rounded-md bg-muted/50 px-4 py-2">
                <div className="text-center font-medium">Delhi Public School</div>
              </div>
              <div className="flex h-16 items-center justify-center rounded-md bg-muted/50 px-4 py-2">
                <div className="text-center font-medium">Ryan International</div>
              </div>
              <div className="flex h-16 items-center justify-center rounded-md bg-muted/50 px-4 py-2">
                <div className="text-center font-medium">DAV Public School</div>
              </div>
              <div className="flex h-16 items-center justify-center rounded-md bg-muted/50 px-4 py-2">
                <div className="text-center font-medium">Kendriya Vidyalaya</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
