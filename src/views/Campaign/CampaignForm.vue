<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{createMode?'New Campaign':'Edit Campaign'}}</h2>
      <v-btn slot="activator" :to="{ name: 'campaign-list'}" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon> Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field v-validate="'required|max:100'" v-model="campaignName" :counter="100" :error-messages="errors.collect('campaignName')" label="Campaign name" data-vv-name="campaignName" required></v-text-field>
                <v-autocomplete v-validate="'required'" v-model="contentId" :items="contents" clearable item-text="name" item-value="_id" :error-messages="errors.collect('contentId')" label="Content name" data-vv-name="contentId"/>
                <v-autocomplete v-validate="'required'" v-model="publisherIds" :items="publishers" clearable chips multiple item-text="name" item-value="_id" :error-messages="errors.collect('publisherIds')" label="Publishers" data-vv-name="publisherIds"/>
                <v-layout row wrap>
                  <v-flex>
                    <v-dialog ref="campaignStartDateDialog" v-model="campaignStartDateModal" :return-value.sync="campaignStartDate" persistent lazy full-width width="290px">
                      <v-text-field slot="activator" v-model="campaignStartDate" label="Campaign start date" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="campaignStartDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="campaignStartDateModal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.campaignStartDateDialog.save(campaignStartDate)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex>
                    <v-dialog ref="campaignEndDateDialog" v-model="campaignEndDateModal" :return-value.sync="campaignEndDate" persistent lazy full-width width="290px">
                      <v-text-field slot="activator" v-model="campaignEndDate" label="Campaign end date" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="campaignEndDate" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="campaignEndDateModal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.campaignEndDateDialog.save(campaignEndDate)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <v-checkbox v-validate="'required'" v-model="isActive" :error-messages="errors.collect('isActive')" label="Active" data-vv-name="isActive" required></v-checkbox>
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
import ContentService from "@/services/contentService";
import PublisherService from "@/services/publisherService";
import CampaignService from "@/services/campaignService";

export default {
  data: () => ({
    isSubmitting: false,
    createMode: true,
    campaignStartDateModal: false,
    campaignEndDateModal: false,
    campaignName: null,
    contents: [],
    publishers: [],
    contentId: null,
    publisherIds: [],
    campaignStartDate: new Date().toISOString().substr(0, 10),
    campaignEndDate: new Date().toISOString().substr(0, 10),
    isActive: true,
    dictionary: {
      custom: {
        campaignName: {
          required: () => "Campaign Name can not be empty.",
          max: "The Campaign name field may not be greater than 10 characters."
        },
        contentId: {
          required: () => "Content can not be empty."
        },
        publisherIds: {
          required: () => "Publishers can not be empty."
        }
      }
    }
  }),
  async created() {
    this.contents = await ContentService.getContents();
    this.publishers = await PublisherService.getPublishers();
    this.createMode = Object.keys(this.$route.params).length === 0; // if there is no router param campaignId then its in create mode
    if (!this.createMode) {
      const campaign = await CampaignService.getCampaignById(
        this.$route.params.campaignId
      );
      this.campaignName = campaign.name;
      this.isActive = campaign.isActive;
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
          const payload = {
            name: this.campaignName,
            content: this.contentId,
            publishers: this.publisherIds,
            campaignStartDate: this.campaignStartDate,
            campaignEndDate: this.campaignEndDate,
            isActive: this.isActive
          };
          // create new campaign
          if (this.createMode) {
            await CampaignService.createCampaign(payload);
          } else {
            await CampaignService.updateCampaign(
              this.$route.params.campaignId,
              payload
            );
          }
          this.isSubmitting = false;
          this.$router.push({ name: "campaign-list" });
        }
      });
    },
    clear() {
      this.campaignName = "";
      this.isActive = false;
      this.$validator.reset();
    }
  }
};
</script>
