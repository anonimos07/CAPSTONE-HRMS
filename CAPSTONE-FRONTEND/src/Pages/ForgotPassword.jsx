import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, BookOpen, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useForgotPassword } from "../hooks/usePasswordReset"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!identifier.trim()) return
    
    forgotPasswordMutation.mutate(identifier.trim(), {
      onSuccess: () => {
        setIsSubmitted(true)
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-800 mb-2">Email Sent!</CardTitle>
                <CardDescription className="text-purple-600 font-medium">
                  Check your inbox for password reset instructions
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8 pb-8">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    If an account with that email/username exists, we've sent a password reset link to your email address.
                  </p>
                  <p className="text-sm text-gray-600">
                    The link will expire in 10 minutes for security reasons.
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={() => navigate("/login")}
                      className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    >
                      Back to Login
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false)
                        setIdentifier("")
                      }}
                      className="w-full h-12 border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Send Another Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-purple-600/50 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-purple-400/30 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {/*Change color from purple to violet-red (#8b1e3f)*/}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-[#8b1e3f] hover:text-[#8b1e3f]/80 mb-6 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to login</span>
          </button>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full">
                <BookOpen className="h-8 w-8 text-[#8b1e3f]" /> {/*Change color from purple to violet-red (#8b1e3f)*/}
              </div>

              {/*Change color from purple to violet-red (#8b1e3f)*/}
              <CardTitle className="text-2xl font-bold text-[#8b1e3f] mb-2">Forgot Password?</CardTitle>
              <CardDescription className="text-[#8b1e3f] font-medium">
                Enter your email or username to reset your password
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="identifier" className="text-sm font-semibold text-[#8b1e3f]">
                    Email or Username
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                    <Input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-10 h-12 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
                      placeholder="Enter your email or username"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={forgotPasswordMutation.isPending || !identifier.trim()}
                >
                  {forgotPasswordMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Reset Link...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-purple-100">
                <p className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-[#8b1e3f] hover:text-[#8b1e3f]/80 transition-colors underline underline-offset-2"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#8b1e3f]/60">Secure password reset • Your data is protected</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
