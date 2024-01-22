<template>
  <el-row class="control-bar">
    <el-col :span="3">
      <el-upload
        action="/post/upload"
        multiple
        :http-request="uploadFile"
        :show-file-list="false"
      >
        <div class="control-bar-upload-div">
          <i
            slot="trigger"
            class="el-icon-folder control-bar-upload"
            @click="closeRemoveMode"
          ></i>
        </div>
      </el-upload>
    </el-col>
    <el-col :span="3">
      <div class="control-bar-remove-div" @click="remove">
        <i class="el-icon-close control-bar-remove"></i>
      </div>
    </el-col>
    <el-col :span="3">
      <div class="control-bar-refresh-div" @click="refresh">
        <i class="el-icon-refresh control-bar-refresh"></i>
      </div>
    </el-col>
    <el-col :span="3" :offset="12">
      <el-popover
        v-show="uploadsList.length > 0"
        popper-class="control-bar-uploads-pop"
        placement="top-end"
        width="250"
        trigger="click"
        v-model="showUploadsArea"
      >
        <div>
          <div>
            <el-row>
              <el-col :span="18">
                <p class="control-bar-uploads-area-name">上传项</p>
              </el-col>
              <el-col :span="6">
                <el-button
                  class="control-bar-remove-completed-items"
                  @click="removeCompletedUploads"
                >
                  清除
                </el-button>
              </el-col>
            </el-row>
          </div>
          <div class="control-bar-uploads-area-items">
            <div v-for="(item, index) in uploadsList" :key="index">
              <i class="el-icon-document control-bar-uploads-item-icon"></i>
              <div class="control-bar-uploads-item-div">
                <div class="control-bar-uploads-item-content">
                  {{ item.content }}
                </div>
                <div>
                  <div
                    class="control-bar-uploads-progress-div"
                    v-if="item.pause && item.uploadingPercentage != -1"
                  >
                    <el-progress
                      class="control-bar-uploads-progress"
                      :percentage="item.uploadingPercentage"
                      status="exception"
                    />
                  </div>
                  <div
                    class="control-bar-uploads-progress-div"
                    v-else-if="item.uploadingPercentage >= 0"
                  >
                    <el-progress
                      class="control-bar-uploads-progress"
                      :percentage="item.uploadingPercentage"
                    />
                  </div>
                  <div class="control-bar-uploads-progress-div" v-else>
                    <el-progress
                      class="control-bar-uploads-progress"
                      :percentage="100"
                      status="success"
                    />
                  </div>
                  <i
                    class="el-icon-video-play control-bar-uploads-switch-icon"
                    @click="resumeUploadsItem(index)"
                    v-if="item.pause && item.uploadingPercentage != -1"
                  ></i>
                  <i
                    class="el-icon-video-pause control-bar-uploads-switch-icon"
                    @click="pauseUploadsItem(index)"
                    v-else-if="!item.pause && item.uploadingPercentage != -1"
                  ></i>
                </div>
              </div>
              <el-divider
                class="control-bar-uploads-divider"
                v-if="index != uploadsList.length - 1"
              ></el-divider>
            </div>
          </div>
        </div>
        <i
          class="el-icon-upload2 control-bar-uploads-status"
          slot="reference"
        ></i>
      </el-popover>
    </el-col>
  </el-row>
</template>

<script>
import { refresh as refreshInner } from "@/methods/refresh.js";

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
    closeRemoveMode() {
      this.$emit("closeRemoveMode");
    },
    remove() {
      this.$emit("remove");
    },
    refresh() {
      refreshInner(this);
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

<style>
.control-bar-upload-div,
.control-bar-remove-div,
.control-bar-refresh-div {
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-bar-upload,
.control-bar-remove,
.control-bar-refresh {
  font-size: 34px;
}

.control-bar-upload:hover,
.control-bar-remove:hover,
.control-bar-refresh:hover,
.control-bar-uploads-status:hover {
  cursor: pointer;
  color: #409eff;
}

.control-bar-uploads-pop {
  padding-right: 0;
}

.control-bar-uploads-area-name {
  text-align: end;
  line-height: 24px;
  margin: 0 46px 0 0;
  font-weight: bolder;
}

.control-bar-remove-completed-items {
  padding: 4px 10px 4px 10px;
}

.control-bar-uploads-area-items {
  padding-right: 14px;
  overflow-x: hidden;
  height: 200px;
}

.control-bar-uploads-item-icon {
  font-size: 30px;
}

.control-bar-uploads-item-div {
  width: 200px;
  display: inline-block;
}

.control-bar-uploads-item-content {
  margin: 0;
  width: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.control-bar-uploads-progress-div {
  width: 180px;
  display: inline-block;
}

.control-bar-uploads-progress {
  vertical-align: bottom;
}

.control-bar-uploads-progress .el-progress-bar {
  padding-right: 40px;
}

.control-bar-uploads-progress .el-progress__text {
  margin-left: 24px;
}

.control-bar-uploads-switch-icon {
  vertical-align: bottom;
  padding-bottom: 1px;
}

.control-bar-uploads-switch-icon:hover {
  cursor: pointer;
  color: #f56c6c;
}

.control-bar-uploads-divider {
  margin: 10px 0 8px 0;
}

.control-bar-uploads-status {
  font-size: 34px;
}
</style>