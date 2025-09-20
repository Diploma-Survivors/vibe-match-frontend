import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path, 'GET');
}

export async function POST(
  request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const requestPath = resolvedParams.path.join('/');
  if (requestPath === 'signin') {
    try {
      const csrfData = await getCSRFToken(request);
      const formData = await request.formData();
      const accessToken = formData.get('accessToken')?.toString() || '';
      const refreshToken = formData.get('refreshToken')?.toString() || '';
      const redirectPath = formData.get('redirect')?.toString() || '/dashboard';
  
      const htmlContent = generateAuthForm(accessToken, refreshToken, redirectPath, csrfData.token, request);
      
      // Create response headers
      const responseHeaders = new Headers({
        'Content-Type': 'text/html',
      });
  
      // Directly forward all Set-Cookie headers from CSRF response without parsing
      if (csrfData.cookies && csrfData.cookies.length > 0) {
        csrfData.cookies.forEach(cookieHeader => {
          responseHeaders.append('Set-Cookie', cookieHeader);
        });
      } else {
        // Fallback: manually set the CSRF token cookie if no cookies were returned
        const fallbackCsrfCookie = `next-auth.csrf-token=${csrfData.token}; Path=/; HttpOnly; SameSite=lax`;
        responseHeaders.append('Set-Cookie', fallbackCsrfCookie);
      }
  
      const response = new NextResponse(htmlContent, {
        status: 200,
        headers: responseHeaders,
      });
  
      return response;
      
    }
    catch (error) {
      console.error('Error in POST proxy handler:', error);
      return NextResponse.json(
        { error: 'Failed to process request' },
        { status: 500 }
      );
    }
  }

  return handleProxy(request, resolvedParams.path, 'POST');

}

export async function PUT(
  request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return handleProxy(request, resolvedParams.path, 'PATCH');
}

async function handleProxy(
  request: NextRequest,
  proxyPath: string[],
  method: string
) {
  // add logic here;
}

// Update the getCSRFToken function to return both token and cookies
async function getCSRFToken(request: NextRequest): Promise<{token: string, cookies?: string[]}> {
  try {
    // Get the current domain and protocol
    const protocol = request.headers.get('x-forwarded-proto') || 
                    (request.url.startsWith('https') ? 'https' : 'http');
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    
    // Make request to NextAuth's CSRF endpoint
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`, {
      method: 'GET',
      headers: {
        // remove cookies to work properly
        // 'Cookie': request.headers.get('cookie') || '',
        'User-Agent': request.headers.get('user-agent') || 'NextJS-Proxy',
      },
    });

    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json();
      
      // Get all Set-Cookie headers from the response
      const setCookieHeaders = csrfResponse.headers.getSetCookie?.() || [];
      
      return {
        token: csrfData.csrfToken,
        cookies: setCookieHeaders.length > 0 ? setCookieHeaders : undefined
      };
    } else {
      console.error('❌ Failed to get CSRF token:', csrfResponse.status);
      throw new Error(`CSRF request failed with status: ${csrfResponse.status}`);
    }
  } catch (error) {
    console.error('❌ CSRF token error:', error);
    // Return a fallback token if NextAuth fails
    return { 
      token: 'fallback-'
    };
  }
}

function generateAuthForm(
  accessToken: string, 
  refreshToken: string, 
  redirectPath: string, 
  csrfToken: string,
  request: NextRequest
): string {
  // Determine the target URL for form submission
  const protocol = request.headers.get('x-forwarded-proto') || 
                  (request.url.startsWith('https') ? 'https' : 'http');
  const host = request.headers.get('host');
  const targetUrl = `${protocol}://${host}/api/auth/callback/sso`;
    
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đang chuyển hướng...</title>
        <style>
            body {
                font-family: 'Geist Sans', Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(
                    to bottom right,
                    rgb(248 250 252),
                    rgb(241 245 249),
                    rgb(248 250 252)
                );
                background-attachment: fixed;
            }
            .loading {
                text-align: center;
                padding: 24px;
                background: white;
                border-radius: 0.625rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                border: 1px solid rgba(226, 232, 240, 1);
                max-width: 90%;
                width: 400px;
            }
            .spinner {
                border: 4px solid rgba(241, 245, 249, 1);
                border-top: 4px solid rgb(22, 163, 74);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            h2 {
                color: rgb(15, 23, 42);
                font-weight: 600;
                margin-bottom: 12px;
            }
            p {
                color: rgb(71, 85, 105);
                margin-bottom: 12px;
            }
            small {
                color: rgb(100, 116, 139);
            }
            button {
                padding: 10px 20px;
                background: rgb(22, 163, 74);
                color: white;
                border: none;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s ease;
            }
            button:hover {
                background: rgb(21, 128, 61);
                box-shadow: 0 2px 10px rgba(22, 163, 74, 0.2);
            }
            @media (prefers-color-scheme: dark) {
                body {
                    background: linear-gradient(
                        to bottom right,
                        rgb(15, 23, 42),
                        rgb(30, 41, 59),
                        rgb(15, 23, 42)
                    );
                }
                .loading {
                    background: rgb(30, 41, 59);
                    border-color: rgb(51, 65, 85);
                }
                h2 {
                    color: rgb(241, 245, 249);
                }
                p {
                    color: rgb(148, 163, 184);
                }
                small {
                    color: rgb(100, 116, 139);
                }
                .spinner {
                    border-color: rgb(51, 65, 85);
                    border-top-color: rgb(34, 197, 94);
                }
            }
        </style>
    </head>
    <body>
        <div class="loading">
            <div class="spinner"></div>
            <h2>Đang chuyển hướng...</h2>
            <p>Vui lòng đợi trong khi chúng tôi xử lý xác thực của bạn...</p>
            <p><small>Nếu trang này không tự động chuyển hướng, vui lòng nhấn nút bên dưới.</small></p>
            
            <form id="postRedirectForm" action="${targetUrl}" method="POST" style="margin-top: 20px;">
                <input type="hidden" name="accessToken" value="${accessToken}" />
                <input type="hidden" name="refreshToken" value="${refreshToken}" />
                <input type="hidden" name="csrfToken" value="${csrfToken}" />
                <input type="hidden" name="callbackUrl" value="${redirectPath}" />
                <button type="submit">
                    Tiếp tục
                </button>
            </form>
        </div>
        
        <script type="text/javascript">
            
            // Tự động gửi form sau một khoảng thời gian ngắn
            setTimeout(() => {
                document.getElementById('postRedirectForm').submit();
            }, 1000);
            
            // Dự phòng: gửi khi trang đã tải xong
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (!document.hidden) {
                        document.getElementById('postRedirectForm').submit();
                    }
                }, 2000);
            });
        </script>
    </body>
    </html>
  `;
}