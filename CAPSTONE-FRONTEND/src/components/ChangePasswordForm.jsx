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
  const [toast, setToast] = useState({ show: false, message: "", type: "" })

  const changePasswordMutation = useChangePassword()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) return

    if (newPassword !== confirmPassword) {
      setToast({ show: true, message: "New passwords do not match", type: "error" })
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
      return
    }

    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
          setToast({ show: true, message: "Password changed successfully!", type: "success" })
          setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
        },
        onError: () => {
          setToast({ show: true, message: "Failed to change password. Please try again.", type: "error" })
          setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000)
        },
      },
    )
  }

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" }

    let score = 0
    const feedback = []

    if (password.length >= 8) score++
    else feedback.push("at least 8 characters")

    if (/[A-Z]/.test(password)) score++
    else feedback.push("uppercase letter")

    if (/[a-z]/.test(password)) score++
    else feedback.push("lowercase letter")

    if (/\d/.test(password)) score++
    else feedback.push("number")

    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) score++
    else feedback.push("special character")

    const colors = ["text-red-500", "text-red-500", "text-yellow-500", "text-yellow-500", "text-green-500"]

    return {
      score,
      text: score === 5 ? "Strong" : `Missing: ${feedback.join(", ")}`,
      color: colors[score] || "text-gray-500",
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <Card className="w-full max-w-6xl mx-auto">

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#8b1e3f]">Change Password</CardTitle>
        <CardDescription className="text-[#8b1e3f]">
          Update your account password for enhanced security
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-semibold text-[#8b1e3f]">
              Current Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-[#8b1e3f]/30 focus:border-[#8b1e3f] focus:ring-[#8b1e3f]"
                placeholder="Enter current password"
                required
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]"
                disabled={changePasswordMutation.isPending}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
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
                className="pl-10 pr-10 h-12 border-[#8b1e3f]/30 focus:border-[#8b1e3f] focus:ring-[#8b1e3f]"
                placeholder="Enter new password"
                required
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]"
                disabled={changePasswordMutation.isPending}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword && <p className={`text-xs ${passwordStrength.color}`}>{passwordStrength.text}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-[#8b1e3f]">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8b1e3f]/40" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 h-12 border-p[#8b1e3f]/30 focus:border-[#8b1e3f] focus:ring-[#8b1e3f]"
                placeholder="Confirm new password"
                required
                disabled={changePasswordMutation.isPending}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b1e3f]/40 hover:text-[#8b1e3f]"
                disabled={changePasswordMutation.isPending}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/70 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
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
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-[#8b1e3f]/10 rounded-lg">
          <h4 className="text-sm font-semibold text-[#8b1e3f] mb-2">Password Requirements:</h4>
          <ul className="text-xs text-[#8b1e3f] space-y-1">
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
