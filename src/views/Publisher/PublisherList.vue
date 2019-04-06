<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">Publishers</h2>
      <v-btn slot="activator" :to="{ name: 'publisher-add' }" color="primary" dark>
        <v-icon left dark>add</v-icon>New
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="publisherSearchText"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <ApolloQuery
            :query="require('@/graphql/publisher/Publishers.gql')"
            fetch-policy="network-only"
          >
            <template slot-scope="{ result: { data, loading } }">
              <v-data-table
                v-if="data && data.publishers"
                :headers="headers"
                :items="data.publishers"
                :loading="loading"
                :search="publisherSearchText"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-center" v-if="props.item.isActive">
                    <v-chip color="green" text-color="white">Active</v-chip>
                  </td>
                  <td class="text-xs-center" v-else>
                    <v-chip color="red" text-color="white">Inactive</v-chip>
                  </td>
                  <td>{{ props.item.updatedAt | fromNow }}</td>
                  <td>{{ props.item.createdAt | format }}</td>
                  <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="editPublisher(props.item)">edit</v-icon>
                    <v-icon small @click="showDeletePublisherPrompt(props.item)">delete</v-icon>
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
      <v-dialog v-model="showPublisherDeleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Delete Publisher?</v-card-title>
          <v-card-text>
            Are you sure you want to delete the publisher
            <b>{{ publisherToBeDeleted ? publisherToBeDeleted.name : "" }}</b>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="showPublisherDeleteDialog = false">Cancel</v-btn>
            <v-btn
              color="red darken-1"
              flat
              @click="deletePublisher"
              :loading="isPublisherDeleting"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import DELETE_PUBLISHER from "@/graphql/publisher/PublisherDelete.gql";
import GET_PUBLISHERS from "@/graphql/publisher/Publishers.gql";
export default {
  data: () => ({
    publisherSearchText: "",
    showPublisherDeleteDialog: false,
    isPublisherDeleting: false,
    publisherToBeDeleted: null,
    headers: [
      {
        text: "Publisher Name",
        align: "left",
        value: "name"
      },
      { text: "Status", value: "isActive", align: "center", sortable: false },
      { text: "Last Updated", value: "updatedAt", sortable: false },
      { text: "Created", value: "createdAt", sortable: false },
      { text: "Actions", value: "name", align: "right", sortable: false }
    ]
  }),
  methods: {
    editPublisher(item) {
      this.$router.push({
        name: "publisher-edit",
        params: { publisherId: item.id }
      });
    },
    showDeletePublisherPrompt(item) {
      this.showPublisherDeleteDialog = true;
      this.publisherToBeDeleted = item;
    },
    async deletePublisher() {
      this.isPublisherDeleting = true;

      await this.$apollo.mutate({
        mutation: DELETE_PUBLISHER,
        // Payload
        variables: {
          id: this.publisherToBeDeleted.id
        },
        update: store => {
          let data = store.readQuery({ query: GET_PUBLISHERS });
          // TODO this is a workaround
          // See: https://github.com/apollographql/apollo-client/issues/4031#issuecomment-433668473
          data = {
            publishers: [...data.publishers]
          };
          const index = data.publishers.findIndex(p => p.id === p.id);
          if (index !== -1) data.publishers.splice(index, 1);
          store.writeQuery({ query: GET_PUBLISHERS, data });
        }
      });

      this.isPublisherDeleting = false;
      this.showPublisherDeleteDialog = false;
    }
  }
};
</script>
