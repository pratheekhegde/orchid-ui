import ApiService from "./apiService";

const getCampaigns = async () => {
  const response = await ApiService.get(`campaign`);
  if (response.status === 200) {
    return response.data;
  } else return [];
};

const createCampaign = async payload => {
  const response = await ApiService.post(`campaign`, payload);
  if (response.status === 201) {
    return response.data;
  } else return {};
};

const updateCampaign = async (campaignId, payload) => {
  const response = await ApiService.put(`campaign/${campaignId}`, payload);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const getCampaignById = async campaignId => {
  const response = await ApiService.get(`campaign/${campaignId}`);
  if (response.status === 200) {
    return response.data;
  } else return {};
};

const deleteCampaign = async campaignId => {
  const response = await ApiService.delete(`campaign/${campaignId}`);
  if (response.status === 200) {
    return true;
  } else return false;
};

export default {
  getCampaigns,
  createCampaign,
  updateCampaign,
  getCampaignById,
  deleteCampaign
};
