import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Lock, BookOpen, Eye, EyeOff } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import axios from "axios"

const API_BASE_URL_HR = import.meta.env.VITE_API_BASE_URL_HR

const LoginHr = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleEmployeeLogin = (e) => {
    e.preventDefault()

    setTimeout(() => {
      navigate("/login")
    }, 500)
  }

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }) => {
      const response = await axios.post(`${API_BASE_URL_HR}/login`, {
        username: username, // Your backend expects "username"
        password: password,
      })
      return response.data
    },
    onSuccess: (data) => {
      console.log("Login success:", data)

      // Example: store token
      localStorage.setItem("token", data.token)
      localStorage.setItem("username", data.username)
      localStorage.setItem("userId", data.userId)
      localStorage.setItem("user", JSON.stringify({ role: data.role }))
      localStorage.setItem("position", data.position)

      // Redirect to dashboard or HR page
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pure-50 via-white to-purple-50">
        {/* Large decorative circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-purple-600/50 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-400/30 rounded-full animate-bounce delay-1000"></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
          linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
        `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Subtle diagonal lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 100px,
          rgba(147, 51, 234, 0.1) 100px,
          rgba(147, 51, 234, 0.1) 101px
        )`,
            }}
          ></div>
        </div>

        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-50/50 to-purple-100/30"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {/*Change color from purple to violet-red (#8b1e3f)*/}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-[#8b1e3f] hover:text-[#8b1e3f]/80 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to homepage</span>
          </button>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-8">
              {/* Logo */}
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full"> 
                <BookOpen className="h-8 w-8 text-[#8b1e3f]" /> {/*Change color from purple to violet-red (#8b1e3f)*/}
              </div>

              {/*Change color from purple to violet-red (#8b1e3f)*/}
              <CardTitle className="text-2xl font-bold text-[#8b1e3f] mb-2">TechStaffHub</CardTitle>
              <CardDescription className="text-[#8b1e3f] font-medium">HR Management Portal</CardDescription>
            </CardHeader>
            
            {/*Change color from purple to violet-red (#8b1e3f)*/}
            <CardContent className="px-8 pb-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-[#8b1e3f]">
                    Work Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
                      placeholder="username.HR"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-[#8b1e3f]">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-medium text-[#8b1e3f] hover:text-[#8b1e3f]/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#8b1e3f]/10">
                <p className="text-center text-sm text-gray-600">
                  Employee?{" "}
                  <a
                    href="/login"
                    onClick={handleEmployeeLogin}
                    className="font-semibold text-[#8b1e3f] hover:text-[#8b1e3f]/80 transition-colors underline underline-offset-2"
                  >
                    Sign as Employee
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#8b1e3f]/60">HR Management Portal • Secure administrative access</p> {/*Change color from purple to violet-red (#8b1e3f)*/}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginHr
