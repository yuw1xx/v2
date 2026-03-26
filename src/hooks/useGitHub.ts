import { useState, useEffect } from 'react'

export interface GHUser {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  html_url: string
  created_at: string
}

export interface GHRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  topics: string[]
  updated_at: string
  pushed_at: string
  fork: boolean
  size: number
}

export interface LangStats {
  [lang: string]: number // bytes
}

// Colours sourced from GitHub linguist
export const LANG_COLOR: Record<string, string> = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f1e05a',
  Python:      '#3572a5',
  'C#':        '#178600',
  Java:        '#b07219',
  CSS:         '#563d7c',
  HTML:        '#e34c26',
  PHP:         '#4f5d95',
  Rust:        '#dea584',
  Go:          '#00add8',
  Shell:       '#89e051',
  Kotlin:      '#a97bff',
  Swift:       '#f05138',
  Ruby:        '#701516',
  'C++':       '#f34b7d',
  C:           '#555555',
  Vue:         '#41b883',
  Svelte:      '#ff3e00',
  Dart:        '#00b4ab',
}

export function useGitHub(username: string) {
  const [user,  setUser]  = useState<GHUser | null>(null)
  const [repos, setRepos] = useState<GHRepo[]>([])
  const [langs, setLangs] = useState<LangStats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`),
        ])
        const u: GHUser    = await uRes.json()
        const r: GHRepo[]  = await rRes.json()

        setUser(u)
        const filtered = r.filter(repo => !repo.fork)
        setRepos(filtered)

        // Aggregate languages across top 10 repos by size
        const top = [...filtered].sort((a, b) => b.size - a.size).slice(0, 10)
        const langMap: LangStats = {}

        await Promise.all(
          top.map(async (repo) => {
            try {
              const lRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/languages`)
              const l: LangStats = await lRes.json()
              Object.entries(l).forEach(([lang, bytes]) => {
                langMap[lang] = (langMap[lang] || 0) + bytes
              })
            } catch {}
          })
        )

        setLangs(langMap)
      } catch (err) {
        console.error('GitHub fetch error', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [username])

  // Sorted repos for display (most recently pushed, non-fork)
  const topRepos = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 6)

  // Lang percentages
  const totalBytes = Object.values(langs).reduce((s, v) => s + v, 0)
  const langPercent = Object.entries(langs)
    .map(([lang, bytes]) => ({ lang, pct: (bytes / totalBytes) * 100 }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 7)

  return { user, repos, topRepos, langs, langPercent, loading }
}

export function timeAgo(date: string) {
  const d = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (d < 60)   return `${d}s ago`
  if (d < 3600) return `${Math.floor(d/60)}m ago`
  if (d < 86400)return `${Math.floor(d/3600)}h ago`
  if (d < 2592000) return `${Math.floor(d/86400)}d ago`
  return `${Math.floor(d/2592000)}mo ago`
}
