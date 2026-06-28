import { useEffect, useState } from 'react'
import { createPost, deletePost, fetchPosts, upvotePost } from '../api/posts'

function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', link: '', username: '', text: '' })

  useEffect(() => {
    refreshPosts()
  }, [])

  const refreshPosts = () => {
    setLoading(true)
    fetchPosts()
      .then((response) => setPosts(response.data.posts))
      .catch(() => setError('Unable to load posts'))
      .finally(() => setLoading(false))
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const body = { title: form.title, link: form.link, username: form.username, text: form.text }
    try {
      await createPost(body)
      setForm({ title: '', link: '', username: '', text: '' })
      refreshPosts()
    } catch {
      setError('Unable to create post')
    }
  }

  const handleDelete = async (id) => {
    await deletePost(id)
    refreshPosts()
  }

  const handleUpvote = async (id) => {
    await upvotePost(id)
    refreshPosts()
  }

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 shadow-lg shadow-slate-950/20">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Content manager</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Post workflow</h2>
        <p className="mt-2 text-slate-400">Create and manage community posts with a lightweight backend API.</p>
      </header>

      <section className="grid gap-6 xl:grid-cols-[0.9fr,0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <h3 className="text-xl font-semibold text-white">New post</h3>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {['title', 'link', 'username'].map((field) => (
              <label key={field} className="block text-sm text-slate-300">
                <span className="mb-2 block text-slate-400 uppercase tracking-[0.18em]">{field}</span>
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
                  placeholder={`Enter ${field}`}
                />
              </label>
            ))}
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-slate-400 uppercase tracking-[0.18em]">text</span>
              <textarea
                name="text"
                value={form.text}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
                placeholder="Add post details"
              />
            </label>
            <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Publish post
            </button>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </form>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Live feed</p>
          <p className="mt-2 text-slate-400">Posts are fetched from the backend and rendered in a content-first dashboard.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
        <h3 className="text-xl font-semibold text-white">Published posts</h3>
        {loading ? (
          <div className="mt-6 text-slate-400">Loading posts…</div>
        ) : (
          <div className="mt-6 space-y-4">
            {posts.length === 0 ? (
              <p className="text-slate-400">No posts yet. Publish one above to see the dashboard update.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{post.username || 'anonymous'}</p>
                      <h4 className="mt-2 text-lg font-semibold text-white">{post.title}</h4>
                      {post.link ? (
                        <a href={post.link} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">
                          Open link
                        </a>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button onClick={() => handleUpvote(post.id)} className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-700">
                        +1 upvote
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="rounded-full bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-500">
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
                    <span>{post.upvotes} upvotes</span>
                    <span>{post.comments.length} comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Posts
