import ScenarioForm from '../components/ScenarioForm';

const ReportIncidentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Incident Management System
        </h1>
        {/* We just drop the component here */}
        <ScenarioForm />
      </div>
    </div>
  );
};

export default ReportIncidentPage;