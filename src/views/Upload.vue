<template>
  <div id="upload-view">
    <div class="container mt-4">
      <h1>Upload new clip</h1>
      <form @submit.prevent>
        <FormGroup>
          <label class="control-label">Clip name</label>
          <input type="text" class="form-control" v-model="clip.title">
        </FormGroup>
        <FormGroup>
          <button @click="onFileSelectTrigger" class="btn btn-outline-info">
            <span>Select file</span>
          </button>
          <input @change="onFileSelected($event.target.name, $event.target.files)" ref="nativeUploadButton" type="file" accept="video/mp4" class="form-control">
        </FormGroup>
        <FormGroup>
          <button @click="onFormSubmit" class="btn btn-primary">
            <font-awesome-icon icon="cloud-upload-alt"></font-awesome-icon>
            Upload
          </button>
        </FormGroup>
      </form>
    </div>

    <div class="overlay" v-show="progress.sentPercentage !== null">
      <div class="mask"></div>
      <div class="container">
        <h1>
          <font-awesome-icon icon="circle-notch" spin></font-awesome-icon>
        </h1>
        <h5>Our monkeys are uploading your video</h5>
        <h3>{{ progress.sentPercentage }}%</h3>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormGroup from '@/components/common/FormGroup';
import http from '@/lib/http';
export default {

  data () {
    return {
      clip: {
        title: null,
        clipData: null
      },
      progress: {
        sentPercentage: null
      }
    };
  },
  
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (vm.currentUser === null) {
        vm.$router.replace({ name: 'home' });
      }
    });
  },

  methods: {
    onFileSelectTrigger () {
      this.$refs.nativeUploadButton.click();
    },

    onFileSelected (name, files) {
      this.clip.clipData = files[0];
    },

    onUploadProgress () {

    },

    onUploadCompleted (clip) {
      // TODO: navigate to clip page
      this.$router.push({ name: 'stream', params: { id: clip.uuid } });
    },

    onFormSubmit () {
      const vm = this;
      let data = new FormData();
      data.append('title', this.clip.title);
      data.append('media', this.clip.clipData, this.clip.filename)
      
      http.post('/api/content/upload', data, {
        onUploadProgress: (evt) => {
          try {
            vm.progress.sentPercentage = parseInt(evt.loaded / evt.total * 100);
            if (vm.progress.sentPercentage !== 0) {
              vm.onUploadProgress(vm.progress.sentPercentage);
            }
          } catch (e) {
            vm.progress.sentPercentage = null;
          }
        },
      }).then(res => {
        vm.progress.sentPercentage = null;
        vm.onUploadCompleted(res.data);
      }).catch(err => {
        console.error(err);
        // TODO: notify user about occurred error
      });
    }
  },

  computed: {
    ...mapGetters(['currentUser'])
  },

  components: {
    FormGroup
  }
}
</script>
