## 1. 运行项目
启动主应用服务器（例如使用 http-server）：
```bash
cd main-app
http-server -p 3000
```
## 2. 启动子应用服务器：
```bash
cd sub-app
http-server -p 3001
```
在浏览器中访问主应用：
http://localhost:3000 

然后切换到子应用的路径，例如：
http://localhost:3000/#/app1
