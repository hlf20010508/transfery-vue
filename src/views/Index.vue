<template>
  <div class="index">
    <el-row class="index-row1">
      <div class="index-now">{{ now }}</div>
    </el-row>
    <el-row class="index-mb index-row2">
      <el-scrollbar class="index-scrw" ref="myScrollbar" :native="true">
        <infinite-loading direction="top" @infinite="getNewData" :distance="10">
          <template slot="no-results">还没有任何内容</template>
          <template slot="no-more">没有更多了</template>
        </infinite-loading>
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
                @click="removeItem(item, index)"
              ></i>
            </span>
          </div>
          <div class="index-file" v-if="item.type == 'file'">
            <div>
              <el-progress
                v-if="isUploading(item)"
                :text-inside="true"
                :stroke-width="24"
                :percentage="getUploadingPercentage(item)"
                status="success"
              />
            </div>
            <div>
              <span class="index-file-span" @click="download(item.content)">
                <i class="el-icon-document"></i>
                {{ item.content }}
              </span>
              <i
                class="el-icon-error index-remove-item"
                v-show="removing"
                @click="removeItem(item, index)"
              ></i>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-row>
    <el-row class="index-row3">
      <el-divider class="index-divider"></el-divider>
    </el-row>
    <el-row class="index-row4">
      <el-col :span="2">
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
        v-model="input"
        placeholder="请输入消息内容或拖入文件"
        @keyup.enter.native="submit"
        :autofocus="true"
      ></el-input>
    </el-row>
  </div>
</template>

<script>
import Moment from "moment";
import jquery from "jquery";

export default {
  data() {
    return {
      page: 0,
      list: [],
      input: null,
      removing: false,
      now: this.time(Date.parse(Date())),
    };
  },
  mounted() {
    this.updateTime();
    this.adjustCSS();
    document.addEventListener("click", (e) => {
      let items = document.getElementsByClassName("index-remove-item"); //获取删除键
      let remove = document.getElementsByClassName("index-remove")[0]; //获取删除键开关
      if (items.length > 0 && e.target != remove) {
        //获取到删除键且没有点击删除键开关则继续
        if (e.target.className != items[0].className) {
          //点击的不是删除键则继续
          this.removing = false; //关闭删除键开关
        }
      }
    });
  },
  methods: {
    adjustCSS() {
      let height = 0;
      height += jquery(".index-row1").outerHeight();
      height += jquery(".index-row2").outerHeight();
      height += jquery(".index-row3").outerHeight();
      height += jquery(".index-row4").outerHeight();
      let heightHTML = jquery("body").outerHeight();
      jquery(".index-input textarea").css("height", heightHTML - height + "px");
    },
    time(timeParse) {
      let date = new Moment(timeParse);
      return date.format("YYYY-MM-DD HH:mm:ss");
    },
    updateTime() {
      setInterval(() => (this.now = this.time(Date.parse(Date()))), 1000);
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
    download(content) {
      // console.log("download: ", item.content);
      this.axios
        .get("/get/download", { params: { content: content } })
        .then((res) => {
          let data = res.data;
          if (data.success) {
            var eleLink = document.createElement("a");
            eleLink.download = content;
            eleLink.target='_blank'
            eleLink.style.display = "none";
            eleLink.href = data.url;
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
          }
        });
    },
    selectFile() {
      this.unremove();
    },
    uploadFile(res) {
      let size = this.list.length;
      let time = Date.parse(Date());
      let showTime = true;
      if (size > 0) {
        showTime = this.shouldShowTime(time, this.list[size - 1].time);
      }
      let file = res.file;
      let newItem = {
        content: file.name,
        type: "file",
        showTime: showTime,
        time: time,
        uploading: false,
        uploadingPercentage: 0,
      };
      // console.log("add new item: ", newItem);
      let newItemIndex = this.list.push(newItem) - 1;
      this.$nextTick(() => this.toBottom());
      let form = new FormData();
      form.append("file", file);
      form.append("size", file.size);
      this.axios({
        method: "post",
        url: "/post/upload",
        data: form,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          this.list[newItemIndex].uploading = true;
          this.list[newItemIndex].uploadingPercentage =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
        },
      }).then((res) => {
        if (res.data.success) {
          delete this.list[newItemIndex].uploading;
          delete this.list[newItemIndex].uploadingPercentage;
          this.axios
            .post("/post/message", this.list[newItemIndex])
            .then((response) => {
              if (response.data.success) {
                this.$nextTick(() => this.toBottom());
              }
            });
        }
      });
    },
    isUploading(item) {
      try {
        return item.uploading;
      } catch (err) {
        return false;
      }
    },
    getUploadingPercentage(item) {
      try {
        // console.log(item.uploadingPercentage);
        return item.uploadingPercentage;
      } catch (err) {
        console.log(err);
        return 100;
      }
    },
    remove() {
      //开关删除模式
      this.removing = !this.removing;
    },
    unremove() {
      //关闭删除模式
      this.removing = false;
    },
    removeItem(item, index) {
      //删除项目
      // console.log("removed ", id);
      let showTime = false;
      let deletedItem = {
        time: item.time,
        change: null,
        type: item.type,
        content: item.content,
      };
      if (index != this.list.length - 1) {
        if (this.list[index].showTime) {
          //如果被删除的项目会显示时间，则将下一个项目改为会显示时间
          showTime = true;
          deletedItem.change = this.list[index + 1].time;
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
  width: 100%;
  height: 100%;
  margin: 0 auto 0 auto;
  background: #f3f3f3;
}
.index-now {
  margin: 10px 0 10px 0;
}
.index-mb {
  height: 75%;
}
.index-scrw {
  height: 100%;
  margin: 0 20px 0 20px;
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
  margin: 0 0 10px 0;
}
.index-upload-div,
.index-remove-div {
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
  height: 96px;
}
</style>
