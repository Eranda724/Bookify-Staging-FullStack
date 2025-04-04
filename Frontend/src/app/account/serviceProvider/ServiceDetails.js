import React, { useState, useEffect } from "react";
import {
  fetchProviderServices,
  updateProviderService,
} from "../../../services/api";
import { toast } from "react-toastify";
import Navigation from "../../../components/ui/navigation";

const ServiceDetails = ({ userData }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service_id: null,
    name: "",
    specialization: "",
    duration: 30,
    price: 0,
    startTime: "08:00",
    endTime: "17:00",
    description: "",
    category: "",
    workingDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false,
    },
  });

  useEffect(() => {
    loadServiceData();
  }, []);

  const loadServiceData = async () => {
    try {
      setLoading(true);
      const services = await fetchProviderServices();
      if (services && services.length > 0) {
        // Use the first service or create a new one if none exists
        const service = services[0];
        setFormData({
          service_id: service.service_id,
          name: service.name || "",
          specialization: service.specialization || "",
          duration: service.duration || 30,
          price: service.price || 0,
          startTime: service.startTime
            ? new Date(service.startTime).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })
            : "08:00",
          endTime: service.endTime
            ? new Date(service.endTime).toLocaleTimeString("en-US", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
              })
            : "17:00",
          description: service.description || "",
          category: service.category || "",
          workingDays: formData.workingDays, // Keep default working days
        });
      }
    } catch (error) {
      console.error("Error loading service data:", error);
      toast.error("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWorkingDaysChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: {
        ...prev.workingDays,
        [day]: !prev.workingDays[day],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Convert time strings to LocalDateTime format
      const [startHour, startMinute] = formData.startTime.split(":");
      const [endHour, endMinute] = formData.endTime.split(":");

      const now = new Date();
      const startDateTime = new Date(now);
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0);

      const endDateTime = new Date(now);
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0);

      const serviceData = {
        service_id: formData.service_id,
        name: formData.name,
        specialization: formData.specialization,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        description: formData.description,
        category: formData.category,
      };

      await updateProviderService(serviceData);
      toast.success("Service details updated successfully");
      setEditMode(false);
      loadServiceData(); // Reload the data
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading service details...</div>;
  }

  return (
    <div className="bg-cyan-100 p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Service Details</h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Edit Details
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => {
                setEditMode(false);
                loadServiceData(); // Reset form data
              }}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Service Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 mb-1">Service Name</label>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            ) : (
              <p className="py-2">{formData.name || "Not specified"}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Specialization</label>
            {editMode ? (
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            ) : (
              <p className="py-2">
                {formData.specialization || "Not specified"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Duration (minutes)
            </label>
            {editMode ? (
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            ) : (
              <p className="py-2">{formData.duration} minutes</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Price</label>
            {editMode ? (
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            ) : (
              <p className="py-2">${formData.price}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Category</label>
            {editMode ? (
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              />
            ) : (
              <p className="py-2">{formData.category || "Not specified"}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Description</label>
          {editMode ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              rows="3"
            />
          ) : (
            <p className="py-2">{formData.description || "Not specified"}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Availability Settings</h3>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Working Hours</h4>
          {editMode ? (
            <div className="flex items-center gap-2">
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
              <span className="mt-6">to</span>
              <div>
                <label className="block text-gray-700 text-sm mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
            </div>
          ) : (
            <p className="py-2">
              {formData.startTime} to {formData.endTime}
            </p>
          )}
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Working Days</h4>
          {editMode ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.workingDays).map(([day, isWorking]) => (
                <button
                  key={day}
                  onClick={() => handleWorkingDaysChange(day)}
                  type="button"
                  className={`py-2 px-3 rounded-md ${
                    isWorking
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.workingDays).map(([day, isWorking]) => (
                <span
                  key={day}
                  className={`py-2 px-3 rounded-md ${
                    isWorking
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
