"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Home, LogIn, UserPlus, HelpCircle, Users } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <div className="container px-6 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Error Status */}
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="h-px w-12 bg-gray-600"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-xl font-medium text-red-500"
                  >
                    Error 404
                  </motion.p>
                </div>

                {/* Main Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
                >
                  Page Not Found
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-lg text-gray-400"
                >
                  We apologize for the inconvenience. The page you are looking for does not exist or has been moved.
                </motion.p>

                {/* Quick Links Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="pt-4"
                >
                  <h2 className="text-xl font-semibold text-white mb-4">Quick Navigation</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                     
                      { href: "/help", icon: <HelpCircle className="w-4 h-4" />, label: "Help Center" },
                      { href: "/team", icon: <Users className="w-4 h-4" />, label: "Our Team" },
                    ].map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center p-3 text-sm text-gray-300 transition-colors duration-200 bg-gray-800/50 rounded-lg hover:bg-gray-800 border border-gray-700/50"
                        >
                          <div className="flex items-center gap-3">
                            {link.icon}
                            <span>{link.label}</span>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center gap-4 pt-4"
                >
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center justify-center px-4 py-2 text-sm text-gray-300 transition-colors duration-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span>Go Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex items-center justify-center px-4 py-2 text-sm text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    <span>Return Home</span>
                  </button>
                </motion.div>
              </motion.div>
            </div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="flex justify-center items-center"
            >
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl"
                />
                <div className="relative p-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl opacity-50" />
                  <div className="relative rounded-xl overflow-hidden border border-gray-700">
                    <Image
                      className="w-full max-w-md"
                      src="/present_sir_night_logo.jpg"
                      priority={true}
                      width={500}
                      height={500}
                      alt="School Portal Logo"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="text-6xl font-bold text-white opacity-20"
                      >
                        404
                      </motion.div> */}
                    </div>
                  </div>
                </div>

                {/* Subtle decorative elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-500/5 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
