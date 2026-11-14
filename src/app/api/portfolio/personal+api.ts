import { handlePortfolioRequest } from '@/lib/portfolio/web-handler';

export function GET() {
  return handlePortfolioRequest('personal');
}
