<template>
  <div class="index">
    <el-row>
      <div class="index-mb">
        <el-scrollbar class="index-scrw" ref="myScrollbar" :native="true">
          <infinite-loading
            direction="top"
            @infinite="getNewData"
            :distance="10"
          ></infinite-loading>
          <div v-for="(item, index) in list" :key="index">
            <div class="index-time" v-if="item.showTime">
              {{ time(item.time) }}
            </div>
            <div class="index-text" v-if="item.type == 'text'">
              <span>
                {{ item.content }}
                <i
                  class="el-icon-error index-remove-item"
                  v-show="removing"
                  @click="removeItem(item.time, index)"
                ></i>
              </span>
            </div>
            <div class="index-file" v-if="item.type == 'file'">
              <span class="index-file-span" @click="download(item.content)">
                <i class="el-icon-document"></i>
                {{ item.content }}
              </span>
              <i
                class="el-icon-error index-remove-item"
                v-show="removing"
                @click="removeItem(item.time, index)"
              ></i>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-row>
    <el-divider class="index-divider"></el-divider>
    <el-row>
      <el-col :span="2">
        <el-upload
          action="/post/upload"
          multiple
          :file-list="uploadFileList"
          :on-success="uploadSuccess"
          :show-file-list="false"
        >
          <div class="index-upload-div">
            <i
              slot="trigger"
              class="el-icon-folder index-upload"
              @click="upload"
            ></i>
          </div>
        </el-upload>
      </el-col>
      <el-col :span="2">
        <div class="index-remove-div" @click="remove">
          <i class="el-icon-close index-remove"></i>
        </div>
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
const Moment = require("moment");

export default {
  data() {
    return {
      page: 0,
      list: [],
      input: null,
      uploadFileList: [],
      removing: false,
    };
  },
  methods: {
    time(timeParse) {
      let date = new Moment(timeParse);
      return date.format("YYYY-MM-DD HH:mm:ss");
    },
    shouldShowTime(time1, time2) {
      let date1 = new Date(time1);
      let date2 = new Date(time2);
      if (Math.abs(date1.getTime() - date2.getTime()) > 1000 * 60) {
        return true;
      }
      return false;
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
      if (this.input != "\n") {
        // console.log("submit", this.input);
        let date = new Date();
        let time = Date.parse(date);
        let showTime = false;
        let size = this.list.length;
        if (size > 0) {
          showTime = this.shouldShowTime(time, this.list[size - 1].time);
        } else {
          showTime = true;
        }

        let newItem = {
          content: this.input,
          type: "text",
          showTime: showTime,
          time: time,
        };
        this.input = null;
        this.axios.post("/post/message", newItem).then((response) => {
          if (response.data.success) {
            this.list.push(newItem);
            this.$nextTick(() => this.toBottom());
          }
        });
      } else {
        this.input = null;
      }
    },
    download(name) {
      // console.log("download: ", name);
      let item = {
        name: name,
      };
      this.axios.post("/post/download", item).then((response) => {
        let blob = new Blob([response.data]);
        let url = URL.createObjectURL(blob);
        var eleLink = document.createElement("a");
        eleLink.download = name;
        eleLink.style.display = "none";
        eleLink.href = url;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      });
    },
    upload() {
      this.remove();
    },
    uploadSuccess(response, file) {
      // console.log(response, file);
      let size = this.list.length;
      let showTime = this.shouldShowTime(
        response.time,
        this.list[size - 1].time
      );

      let newItem = {
        content: file.name,
        type: "file",
        showTime: showTime,
        time: response.time,
      };
      this.list.push(newItem);
      this.axios.post("/post/message", newItem).then((response) => {
        if (response.data.success) {
          this.$nextTick(() => this.toBottom());
        }
      });
    },
    remove() {
      //开关删除模式
      this.removing = !this.removing;
    },
    removeItem(id, index) {
      //删除项目
      // console.log("removed ", id);
      let showTime = false;
      let deletedItem = {
        time: id,
        change: null,
      };
      if (index != this.list.length - 1) {
        if (this.list[index].showTime) {
          //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
          showTime = true;
          deletedItem = {
            time: id,
            change: this.list[index + 1].time,
          };
        }
      }
      this.axios.post("/post/remove", deletedItem).then((response) => {
        if (response.data.success) {
          if (showTime) {
            this.list[index + 1].showTime = true;
          }
          this.list.splice(index, 1);
        }
      });
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
.index-text {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  margin: 10px 0 10px 0;
  text-align: left;
}
.index-file {
  word-wrap: break-word;
  word-break: normal;
  font-size: 16px;
  margin: 10px 0 10px 0;
  text-align: left;
}
.index-file-span:hover {
  cursor: pointer;
  color: #409eff;
}
.index-remove-item:hover {
  cursor: pointer;
  color: #f56c6c;
}
.index-divider {
  margin: 0;
}
.index-upload-div,
.index-remove-div {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.index-upload,
.index-remove {
  font-size: 34px;
}
.index-upload:hover,
.index-remove:hover {
  cursor: pointer;
  color: #409eff;
}
.index-input textarea {
  resize: none;
  background: #f3f3f3;
  border: 0px;
}
</style>
