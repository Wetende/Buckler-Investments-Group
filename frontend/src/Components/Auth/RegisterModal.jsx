import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../Form/Form'
import Buttons from '../Button/Buttons'
import CustomModal from '../CustomModal'
import { registerAndLogin } from '../../api/authService'
import { resetForm } from '../../Functions/Utilities'
import { Link, useNavigate } from 'react-router-dom'
import RegisterBtn from './RegisterBtn'
import useAuth from '../../api/useAuth'

const RegisterModal = ({ className = '', onSuccess = () => {}, triggerButton = null }) => {
  const navigate = useNavigate()
  const { login } = useAuth()
  return (
    <CustomModal.Wrapper
      className={className}
      closeBtnOuter={false}
      modalBtn={
        triggerButton || <RegisterBtn />
      }
    >
      <div className="bg-white rounded-[6px] p-16 md:p-12 sm:p-8 max-w-[500px] mx-auto relative">
        <CustomModal.Close className="close-btn absolute top-[12px] right-[12px] text-[#333] z-[60]">
          <button aria-label="close register modal" title="Close (Esc)" type="button" className="border-none text-[24px] font-light w-[40px] h-[40px]">×</button>
        </CustomModal.Close>
        
        <h3 className="heading-5 font-serif font-semibold text-center mb-8">Create your account</h3>
        
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={Yup.object().shape({
            username: Yup.string().required("Username is required."),
            email: Yup.string().email("Invalid email.").required("Email is required."),
            password: Yup.string().min(8, "Password must be at least 8 characters.").required("Password is required.")
          })}
          onSubmit={async (values, actions) => {
            try {
              const result = await registerAndLogin({ 
                username: values.username, 
                email: values.email, 
                password: values.password 
              })
              
              // Update auth context with user data
              login(result.user)
              
              resetForm(actions)
              onSuccess()
              
              // Redirect to home page
              navigate('/')
              
              actions.setStatus('Registration successful! Welcome!')
            } catch (e) {
              console.error('Registration error:', e)
              actions.setStatus('Registration failed. Please try again.')
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {status && (
                <div className={`text-sm mb-4 text-center ${status.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>
                  {status}
                </div>
              )}
              
              <Input 
                showErrorMsg={true} 
                name="username" 
                type="text" 
                labelClass="mb-[20px]" 
                label={<div className="mb-[10px] font-serif">Username <span className="text-[#fb4f58]">*</span></div>} 
                className="py-[13px] px-[15px] w-full border-[1px] border-solid border-[#dfdfdf] text-md leading-[initial] rounded-[4px]" 
                placeholder="Enter your username" 
              />
              
              <Input 
                showErrorMsg={true} 
                name="email" 
                type="email" 
                labelClass="mb-[20px]" 
                label={<div className="mb-[10px] font-serif">Email address <span className="text-[#fb4f58]">*</span></div>} 
                className="py-[13px] px-[15px] w-full border-[1px] border-solid border-[#dfdfdf] text-md leading-[initial] rounded-[4px]" 
                placeholder="Enter your email" 
              />
              
              <Input 
                showErrorMsg={true} 
                name="password" 
                type="password" 
                labelClass="mb-[20px]" 
                label={<div className="mb-[10px] font-serif">Password <span className="text-[#fb4f58]">*</span></div>} 
                className="py-[13px] px-[15px] w-full border-[1px] border-solid border-[#dfdfdf] text-md leading-[initial] rounded-[4px]" 
                placeholder="Enter your password (min 8 characters)" 
              />
              
              <p className="mb-[25px] block text-sm text-[#777]">
                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our{' '}
                <Link aria-label="privacy-policy-link" to="/privacy" target="_blank" className="underline hover:text-basecolor">
                  privacy policy
                </Link>.
              </p>
              
              <Buttons 
                ariaLabel="register" 
                type="submit" 
                disabled={isSubmitting}
                className="btn-fill btn-fancy w-full font-medium font-serif rounded-none uppercase" 
                themeColor="#232323" 
                color="#fff" 
                size="md" 
                title={isSubmitting ? "Creating account..." : "Register"} 
              />
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal.Wrapper>
  )
}

export default RegisterModal
