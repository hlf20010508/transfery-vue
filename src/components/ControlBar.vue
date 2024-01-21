<template>
  <el-row class="index-row4">
    <el-col :span="3">
      <el-upload
        action="/post/upload"
        multiple
        :http-request="uploadFile"
        :show-file-list="false"
      >
        <div class="index-upload-div">
          <i
            slot="trigger"
            class="el-icon-folder index-upload"
            @click="selectFile"
          ></i>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="3">
      <div class="index-remove-div" @click="remove">
        <i class="el-icon-close index-remove"></i>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="index-refresh-div" @click="refresh">
        <i class="el-icon-refresh index-refresh"></i>
      </div>
    </el-col>
    <el-col :span="3" :offset="12">
      <el-popover
        v-show="uploadsList.length > 0"
        popper-class="index-uploads-pop"
        placement="top-end"
        width="250"
        trigger="click"
        v-model="showUploadsArea"
      >
        <div>
          <div>
            <el-row>
              <el-col :span="18">
                <p class="index-uploads-area-name">上传项</p>
              </el-col>
              <el-col :span="6">
                <el-button
                  class="index-remove-completed-items"
                  @click="removeCompletedUploads"
                >
                  清除
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="index-uploads-area-items">
            <div v-for="(item, index) in uploadsList" :key="index">
              <i class="el-icon-document index-uploads-item-icon"></i>
              <div class="index-uploads-item-div">
                <div class="index-uploads-item-content">
                  {{ item.content }}
                </div>
                <div>
                  <div
                    class="index-uploads-progress-div"
                    v-if="item.pause && item.uploadingPercentage != -1"
                  >
                    <el-progress
                      class="index-uploads-progress"
                      :percentage="item.uploadingPercentage"
                      status="exception"
                    />
                  </div>
                  <div
                    class="index-uploads-progress-div"
                    v-else-if="item.uploadingPercentage >= 0"
                  >
                    <el-progress
                      class="index-uploads-progress"
                      :percentage="item.uploadingPercentage"
                    />
                  </div>
                  <div class="index-uploads-progress-div" v-else>
                    <el-progress
                      class="index-uploads-progress"
                      :percentage="100"
                      status="success"
                    />
                  </div>
                  <i
                    class="el-icon-video-play index-uploads-switch-icon"
                    @click="resumeUploadsItem(index)"
                    v-if="item.pause && item.uploadingPercentage != -1"
                  ></i>
                  <i
                    class="el-icon-video-pause index-uploads-switch-icon"
                    @click="pauseUploadsItem(index)"
                    v-else-if="!item.pause && item.uploadingPercentage != -1"
                  ></i>
                </div>
              </div>
              <el-divider
                class="index-uploads-divider"
                v-if="index != uploadsList.length - 1"
              ></el-divider>
            </div>
          </div>
        </div>
        <i class="el-icon-upload2 index-uploads-status" slot="reference"></i>
      </el-popover>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["uploadsList"],
  data() {
    return {
      showUploadsArea: false,
    };
  },
  methods: {
    uploadFile(res) {
      this.$emit("uploadFile", res);
    },
    selectFile() {
      this.$emit("selectFile");
    },
    remove() {
      this.$emit("remove");
    },
    refresh() {
      this.$emit("refresh");
    },
    removeCompletedUploads() {
      this.$emit("removeCompletedUploads");
    },
    resumeUploadsItem(index) {
      this.$emit("resumeUploadsItem", index);
    },
    pauseUploadsItem(index) {
      this.$emit("pauseUploadsItem", index);
    },
  },
};
</script>