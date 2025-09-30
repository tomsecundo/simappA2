import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgramApi } from "../../api/programApi";
import ErrorBanner from "../../components/common/ErrorBanner";

function ProgramForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createProgram, updateProgram, getProgramById } = useProgramApi();

    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
    });
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (id) {
        getProgramById(id)
            .then((data) => setForm(data))
            .catch(() => setErrorMessages(["Failed to load program."]));
        }
    }, [id, getProgramById]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await updateProgram(id, form);
            } else {
                await createProgram(form);
            }
            navigate("/programs");
        } catch (err) {
            if (err.response?.status === 401) {
                setErrorMessages(["Unauthorized: please log in again."]);
            } else if (err.response?.data?.details) {
                setErrorMessages(err.response.data.details);
            } else {
                setErrorMessages(["Failed to save program."]);
            }
        }
    };

    return (
        <div className="p-4">
            <h2>{id ? "Edit Program" : "New Program"}</h2>

            <ErrorBanner
                message={errorMessages.length ? errorMessages.join(", ") : ""}
                onClose={() => setErrorMessages([])}
            />

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleChange}
                    className="form-control"
                />
                <input
                    type="date"
                    name="startDate"
                    value={form.startDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <input
                    type="date"
                    name="endDate"
                    value={form.endDate?.slice(0, 10) || ""}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <button type="submit" className="btn btn-success">
                    {id ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
}

export default ProgramForm;
