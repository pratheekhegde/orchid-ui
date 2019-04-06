<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{ contentId ? "Edit Content" : "New Content" }}</h2>
      <v-btn slot="activator" :to="{ name: 'content-list' }" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon>Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card v-if="!$apollo.queries.content.loading">
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field
                  v-validate="'required|max:100'"
                  v-model="content.name"
                  :counter="100"
                  :error-messages="errors.collect('contentName')"
                  label="Content Name"
                  data-vv-name="contentName"
                  required
                ></v-text-field>
                <v-select
                  v-validate="'required'"
                  :items="contentTypes"
                  v-model="content.type"
                  :error-messages="errors.collect('selectedContentType')"
                  label="Content Type"
                  data-vv-name="selectedContentType"
                  required
                ></v-select>
                <v-checkbox
                  v-validate="'required'"
                  v-model="content.isActive"
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
import GET_CONTENT from "@/graphql/content/Content.gql";
import SAVE_CONTENT from "@/graphql/content/ContentSave.gql";
import UPDATE_CONTENT from "@/graphql/content/ContentUpdate.gql";

export default {
  props: {
    contentId: String
  },
  data: () => ({
    content: {},
    isSubmitting: false,
    contentTypes: ["Movie", "Advertisement"],
    dictionary: {
      custom: {
        contentName: {
          required: () => "Content Name can not be empty.",
          max: "The Content name field may not be greater than 10 characters."
          // custom messages
        },
        selectedContentType: {
          required: "Content Type field is required."
        }
      }
    }
  }),
  apollo: {
    content: {
      query: GET_CONTENT,
      variables() {
        return {
          id: this.contentId
        };
      },
      skip() {
        return !this.contentId;
      }
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
          // update existing content
          if (this.contentId) {
            Vue.delete(this.content, "id");
            Vue.delete(this.content, "createdAt");
            Vue.delete(this.content, "updatedAt");
            Vue.delete(this.content, "__typename"); // TODO: dont send apollo query object directly
            await this.$apollo.mutate({
              mutation: UPDATE_CONTENT,
              // Payload
              variables: {
                id: this.contentId,
                input: this.content
              }
            });
          } else {
            // create new content
            await this.$apollo.mutate({
              mutation: SAVE_CONTENT,
              // Payload
              variables: {
                input: this.content
              }
            });
          }
          this.isSubmitting = false;
          this.$router.push({ name: "content-list" });
        }
      });
    },
    clear() {
      this.content = {};
      this.$validator.reset();
    }
  }
};
</script>
