import React from "react";
import { Link } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";
import ProgramTable from "../../components/Program/ProgramTable";

function ProgramList() {
    const { programsQuery } = useProgramsHook();

    if (programsQuery.isLoading) return <p className="p-4">Loading programs...</p>;
    if (programsQuery.isError) return <p className="p-4 text-red-500">Failed to load programs.</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h2>Programs</h2>
                <Link to="/programs/new" className="btn btn-primary my-3"
                >
                    New Program
                </Link>
            </div>
            <ProgramTable programs={programsQuery.data || []} />
        </div>
    );
}

export default ProgramList;
