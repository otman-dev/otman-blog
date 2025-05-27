'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, ArrowLeft, FolderOpen, Calendar, Sparkles, FileText, Globe, ChevronDown, X, Tag as TagIcon } from 'lucide-react';

export default function NewPost() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categories: [] as string[],
    tags: [] as string[],
    status: 'draft' as 'draft' | 'published'
  });

  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string, color?: string}[]>([]);
  const [availableTags, setAvailableTags] = useState<{id: string, name: string, color?: string}[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');  const router = useRouter();
  const fetchAvailableCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/categories');
      if (response.ok) {
        const categories = await response.json();
        setAvailableCategories(categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, []);

  const fetchAvailableTags = useCallback(async () => {
    try {
      const response = await fetch('/api/blog/tags');
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (!response.ok || !data.isAuthenticated) {
        router.push('/admin/login');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    }
  }, [router]);
  useEffect(() => {
    checkAuth();
    fetchAvailableCategories();
    fetchAvailableTags();
  }, [checkAuth, fetchAvailableCategories, fetchAvailableTags]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false);
      }
      if (!target.closest('.tag-dropdown')) {
        setIsTagDropdownOpen(false);
      }
    };

    if (isCategoryDropdownOpen || isTagDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isCategoryDropdownOpen, isTagDropdownOpen]);  const handleCategoryToggle = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter(cat => cat !== categoryName)
        : [...prev.categories, categoryName]
    }));
  };

  const handleRemoveCategory = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryName)
    }));
  };

  const handleTagToggle = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(tag => tag !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const handleRemoveTag = (tagName: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagName)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categories: formData.categories,
          tags: formData.tags,
        }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
      }    } catch (error) {
      console.error('Post creation error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${formData.title}</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-50">
          <div class="max-w-4xl mx-auto p-6">
            <article class="bg-white rounded-lg shadow-lg p-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">${formData.title}</h1>
              <p class="text-xl text-gray-600 mb-6">${formData.excerpt}</p>
              <div class="prose max-w-none">
                ${formData.content.replace(/\n/g, '<br>')}
              </div>
            </article>
          </div>
        </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center text-gray-400 hover:text-white mr-6 p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <p className="text-gray-400 mt-1">Share your insights with the world</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center px-4 py-2 text-gray-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 backdrop-blur-xl">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
              {error}
            </div>
          </div>
        )}        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Title */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-200 mb-3">
                  Post Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 text-lg backdrop-blur-xl transition-all duration-200"
                  placeholder="Enter an engaging title for your post..."
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-200 mb-3">
                  Post Excerpt
                </label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-200 resize-none"
                  placeholder="Write a compelling excerpt that summarizes your post..."
                />
              </div>

              {/* Content */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <label htmlFor="content" className="block text-sm font-semibold text-gray-200 mb-3">
                  Post Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={24}
                  className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 font-mono text-sm backdrop-blur-xl transition-all duration-200 resize-none"
                  placeholder="Write your post content here... You can use Markdown formatting."
                />
                <div className="mt-3 flex items-center text-xs text-gray-400">
                  <FileText className="w-4 h-4 mr-2" />
                  Supports Markdown formatting for rich content
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                  Publishing
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Post Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        status: e.target.value as 'draft' | 'published' 
                      })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white backdrop-blur-xl"
                    >
                      <option value="draft" className="bg-gray-800">Save as Draft</option>
                      <option value="published" className="bg-gray-800">Publish Now</option>
                    </select>
                  </div>
                  <div className="flex items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className={`w-2 h-2 rounded-full mr-3 ${formData.status === 'published' ? 'bg-green-400' : 'bg-amber-400'}`}></div>
                    <span className="text-sm text-gray-300">
                      {formData.status === 'published' ? 'Will be published immediately' : 'Saved as draft'}
                    </span>
                  </div>
                </div>
              </div>              {/* Categories */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-purple-400" />
                  Categories
                </h3>
                <div className="space-y-3">
                  {/* Selected Categories Display */}
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-xl text-sm border border-purple-500/30"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category)}
                            className="ml-2 text-purple-400 hover:text-purple-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category Dropdown */}
                  <div className="relative category-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 backdrop-blur-xl flex items-center justify-between"
                    >
                      <span className="text-gray-400">
                        {formData.categories.length > 0 ? `${formData.categories.length} categor${formData.categories.length === 1 ? 'y' : 'ies'} selected` : 'Select categories'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isCategoryDropdownOpen && (                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto category-dropdown">
                        {availableCategories.length > 0 ? (
                          availableCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              onClick={() => {
                                handleCategoryToggle(category.name);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center ${
                                formData.categories.includes(category.name)
                                  ? 'bg-purple-500/20 text-purple-300'
                                  : 'text-gray-300'
                              }`}
                            >
                              {category.color && (
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                ></div>
                              )}
                              {category.name}
                              {formData.categories.includes(category.name) && (
                                <span className="ml-auto text-purple-400">✓</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-400 text-sm">
                            No categories available. Create categories in the dashboard first.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Primary organization for your content
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TagIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Tags
                </h3>
                <div className="space-y-3">
                  {/* Selected Tags Display */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => {
                        const tagData = availableTags.find(t => t.name === tag);
                        return (
                          <span
                            key={tag}
                            className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm border border-blue-500/30"
                            style={{
                              backgroundColor: tagData?.color ? `${tagData.color}20` : undefined,
                              borderColor: tagData?.color ? `${tagData.color}50` : undefined,
                              color: tagData?.color || undefined
                            }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:opacity-75"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Tag Dropdown */}
                  <div className="relative tag-dropdown">
                    <button
                      type="button"
                      onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white placeholder-gray-400 backdrop-blur-xl flex items-center justify-between"
                    >
                      <span className="text-gray-400">
                        {formData.tags.length > 0 ? `${formData.tags.length} tag${formData.tags.length === 1 ? '' : 's'} selected` : 'Select tags'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isTagDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isTagDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto tag-dropdown">
                        {availableTags.length > 0 ? (
                          availableTags.map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => {
                                handleTagToggle(tag.name);
                                setIsTagDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center ${
                                formData.tags.includes(tag.name)
                                  ? 'bg-blue-500/20 text-blue-300'
                                  : 'text-gray-300'
                              }`}
                            >
                              {tag.color && (
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: tag.color }}
                                ></div>
                              )}
                              {tag.name}
                              {formData.tags.includes(tag.name) && (
                                <span className="ml-auto text-blue-400">✓</span>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-gray-400 text-sm">
                            No tags available. Create tags in the dashboard first.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-400 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Keywords and labels for better discoverability
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-400" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="w-full flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Post
                  </button>
                  <a
                    href="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Blog
                  </a>
                </div>
              </div>

              {/* Writing Tips */}
              <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
                  Writing Tips
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Keep your title clear and engaging
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Write a compelling excerpt
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Use headings to structure content
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Preview before publishing
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
