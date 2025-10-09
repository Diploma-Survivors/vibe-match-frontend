import clientApi from '@/lib/apis/axios-client';
import type { CreateTagRequest, Tag } from '@/types/tags';

// create a new tag
async function createTag(tag: CreateTagRequest): Promise<Tag> {
  try {
    const response = await clientApi.post('/tags', tag);
    return response.data.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
}

// create multiple tags
async function createTags(tags: CreateTagRequest[]): Promise<Tag[]> {
  try {
    const response = await clientApi.post('/tags/bulk', { tags });
    return response.data.data;
  } catch (error) {
    console.error('Error creating tags:', error);
    throw error;
  }
}

// Fetch all available tags
async function getAllTags(): Promise<Tag[]> {
  try {
    const response = await clientApi.get('/tags');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

// Fetch tag by ID
async function getTagById(id: string): Promise<Tag> {
  try {
    const response = await clientApi.get(`/tags/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching tag ${id}:`, error);
    throw error;
  }
}

// Update tag by ID
async function updateTag(tag: CreateTagRequest, id: string): Promise<Tag> {
  try {
    const response = await clientApi.patch(`/tags/${id}`, tag);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating tag ${id}:`, error);
    throw error;
  }
}

// Delete tag by ID
async function deleteTag(id: string): Promise<void> {
  try {
    await clientApi.delete(`/tags/${id}`);
  } catch (error) {
    console.error(`Error deleting tag ${id}:`, error);
    throw error;
  }
}

export const TagsService = {
  createTag,
  createTags,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
