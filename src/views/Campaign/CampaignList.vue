<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">Campaigns</h2>
      <v-btn :to="{ name: 'campaign-add' }" color="primary" dark>
        <v-icon left dark>add</v-icon>New
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="campaignSearchText"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <ApolloQuery
            :query="require('@/graphql/campaign/Campaigns.gql')"
            fetch-policy="network-only"
          >
            <template slot-scope="{ result: { data, loading } }">
              <v-data-table
                v-if="data && data.campaigns"
                :headers="headers"
                :items="data.campaigns"
                :loading="loading"
                :search="campaignSearchText"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.content.name }}</td>
                  <td class="text-xs-center" v-if="props.item.isActive">
                    <v-chip color="green" text-color="white">Active</v-chip>
                  </td>
                  <td class="text-xs-center" v-else>
                    <v-chip color="red" text-color="white">Inactive</v-chip>
                  </td>
                  <td>{{ props.item.updatedAt | fromNow }}</td>
                  <td>{{ props.item.createdAt | format }}</td>
                  <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="editCampaign(props.item)">edit</v-icon>
                    <v-icon small @click="showDeleteCampaignPrompt(props.item)">delete</v-icon>
                  </td>
                </template>
                <template slot="no-data">
                  <span class="justify-center">There is nothing to display.</span>
                </template>
              </v-data-table>
            </template>
          </ApolloQuery>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="showCampaignDeleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Delete Campaign?</v-card-title>
          <v-card-text>
            Are you sure you want to delete the campaign
            <b>{{ campaignToBeDeleted ? campaignToBeDeleted.name : "" }}</b>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="showCampaignDeleteDialog = false">Cancel</v-btn>
            <v-btn
              color="red darken-1"
              flat
              @click="deleteCampaign"
              :loading="isCampaignDeleting"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import DELETE_CAMPAIGN from "@/graphql/campaign/CampaignDelete.gql";
import GET_CAMPAIGN from "@/graphql/campaign/Campaigns.gql";
export default {
  data: () => ({
    campaignSearchText: "",
    showCampaignDeleteDialog: false,
    isCampaignDeleting: false,
    campaignToBeDeleted: null,
    headers: [
      {
        text: "Campaign Name",
        align: "left",
        value: "name"
      },
      {
        text: "Content Name",
        value: "content",
        align: "center",
        sortable: false
      },
      { text: "Status", value: "isActive", align: "center", sortable: false },
      { text: "Last Updated", value: "updatedAt", sortable: false },
      { text: "Created", value: "createdAt", sortable: false },
      { text: "Actions", value: "name", align: "right", sortable: false }
    ],
  }),
  methods: {
    editCampaign(item) {
      this.$router.push({
        name: "campaign-edit",
        params: { campaignId: item.id }
      });
    },
    showDeleteCampaignPrompt(item) {
      this.showCampaignDeleteDialog = true;
      this.campaignToBeDeleted = item;
    },
    async deleteCampaign() {
      this.isCampaignDeleting = true;

      await this.$apollo.mutate({
        mutation: DELETE_CAMPAIGN,
        // Payload
        variables: {
          id: this.campaignToBeDeleted.id
        },
        update: store => {
          let data = store.readQuery({ query: GET_CAMPAIGN });
          // TODO this is a workaround
          // See: https://github.com/apollographql/apollo-client/issues/4031#issuecomment-433668473
          data = {
            campaigns: [...data.campaigns]
          };
          const index = data.campaigns.findIndex(c => c.id === c.id);
          if (index !== -1) data.campaigns.splice(index, 1);
          store.writeQuery({ query: GET_CAMPAIGN, data });
        }
      });

      this.isCampaignDeleting = false;
      this.showCampaignDeleteDialog = false;
    }
  }
};
</script>
