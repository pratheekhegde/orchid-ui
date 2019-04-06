<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{ publisherId ? "Edit Publisher" : "New Publisher" }}</h2>
      <v-btn slot="activator" :to="{ name: 'publisher-list' }" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon>Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card v-if="!$apollo.queries.publisher.loading">
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field
                  v-validate="'required|max:100'"
                  v-model="publisher.name"
                  :counter="100"
                  :error-messages="errors.collect('publisherName')"
                  label="Publisher Name"
                  data-vv-name="publisherName"
                  required
                ></v-text-field>
                <v-checkbox
                  v-validate="'required'"
                  v-model="publisher.isActive"
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
import GET_PUBLISHER from "@/graphql/publisher/Publisher.gql";
import SAVE_PUBLISHER from "@/graphql/publisher/PublisherSave.gql";
import UPDATE_PUBLISHER from "@/graphql/publisher/PublisherUpdate.gql";

export default {
  props: {
    publisherId: String
  },
  data: () => ({
    publisher: {},
    isSubmitting: false,
    dictionary: {
      custom: {
        publisherName: {
          required: () => "Publisher Name can not be empty.",
          max: "The Publisher name field may not be greater than 10 characters."
          // custom messages
        }
      }
    }
  }),
  apollo: {
    publisher: {
      query: GET_PUBLISHER,
      variables() {
        return {
          id: this.publisherId
        };
      },
      skip() {
        return !this.publisherId;
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
          // update existing publisher
          if (this.publisherId) {
            Vue.delete(this.publisher, "id");
            Vue.delete(this.publisher, "createdAt");
            Vue.delete(this.publisher, "updatedAt");
            Vue.delete(this.publisher, "__typename"); // TODO: dont send apollo query object directly
            await this.$apollo.mutate({
              mutation: UPDATE_PUBLISHER,
              // Payload
              variables: {
                id: this.publisherId,
                input: this.publisher
              }
            });
          } else {
            // create new publisher
            await this.$apollo.mutate({
              mutation: SAVE_PUBLISHER,
              // Payload
              variables: {
                input: this.publisher
              }
            });
          }
          this.isSubmitting = false;
          this.$router.push({ name: "publisher-list" });
        }
      });
    },
    clear() {
      this.publisher = {};
      this.$validator.reset();
    }
  }
};
</script>
