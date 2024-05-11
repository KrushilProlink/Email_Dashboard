import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import Email from './pages/email/Email'
import EmailView from './pages/email/View'
import EmailTemplate from './pages/emailTemplate/EmailTemplate';
import AddEmailTemplate from './pages/emailTemplate/Add'
import ViewEmailTemplate from './pages/emailTemplate/View'
import Page404 from './pages/Page404';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/email" />, index: true },
        { path: 'email', element: <Email /> },
        { path: 'email/view/:id', element: <EmailView /> },
        { path: 'emailtemplate', element: <EmailTemplate /> },
        { path: 'emailtemplate/add', element: <AddEmailTemplate /> },
        { path: 'emailtemplate/view/:id', element: <ViewEmailTemplate /> },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '*', element: <Navigate to="/dashboard/email" />, index: true },
      //   { path: '404', element: <Page404 /> },
      ],
    },
    // {
    //   path: '*',
    //   element: <Navigate to="/404" replace />,
    // },
  ]);

  return routes;
}
