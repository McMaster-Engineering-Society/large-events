import Head from 'next/head';
import TeamAWidget from '../components/TeamAWidget';
import TeamBWidget from '../components/TeamBWidget';
import TeamCWidget from '../components/TeamCWidget';
import TeamDWidget from '../components/TeamDWidget';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Large Event Platform - User Portal</title>
      </Head>

      <div className="space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Large Event Platform
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Team A Section */}
          <div className="lg:col-span-2 xl:col-span-1">
            <TeamAWidget />
          </div>

          {/* Team B Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TeamBWidget />
          </div>

          {/* Team C Section */}
          <div className="lg:col-span-1 xl:col-span-1">
            <TeamCWidget />
          </div>

          {/* Team D Section */}
          <div className="lg:col-span-2 xl:col-span-1">
            <TeamDWidget />
          </div>
        </div>
      </div>
    </>
  );
}