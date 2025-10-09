import clientApi from '@/lib/apis/axios-client';
import type {
  CreateTopicRequest,
  Topic,
  UpdateTopicRequest,
} from '@/types/topics';

// create topic
async function createTopic(topic: CreateTopicRequest): Promise<Topic> {
  try {
    const response = await clientApi.post('/topics', topic);
    return response.data.data;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

// create multiple topics
async function createTopics(topics: CreateTopicRequest[]): Promise<Topic[]> {
  try {
    const response = await clientApi.post('/topics/bulk', { topics });
    return response.data.data;
  } catch (error) {
    console.error('Error creating topics:', error);
    throw error;
  }
}

// Fetch all available topics
async function getAllTopics(): Promise<Topic[]> {
  try {
    const response = await clientApi.get('/topics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

// Fetch topic by ID
async function getTopicById(id: string): Promise<Topic> {
  try {
    const response = await clientApi.get(`/topics/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching topic ${id}:`, error);
    throw error;
  }
}

// Update topic
async function updateTopic(
  topic: UpdateTopicRequest,
  id: string
): Promise<Topic> {
  try {
    const response = await clientApi.patch(`/topics/${id}`, topic);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating topic ${id}:`, error);
    throw error;
  }
}

// Delete topic
async function deleteTopic(id: string): Promise<void> {
  try {
    await clientApi.delete(`/topics/${id}`);
  } catch (error) {
    console.error(`Error deleting topic ${id}:`, error);
    throw error;
  }
}

export const TopicsService = {
  createTopic,
  createTopics,
  getAllTopics,
  getTopicById,
  updateTopic,
  deleteTopic,
};
