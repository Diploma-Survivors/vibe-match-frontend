import clientApi from '@/lib/apis/axios-client';
import { getSession } from 'next-auth/react';

export enum ResourceType {
  PROBLEM = 'PROBLEM',
  CONTEST = 'CONTEST',
}

async function getDeviceId(): Promise<string> {
  if (typeof window !== 'undefined') {
    const session = await getSession();
    return session?.deviceId || '';
  }
  return '';
}

// Send deep linking response
async function sendDeepLinkingResponse(
  resourceId: string,
  type: ResourceType = ResourceType.PROBLEM
): Promise<any> {
  try {
    const url = process.env.NEXT_PUBLIC_API_LAUNCH_URL;
    const deviceId = await LtiService.getDeviceId();

    const custom =
      type === ResourceType.PROBLEM
        ? { problemId: resourceId }
        : { contestId: resourceId };

    const deepLinkResponse = {
      url,
      deviceId,
      custom,
    };

    const response = await clientApi.post(
      '/lti/dl/response',
      deepLinkResponse,
      { withCredentials: true, responseType: 'text' }
    );

    const html = response.data;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Lấy form ra
    const form = doc.querySelector('form');
    if (form) {
      document.body.appendChild(form);
      form.submit();
    }
  } catch (error) {
    console.error('Error sending deep linking response:', error);
    throw error;
  }
}

export const LtiService = {
  getDeviceId,
  sendDeepLinkingResponse,
};
