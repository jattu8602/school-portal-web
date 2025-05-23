import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

export default function RequestDemo() {
  return (
    <div className="container py-12 md:py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Experience PresentSir in Action</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              See how our comprehensive school management system can transform your institution.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Streamlined Attendance Management</h3>
                <p className="text-muted-foreground">
                  Efficiently track student attendance with our digital system that works online and offline.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Comprehensive Class Management</h3>
                <p className="text-muted-foreground">
                  Manage classes, students, and teachers all in one centralized platform.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Monitor and analyze student performance with detailed insights and reports.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">Mobile Accessibility</h3>
                <p className="text-muted-foreground">
                  Access your school management system on the go with our mobile application.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-6">
            <h3 className="text-lg font-medium">What to expect from your demo</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Personalized walkthrough of the PresentSir platform</li>
              <li>• Q&A session with our product specialists</li>
              <li>• Custom implementation strategies for your institution</li>
              <li>• Pricing and deployment information</li>
              <li>• Post-demo resources and support</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Request Your Free Demo</h2>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below and our team will contact you to schedule a personalized demo.
          </p>

          <form className="mt-6 space-y-4">
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
              <label htmlFor="role" className="text-sm font-medium">
                Your Role
              </label>
              <Select>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="it-manager">IT Manager</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="institution-size" className="text-sm font-medium">
                Institution Size
              </label>
              <Select>
                <SelectTrigger id="institution-size">
                  <SelectValue placeholder="Select institution size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="less-than-100">Less than 100 students</SelectItem>
                  <SelectItem value="100-500">100-500 students</SelectItem>
                  <SelectItem value="501-1000">501-1000 students</SelectItem>
                  <SelectItem value="1001-5000">1001-5000 students</SelectItem>
                  <SelectItem value="more-than-5000">More than 5000 students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Additional Information
              </label>
              <Textarea id="message" placeholder="Tell us about your specific requirements or questions" rows={4} />
            </div>

            <Button type="submit" className="w-full">
              Request Demo
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
      </div>
    </div>
  )
}
