<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{ campaignId ? "Edit Campaign" : "New Campaign" }}</h2>
      <v-btn slot="activator" :to="{ name: 'campaign-list' }" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon>Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card v-if="!$apollo.queries.campaign.loading">
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field
                  v-validate="'required|max:100'"
                  v-model="campaign.name"
                  :counter="100"
                  :error-messages="errors.collect('campaignName')"
                  label="Campaign name"
                  data-vv-name="campaignName"
                  required
                ></v-text-field>
                <v-autocomplete
                  v-validate="'required'"
                  v-model="campaign.content"
                  :items="contents"
                  clearable
                  item-text="name"
                  item-value="id"
                  :error-messages="errors.collect('campaignId')"
                  label="Content name"
                  data-vv-name="campaignId"
                />
                <v-autocomplete
                  v-validate="'required'"
                  v-model="campaign.publishers"
                  :items="publishers"
                  clearable
                  chips
                  multiple
                  item-text="name"
                  item-value="id"
                  :error-messages="errors.collect('publisherIds')"
                  label="Publishers"
                  data-vv-name="publisherIds"
                />
                <v-layout row wrap>
                  <v-flex>
                    <v-dialog
                      ref="campaignStartDateDialog"
                      v-model="campaignStartDateModal"
                      :return-value.sync="campaign.startDate"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="campaign.startDate"
                        label="Campaign start date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="campaign.startDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="campaignStartDateModal = false">Cancel</v-btn>
                        <v-btn
                          flat
                          color="primary"
                          @click="
                            $refs.campaignStartDateDialog.save(
                              campaign.startDate
                            )
                          "
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex>
                    <v-dialog
                      ref="campaignEndDateDialog"
                      v-model="campaignEndDateModal"
                      :return-value.sync="campaign.endDate"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="campaign.endDate"
                        label="Campaign end date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="campaign.endDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="campaignEndDateModal = false">Cancel</v-btn>
                        <v-btn
                          flat
                          color="primary"
                          @click="
                            $refs.campaignEndDateDialog.save(campaign.endDate)
                          "
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <v-checkbox
                  v-validate="'required'"
                  v-model="campaign.isActive"
                  :error-messages="errors.collect('isActive')"
                  label="Active"
                  data-vv-name="isActive"
                  required
                ></v-checkbox>
                <v-btn @click="submit" :loading="isSubmitting" color="success">submit</v-btn>
                <v-btn @click="clear">clear</v-btn>
              </form>
            </v-flex>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Vue from "vue";
import GET_CAMPAIGN from "@/graphql/campaign/Campaign.gql";
import SAVE_CAMPAIGN from "@/graphql/campaign/CampaignSave.gql";
import UPDATE_CAMPAIGN from "@/graphql/campaign/CampaignUpdate.gql";
import GET_PUBLISHERS from "@/graphql/publisher/Publishers.gql";
import GET_CONTENTS from "@/graphql/content/Contents.gql";

export default {
  props: {
    campaignId: String
  },
  data: () => ({
    campaign: {},
    isSubmitting: false,
    campaignStartDateModal: false,
    campaignEndDateModal: false,
    publishers: [],
    dictionary: {
      custom: {
        campaignName: {
          required: () => "Campaign Name can not be empty.",
          max: "The Campaign name field may not be greater than 10 characters."
        },
        campaignId: {
          required: () => "Content can not be empty."
        },
        publisherIds: {
          required: () => "Publishers can not be empty."
        }
      }
    }
  }),
  apollo: {
    campaign: {
      query: GET_CAMPAIGN,
      variables() {
        return {
          id: this.campaignId
        };
      },
      skip() {
        return !this.campaignId;
      }
    },
    publishers: {
      query: GET_PUBLISHERS
    },
    contents: {
      query: GET_CONTENTS
    }
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
  },
  methods: {
    submit() {
      this.$validator.validate().then(async result => {
        if (result) {
          this.isSubmitting = true;

          // format date fields to graphql-iso
          const dateFields = {
            startDate: new Date(this.campaign.startDate).toISOString(),
            endDate: new Date(this.campaign.endDate).toISOString()
          };

          // update existing campaign
          if (this.campaignId) {
            Vue.delete(this.campaign, "id");
            Vue.delete(this.campaign, "createdAt");
            Vue.delete(this.campaign, "updatedAt");
            Vue.delete(this.campaign, "__typename"); // TODO: dont send apollo query object directly
            console.log;
            await this.$apollo.mutate({
              mutation: UPDATE_CAMPAIGN,
              // Payload
              variables: {
                id: this.campaignId,
                input: { ...this.campaign, ...dateFields }
              }
            });
          } else {
            // create new campaign
            await this.$apollo.mutate({
              mutation: SAVE_CAMPAIGN,
              // Payload
              variables: {
                input: { ...this.campaign, ...dateFields }
              }
            });
          }
          this.isSubmitting = false;
          this.$router.push({ name: "campaign-list" });
        }
      });
    },
    clear() {
      this.campaignName = null;
      this.campaignId = null;
      this.publisherIds = [];
      this.campaignStartDate = null;
      this.campaignEndDate = null;
      this.isActive = true;
      this.$validator.reset();
    }
  }
};
</script>
