<template>
  <div class="index">
    <el-row>
      <div class="index-mb">
        <el-scrollbar
          class="index-scrw"
          ref="myScrollbar"
          :native="true"
        >
          <infinite-loading
            direction="top"
            @infinite="getNewData"
            :distance="10"
          ></infinite-loading>
          <div v-for="(item, index) in list" :key="index">
            <div class="index-time" v-if="item.showTime">
              {{ time(item.time) }}
            </div>
            <div class="index-content">
              <span v-if="item.type == 'text'">{{ item.content }}</span>
              <a :href="item.url" download v-if="item.type == 'file'">
                {{ item.content }}
              </a>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-row>
    <el-divider class="index-divider"></el-divider>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-upload
          action="/post/files"
          multiple
          :file-list="uploadFileList"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <div class="index-upload-div">
            <i slot="trigger" class="el-icon-folder index-upload"></i>
          </div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row>
      <el-input
        class="index-input"
        type="textarea"
        :rows="2"
        v-model="input"
        placeholder="请输入消息内容或拖入文件"
        @keyup.enter.native="submit"
      ></el-input>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 0,
      list: [],
      input: null,
      uploadFileList: [],
    };
  },
  methods: {
    time(timeParse) {
      let date = new Date(timeParse);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDay();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      return (
        year +
        "/" +
        month +
        "/" +
        day +
        "/ " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    toBottom() {
      this.$refs["myScrollbar"].wrap.scrollTop =
        this.$refs["myScrollbar"].wrap.scrollHeight;
    },
    getNewData($state) {
      this.axios
        .get("/get/page", {
          params: {
            page: this.page,
          },
        })
        .then((response) => {
          let data = response.data;
          if (data.messages.length) {
            this.page += 1;
            this.list.unshift(...data.messages.reverse());
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
    submit() {
      console.log("submit", this.input);

      let date = new Date();

      let showTime = false;
      let size = this.list.length;

      let itemDate = new Date(this.list[size - 1].time);
      if (date.getTime() - itemDate.getTime() > 1000 * 60) {
        showTime = true;
      }

      let newItem = {
        content: this.input,
        type: "text",
        showTime: showTime,
        time: Date.parse(date),
      };
      this.list.push(newItem);
      this.axios.post("/post/message", newItem);
      this.$nextTick(() => this.toBottom());
      this.input = null;
    },
    uploadSuccess(response, file) {
      console.log(response, file);

      let date = new Date(response.time);

      let showTime = false;
      let size = this.list.length;

      let itemDate = new Date(this.list[size - 1].time);
      if (date.getTime() - itemDate.getTime() > 1000 * 60) {
        showTime = true;
      }
      let newItem = {
        content: file.name,
        type: "file",
        showTime: showTime,
        time: response.time,
        url: response.url,
      };
      this.list.push(newItem);
      this.axios.post("/post/message", newItem);
      this.$nextTick(() => this.toBottom());
    },
  },
};
</script>

<style>
.index {
  width: 400px;
  margin: 20px auto 0 auto;
  background: #f3f3f3;
}
.index-mb {
  height: 400px;
}
.index-scrw {
  height: 400px;
}
.index-time {
  font-size: 14px;
  color: #aaaaaa;
  text-align: left;
}
.index-content {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  margin: 10px 0 10px 0;
  text-align: left;
}
.index-divider {
  margin: 0;
}
.index-upload-div {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.index-upload {
  font-size: 34px;
}
.index-input textarea {
  resize: none;
  background: #f3f3f3;
  border: 0px;
}
</style>
