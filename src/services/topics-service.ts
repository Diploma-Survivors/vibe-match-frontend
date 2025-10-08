import clientApi from '@/lib/apis/axios-client';
import type {
  CreateTopicRequest,
  Topic,
  UpdateTopicRequest,
} from '@/types/topics';

// create topic
export async function createTopic(topic: CreateTopicRequest): Promise<Topic> {
  try {
    const response = await clientApi.post('/topics', topic);
    return response.data.data;
  } catch (error) {
    console.error('Error creating topic:', error);
    throw error;
  }
}

// create multiple topics
export async function createTopics(
  topics: CreateTopicRequest[]
): Promise<Topic[]> {
  try {
    const response = await clientApi.post('/topics/bulk', { topics });
    return response.data.data;
  } catch (error) {
    console.error('Error creating topics:', error);
    throw error;
  }
}

// Fetch all available topics
export async function getTopics(): Promise<Topic[]> {
  try {
    const response = await clientApi.get('/topics');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
}

// Fetch topic by ID
export async function getTopicById(id: string): Promise<Topic> {
  try {
    const response = await clientApi.get(`/topics/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching topic ${id}:`, error);
    throw error;
  }
}

// Update topic
export async function updateTopic(
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
export async function deleteTopic(id: string): Promise<void> {
  try {
    await clientApi.delete(`/topics/${id}`);
  } catch (error) {
    console.error(`Error deleting topic ${id}:`, error);
    throw error;
  }
}
