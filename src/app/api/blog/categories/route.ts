import { NextRequest, NextResponse } from 'next/server';
import { getCategoriesCollection, getPostsCollection } from '@/lib/mongodb';
import { Category } from '@/lib/types';

export async function GET() {
  try {
    const categoriesCollection = await getCategoriesCollection();
    const postsCollection = await getPostsCollection();
    
    const categories = await categoriesCollection.find({}).sort({ name: 1 }).toArray();
      // Get post counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await postsCollection.countDocuments({ 
          tags: category.name 
        });
        
        return {
          ...category,
          id: category.id || category.slug || category.name.toLowerCase().replace(/\s+/g, '-'),
          postCount
        };
      })
    );
    
    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, color } = await request.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    const categoryName = name.trim();
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    const categoriesCollection = await getCategoriesCollection();
    
    // Check if category already exists
    const existingCategory = await categoriesCollection.findOne({ name: categoryName });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category already exists' },
        { status: 400 }
      );
    }
      const newCategory: Omit<Category, '_id'> = {
      id: categorySlug, // Use slug as ID
      name: categoryName,
      slug: categorySlug,
      description: description || '',
      color: color || '#3B82F6',
      createdAt: new Date().toISOString()
    };
    
    const result = await categoriesCollection.insertOne(newCategory);
    
    const createdCategory = {
      _id: result.insertedId,
      ...newCategory,
      postCount: 0
    };
    
    return NextResponse.json(createdCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { oldName, newName, description, color } = await request.json();
    
    if (!oldName || !newName || !newName.trim()) {
      return NextResponse.json(
        { error: 'Both old name and new name are required' },
        { status: 400 }
      );
    }
    
    const categoriesCollection = await getCategoriesCollection();
    const postsCollection = await getPostsCollection();
    
    const trimmedNewName = newName.trim();
    const newSlug = trimmedNewName.toLowerCase().replace(/\s+/g, '-');
    
    // Check if new name already exists (unless it's the same category)
    if (oldName !== trimmedNewName) {
      const existingCategory = await categoriesCollection.findOne({ name: trimmedNewName });
      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with new name already exists' },
          { status: 400 }
        );
      }
    }
      // Update category
    const updateResult = await categoriesCollection.updateOne(
      { name: oldName },
      { 
        $set: { 
          id: newSlug,
          name: trimmedNewName,
          slug: newSlug,
          description: description || '',
          color: color || '#3B82F6'
        }
      }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Update posts that reference this category (stored in tags field)
    await postsCollection.updateMany(
      { tags: oldName },
      { 
        $set: { 
          "tags.$": trimmedNewName
        }
      }
    );
    
    // Get the updated category with post count
    const updatedCategory = await categoriesCollection.findOne({ name: trimmedNewName });
    const postCount = await postsCollection.countDocuments({ tags: trimmedNewName });
    
    return NextResponse.json({
      ...updatedCategory,
      postCount
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    const categoriesCollection = await getCategoriesCollection();
    const postsCollection = await getPostsCollection();
    
    // Check if category exists
    const category = await categoriesCollection.findOne({ name });
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Remove category from all posts (stored in tags field)
    await postsCollection.updateMany(
      { tags: name },
      { 
        $pull: { tags: name }
      }
    );
    
    // Delete the category
    const deleteResult = await categoriesCollection.deleteOne({ name });
    
    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      deletedCategory: category
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
