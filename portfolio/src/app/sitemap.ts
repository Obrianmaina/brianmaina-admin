import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://brianmaina.de',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // If you had a blog, you would add more pages here
    // {
    //   url: 'https://brianmaina.de/blog/my-post',
    //   lastModified: new Date(),
    //   changeFrequency: 'weekly',
    //   priority: 0.8,
    // },
  ]
}