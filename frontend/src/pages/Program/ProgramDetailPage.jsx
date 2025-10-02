// pages/Program/ProgramDetailPage.jsx
import { useParams } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";
import ProgramInfo from "../../components/Program/ProgramInfo";
import ProgramApplications from "../../components/Program/ProgramApplications";
import ProgramMentors from "../../components/Program/ProgramMentors";

const ProgramDetailPage = () => {
    const { id } = useParams();
    const { useProgram } = useProgramsHook();

    const { data: program, isLoading, isError } = useProgram(id);

    if (isLoading) return <p className="p-6">Loading program...</p>;
    if (isError || !program) return <p className="p-6 text-red-500">Program not found.</p>;

    return (
        <div className="p-6 space-y-6">

        {/* Program Details */}
        <ProgramInfo program={program} />

        {/* Mentors for this program */}
        <ProgramMentors programId={id} mentors={program.mentors || []} />

        {/* Applications under this program */}
        <ProgramApplications programId={id} />
        </div>
    );
};

export default ProgramDetailPage;
