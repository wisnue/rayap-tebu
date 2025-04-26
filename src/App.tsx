import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/useApp';
import Layout from './components/ui/Layout';
import Dashboard from './pages/Dashboard';
import FormPage from './pages/FormPage';
import DataPage from './pages/DataPage';
import AnalysisPage from './pages/AnalysisPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/data" element={<DataPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
