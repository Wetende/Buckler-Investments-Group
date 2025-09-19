import React, { useState } from 'react'
import LoginBtn from './LoginBtn'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input, Checkbox } from '../Form/Form'
import Buttons from '../Button/Buttons'
import CustomModal from '../CustomModal'
import { login, getCurrentUser } from '../../api/authService'
import { resetForm } from '../../Functions/Utilities'
import { useAuth } from '../../api/useAuth'

const LoginModal = ({ className = '', onSuccess = () => {}, triggerButton = null }) => {
  const { login: setAuthUser } = useAuth()
  return (
    <CustomModal.Wrapper
      className={className}
      closeBtnOuter={false}
      modalBtn={
        triggerButton || <LoginBtn />
      }
    >
      <div className="bg-white rounded-[6px] p-16 md:p-12 sm:p-8 max-w-[500px] mx-auto relative">
        <CustomModal.Close className="close-btn absolute top-[15px] right-[15px] text-[#333]">
          <button title="Close (Esc)" type="button" className="border-none text-[24px] font-light w-[40px] h-[40px]">×</button>
        </CustomModal.Close>
        
        <h3 className="heading-5 font-serif font-semibold text-center mb-8">Login to your account</h3>
        
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
              onSuccess()
              actions.setStatus('Login successful!')
            } catch (e) {
              actions.setStatus('Login failed. Please check your credentials.')
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form>
              {status && (
                <div className="text-red-500 text-sm mb-4 text-center">{status}</div>
              )}
              
              <Input 
                showErrorMsg={true} 
                name="email" 
                type="email" 
                labelClass="mb-[20px]" 
                label={<div className="mb-[10px] font-serif">Email address <span className="text-[#fb4f58]">*</span></div>} 
                className="py-[13px] px-[15px] text-md leading-[initial] w-full border-[1px] border-solid border-[#dfdfdf] rounded-[4px]" 
                placeholder="Enter your email" 
              />
              
              <Input 
                showErrorMsg={true} 
                name="password" 
                type="password" 
                labelClass="mb-[20px]" 
                label={<div className="mb-[10px] font-serif">Password <span className="text-[#fb4f58]">*</span></div>} 
                className="py-[13px] px-[15px] text-md leading-[initial] w-full border-[1px] border-solid border-[#dfdfdf] rounded-[4px]" 
                placeholder="Enter your password" 
              />
              
              <Checkbox 
                type="checkbox" 
                name="remember" 
                className="inline-block" 
                labelClass="flex items-center mb-[25px]"
              >
                <span className="ml-[10px] text-base font-serif">Remember me</span>
              </Checkbox>
              
              <Buttons 
                ariaLabel="login" 
                type="submit" 
                disabled={isSubmitting}
                className="btn-fill btn-fancy w-full font-medium font-serif rounded-none uppercase mb-4" 
                themeColor="#232323" 
                color="#fff" 
                size="md" 
                title={isSubmitting ? "Logging in..." : "Login"} 
              />
              
              <div className="text-center">
                <Buttons 
                  ariaLabel="reset-password" 
                  to="/password-reset" 
                  className="text-center text-[12px] btn-link after:bg-[#000] hover:text-[#000] font-medium font-serif uppercase btn after:h-[2px]" 
                  size="md" 
                  color="#000" 
                  title="Forgot your password?" 
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </CustomModal.Wrapper>
  )
}

export default LoginModal
