import ApiService from "./apiService";
import store from "../store";

const get = async configName => {
  const apiUrl = store.state.config[configName].apiUrl;
  const response = await ApiService.get(apiUrl);
  if (response.status === 200) {
    return response.data;
  } else return [];
};

const create = async (configName, payload) => {
  const apiUrl = store.state.config[configName].apiUrl;
  const response = await ApiService.post(apiUrl, payload);
  if (response.status === 201) {
    return response.data;
  } else return {};
};

const update = async (configName, id, payload) => {
  const apiUrl = store.state.config[configName].apiUrl;
  const response = await ApiService.put(`${apiUrl}/${id}`, payload);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const getOne = async (configName, id) => {
  const apiUrl = store.state.config[configName].apiUrl;
  const response = await ApiService.get(`${apiUrl}/${id}`);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const remove = async (configName, id) => {
  const apiUrl = store.state.config[configName].apiUrl;
  const response = await ApiService.delete(`${apiUrl}/${id}`);
  if (response.status === 200) {
    return true;
  } else return false;
};

export default {
  get,
  create,
  update,
  getOne,
  delete: remove
};
