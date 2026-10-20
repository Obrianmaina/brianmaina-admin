import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://brianmaina.stream',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // If you had a blog, you would add more pages here
    // {
    //   url: 'https://brianmaina.stream/blog/my-post',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}