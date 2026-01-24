import { LitElement, html, css } from "lit";
import { Driver } from "../../models/Driver.js";
import { getIconHTML } from "../../../assets/icons/index.js";

export class VehicleManagement extends LitElement {
  static properties = {
    vehicleData: { type: Object },
    driverId: { type: String },
    message: { type: Object },
    isLoadingGPS: { type: Boolean },
  };

  constructor() {
    super();
    this.vehicleData = null;
    this.driverId = null;
    this.message = null;
    this.isLoadingGPS = false;
    this.getVehicleDetails();
  }

  createRenderRoot() {
    return this;
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

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const vehicleId = form.vehicleId.value;
    const vehicleType = form.vehicleType.value;
    const licenseNumber = form.licenseNumber.value;
    const currentLocation = form.currentLocation.value;

    const updatedData = {
      vehicleId: vehicleId || null,
      vehicleType: vehicleType || null,
      licenseNumber: licenseNumber || null,
      currentLocation: currentLocation || null,
    };

    try {
      await Driver.update(this.driverId, updatedData);
      this.message = {
        text: "Vehicle details updated successfully!",
        type: "success",
      };
      await this.getVehicleDetails();
    } catch (error) {
      console.error("Error updating vehicle details:", error);
      this.message = {
        text: "Failed to update vehicle details. Please try again.",
        type: "error",
      };
    }
  }

  resetForm() {
    this.requestUpdate();
    this.message = { text: "Form reset to original values.", type: "info" };
  }

  getCurrentLocation() {
    if (!navigator.geolocation) {
      this.message = {
        text: "Geolocation is not supported by your browser.",
        type: "error",
      };
      return;
    }

    this.isLoadingGPS = true;

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

          this.vehicleData = {
            ...this.vehicleData,
            currentLocation: address.split(",").slice(0, 2).join(","),
          };
          this.message = {
            text: "Location fetched successfully!",
            type: "success",
          };
        } catch (error) {
          console.error("Error fetching address:", error);

          this.vehicleData = {
            ...this.vehicleData,
            currentLocation: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          };
          this.message = {
            text: "Using coordinates (address lookup unavailable).",
            type: "info",
          };
        } finally {
          this.isLoadingGPS = false;
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

        this.message = { text: errorMessage, type: "error" };
        this.isLoadingGPS = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  renderMessage() {
    if (!this.message) return null;

    const bgColor =
      this.message.type === "success"
        ? "bg-green-100 border-green-400 text-green-700"
        : this.message.type === "error"
        ? "bg-red-100 border-red-400 text-red-700"
        : "bg-blue-100 border-blue-400 text-blue-700";

    setTimeout(() => {
      this.message = null;
    }, 5000);

    return html`
      <div class="${bgColor} border px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">${this.message.text}</span>
      </div>
    `;
  }

  render() {
    if (!this.vehicleData) {
      return html`<p class="text-gray-600">Unable to load vehicle details.</p>`;
    }

    return html`
      <div class="space-y-6">
        <div>
          <h2 class="driver-title mb-2">Vehicle Management</h2>
          <p class="driver-subtitle">
            Update and manage your vehicle information
          </p>
        </div>

        <div class="driver-panel p-6">
          <form @submit=${this.handleSubmit} class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="driver-label-text">Vehicle ID</label>
                <input
                  type="text"
                  name="vehicleId"
                  .value=${this.vehicleData.vehicleId || ""}
                  class="driver-input"
                  placeholder="Enter vehicle ID"
                />
              </div>

              <div>
                <label class="driver-label-text">Vehicle Type</label>
                <select
                  name="vehicleType"
                  class="driver-input"
                  .value=${this.vehicleData.vehicleType || ""}
                >
                  <option value="">Select vehicle type</option>
                  <option
                    value="truck"
                    ?selected=${this.vehicleData.vehicleType === "truck"}
                  >
                    Truck
                  </option>
                  <option
                    value="van"
                    ?selected=${this.vehicleData.vehicleType === "van"}
                  >
                    Van
                  </option>
                  <option
                    value="motorcycle"
                    ?selected=${this.vehicleData.vehicleType === "motorcycle"}
                  >
                    Motorcycle
                  </option>
                  <option
                    value="car"
                    ?selected=${this.vehicleData.vehicleType === "car"}
                  >
                    Car
                  </option>
                </select>
              </div>

              <div>
                <label class="driver-label-text">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  .value=${this.vehicleData.licenseNumber || ""}
                  class="driver-input"
                  placeholder="Enter license number"
                />
              </div>

              <div>
                <label class="driver-label-text">Current Location</label>
                <div class="flex gap-2">
                  <input
                    type="text"
                    name="currentLocation"
                    .value=${this.vehicleData.currentLocation || ""}
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter current location"
                  />
                  <button
                    type="button"
                    @click=${this.getCurrentLocation}
                    ?disabled=${this.isLoadingGPS}
                    class="driver-btn-secondary driver-btn-action"
                    title="Use GPS to get current location"
                  >
                    ${this.isLoadingGPS ? "Getting..." : "GPS"}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                class="flex-1 driver-btn-primary driver-btn-action"
              >
                <div class="w-5 h-5" .innerHTML=${getIconHTML("check")}></div>
                Update Vehicle Details
              </button>
              <button
                type="button"
                @click=${this.resetForm}
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Reset
              </button>
            </div>
          </form>

          <div class="mt-4">${this.renderMessage()}</div>
        </div>
      </div>
    `;
  }
}

customElements.define("vehicle-management", VehicleManagement);
