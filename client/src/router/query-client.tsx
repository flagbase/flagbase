import { QueryCache, QueryClient } from 'react-query';

export default new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      console.error(error, query.queryKey);
    },
  }),
});
