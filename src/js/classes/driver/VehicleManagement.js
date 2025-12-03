import { Driver } from "../../models/Drivers.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class VehicleManagement {
  constructor(container) {
    this.container = container;
    this.vehicleData = null;
    this.driverId = null;
  }

  async getVehicleDetails() {
    try {
      this.driverId = window.location.search.split("id=")[1];
      const response = await Driver.findById(this.driverId);
      this.vehicleData = response.data;
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      this.vehicleData = null;
    }
  }

  render() {
    if (!this.vehicleData) {
      return `<p class="text-gray-600">Unable to load vehicle details.</p>`;
    }

    return `
      <div class="space-y-6">
        <div>
          <h2 class="driver-title mb-2">Vehicle Management</h2>
          <p class="driver-subtitle">Update and manage your vehicle information</p>
        </div>

        <div class="driver-panel p-6">
          <form id="vehicleForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="driver-label-text">
                  Vehicle ID
                </label>
                <input 
                  type="text" 
                  id="vehicleId" 
                  value="${this.vehicleData.vehicleId || ""}" 
                  class="driver-input"
                  placeholder="Enter vehicle ID"
                />
              </div>

              <div>
                <label class="driver-label-text">
                  Vehicle Type
                </label>
                <select 
                  id="vehicleType" 
                  class="driver-input"
                >
                  <option value="">Select vehicle type</option>
                  <option value="truck" ${
                    this.vehicleData.vehicleType === "truck" ? "selected" : ""
                  }>Truck</option>
                  <option value="van" ${
                    this.vehicleData.vehicleType === "van" ? "selected" : ""
                  }>Van</option>
                  <option value="motorcycle" ${
                    this.vehicleData.vehicleType === "motorcycle"
                      ? "selected"
                      : ""
                  }>Motorcycle</option>
                  <option value="car" ${
                    this.vehicleData.vehicleType === "car" ? "selected" : ""
                  }>Car</option>
                </select>
              </div>

              <div>
                <label class="driver-label-text">
                  License Number
                </label>
                <input 
                  type="text" 
                  id="licenseNumber" 
                  value="${this.vehicleData.licenseNumber || ""}" 
                  class="driver-input"
                  placeholder="Enter license number"
                />
              </div>

              <div>
                <label class="driver-label-text">
                  Current Location
                </label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    id="currentLocation" 
                    value="${this.vehicleData.currentLocation || ""}" 
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter current location"
                  />
                  <button 
                    type="button" 
                    id="gpsBtn"
                    class="driver-btn-secondary driver-btn-action"
                    title="Use GPS to get current location"
                  >
                    <div class="w-5 h-5">${getIconHTML("map-pin")}</div>
                    GPS
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                class="flex-1 driver-btn-primary driver-btn-action"
              >
                <div class="w-5 h-5">${getIconHTML("check")}</div>
                Update Vehicle Details
              </button>
              <button 
                type="button" 
                id="resetBtn"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>

          <div id="messageContainer" class="mt-4"></div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const form = document.getElementById("vehicleForm");
    const resetBtn = document.getElementById("resetBtn");
    const gpsBtn = document.getElementById("gpsBtn");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetForm();
      });
    }

    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => {
        this.getCurrentLocation();
      });
    }
  }

  async handleSubmit() {
    const vehicleId = document.getElementById("vehicleId").value;
    const vehicleType = document.getElementById("vehicleType").value;
    const licenseNumber = document.getElementById("licenseNumber").value;
    const currentLocation = document.getElementById("currentLocation").value;

    const updatedData = {
      vehicleId: vehicleId || null,
      vehicleType: vehicleType || null,
      licenseNumber: licenseNumber || null,
      currentLocation: currentLocation || null,
    };

    try {
      await Driver.update(this.driverId, updatedData);
      this.showMessage("Vehicle details updated successfully!", "success");
      await this.getVehicleDetails();
    } catch (error) {
      console.error("Error updating vehicle details:", error);
      this.showMessage(
        "Failed to update vehicle details. Please try again.",
        "error"
      );
    }
  }

  resetForm() {
    document.getElementById("vehicleId").value =
      this.vehicleData.vehicleId || "";
    document.getElementById("vehicleType").value =
      this.vehicleData.vehicleType || "";
    document.getElementById("licenseNumber").value =
      this.vehicleData.licenseNumber || "";
    document.getElementById("currentLocation").value =
      this.vehicleData.currentLocation || "";
    this.showMessage("Form reset to original values.", "info");
  }

  getCurrentLocation() {
    const gpsBtn = document.getElementById("gpsBtn");
    const locationInput = document.getElementById("currentLocation");

    if (!navigator.geolocation) {
      this.showMessage(
        "Geolocation is not supported by your browser.",
        "error"
      );
      return;
    }

    // Disable button and show loading state
    gpsBtn.disabled = true;
    gpsBtn.innerHTML = `
      <div class="w-5 h-5 animate-spin">${getIconHTML("rotate-ccw")}</div>
      Getting...
    `;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                "User-Agent": "DistributorMS/1.0",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;

          locationInput.value = address.split(",").slice(0, 2).join(",");
          this.showMessage("Location fetched successfully!", "success");
        } catch (error) {
          console.error("Error fetching address:", error);

          locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(
            6
          )}`;
          this.showMessage(
            "Using coordinates (address lookup unavailable).",
            "info"
          );
        } finally {
          gpsBtn.disabled = false;
          gpsBtn.innerHTML = `
            <div class="w-5 h-5">${getIconHTML("map-pin")}</div>
            GPS
          `;
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }

        this.showMessage(errorMessage, "error");

        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `
          <div class="w-5 h-5">${getIconHTML("map-pin")}</div>
          GPS
        `;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  showMessage(message, type) {
    const messageContainer = document.getElementById("messageContainer");
    if (!messageContainer) return;

    const bgColor =
      type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-blue-100 border-blue-400 text-blue-700";

    messageContainer.innerHTML = `
      <div class="${bgColor} border px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">${message}</span>
      </div>
    `;

    setTimeout(() => {
      messageContainer.innerHTML = "";
    }, 5000);
  }
}
