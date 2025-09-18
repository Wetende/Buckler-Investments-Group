import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../Components/Form/Form'
import Buttons from '../../Components/Button/Buttons'
import { axiosInstance } from '../../api/axios'

const PasswordReset = () => {
  const [step, setStep] = useState('request')
  const [message, setMessage] = useState('')

  return (
    <div className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
      <div className="container max-w-xl">
        <h1 className="heading-4 font-serif font-semibold mb-6">Password reset</h1>
        {message && <p className="text-[#777] mb-6">{message}</p>}

        {step === 'request' && (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={Yup.object().shape({ email: Yup.string().email('Invalid email').required('Required') })}
            onSubmit={async (values, actions) => {
              try {
                await axiosInstance.post('/auth/password-reset/request', values)
                setMessage('Check your email for the reset code')
                setStep('confirm')
              } catch (e) {
                actions.setStatus('Failed to request reset')
              }
            }}
          >
            {() => (
              <Form>
                <Input name="email" type="email" label={<div className="mb-[10px]">Email address</div>} className="py-[12px] px-[14px] w-full border border-[#dfdfdf]" />
                <Buttons type="submit" className="btn-fill font-medium font-serif rounded-none uppercase mt-4" themeColor="#232323" color="#fff" title="Request reset" />
              </Form>
            )}
          </Formik>
        )}

        {step === 'confirm' && (
          <Formik
            initialValues={{ token: '', new_password: '' }}
            validationSchema={Yup.object().shape({ token: Yup.string().required('Required'), new_password: Yup.string().min(8, 'Min 8 chars').required('Required') })}
            onSubmit={async (values, actions) => {
              try {
                await axiosInstance.post('/auth/password-reset/confirm', values)
                setMessage('Password reset successful. You can now login.')
              } catch (e) {
                actions.setStatus('Failed to confirm reset')
              }
            }}
          >
            {() => (
              <Form>
                <Input name="token" type="text" label={<div className="mb-[10px]">Reset code</div>} className="py-[12px] px-[14px] w-full border border-[#dfdfdf]" />
                <Input name="new_password" type="password" label={<div className="mb-[10px]">New password</div>} className="py-[12px] px-[14px] w-full border border-[#dfdfdf]" />
                <Buttons type="submit" className="btn-fill font-medium font-serif rounded-none uppercase mt-4" themeColor="#232323" color="#fff" title="Confirm reset" />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  )
}

export default PasswordReset


