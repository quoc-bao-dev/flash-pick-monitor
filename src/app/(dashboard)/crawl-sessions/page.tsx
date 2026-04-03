import { CrawlSessionsView } from '@/modules/crawl-sessions/views';

export const metadata = {
  title: 'Crawl Sessions | Flash Pick Monitor',
  description: 'Manage and monitor active crawl sessions across all worker nodes.',
};

const Page = () => {
  return <CrawlSessionsView />;
};

export default Page;
