import ApiService from "./apiService";

const getContents = async () => {
  const response = await ApiService.get(`content`);
  if (response.status === 200) {
    return response.data;
  } else return [];
};

const createContent = async payload => {
  const response = await ApiService.post(`content`, payload);
  if (response.status === 201) {
    return response.data;
  } else return {};
};

const updateContent = async (contentId, payload) => {
  const response = await ApiService.put(`content/${contentId}`, payload);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const getContentById = async contentId => {
  const response = await ApiService.get(`content/${contentId}`);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const deleteContent = async contentId => {
  const response = await ApiService.delete(`content/${contentId}`);
  if (response.status === 200) {
    return true;
  } else return false;
};

export default {
  getContents,
  createContent,
  updateContent,
  getContentById,
  deleteContent
};
