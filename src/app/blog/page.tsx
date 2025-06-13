'use client';
import { useState, useEffect } from 'react';
import { Calendar, User, Clock, ArrowRight, Search, FolderOpen, Home, Filter, Grid, Sparkles, TrendingUp, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  slug: string;
  categories: string[];
  readingTime: number;
  published: boolean;
}

export default function BlogPage() {  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Show 6 posts per page (3x2 grid on desktop, 1 column on mobile)

  useEffect(() => {
    fetchPosts();
  }, []);  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched posts:', data); // Debug log
        // Filter to only show published posts and transform tags to categories
        const publishedPosts = data.filter((post: any) => post.published).map((post: any) => ({
          ...post,
          categories: post.tags || [] // Transform tags to categories for display
        }));
        setPosts(publishedPosts);
        console.log('Published posts displayed:', publishedPosts); // Debug log
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const allCategories = Array.from(new Set(posts.flatMap(post => post.categories)));

  // Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); 
           i <= Math.min(totalPages - 1, currentPage + delta); 
           i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
      <div className="flex flex-col items-center space-y-4 mt-12">
        {/* Mobile pagination - simplified */}
        <div className="flex md:hidden items-center justify-between w-full max-w-sm">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <span>Page</span>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg font-semibold text-white">
              {currentPage}
            </span>
            <span>of {totalPages}</span>
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Desktop pagination - full controls */}
        <div className="hidden md:flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? setCurrentPage(page) : null}
                disabled={typeof page !== 'number'}
                className={`px-4 py-2 text-sm font-medium rounded-xl backdrop-blur-xl transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white border border-blue-400/50 shadow-lg'
                    : typeof page === 'number'
                    ? 'text-gray-300 bg-white/10 border border-white/20 hover:bg-white/20 hover:text-white'
                    : 'text-gray-500 cursor-default'
                }`}
              >
                {typeof page === 'number' ? page : <MoreHorizontal className="w-4 h-4" />}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-xl backdrop-blur-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Results info */}
        <div className="text-sm text-gray-400 text-center">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} of {filteredPosts.length} articles
        </div>
      </div>
    );
  };if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="relative flex flex-col items-center">
          <div className="animate-spin rounded-full h-40 w-40 border-4 border-transparent border-t-blue-500 border-r-purple-500 p-1 mb-4">
            <Image src="/LogoMouhibOtman.svg" alt="Loading..." width={144} height={144} className="rounded-full" />
          </div>
          <p className="text-white text-xl">Loading posts...</p>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-3 shadow-2xl">                  <Image
                    src="/LogoMouhibOtman.svg"
                    alt="Mouhib Otman Logo"
                    width={40}
                    height={40}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Mouhib Otman
                </h1>
                <p className="mt-1 text-gray-400 text-sm sm:text-base">Personal insights and innovation</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-400">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>{filteredPosts.length} Articles</span>
              </div>
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-gray-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl group"
              >
                <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* Hero Section */}
        <div className="text-center mb-12">          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-xl">
              <Sparkles className="w-4 h-4 mr-2" />
              Tech Stories • Insights • Perspectives
            </span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
            Let's Code, Create & Grow
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Hey there! 👋 I'm <span className="text-blue-300 font-medium">Mouhib Otman</span>, and I love sharing my journey through the tech world. 
            <br className="hidden sm:block" />
            From <span className="text-green-300 font-medium">late-night debugging stories</span> to 
            <span className="text-purple-300 font-medium"> industry insights</span>, 
            <span className="text-pink-300 font-medium"> personal viewpoints</span>, and yes - some tutorials too! 
            <br className="hidden sm:block" />
            This is where I share what I've learned, what I think, and the experiences that shaped my perspective on technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
            <Link
              href="/"
              className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-xl border border-white/20"
            >
              <User className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              View My Portfolio
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="text-sm text-gray-400">
              Want to see what I've built? Check out my work! 
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Fresh content weekly
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
              {posts.length}+ articles and counting
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-600 rounded-full"></div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-purple-400" />
              Personal experiences shared
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles, insights, and more..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white backdrop-blur-xl min-w-48"
                  >
                    <option value="" className="bg-gray-800">All Categories</option>
                    {allCategories.map(category => (
                      <option key={category} value={category} className="bg-gray-800">{category}</option>
                    ))}
                  </select>
                </div>
                <button className="flex items-center px-6 py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-white/20 backdrop-blur-xl group">
                  <Grid className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  View All
                </button>
              </div>
            </div>
          </div>
        </div>        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No articles found</h3>              
              <p className="text-gray-400 mb-6">
                {searchTerm || selectedCategory 
                  ? 'Try adjusting your search criteria to discover more content.' 
                  : 'Check back soon for fresh insights and perspectives.'}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <article
                  key={post._id}
                  className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:bg-white/15 hover:scale-105 transition-all duration-500 hover:shadow-2xl"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="p-8">
                    {/* Article Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{post.author}</div>
                          <div className="flex items-center text-xs text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
                      {post.title}
                    </h2>

                    <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>                  
                    
                    {/* Categories */}
                    {post.categories.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {post.categories.slice(0, 3).map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30 backdrop-blur-xl"
                            >
                              <FolderOpen className="w-3 h-3 mr-1" />
                              {category}
                            </span>
                          ))}
                          {post.categories.length > 3 && (
                            <span className="text-xs text-gray-400 px-2 py-1">
                              +{post.categories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center text-blue-400 hover:text-white font-medium text-sm group-hover:translate-x-2 transition-all duration-300"
                    >
                      <span>Read full article</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-500 pointer-events-none"></div>
                </article>
              ))}
            </div>
            
            {/* Pagination Component */}
            <PaginationComponent />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">            <p className="text-gray-400">
              © 2025 Mouhib Otman. Crafted with passion for personal innovation.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
