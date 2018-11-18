import ApiService from "./apiService";

const getPublishers = async () => {
  const response = await ApiService.get(`publisher`);
  if (response.status === 200) {
    return response.data;
  } else return [];
};

const createPublisher = async payload => {
  const response = await ApiService.post(`publisher`, payload);
  if (response.status === 201) {
    return response.data;
  } else return {};
};

const updatePublisher = async (publisherId, payload) => {
  const response = await ApiService.put(`publisher/${publisherId}`, payload);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const getPublisherById = async publisherId => {
  const response = await ApiService.get(`publisher/${publisherId}`);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

export default {
  getPublishers,
  createPublisher,
  updatePublisher,
  getPublisherById
};
