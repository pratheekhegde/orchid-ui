<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{createMode?'New Publisher':'Edit Publisher'}}</h2>
      <v-btn slot="activator" :to="{ name: 'publisher-list'}" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon> Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field v-validate="'required|max:100'" v-model="publisherName" :counter="100" :error-messages="errors.collect('publisherName')" label="Publisher Name" data-vv-name="publisherName" required></v-text-field>
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
import PublisherService from "@/services/publisherService";
export default {
  data: () => ({
    isSubmitting: false,
    createMode: true,
    publisherName: "",
    isActive: true,
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
  async created() {
    this.createMode = Object.keys(this.$route.params).length === 0; // if there is no router param publisherId then its in create mode
    if (!this.createMode) {
      const publisher = await PublisherService.getPublisherById(
        this.$route.params.publisherId
      );
      this.publisherName = publisher.name;
      this.isActive = publisher.isActive;
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
            name: this.publisherName,
            isActive: this.isActive
          };
          // create new publisher
          if (this.createMode) {
            await PublisherService.createPublisher(payload);
          } else {
            await PublisherService.updatePublisher(
              this.$route.params.publisherId,
              payload
            );
          }
          this.isSubmitting = false;
          this.$router.push({ name: "publisher-list" });
        }
      });
    },
    clear() {
      this.publisherName = "";
      this.isActive = false;
      this.$validator.reset();
    }
  }
};
</script>
