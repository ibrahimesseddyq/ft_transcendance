import { BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {Main} from '@/pages/main'


const queryClient = new QueryClient();

const App = () => (
  
    
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Main/>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;