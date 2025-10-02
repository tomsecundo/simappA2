import React from "react";
import { Link } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";
import ProgramTable from "../../components/Program/ProgramTable";

function ProgramList() {
    const { programsQuery } = useProgramsHook();

    if (programsQuery.isLoading) return <p className="p-4">Loading programs...</p>;
    if (programsQuery.isError) return <p className="p-4 text-red-500">Failed to load programs.</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Programs</h2>
                <Link
                    to="/programs/new"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    New Program
                </Link>
            </div>
            <ProgramTable programs={programsQuery.data || []} />
        </div>
    );
}

export default ProgramList;
