import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SummaryPage from './pages/SummaryPage';
import PlanetDetailPage from './pages/PlanetDetailPage';
import TransactionsPage from './pages/TransactionsPage';

const queryClient = new QueryClient();
const theme = createTheme({});

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<SummaryPage />} />
              <Route path="/planets/:id" element={<PlanetDetailPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
     </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
