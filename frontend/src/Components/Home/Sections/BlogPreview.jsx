import React from 'react'

const MOCK_POSTS = [
  { slug: 'market-outlook-q3', title: 'Market outlook for Q3', excerpt: 'Key trends we are watching in the region.' },
  { slug: 'safari-packing-list', title: 'Safari packing list', excerpt: 'Everything you need for your next trip.' },
  { slug: 'naivasha-weekend', title: 'A weekend in Naivasha', excerpt: 'Quick guide to lakeside serenity.' },
]

export default function BlogPreview() {
  return (
    <section className="py-[80px] bg-white md:py-[60px]">
      <div className="container">
        <h2 className="heading-4 font-serif font-semibold mb-6">From the blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_POSTS.map((p) => (
            <article key={p.slug} className="p-6 border rounded-md">
              <h3 className="font-serif font-semibold mb-2">{p.title}</h3>
              <p className="text-[#777] mb-3">{p.excerpt}</p>
              <a href={`/blogs/${p.slug}`} className="text-[#232323] underline">Read more</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}


