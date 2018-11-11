<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">Contents</h2>
      <v-btn slot="activator" :to="{ name: 'content-add'}" color="primary" dark>
        <v-icon left dark>add</v-icon>New
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field v-model="contentSearchText" append-icon="search" label="Search" single-line hide-details></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="contents" :loading="isContentsLoading" :search="contentSearchText">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.type }}</td>
              <td class="text-xs-center" v-if="props.item.isActive"><v-chip color="green" text-color="white">Active</v-chip></td>
              <td class="text-xs-center" v-else><v-chip color="red" text-color="white">Inactive</v-chip></td>
              <td>{{ props.item.updatedAt | fromNow }}</td>
              <td>{{ props.item.createdAt | format }}</td>
              <td class="text-xs-right">
                <v-icon small class="mr-2" @click="editItem(props.item)">
                  edit
                </v-icon>
                <v-icon small @click="deleteItem(props.item)">
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
  </v-container>
</template>
<script>
import ContentService from "@/services/contentService";

export default {
  data: () => ({
    contentSearchText: "",
    isContentsLoading: false,
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
  async created() {
    this.isContentsLoading = true;
    this.contents = await ContentService.getContents();
    this.isContentsLoading = false;
  },
  methods: {
    editItem(item) {
      this.$router.push({
        name: "content-edit",
        params: { contentId: item._id }
      });
    }
  }
};
</script>
