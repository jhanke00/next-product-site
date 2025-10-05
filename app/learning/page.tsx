import LearningDashboard from '@/src/components/learning/LearningDashboard';

export default function LearningPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <LearningDashboard userId='user_001' showUserProgress={true} />
    </div>
  );
}
