import api from "@/api/api"

export const fetchTypes = async (token) => {
  try {
    const typesData = await api.get("types/types", token)
    return typesData
  } catch (error) {
    console.error("Error fetching Types:", error)
  }
}

export const fetchLocations = async (token) => {
  try {
    const locationData = await api.get("locations/location", token)
    return locationData
  } catch (error) {
    console.error("Error fetching Locations:", error)
  }
}

export const fetchServices = async (token) => {
  try {
    const servicesData = await api.get("services/services/", token)
    return servicesData
  } catch (error) {
    console.error("Error fetching services:", error)
  }
}

export const fetchSubServices = async (token, id) => {
  try {
    const subServicesData = await api.get(`services/${id}`, token)
    return subServicesData
  } catch (error) {
    console.error("Error fetching services:", error)
  }
}
