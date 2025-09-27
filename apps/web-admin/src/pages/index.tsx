import Head from 'next/head';
import AdminDashboard from '../components/AdminDashboard';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Large Event Platform - Admin Portal</title>
      </Head>
      <AdminDashboard />
    </>
  );
}