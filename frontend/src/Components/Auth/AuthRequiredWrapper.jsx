import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import CustomModal from '../CustomModal'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input, Checkbox } from '../Form/Form'
import Buttons from '../Button/Buttons'
import { login, getCurrentUser } from '../../api/authService'
import { resetForm } from '../../Functions/Utilities'
import { useAuth } from '../../api/useAuth'

const AuthRequiredWrapper = ({ 
  children, 
  fallbackButton,
  modalTitle = "Sign in to continue",
  modalSubtitle = "Please sign in to access this feature",
  className = ""
}) => {
  const { isAuthenticated } = useContext(AuthContext)
  const { login: setAuthUser } = useAuth()

  // If authenticated, render children normally
  if (isAuthenticated) {
    return children
  }

  // If not authenticated, show login modal with fallback button
  return (
    <CustomModal.Wrapper
      className={className}
      closeBtnOuter={false}
      modalBtn={fallbackButton}
    >
      <div className="bg-white rounded-[6px] p-16 md:p-12 sm:p-8 max-w-[500px] mx-auto relative">
        <CustomModal.Close className="close-btn absolute top-[15px] right-[15px] text-[#333]">
          <button title="Close (Esc)" type="button" className="border-none text-[24px] font-light w-[40px] h-[40px]">×</button>
        </CustomModal.Close>
        
        <h3 className="heading-5 font-serif font-semibold text-center mb-4">{modalTitle}</h3>
        {modalSubtitle && (
          <p className="text-center text-gray-600 mb-8">{modalSubtitle}</p>
        )}
        
        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email("Invalid email.").required("Email is required."),
            password: Yup.string().required("Password is required.")
          })}
          onSubmit={async (values, actions) => {
            try {
              await login({ username: values.email, password: values.password })
              const userData = await getCurrentUser()
              setAuthUser(userData)
              resetForm(actions)
              actions.setSubmitting(false)
            } catch (error) {
              console.error('Login failed:', error)
              actions.setFieldError('password', 'Invalid email or password')
              actions.setSubmitting(false)
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <Input 
                  showErrorMsg={true}
                  type="email"
                  name="email"
                  labelClass="mb-[15px]"
                  className="py-[13px] px-[15px] text-md w-full border-[1px] border-solid border-[#dfdfdf]"
                  placeholder="Enter your email"
                  label="Email address *"
                />
              </div>
              <div className="mb-4">
                <Input 
                  showErrorMsg={true}
                  type="password"
                  name="password"
                  labelClass="mb-[15px]"
                  className="py-[13px] px-[15px] text-md w-full border-[1px] border-solid border-[#dfdfdf]"
                  placeholder="Enter your password"
                  label="Password *"
                />
              </div>
              <div className="flex items-center justify-between mb-6">
                <Checkbox name="remember" labelClass="text-sm">
                  Remember me
                </Checkbox>
                <a href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </a>
              </div>
              <Buttons
                type="submit"
                className="btn-fancy btn-fill font-medium font-serif rounded-none uppercase w-full mb-4"
                themeColor="#232323"
                color="#fff"
                size="lg"
                title={isSubmitting ? "Signing in..." : "LOGIN"}
                disabled={isSubmitting}
              />
              <div className="text-center text-sm text-gray-600">
                Don't have an account? 
                <a href="/register" className="text-primary font-medium ml-1">Create one here</a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal.Wrapper>
  )
}

export default AuthRequiredWrapper
