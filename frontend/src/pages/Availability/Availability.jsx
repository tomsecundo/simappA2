import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAvailabilityApi } from "../../api/availabilityAPI";
import ErrorBanner from "../../components/common/ErrorBanner";

function AvailabilityForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { createAvailability, updateAvailability, getAvailabilityById } = useAvailabilityApi();

    const [form, setForm] = useState({
        startDate: "",
        endDate: "",
    });
    const [errorMessages, setErrorMessages] = useState([]);

    useEffect(() => {
        if (!id) return;
        
        getAvailabilityById(id)
            .then((data) => 
                setForm({
                    startDate: (data.startDate || "").slice(0,10),
                    endDate: (data.endDate || "").slice(0,10),
            })
        )
            .catch(() => setErrorMessages(["Failed to load availability."]));
    }, [id]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (id) {
                await updateAvailability(id, form);
            } else {
                await createAvailability(form);
            }
            navigate("/availabilitylist");
        } catch (err) {
            if (err.response?.status === 401) {
                setErrorMessages(["Unauthorized: please log in again."]);
            } else if (err.response?.data?.details) {
                setErrorMessages(err.response.data.details);
            } else {
                setErrorMessages(["Failed to save availability."]);
            }
        }
    };

    return (
        <div className="p-4">
            <h2>{id ? "Edit Availability" : "New Availability"}</h2>

            <ErrorBanner
                message={errorMessages.length ? errorMessages.join(", ") : ""}
                onClose={() => setErrorMessages([])}
            />

            <form onSubmit={handleSubmit} className="space-y-3">
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

export default AvailabilityForm;
