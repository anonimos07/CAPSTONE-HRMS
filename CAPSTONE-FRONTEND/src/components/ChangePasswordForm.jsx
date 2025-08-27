import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useChangePassword } from "../hooks/usePasswordReset"

const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const changePasswordMutation = useChangePassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) return
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match")
      return
    }
    
    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-800">Change Password</CardTitle>
        <CardDescription className="text-purple-600">
          Update your account password for enhanced security
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-semibold text-purple-700">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-semibold text-purple-700">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
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
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-purple-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={
                changePasswordMutation.isPending || 
                !currentPassword || 
                !newPassword || 
                !confirmPassword || 
                newPassword !== confirmPassword ||
                passwordStrength.score < 5
              }
            >
              {changePasswordMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing Password...
                </div>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-800 mb-2">Password Requirements:</h4>
          <ul className="text-xs text-purple-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase and lowercase letters</li>
            <li>• Contains at least one number</li>
            <li>• Contains at least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChangePasswordForm
