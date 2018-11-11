<template>
  <v-container fluid>
    <v-layout align-center justify-space-between>
      <h2 class="headline">{{createMode?'New Content':'Edit Content'}}</h2>
      <v-btn slot="activator" :to="{ name: 'content-list'}" color="primary" dark>
        <v-icon left dark>arrow_back</v-icon> Back
      </v-btn>
    </v-layout>
    <v-layout mt-3>
      <v-flex>
        <v-card>
          <v-card-title>
            <v-flex>
              <form>
                <v-text-field v-validate="'required|max:100'" v-model="contentName" :counter="100" :error-messages="errors.collect('contentName')" label="Content Name" data-vv-name="contentName" required></v-text-field>
                <v-select v-validate="'required'" :items="contentTypes" v-model="selectedContentType" :error-messages="errors.collect('selectedContentType')" label="Content Type" data-vv-name="selectedContentType" required></v-select>
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
export default {
  data: () => ({
    isSubmitting: false,
    createMode: true,
    contentName: "",
    selectedContentType: null,
    isActive: false,
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
  async created() {
    this.createMode = Object.keys(this.$route.params).length === 0; // if there is no router param contentId then its in create mode
    if (!this.createMode) {
      const content = await ContentService.getContentById(
        this.$route.params.contentId
      );
      this.contentName = content.name;
      this.selectedContentType = content.type;
      this.isActive = content.isActive;
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
            name: this.contentName,
            type: this.selectedContentType,
            isActive: this.isActive
          };
          // create new content
          if (this.createMode) {
            await ContentService.createContent(payload);
          } else {
            await ContentService.updateContent(
              this.$route.params.contentId,
              payload
            );
          }
          this.isSubmitting = false;
          this.$router.push({ name: "content-list" });
        }
      });
    },
    clear() {
      this.contentName = "";
      this.selectedContentType = null;
      this.isActive = false;
      this.$validator.reset();
    }
  }
};
</script>
