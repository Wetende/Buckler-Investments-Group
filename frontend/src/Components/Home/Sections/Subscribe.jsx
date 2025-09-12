import React, { useState } from 'react'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState(false)
  const onSubmit = (e) => {
    e.preventDefault()
    setOk(true)
  }
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-6">Subscribe for updates</h2>
        {ok ? (
          <div className="text-green-600">Thanks! You are subscribed.</div>
        ) : (
          <form onSubmit={onSubmit} className="flex max-w-[520px] gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 border rounded-md px-4 py-3"
              placeholder="you@example.com"
              required
            />
            <button type="submit" className="px-5 py-3 bg-[#232323] text-white rounded-md">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  )
}








