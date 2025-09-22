import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Lock, BookOpen, Eye, EyeOff, CheckCircle, AlertCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useResetPassword, useValidateResetToken } from "../hooks/usePasswordReset"

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  
  const resetPasswordMutation = useResetPassword()
  const { data: tokenValidation, isLoading: isValidating, error: validationError } = useValidateResetToken(token)

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password')
    }
  }, [token, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPassword || !confirmPassword) return
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      setShowErrorModal(true)
      return
    }
    
    resetPasswordMutation.mutate(
      { token, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setIsSuccess(true)
        },
        onError: (error) => {
          const message = error.response?.data?.message || error.message || "An error occurred while resetting your password"
          setErrorMessage(message)
          setShowErrorModal(true)
        }
      }
    )
  }

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" }
    
    let score = 0
    let feedback = []
    
    if (password.length >= 8) score++
    else feedback.push("at least 8 characters")
    
    if (/[A-Z]/.test(password)) score++
    else feedback.push("uppercase letter")
    
    if (/[a-z]/.test(password)) score++
    else feedback.push("lowercase letter")
    
    if (/\d/.test(password)) score++
    else feedback.push("number")
    
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score++
    else feedback.push("special character")
    
    const colors = ["text-red-500", "text-red-500", "text-yellow-500", "text-yellow-500", "text-green-500"]
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    
    return {
      score,
      text: score === 5 ? "Strong" : `Missing: ${feedback.join(", ")}`,
      color: colors[score] || "text-gray-500"
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  // Error Modal Component
  const ErrorModal = () => {
    if (!showErrorModal) return null

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#8b1e3f]">Password Reset Error</h3>
              </div>
              <button
                onClick={() => setShowErrorModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{errorMessage}</p>
              
              {errorMessage.includes("Password must contain") && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2">Password Requirements:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• At least one uppercase letter (A-Z)</li>
                    <li>• At least one lowercase letter (a-z)</li>
                    <li>• At least one number (0-9)</li>
                    <li>• At least one special character (!@#$%^&*)</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={() => setShowErrorModal(false)}
                className="flex-1 bg-[#8b1e3f] hover:bg-[#8b1e3f]/80 text-white font-medium"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isValidating) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b1e3f] mx-auto mb-4"></div>
            <p className="text-[#8b1e3f]">Validating reset token...</p>
          </div>
        </div>
      </div>
    )
  }

  if (validationError || !tokenValidation?.valid) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-red-800 mb-2">Invalid Reset Link</CardTitle>
                <CardDescription className="text-red-600 font-medium">
                  This password reset link is invalid or has expired
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Password reset links expire after 10 minutes for security reasons.
                  </p>
                  <Button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold"
                  >
                    Request New Reset Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8 pt-8">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-[#8b1e3f] mb-2">Password Reset!</CardTitle>
                <CardDescription className="text-[#8b1e3f] font-medium">
                  Your password has been successfully reset
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    You can now log in with your new password.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold"
                  >
                    Go to Login
                  </Button>
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
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="absolute top-20 left-20 w-4 h-4 bg-red-400/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-red-500/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-16 w-2 h-2 bg-red-600/50 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-red-400/30 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
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
                <BookOpen className="h-8 w-8 text-[#8b1e3f]" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#8b1e3f] mb-2">Reset Password</CardTitle>
              <CardDescription className="text-[#8b1e3f] font-medium">
                Enter your new password
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-semibold text-[#8b1e3f]">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {newPassword && (
                    <p className={`text-xs ${passwordStrength.color}`}>
                      {passwordStrength.text}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#8b1e3f]">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-[#8b1e3f]/20 focus:border-[#8b1e3f]/50 focus:ring-[#8b1e3f]/50 bg-white/50"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={resetPasswordMutation.isPending || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  {resetPasswordMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-xs text-[#8b1e3f]/60">Secure password reset • Your data is protected</p>
          </div>
        </div>
      </div>
      
      {/* Error Modal */}
      <ErrorModal />
    </div>
  )
}

export default ResetPassword
