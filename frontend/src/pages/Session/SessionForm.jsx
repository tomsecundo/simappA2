import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSessionApi } from "../../api/sessionAPI";
import ErrorBanner from "../../components/common/ErrorBanner";

function SessionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createSession, updateSession, getSessionById } = useSessionApi();

    const [form, setForm] = useState({
        applicationName: "",
        mentorfirstName: "",
        mentorlastName: "",
        sessionDate: "",
    });
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (!id) return;

        getSessionById(id)
            .then((data) => 
                setForm({
                    applicationName: data.applicationName || "",
                    mentorfirstName: data.mentorfirstName || "",
                    mentorlastName: data.mentorlastName || "",
                    sessionDate: (data.sessionDate || "").slice(0,10),
                })
            )
            .catch(() => setErrorMessages(["Failed to load session."]));
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await updateSession(id, form);
            } else {
                await createSession(form);
            }
            navigate("/sessions");
        } catch (err) {
            if (err.response?.status === 401) {
                setErrorMessages(["Unauthorized: please log in again."]);
            } else if (err.response?.data?.details) {
                setErrorMessages(err.response.data.details);
            } else {
                setErrorMessages(["Failed to save session."]);
            }
        }
    };

    return (
        <div className="p-4">
            <h2>{id ? "Edit Session" : "New Session"}</h2>

            <ErrorBanner
                message={errorMessages.length ? errorMessages.join(", ") : ""}
                onClose={() => setErrorMessages([])}
            />

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="applicationName"
                    placeholder="Application Name"
                    value={form.applicationName}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <input
                    type="text"
                    name="mentorfirstName"
                    placeholder="Mentor First Name"
                    value={form.mentorfirstName}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <input
                    type="text"
                    name="mentorlastName"
                    placeholder="Mentor Last Name"
                    value={form.mentorlastName}
                    onChange={handleChange}
                    required
                    className="form-control"
                />
                <input
                    type="date"
                    name="sessionDate"
                    value={form.sessionDate?.slice(0,10) || ""}
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

export default SessionForm;
