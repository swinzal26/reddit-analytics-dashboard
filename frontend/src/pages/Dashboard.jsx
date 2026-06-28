import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchPosts } from '../api/posts'
import StatCard from '../components/StatCard'

function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPosts()
      .then((response) => {
        setPosts(response.data.posts)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to fetch posts')
        setLoading(false)
      })
  }, [])

  const metrics = useMemo(() => {
    const totalPosts = posts.length
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0)
    const totalUpvotes = posts.reduce((sum, post) => sum + post.upvotes, 0)
    const topPost = posts.slice().sort((a, b) => b.upvotes - a.upvotes)[0]
    return { totalPosts, totalComments, totalUpvotes, topPost }
  }, [posts])

  const chartData = useMemo(
    () =>
      posts.map((post) => ({
        title: post.title.length > 20 ? `${post.title.slice(0, 20)}…` : post.title,
        upvotes: post.upvotes,
        comments: post.comments.length,
      })),
    [posts],
  )

  if (loading) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-slate-300">Loading dashboard…</div>
  }

  if (error) {
    return <div className="rounded-3xl border border-red-500 bg-red-950/20 p-8 text-red-200">{error}</div>
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Performance overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Community analytics</h2>
        <p className="mt-2 text-slate-400">
          Monitor votes, comments, and active posts to shape the next feature release.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        <StatCard label="Total posts" value={metrics.totalPosts} description="New ideas generated from community content." />
        <StatCard label="Total comments" value={metrics.totalComments} description="Community engagement across posts." />
        <StatCard label="Total upvotes" value={metrics.totalUpvotes} description="Overall positive reactions from users." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Engagement chart</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Upvotes by post</h3>
            </div>
          </div>

          <div className="mt-8 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="title" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                <Bar dataKey="upvotes" fill="#38bdf8" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Top trending post</p>
          {metrics.topPost ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-slate-900 p-5">
                <h4 className="text-lg font-semibold text-white">{metrics.topPost.title}</h4>
                <p className="mt-2 text-slate-400">By {metrics.topPost.username || 'anonymous'}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatCard label="Upvotes" value={metrics.topPost.upvotes} />
                <StatCard label="Comments" value={metrics.topPost.comments.length} />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-slate-400">No posts available yet. Create one from the Posts page.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
