import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost, generateSlug } from '@/lib/blog';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const posts = await getAllPosts({});
    console.log('API: Fetched posts count:', posts.length); // Debug log
    console.log('API: Posts data:', posts); // Debug log
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {    // Check authentication
    const session = await getSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }    const body = await request.json();
    // Handle both 'categories' and 'tags' as separate fields
    const { title, content, excerpt, categories, tags, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const categoriesArray = categories || [];
    const tagsArray = tags || [];
    
    const postData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 160) + '...',
      slug,
      categories: categoriesArray,
      tags: tagsArray,
      author: session.username || 'Admin',
      published: status === 'published',
      featured: false,
      category: '',
      metaDescription: excerpt || '',
      metaKeywords: [...categoriesArray, ...tagsArray].join(', '),
      readingTime: Math.ceil(content.split(' ').length / 200),
    };

    const newPost = await createPost(postData);
    
    if (!newPost) {
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
