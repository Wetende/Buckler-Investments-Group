import React from 'react'
import { useParams } from 'react-router-dom'
import BlogPostLayout01 from './LayoutPage/BlogPostLayout01'

const SlugPage = () => {
  const { slug } = useParams()
  // For now reusing a layout page; can switch to real fetch by slug
  console.log('Blog slug:', slug) // Use slug to avoid warning
  return <BlogPostLayout01 />
}

export default SlugPage


