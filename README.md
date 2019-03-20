# Vue-qqMusic

#### 介绍
这是一款基于Vue 全家桶 (2.x) 制作的移动端音乐 WebApp ，一个媲美原生的移动端音乐 App，项目完整、功能完备、UI美观、交互一流。
#### 项目线上地址
[点我去参观下](http://music.52react.cn)
#### 效果图
![](http://book.52react.cn/20190319085537.png) ![](http://book.52react.cn/20190319085620.png)![](http://book.52react.cn/20190319085601.png) ![](http://book.52react.cn/20190319085639.png)

![](http://book.52react.cn/20190319085700.png) ![](http://book.52react.cn/20190319085722.png)
![](http://book.52react.cn/20190319090108.png) ![](http://book.52react.cn/20190319085856.png)
![](http://book.52react.cn/20190319085912.png) ![](http://book.52react.cn/20190319085937.png)
#### 软件架构
软件架构说明

```
├── build                        // 编译后的文件
├── public                       // vue主页面
├── node_modules                // 项目依赖包
├── src                         // 项目主目录
│   ├── components              // 项目组件  
│   ├── common                  // 项目配置文件
│   │    ├── font               // 项目字体库
│   │    ├── img                // 项目图片
│   │    ├── js                // 一些工具方法
│   │    └── less              // 全局样式文件
│   ├── base                   // 项目可复用组件
│   │    ├── fetch.js           // response.js方法配置
│   │    ├── response.js        // http数据请求方法
│   │    └── utils.js           // 常用方法库
│   ├── api                  //   项目请求文件
│   │    └── tabIcon            // 底部导航图标
│   ├── router                  // 路由部分
│   ├── store                   // redux部分
│   │    ├── index.js           // redux配置页面
│   │    └── stores.js          // redux数据中心
│   ├── main.js                  //项目注册入口文件
│   └── App.vue                  //项目入口页
├── package.json                // 项目配置信息
├── .babelrc                    // 设置转码的规则,插件,文件地址映（自动生成的）
├── .gitignore                  // 告诉Git哪些文件不需要添加到版本管理中（自动生成的）
├── .eslintrc                   // 代码校验规则配置
├── README.md                   // help
└── yarn.lock                   // 依赖的版本信息管理
```


#### 技术栈
【前端】
* Vue：用于构建用户界面的 MVVM 框架。它的核心是响应的数据绑定和组系统件
* vue-router：为单页面应用提供的路由系统，项目上线前使用了 Lazy Loading Routes 技术来实现异步加载优化性能
* vuex：Vue 集中状态管理，在多个组件共享某些状态时非常便捷
* vue-lazyload：第三方图片懒加载库，优化页面加载速度
* better-scroll：iscroll 的优化版，使移动端滑动体验更加流畅
* LESS(Scss)：css 预编译处理器
* ES6：ECMAScript 新一代语法，模块化、解构赋值、Promise、Class 等方法非常好用
【后端】
* Node.js：利用 Koa 起一个本地测试服务器
* jsonp：服务端通讯。抓取 QQ音乐(移动端)数据
* axios：服务端通讯。结合 Node.js 代理后端请求，抓取 QQ音乐(PC端)数据
【自动化构建及其他工具】
* vue-cli：Vue 脚手架工具，快速初始化项目代码
* eslint：代码风格检查工具，规范代码书写
* vConsole：移动端调试工具，在移动端输出日志
#### 安装教程
```
# clone the repo into your disk.
$ git clone https://github.com/MarioGogogo/vue_qqmusic.git

# install dependencies
$ yarn

# serve with hot reload at localhost:8080
$ yarn run dev

# build for production with minification
$ yarn run build
```


#### iOS 微信里点击不能播放歌曲的解决
参考:https://juejin.im/post/5a1af88f5188254a701ec230


#### 如何参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request

# 最后感谢[黄大大](https://github.com/ustbhuangyi)的帮助
![](http://book.52react.cn/20190320120635.png)