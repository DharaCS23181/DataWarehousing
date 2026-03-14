import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import QueryBuilder from '../pages/QueryBuilder';
import SavedQueries from '../pages/SavedQueries';
import QueryHistory from '../pages/QueryHistory';
import Alerts from '../pages/Alerts';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/query-editor" element={<QueryBuilder />} />
          <Route path="/saved-queries" element={<SavedQueries />} />
          <Route path="/query-history" element={<QueryHistory />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
