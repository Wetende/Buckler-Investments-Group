import React, { useState } from 'react'
import { logout } from '../../api/authService'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '../../Components/Form/Form'
import Buttons from '../../Components/Button/Buttons'
import { axiosPrivate } from '../../api/axios'

const Account = () => {
  const [message, setMessage] = useState('')

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/login'
    } catch (e) {
      setMessage('Logout failed')
    }
  }

  return (
    <div className="py-[130px] lg:py-[90px] md:py-[75px] sm:py-[50px]">
      <div className="container">
        <h1 className="heading-4 font-serif font-semibold">My Account</h1>
        {message && <p className="text-[#777]">{message}</p>}
        <div className="mt-6">
          <Buttons onClick={handleLogout} className="btn-fill font-medium font-serif rounded-none uppercase" themeColor="#232323" color="#fff" title="Logout" />
        </div>

        <div className="mt-12">
          <h2 className="heading-5 font-serif font-semibold mb-4">Change Password</h2>
          <Formik
            initialValues={{ old_password: '', new_password: '' }}
            validationSchema={Yup.object().shape({
              old_password: Yup.string().required('Required'),
              new_password: Yup.string().min(8, 'Min 8 chars').required('Required'),
            })}
            onSubmit={async (values, actions) => {
              try {
                await axiosPrivate.post('/auth/change-password', values)
                actions.resetForm()
                setMessage('Password changed successfully')
              } catch (e) {
                actions.setStatus('Password change failed')
                setMessage('Password change failed')
              }
            }}
          >
            {() => (
              <Form className="max-w-xl">
                <Input name="old_password" type="password" label={<div className="mb-[10px]">Current password</div>} className="py-[12px] px-[14px] w-full border border-[#dfdfdf]" />
                <Input name="new_password" type="password" label={<div className="mb-[10px]">New password</div>} className="py-[12px] px-[14px] w-full border border-[#dfdfdf]" />
                <Buttons type="submit" className="btn-fill font-medium font-serif rounded-none uppercase mt-4" themeColor="#232323" color="#fff" title="Update Password" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Account


