/**
 * Admin Page
 *
 * Main admin dashboard with tabs for system management.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, Users, FileText, Activity, Coins, Settings, File } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';
import { SystemOverview } from '../components/admin/SystemOverview';
import { UserManagementTable } from '../components/admin/UserManagementTable';
import { ProjectManagementTable } from '../components/admin/ProjectManagementTable';
import { DocumentManagementTable } from '../components/admin/DocumentManagementTable';
import { TokenUsageTable } from '../components/admin/TokenUsageTable';
import { AuditLogsTable } from '../components/admin/AuditLogsTable';
import { SystemPromptsManagement } from '../components/admin/SystemPromptsManagement';
import { useAuth } from '../contexts/AuthContext';

export function AdminPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin
  if (user?.role !== 'ADMIN') {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Admin Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  System management and analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FileText className="h-4 w-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="documents">
              <File className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="tokens">
              <Coins className="h-4 w-4 mr-2" />
              Token Usage
            </TabsTrigger>
            <TabsTrigger value="prompts">
              <Settings className="h-4 w-4 mr-2" />
              System Prompts
            </TabsTrigger>
            <TabsTrigger value="audit">
              <Activity className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTable />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectManagementTable />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentManagementTable />
          </TabsContent>

          <TabsContent value="tokens">
            <TokenUsageTable />
          </TabsContent>

          <TabsContent value="prompts">
            <SystemPromptsManagement />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogsTable />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

export default AdminPage;
