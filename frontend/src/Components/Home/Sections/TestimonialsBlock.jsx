import React from 'react'

export default function TestimonialsBlock() {
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-6">What our customers say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Amina', text: 'Loved the Masai Mara safari. Seamless experience!' },
            { name: 'David', text: 'Great rentals selection and smooth booking.' },
            { name: 'Wanjiru', text: 'Clean UI, easy to find tours and cars.' },
          ].map((t, i) => (
            <div key={i} className="p-6 border rounded-md">
              <p className="mb-3">“{t.text}”</p>
              <div className="text-sm text-[#777]">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}




