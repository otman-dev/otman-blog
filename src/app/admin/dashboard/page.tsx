'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  LogOut, 
  Eye, 
  Calendar,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Globe,
  Search,
  Bell,
  Filter,
  User,
  Mail,
  RefreshCw
} from 'lucide-react';

interface User {
  id: string;
  username: string;
}

interface BlogPost {
  _id: string;
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  published: boolean;
}

interface EmailSubscription {
  id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
  source: string;
  ipAddress?: string;
  userAgent?: string;
}

interface SubscriptionData {
  total: number;
  recent: EmailSubscription[];
}

export default function AdminDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData>({ total: 0, recent: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      
      if (!response.ok || !data.isAuthenticated) {
        // Clear any existing session data
        setUser(null);
        router.push('/admin/login');
        return;
      }
      
      setUser(data.user);
      setIsAuthenticating(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      fetchPosts();
      fetchSubscriptions();
    }
  }, [user]);
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/newsletter/subscribe');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const result = await response.json();
      if (result.success) {
        setSubscriptions(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error);
      setSubscriptions({ total: 0, recent: [] });
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchPosts(), fetchSubscriptions()]);
    } finally {
      setIsRefreshing(false);
    }
  };
  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Clear local state
        setUser(null);
        setPosts([]);
        setActiveTab('posts');
        setSidebarOpen(false);
        
        // Force redirect to login
        window.location.href = '/admin/login';
      } else {
        console.error('Logout failed');
        // Force redirect anyway for security
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect for security
      window.location.href = '/admin/login';
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });
        if (response.ok) {
        setPosts(posts.filter(post => post.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };
  const sidebarItems = [
    { 
      id: 'posts', 
      label: 'Content', 
      icon: FileText, 
      description: 'Manage blog posts',
      count: posts.length 
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      description: 'View insights',
      count: null 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings, 
      description: 'System config',
      count: null 
    },
  ];

  // Show loading screen while checking authentication
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 p-1">
            <div className="h-full w-full rounded-full bg-slate-900"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 text-white animate-pulse">🔐</div>
          </div>
        </div>
        <div className="ml-4 text-white">
          <div className="text-lg font-semibold">Authenticating...</div>
          <div className="text-sm text-gray-400">Verifying your credentials</div>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect)
  if (!user) {
    return null;
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}      {/* Mobile-First Responsive Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/10 backdrop-blur-2xl border-r border-white/20 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-all duration-500 ease-out lg:translate-x-0 lg:w-80 xl:w-96`}>
        
        {/* Glassmorphism Sidebar Header */}
        <div className="relative h-24 px-6 flex items-center border-b border-white/10 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-2 shadow-2xl">
                <Image
                  src="/logo.png"
                  alt="AtlanticDunes Logo"
                  width={32}
                  height={32}
                  className="object-contain filter brightness-0 invert"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white/20 animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                AtlanticDunes
              </h1>
              <p className="text-xs text-gray-400 font-medium">Admin Console</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation with enhanced mobile design */}
        <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto scrollbar-hide">
          {sidebarItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`group relative w-full flex items-center justify-between p-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white shadow-2xl backdrop-blur-xl border border-white/20'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white hover:backdrop-blur-xl'
                }`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
                )}
                
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 shadow-lg' 
                      : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </div>
                  <div>
                    <div className={`font-semibold text-sm transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs mt-0.5 transition-all duration-300 ${
                      isActive ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-300'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
                
                {item.count !== null && (
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                  }`}>
                    {item.count}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Enhanced User Section */}
        <div className="p-4 border-t border-white/10 bg-gradient-to-r from-black/20 to-transparent">
          <div className="flex items-center mb-4 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">AD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div className="ml-3 flex-1">
              <div className="text-sm font-semibold text-white">Admin User</div>
              <div className="text-xs text-gray-400">admin@atlanticdunes.com</div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition-all duration-300 group border border-red-500/20 hover:border-red-500/40"
          >
            <div className="p-2 bg-red-500/10 rounded-xl group-hover:bg-red-500/20 transition-all duration-300">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="ml-3 font-medium">Sign Out</span>
          </button>
        </div>
      </aside>      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-80 xl:ml-96">
        {/* Modern Dark Header */}
        <header className="bg-black/30 backdrop-blur-2xl shadow-2xl border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent capitalize">
                  {activeTab === 'posts' ? 'Content Management' : activeTab}
                </h2>
                <p className="text-sm text-gray-400">
                  {activeTab === 'posts' && `${posts.length} total posts`}
                  {activeTab === 'analytics' && 'Performance insights'}
                  {activeTab === 'settings' && 'System configuration'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </button>
              <a
                href="/blog"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-xl border border-white/20"
              >
                <Globe className="w-4 h-4 mr-2" />
                View Site
              </a>
            </div>
          </div>
        </header>{/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'posts' && (
            <div className="space-y-6">              {/* Enhanced Dark Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{posts.length}</h3>
                          <p className="text-sm font-medium text-gray-300">Total Posts</p>
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{posts.filter(p => p.published).length}</h3>
                          <p className="text-sm font-medium text-gray-300">Published</p>
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg">
                          <Edit className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{posts.filter(p => !p.published).length}</h3>
                          <p className="text-sm font-medium text-gray-300">Drafts</p>
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>

                <div className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">2.4k</h3>
                          <p className="text-sm font-medium text-gray-300">Readers</p>
                        </div>
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Enhanced Dark Posts Section */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border-b border-white/20">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Content Library
                    </h3>
                    <p className="text-sm text-gray-300">Manage your blog posts and articles</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Search posts..."
                        className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-sm text-white placeholder-gray-400 backdrop-blur-xl"
                      />
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push('/admin/posts/new')}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-xl border border-white/20"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Post
                    </button>
                  </div>
                </div>              {/* Posts list */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 mx-auto mb-4"></div>
                    <p className="text-white font-medium">Loading your content...</p>
                    <p className="text-sm text-gray-400">Please wait while we fetch your posts</p>
                  </div>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20">
                    <FileText className="w-10 h-10 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">Start building your blog by creating your first post. Share your insights and expertise with the world.</p>
                  <button
                    onClick={() => router.push('/admin/posts/new')}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-xl border border-white/20"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Create Your First Post
                  </button>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Content
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Published
                          </th>
                          <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>                      <tbody className="divide-y divide-white/10">
                        {posts.map((post) => (
                          <tr key={post._id} className="group hover:bg-white/10 transition-all duration-200">
                            <td className="px-6 py-5">
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mt-2 mr-4 ${
                                  post.published ? 'bg-green-400' : 'bg-amber-400'
                                }`}></div>
                                <div className="flex-1">
                                  <div className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                    {post.title}
                                  </div>
                                  <div className="text-sm text-gray-400 line-clamp-2">
                                    {post.excerpt}
                                  </div>
                                  <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                    <span>By {post.author}</span>
                                    <span>•</span>
                                    <span>{post.tags.length} tags</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                post.published
                                  ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30'
                                  : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  post.published ? 'bg-green-400' : 'bg-amber-400'
                                }`}></div>
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center text-sm text-gray-400">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-200 group"
                                  title="Edit post"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deletePost(post.id)}
                                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-200 group"
                                  title="Delete post"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              </div>
            </div>
          )}          {activeTab === 'analytics' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Analytics Overview</h2>
                <button
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">2,547</h3>
                      <p className="text-sm text-gray-300">Total Visitors</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-500/20 rounded-xl">
                      <Eye className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">1,892</h3>
                      <p className="text-sm text-gray-300">Page Views</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <FileText className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">{posts.length}</h3>
                      <p className="text-sm text-gray-300">Total Posts</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-500/20 rounded-xl">
                      <Mail className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-white">{subscriptions.total}</h3>
                      <p className="text-sm text-gray-300">Email Subscribers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-orange-400" />
                    Recent Email Subscriptions
                  </h3>
                  {subscriptions.recent.length > 0 ? (                    <div className="space-y-3">
                      {subscriptions.recent.map((subscription) => (
                        <div key={subscription.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                          <div>
                            <p className="text-sm font-medium text-white">{subscription.email}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(subscription.subscribedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300 ring-1 ring-green-500/30">
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Mail className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">No email subscriptions yet</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
                    Subscription Analytics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-300">Total Subscriptions</span>
                      <span className="text-lg font-semibold text-white">{subscriptions.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-300">This Week</span>
                      <span className="text-lg font-semibold text-green-400">
                        {subscriptions.recent.filter(sub => {
                          const subDate = new Date(sub.subscribedAt);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return subDate >= weekAgo;
                        }).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-sm text-gray-300">Source: Coming Soon</span>
                      <span className="text-lg font-semibold text-blue-400">
                        {subscriptions.recent.filter(sub => sub.source === 'coming_soon').length}
                      </span>
                    </div>
                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-sm text-blue-300 text-center">
                        📧 Growing audience for launch!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}{activeTab === 'settings' && (
            <div className="max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-400" />
                    Site Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site Title</label>
                      <input 
                        type="text" 
                        value="AtlanticDunes" 
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white backdrop-blur-xl"
                        readOnly 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                      <textarea 
                        value="Enterprise insights and innovation" 
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 text-white backdrop-blur-xl resize-none"
                        rows={3}
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-purple-400" />
                    Publishing Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Auto-save drafts</h4>
                        <p className="text-sm text-gray-400">Automatically save posts as drafts</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-white">Email notifications</h4>
                        <p className="text-sm text-gray-400">Get notified of new comments</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="translate-x-0 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-400" />
                    Account
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white rounded-xl hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 border border-white/20 backdrop-blur-xl">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl">
                      Export Data
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-orange-400" />
                    Advanced
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-200 backdrop-blur-xl">
                      Clear Cache
                    </button>
                    <button className="w-full px-4 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl hover:bg-red-500/30 transition-all duration-200 backdrop-blur-xl">
                      Reset Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
