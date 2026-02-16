import React, { useState, useEffect } from 'react';
import { createScenario } from '@/services/scenarioService';


const ScenarioForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'sick',
        consultant_id: '',
        customer_id: '',
        startTime: '08:00',
        endTime: '16:00',
        description: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createScenario(formData);
            alert("Scenario created successfully!");
            // Reset form or redirect
        } catch (err) {
            alert("Error creating scenario");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-xl rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Report New Incident</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Incident Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        placeholder="e.g., Driver calls in sick"
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="sick">Sick Call</option>
                            <option value="no-show">No-Show</option>
                            <option value="late">Late Arrival</option>
                        </select>
                    </div>

                    {/* Consultant - In real app, map these from your API */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Employee (Consultant)</label>
                        <select
                            required
                            className="w-full px-4 py-2 border rounded-lg bg-white"
                            onChange={e => setFormData({ ...formData, consultant_id: e.target.value })}
                        >
                            <option value="">Select Employee...</option>
                            <option value="CONS_100001">Anna Eriksson</option>
                            <option value="CONS_100002">Viktor Håkansson</option>
                        </select>
                    </div>
                </div>

                {/* Customer Site */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Site</label>
                    <select
                        required
                        className="w-full px-4 py-2 border rounded-lg bg-white"
                        onChange={e => setFormData({ ...formData, customer_id: e.target.value })}
                    >
                        <option value="">Select Warehouse/Site...</option>
                        <option value="CUST_WAREHOUSE_1">Warehouse 1 (High Risk)</option>
                        <option value="CUST_WAREHOUSE_2">Warehouse 2 (Medium Risk)</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 italic">
                        * Urgency level is automatically determined by the site's risk profile.
                    </p>
                </div>

                {/* Shift Times */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shift Start</label>
                        <input
                            type="time"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Shift End</label>
                        <input
                            type="time"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={formData.endTime}
                            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Notes / Description</label>
                    <textarea
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Provide shift details..."
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                        }`}
                >
                    {loading ? 'Processing...' : 'Submit Incident Report'}
                </button>
            </form>
        </div>
    );
};

export default ScenarioForm;