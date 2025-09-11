import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchCurrentUserDetails, updateUserProfile } from "../Api/hr"
import Header from "../components/Header"
import ChangePasswordForm from "../components/ChangePasswordForm"
import ProfilePictureUpload from "../components/ProfilePictureUpload"

const HrProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleLogout = () => {
    setIsDropdownOpen(false)
    localStorage.clear()
  }

  const initialFormState = {
    firstName: "",
    lastName: "",
    contact: "",
    department: "",
    address: "",
    email: "",
  }

  const [form, setForm] = useState(initialFormState)
  const [isEmptyDetails, setIsEmptyDetails] = useState(false)

  const token = localStorage.getItem("token")

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employeeDetails"],
    queryFn: fetchCurrentUserDetails,
    enabled: !!token,
  })

  // Process data with useEffect to ensure it runs every time data changes
  useEffect(() => {
    if (data && !isLoading) {
      console.log("Processing data...")

      // Check if it's an empty details response
      if (data.message === "Employee details not yet created") {
        console.log("Employee details not created yet")
        setIsEmptyDetails(true)
        return
      }

      // Try multiple possible response structures
      const employeeData = data

      const newFormState = {
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        contact: employeeData.contact,
        department: employeeData.department,
        address: employeeData.address,
        email: employeeData.email,
      }

      setForm(newFormState)
      setIsEmptyDetails(false)
    }
  }, [data, isLoading])

  // Mutation for update
  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (responseData) => {
      console.log("Update success:", responseData)
      queryClient.invalidateQueries({ queryKey: ["employeeDetails"] })
      alert("Profile updated successfully")
      setIsEmptyDetails(false)
    },
    onError: (error) => {
      console.error("Update error:", error)
      alert("Failed to update profile")
    },
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting form:", form)
    updateMutation.mutate(form)
  }

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Header userRole="HR" />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b1e3f]"></div>
        </div>
      </div>
    )

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <p className="text-red-600">Error loading profile data: {error?.message}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header userRole="HR" />

      <div className="flex px-8 py-8">
        {/* Sidebar */}
        <aside className="w-1/4 mr-8">
          {/* Profile Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl mb-6 overflow-hidden border border-red-100">
            <div className="bg-white px-6 pt-6 pb-8">
              <div className="flex flex-col items-center gap-4 mb-6">
                <ProfilePictureUpload size="large" />
                <div className="text-center">
                  <div className="font-bold text-lg text-[#8b1e3f]">
                    {form.firstName} {form.lastName}
                  </div>
                  <div className="text-sm text-gray-600">{form.department || "No department assigned"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#8b1e3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-gray-600">{form.email || "No email provided"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#8b1e3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-600">{form.contact || "No contact number"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <svg className="w-4 h-4 text-[#8b1e3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-600">{form.address || "No address provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Profile Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-red-100 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#8b1e3f]">Profile Information</h2>
              {isEmptyDetails && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
                  Your details are empty, please fill up your details.
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">First Name</label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    type="text"
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Last Name</label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Last Name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Contact Number</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    type="text"
                    placeholder="Contact Number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    type="text"
                    placeholder="Department"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="Email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#8b1e3f]/50 focus:border-[#8b1e3f]/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2 pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="w-40 h-12 bg-[#8b1e3f] hover:bg-[#8b1e3f]/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                  >
                    {updateMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-red-100 w-full max-w-full">
            <h2 className="text-2xl font-bold text-[#8b1e3f] mb-6">Security Settings</h2>
            <ChangePasswordForm />
          </div>
        </main>
      </div>
    </div>
  )
}

export default HrProfile
