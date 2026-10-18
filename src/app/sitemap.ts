import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lateliermaison.com'
  const currentDate = new Date().toISOString()

  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/services', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/services/housecleaning', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/services/remodeling', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/services/estate-management', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/services/painting', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/services/tv-mounting', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/estimate', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/portfolio', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contact', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/locations', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/locations/atlanta', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/locations/washington-dc', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/locations/maryland', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/locations/northern-virginia', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'monthly' as const },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
