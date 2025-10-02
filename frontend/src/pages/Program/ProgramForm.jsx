import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgramsHook } from "../../hooks/programHook";

function ProgramForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useProgram, createProgram, updateProgram } = useProgramsHook();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });

    const { data, isLoading } = useProgram(id);

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await updateProgram.mutateAsync({ id, data: form });
            } else {
                await createProgram.mutateAsync(form);
            }
            navigate("/programs");
        } catch {
            alert("Failed to save program.");
        }
    };

    if (isLoading && id) return <p>Loading program...</p>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
                {id ? "Edit Program" : "New Program"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="date"
                    name="startDate"
                    value={form.startDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="date"
                    name="endDate"
                    value={form.endDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    required
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                >
                    {id ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
}

export default ProgramForm;
