import { NextRequest, NextResponse } from 'next/server';
import { getTagsCollection, getPostsCollection } from '@/lib/mongodb';
import { Tag } from '@/lib/types';

export async function GET() {
  try {
    const tagsCollection = await getTagsCollection();
    const postsCollection = await getPostsCollection();
    
    const tags = await tagsCollection.find({}).sort({ name: 1 }).toArray();
    
    // Calculate post counts for each tag
    const tagsWithCounts = await Promise.all(
      tags.map(async (tag) => {
        const postCount = await postsCollection.countDocuments({ 
          tags: tag.name 
        });
        
        return {
          _id: tag._id,
          id: tag.id || tag._id,
          name: tag.name,
          slug: tag.slug || tag.name.toLowerCase().replace(/\s+/g, '-'),
          description: tag.description || `Tag for ${tag.name}`,
          color: tag.color || '#10B981',
          createdAt: tag.createdAt || new Date().toISOString(),
          postCount
        };
      })
    );
    
    return NextResponse.json(tagsWithCounts);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, name, description, color } = body;
    
    // Support both old format (tag) and new format (name, description, color)
    const tagName = (name || tag)?.trim();
    
    if (!tagName) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }
    
    const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
    
    const tagsCollection = await getTagsCollection();
    
    // Check if tag already exists
    const existingTag = await tagsCollection.findOne({ 
      $or: [
        { name: tagName },
        { slug: tagSlug }
      ]
    });
    
    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag already exists' },
        { status: 400 }
      );
    }
    
    // Create new tag
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: tagName,
      slug: tagSlug,
      description: description?.trim() || `Tag for ${tagName}`,
      color: color || '#10B981', // Default green color for tags
      createdAt: new Date().toISOString()
    };
    
    await tagsCollection.insertOne(newTag);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tag created successfully',
      tag: newTag
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { oldTag, newTag, description, color } = await request.json();
    
    console.log('Received tag update request:', { oldTag, newTag, description, color });
    
    if (!oldTag || !newTag) {
      return NextResponse.json(
        { error: 'oldTag and newTag are required' },
        { status: 400 }
      );
    }
    
    const tagsCollection = await getTagsCollection();
    const postsCollection = await getPostsCollection();
    
    // Update the tag in the tags collection
    const newSlug = newTag.toLowerCase().replace(/\s+/g, '-');
    
    const updateData: any = { 
      name: newTag,
      slug: newSlug
    };
    
    // Always include these fields in the update, even if they're empty strings
    updateData.description = description;
    updateData.color = color || '#10B981';
    
    console.log('Updating tag with data:', updateData);
    
    const updateResult = await tagsCollection.updateOne(
      { name: oldTag },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
      // Check if the update was found and applied
    console.log('Tag update result:', updateResult);
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    // Update all posts that use this tag (only if name changed)
    if (oldTag !== newTag) {
      const posts = await postsCollection.find({ tags: oldTag }).toArray();
      
      for (const post of posts) {
        const updatedTags = post.tags.map((tag: string) => tag === oldTag ? newTag : tag);
        await postsCollection.updateOne(
          { _id: post._id },
          { $set: { tags: updatedTags } }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Updated tag and ${posts.length} posts`,
        updatedFields: { name: newTag, description, color }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Tag updated successfully',
      updatedFields: { description, color }
    });} catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag', details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { tag } = await request.json();
    
    if (!tag) {
      return NextResponse.json(
        { error: 'tag is required' },
        { status: 400 }
      );
    }
    
    const tagsCollection = await getTagsCollection();
    const postsCollection = await getPostsCollection();
    
    // Delete the tag from the tags collection
    const deleteResult = await tagsCollection.deleteOne({ name: tag });
    
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    // Remove the tag from all posts
    const posts = await postsCollection.find({ tags: tag }).toArray();
    
    for (const post of posts) {
      const updatedTags = post.tags.filter((t: string) => t !== tag);
      await postsCollection.updateOne(
        { _id: post._id },
        { $set: { tags: updatedTags } }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Deleted tag and removed from ${posts.length} posts` 
    });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}
