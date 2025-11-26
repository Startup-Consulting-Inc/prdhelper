/**
 * Project Detail Page
 * 
 * Shows project overview, progress, and document status with navigation to wizards.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ProjectDetailsView } from '../components/project/ProjectDetailsView';
import { Footer } from '../components/layout/Footer';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  if (!projectId) {
    navigate('/');
    return null;
  }

  return (
    <>
      <ProjectDetailsView
        projectId={projectId}
        onBack={() => navigate('/')}
      />
      <Footer />
    </>
  );
}

export default ProjectDetailPage;











