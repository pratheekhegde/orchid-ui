<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">Contents</h2>
      <v-btn :to="{ name: 'content-add' }" color="primary" dark>
        <v-icon left dark>add</v-icon>New
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="contentSearchText"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <ApolloQuery
            :query="require('@/graphql/content/Contents.gql')"
            fetch-policy="network-only"
          >
            <template slot-scope="{ result: { data, loading } }">
              <v-data-table
                v-if="data && data.contents"
                :headers="headers"
                :items="data.contents"
                :loading="loading"
                :search="contentSearchText"
              >
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.type }}</td>
                  <td class="text-xs-center" v-if="props.item.isActive">
                    <v-chip color="green" text-color="white">Active</v-chip>
                  </td>
                  <td class="text-xs-center" v-else>
                    <v-chip color="red" text-color="white">Inactive</v-chip>
                  </td>
                  <td>{{ props.item.updatedAt | fromNow }}</td>
                  <td>{{ props.item.createdAt | format }}</td>
                  <td class="text-xs-right">
                    <v-icon small class="mr-2" @click="editContent(props.item)">edit</v-icon>
                    <v-icon small @click="showDeleteContentPrompt(props.item)">delete</v-icon>
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
      <v-dialog v-model="showContentDeleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Delete Content?</v-card-title>
          <v-card-text>
            Are you sure you want to delete the content
            <b>{{ contentToBeDeleted ? contentToBeDeleted.name : "" }}</b>?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="showContentDeleteDialog = false">Cancel</v-btn>
            <v-btn
              color="red darken-1"
              flat
              @click="deleteContent"
              :loading="isContentDeleting"
            >Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import DELETE_CONTENT from "@/graphql/content/ContentDelete.gql";
import GET_CONTENTS from "@/graphql/content/Contents.gql";
export default {
  data: () => ({
    contentSearchText: "",
    showContentDeleteDialog: false,
    isContentDeleting: false,
    contentToBeDeleted: null,
    headers: [
      {
        text: "Content Name",
        align: "left",
        value: "name"
      },
      { text: "Content Type", value: "type", sortable: false },
      { text: "Status", value: "isActive", align: "center", sortable: false },
      { text: "Last Updated", value: "updatedAt", sortable: false },
      { text: "Created", value: "createdAt", sortable: false },
      { text: "Actions", value: "name", align: "right", sortable: false }
    ]
  }),
  methods: {
    editContent(item) {
      this.$router.push({
        name: "content-edit",
        params: { contentId: item.id }
      });
    },
    showDeleteContentPrompt(item) {
      this.showContentDeleteDialog = true;
      this.contentToBeDeleted = item;
    },
    async deleteContent() {
      this.isContentDeleting = true;

      await this.$apollo.mutate({
        mutation: DELETE_CONTENT,
        // Payload
        variables: {
          id: this.contentToBeDeleted.id
        },
        update: store => {
          let data = store.readQuery({ query: GET_CONTENTS });
          // TODO this is a workaround
          // See: https://github.com/apollographql/apollo-client/issues/4031#issuecomment-433668473
          data = {
            contents: [...data.contents]
          };
          const index = data.contents.findIndex(c => c.id === c.id);
          if (index !== -1) data.contents.splice(index, 1);
          store.writeQuery({ query: GET_CONTENTS, data });
        }
      });
      this.isContentDeleting = false;
      this.showContentDeleteDialog = false;
    }
  }
};
</script>
