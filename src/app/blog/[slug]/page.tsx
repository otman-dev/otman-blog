'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, User, Clock, ArrowLeft, FolderOpen, Share2, Home, Eye, Bookmark, ThumbsUp, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  slug: string;
  categories: string[];
  tags: string[];
  readingTime: number;
}

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string);
    }
  }, [params.slug]);
  const fetchPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/posts/by-slug/${slug}`);
      if (response.ok) {
        const data = await response.json();
        // Transform tags to categories for display
        setPost({
          ...data,
          categories: data.tags || []
        });
      } else if (response.status === 404) {
        setError('Post not found');
      } else {
        setError('Failed to load post');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="animate-spin rounded-full h-40 w-40 border-4 border-transparent border-t-blue-500 border-r-purple-500 p-1 mb-4">
            <Image src="/logo.png" alt="Loading..." width={144} height={144} className="rounded-full" />
          </div>
          <p className="text-white text-xl">Loading post...</p>
        </div>
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              {error || 'Article not found'}
            </h1>            <p className="text-gray-400 mb-6">
              The article you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <Link
                href="/blog"
                className="flex items-center px-4 py-2 text-gray-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl group"
              >
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Home
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2 shadow-2xl">
                    <Image
                      src="/logo.png"
                      alt="AtlanticDunes Logo"
                      width={32}
                      height={32}
                      className="object-contain filter brightness-0 invert"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-white">AtlanticDunes</div>
                  <div className="text-xs text-gray-400">Enterprise Blog</div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-white/20 backdrop-blur-xl group"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <article className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <header className="mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author and Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-white">{post.author}</div>
                  <div className="flex items-center text-sm text-gray-400 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readingTime} min read
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:bg-white/20 transition-all duration-200 backdrop-blur-xl">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">234 views</span>
                </button>
                <button className="flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:bg-white/20 transition-all duration-200 backdrop-blur-xl">
                  <Bookmark className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Save</span>
                </button>
              </div>
            </div>            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-xl border border-blue-500/30 backdrop-blur-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200"
                  >
                    <FolderOpen className="w-3 h-3 mr-2" />
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>        {/* Article Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8 sm:p-12 mb-12">
          <div className="prose prose-lg prose-invert max-w-none">
            <div className="markdown-content text-gray-200 leading-relaxed text-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                  h1: (props) => <h1 className="text-3xl font-bold text-white mb-6 mt-8" {...props} />,
                  h2: (props) => <h2 className="text-2xl font-bold text-white mb-4 mt-6" {...props} />,
                  h3: (props) => <h3 className="text-xl font-bold text-white mb-3 mt-4" {...props} />,
                  h4: (props) => <h4 className="text-lg font-bold text-white mb-2 mt-4" {...props} />,
                  p: (props) => <p className="mb-6 text-gray-200" style={{lineHeight: '1.8'}} {...props} />,
                  a: (props) => <a className="text-blue-400 hover:text-blue-300 underline" {...props} />,
                  strong: (props) => <strong className="text-white font-semibold" {...props} />,
                  em: (props) => <em className="text-blue-300" {...props} />,
                  blockquote: (props) => <blockquote className="border-l-4 border-blue-500 pl-6 my-6 text-gray-300 italic" {...props} />,
                  code: ({inline, className, children, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <code className={`${className} block p-4 rounded-lg font-mono text-sm overflow-x-auto my-4`} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className="bg-slate-800 px-2 py-1 rounded text-blue-300 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre: (props) => <pre className="bg-slate-800/80 p-0 rounded-lg" {...props} />,
                  ul: (props) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-200" {...props} />,
                  ol: (props) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-200" {...props} />,
                  li: (props) => <li className="mb-1" {...props} />,
                  img: (props) => <img className="rounded-lg shadow-lg my-6 max-w-full" {...props} />,
                  hr: (props) => <hr className="border-gray-700 my-8" {...props} />,
                  table: (props) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-700 my-6" {...props} /></div>,
                  th: (props) => <th className="px-4 py-3 bg-gray-800 text-left text-sm font-medium text-gray-200 uppercase tracking-wider" {...props} />,
                  td: (props) => <td className="px-4 py-3 bg-gray-900/50 text-sm" {...props} />
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Article Footer */}
        <footer className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">
                Written by {post.author}
              </h3>
              <p className="text-gray-400 mb-4">
                Published on {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="text-sm text-gray-400">
                Thank you for reading! Feel free to share this article with your network.
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl group">
                <ThumbsUp className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Like Article
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl group">
                <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Comment
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 group"
              >
                <Share2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                Share Article
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
