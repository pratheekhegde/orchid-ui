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
          <v-data-table
            :headers="headers"
            :items="contents"
            :loading="isContentsLoading"
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
                <v-icon small class="mr-2" @click="editContent(props.item)">
                  edit
                </v-icon>
                <v-icon small @click="showDeleteContentPrompt(props.item)">
                  delete
                </v-icon>
              </td>
            </template>
            <template slot="no-data">
              <span class="justify-center">There is nothing to display.</span>
            </template>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="showContentDeleteDialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Delete Content?</v-card-title>
          <v-card-text
            >Are you sure you want to delete the content
            <b>{{ contentToBeDeleted ? contentToBeDeleted.name : "" }}</b
            >?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              flat
              @click="showContentDeleteDialog = false"
              >Cancel</v-btn
            >
            <v-btn
              color="red darken-1"
              flat
              @click="deleteContent"
              :loading="isContentDeleting"
              >Delete</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>
<script>
import AppService from "@/services/appService";

export default {
  data: () => ({
    contentSearchText: "",
    showContentDeleteDialog: false,
    isContentsLoading: false,
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
    ],
    contents: []
  }),
  created() {
    this.fetchAllContents();
  },
  methods: {
    async fetchAllContents() {
      this.isContentsLoading = true;
      this.contents = await AppService.get("content");
      this.isContentsLoading = false;
    },
    editContent(item) {
      this.$router.push({
        name: "content-edit",
        params: { contentId: item._id }
      });
    },
    showDeleteContentPrompt(item) {
      this.showContentDeleteDialog = true;
      this.contentToBeDeleted = item;
    },
    async deleteContent() {
      this.isContentDeleting = true;
      await AppService.delete("content", this.contentToBeDeleted._id);
      this.isContentDeleting = false;
      this.fetchAllContents();
      this.showContentDeleteDialog = false;
    }
  }
};
</script>
