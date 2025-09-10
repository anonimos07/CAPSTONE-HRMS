import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Lock, Shield, Eye, EyeOff, Users } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import axios from "axios"
import HRImage from "@/assets/HR.jpg";

const API_BASE_URL_HR = import.meta.env.VITE_API_BASE_URL_HR

const LoginHr = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleEmployeeLogin = (e) => {
    e.preventDefault()
    setIsExiting(true)
    setTimeout(() => {
      navigate("/login")
    }, 300)
  }

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await axios.post(`${API_BASE_URL_HR}/login`, {
        username: username,
        password: password,
      })
      return response.data
    },
    onSuccess: (data) => {
      console.log("Login success:", data)
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username)
      localStorage.setItem("userId", data.userId)
      localStorage.setItem("user", JSON.stringify({ role: data.role }))
      localStorage.setItem("position", data.position)
      navigate("/hrpage")
    },
    onError: (error) => {
      console.error("Login failed:", error)
      const errorMessage = error.response?.data?.error || "Invalid credentials"
      if (errorMessage === "Your account has been disabled") {
        alert("Your account has been disabled. Please contact your administrator.")
      } else {
        alert(errorMessage)
      }
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 flex">
        {/* Left side - login form area with overlays */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-violet-50/60">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-300/15 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="absolute top-20 left-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-40 right-32 w-2 h-2 bg-violet-500/25 rounded-full animate-bounce delay-700"></div>
            <div className="absolute bottom-32 left-16 w-2 h-2 bg-purple-600/40 rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-violet-400/20 rounded-full animate-bounce delay-1000"></div>

            <div className="absolute inset-0 opacity-[0.015]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(147, 51, 234, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(147, 51, 234, 0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: "60px 60px",
                }}
              ></div>
            </div>

            <div className="absolute inset-0 opacity-[0.02]">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 120px,
                    rgba(147, 51, 234, 0.06) 120px,
                    rgba(147, 51, 234, 0.06) 121px
                  )`,
                }}
              ></div>
            </div>

            <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-50/30 to-violet-100/20"></div>
          </div>

          {/* Form content */}
          <div
            className={`relative z-10 transition-all duration-500 ease-in-out ${
              isExiting
                ? "transform translate-x-full opacity-0"
                : isVisible
                ? "transform translate-x-0 opacity-100"
                : "transform -translate-x-full opacity-0"
            }`}
          >
            <div className="flex items-center justify-start min-h-screen p-4 pl-8 md:pl-16 lg:pl-24">
              <div className="w-full max-w-md lg:max-w-lg">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center text-[#8b1e3f] hover:text-[#8b1e3f]/80 mb-8 transition-colors group"
                >
                  <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back to homepage</span>
                </button>

                <div className="mb-10">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100/80 rounded-xl mr-4 shadow-sm">
                      <Shield className="h-8 w-8 text-[#8b1e3f]" />
                    </div>
                    <div>
                      <h1 className="text-4xl lg:text-5xl font-bold text-[#8b1e3f] mb-1 tracking-tight">HR Portal</h1>
                      <div className="flex items-center text-[#8b1e3f]/60">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Administrative Access</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-[#8b1e3f]/70 font-medium">Secure management system for HR personnel</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md ring-1 ring-purple-100/50">
                  <CardHeader className="text-left pb-6 pt-8 px-8">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl mr-4 shadow-sm">
                        <Shield className="h-7 w-7 text-[#8b1e3f]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-[#8b1e3f] mb-1">TechStaffHub</CardTitle>
                        <CardDescription className="text-[#8b1e3f]/70 font-medium text-sm">
                          HR Management System
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-8 pb-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-semibold text-[#8b1e3f] flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Work Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                          <Input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-12 h-13 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/30 bg-white/70 rounded-xl text-base"
                            placeholder="username.HR"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-sm font-semibold text-[#8b1e3f] flex items-center">
                            <Lock className="h-4 w-4 mr-2" />
                            Password
                          </Label>
                          <Link
                            to="/forgot-password"
                            className="text-xs font-medium text-[#8b1e3f] hover:text-[#8b1e3f]/80 transition-colors hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-13 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/30 bg-white/70 rounded-xl text-base"
                            placeholder="••••••••"
                            required
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]/60 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-13 bg-gradient-to-r from-[#8b1e3f] to-[#7a1b38] hover:from-[#7a1b38] hover:to-[#6b1830] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Authenticating...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Shield className="h-4 w-4 mr-2" />
                            Access HR Dashboard
                          </div>
                        )}
                      </Button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-[#8b1e3f]/10">
                      <p className="text-center text-sm text-gray-600">
                        Employee?{" "}
                        <a
                          href="/login"
                          onClick={handleEmployeeLogin}
                          className="font-semibold text-[#8b1e3f] hover:text-[#8b1e3f]/80 transition-colors underline underline-offset-2 hover:underline-offset-4"
                        >
                          Sign as Employee
                        </a>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 flex items-center justify-center">
                  <div className="flex items-center text-xs text-[#8b1e3f]/60 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
                    <Shield className="h-3 w-3 mr-2" />
                    <span>HR Management Portal • Secure administrative access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - HR.jpg background with diamond cuts */}
        <div className="flex-1 relative">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${HRImage})`,
              clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",
            }}
          ></div>
          <div
            className="absolute inset-0 bg-gradient-to-l from-purple-500/5 to-transparent"
            style={{
              clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default LoginHr
