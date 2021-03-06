# transfery-vue
> <a href="https://github.com/hlf20010508/transfery.git">Transfery</a> 前端项目

## 目录
- [项目部分界面展示](#interface)
- [项目功能](#functionality)
- [项目意义](#significance)
- [项目所需环境](#environment)
- [注意](#note)
- [项目运行](#running)

<span id="interface"></span>

## 项目部分界面展示
浏览器样式  
<img width="1082" alt="image" src="https://user-images.githubusercontent.com/76218469/176151027-c40cc300-7c22-42c5-9da8-2984066a8b99.png">  
<img width="1082" alt="image" src="https://user-images.githubusercontent.com/76218469/176161205-42b4f732-569d-4cd4-876e-6d0ae31c5f84.png">  
<img width="1082" alt="image" src="https://user-images.githubusercontent.com/76218469/176152167-abc40d1f-26d6-4b19-8438-519ff1c774a1.png">

ios webapp（增加到主屏幕）  
<div align=center>
<img width="300" alt="image" src="https://user-images.githubusercontent.com/76218469/176231809-af30a998-f494-479e-8355-2a4c5b5f18dd.PNG"> <img width="300" alt="image" src="https://user-images.githubusercontent.com/76218469/176233010-944534ff-9db5-4935-9e71-44a28af17b28.PNG"> <img width="300" alt="image" src="https://user-images.githubusercontent.com/76218469/176233015-457633fd-bb43-4a7f-b021-4a3e85ef02b2.PNG"> <img width="300" alt="image" src="https://user-images.githubusercontent.com/76218469/176664354-69f6b382-44ef-4592-aa34-57333a22240f.PNG">
</div>

<span id="functionality"></span>

## 项目功能
- 发送文字消息
- 传输文件，支持多文件，支持分片上传
- 全双工即时通信
- 异步框架，支持边上传边发送消息
- 手机使用屏幕键盘时页面弹性缩放
- 删除历史记录

<span id="significance"></span>

## 项目意义
假设一个场景：  
你正在上课，这堂课需要你上台汇报。  
然而你虽然带了电脑，但忘记带上U盘，没有办法将PPT拷贝到教室的电脑里。  
教室的电脑比较新，没有安装通讯软件，你又不便直接在上面安装。  
此时比较靠谱的办法可能是将PPT通过电子邮件发送给自己，然后登录自己的邮箱进行下载。  
或者将PPT发送到自己的网盘，然后登录网盘的网页版进行下载。  
然而这些都需要进行登录操作，可能会让台下的人长时间观摩你的操作。

再假设一个场景：  
你拥有三台电脑，一台是Windows电脑，一台是Mac电脑，一台是Linux电脑。  
你需要在这三台电脑之间发送大量的小文件，同时还要时不时传递文字信息。  
如果是在手机和电脑上，你应该会直接使用通讯软件，这的确很方便。  
然而现在是三台电脑，三种操作系统，可能有一个操作系统无法装你想要的通讯软件，也有可能通讯软件不能同时登录三台电脑

生活中难免会遇到需要操作别人的或者公共的电脑时候，亦或者自己有很多不同平台的设备，此时传送小文件、发送文字是挺麻烦的一件事。

Transfery的意义，就是传送小型的临时文件，共享剪贴板，而无需登录，无设备数量限制。

<span id="environment"></span>

## 项目所需环境
运行Transfery，你需要
- <a href="https://github.com/minio/minio.git">Minio</a>，作为对象存储服务
- MySQL，作为数据库
- Sanic，作为后端服务
- 一台服务器，以便随时随地使用

<span id="dependencies"></span>

### 依赖
- [package.json](https://github.com/hlf20010508/transfery-vue/blob/master/package.json)
- [package-lock.json](https://github.com/hlf20010508/transfery-vue/blob/master/package-lock.json)

<span id="note"></span>

## 注意
- 由于没有设置密码，因此请不要将Transfery的服务网址分享到网络上，以免被恶意上传。
- 本项目仅为前端，如需自定义后端服务，请前往<a href="https://github.com/hlf20010508/transfery.git">transfery</a>。
- 由于mockjs暂时无法拦截socket请求，所以在开发环境下无法即时通信，使用后端发送数据的时候可以。
- 由于暂未实现大文件分片传输，请尽量将Minio服务器放在与Transfery相同的服务器上，否则由于需要中转导致等待时间较长。

<span id="running"></span>

## 项目运行
``` bash
# 安装依赖
npm install

# 在127.0.0.1:8080上运行开发环境
npm run dev

# 使用webpack编译，得到html和js
# 项目中已设置自动将编译好的文件复制到transfery后端项目中
# 默认后端项目文件夹名为transfery且与transfery-vue同级
# 请根据实际情况编辑package.json第十行
npm run build
```
