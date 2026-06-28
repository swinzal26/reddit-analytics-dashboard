import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createComment, fetchPost } from '../api/posts'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState(null)

  useEffect(() => {
    fetchPost(id)
      .then((response) => setPost(response.data.post))
      .catch(() => setStatus('Unable to load the selected post.'))
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!commentText || !username) {
      setStatus('Username and comment text are required.')
      return
    }
    try {
      const response = await createComment(id, { text: commentText, username })
      setPost((current) => ({ ...current, comments: [...current.comments, response.data.comment] }))
      setCommentText('')
      setUsername('')
      setStatus('Comment added successfully.')
    } catch {
      setStatus('Unable to submit comment.')
    }
  }

  if (!post) {
    return <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-8 text-slate-300">Loading post details…</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/20">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Post detail</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{post.title}</h2>
          <p className="mt-2 text-slate-400">Published by {post.username || 'anonymous'}</p>
        </div>
        <Link to="/posts" className="rounded-3xl bg-slate-800 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-700">
          Back to posts
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr,0.7fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Overview</p>
          <div className="mt-4 space-y-4 text-slate-300">
            <p>{post.text || 'No description was provided for this post.'}</p>
            {post.link ? (
              <a href={post.link} target="_blank" rel="noreferrer" className="text-sky-400 hover:text-sky-300">
                Visit linked resource
              </a>
            ) : null}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Upvotes</p>
              <p className="mt-2 text-2xl font-semibold text-white">{post.upvotes}</p>
            </div>
            <div className="rounded-3xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">Comments</p>
              <p className="mt-2 text-2xl font-semibold text-white">{post.comments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Comments</p>
          <div className="mt-4 space-y-4">
            {post.comments.length === 0 ? (
              <p className="text-slate-400">No comments yet. Add the first one below.</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="rounded-3xl bg-slate-900 p-4">
                  <p className="text-sm text-slate-400">{comment.username || 'anonymous'}</p>
                  <p className="mt-2 text-white">{comment.text}</p>
                  <p className="mt-2 text-xs text-slate-500">Upvotes: {comment.upvotes}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-lg shadow-slate-950/10">
        <h3 className="text-xl font-semibold text-white">Post a comment</h3>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-slate-400 uppercase tracking-[0.18em]">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              placeholder="Enter your name"
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-slate-400 uppercase tracking-[0.18em]">Comment</span>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              rows="4"
              className="w-full rounded-3xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-500"
              placeholder="Write your comment"
            />
          </label>
          <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Submit comment
          </button>
          {status ? <p className="text-sm text-slate-400">{status}</p> : null}
        </form>
      </section>
    </div>
  )
}

export default PostDetail
