# markdown-blog
平时我使用vNode用来写一些markdown格式的笔记，但是缺少一个在网络上展示的程序，用于在外出的时候，随时可以上网查看电脑上的笔记，于是写了这个小工具，可以直接把vNote笔记目录下的内容放到public目录进行在线展示。

需要在public目录下笔记目录结构生成一个json文件(article.json)
基于jdk1.8 + fastjson-1.2.75
以下Java代码运行结果，直接粘贴到article.json文件即可（注意文件要UTF-8字符集）
```
package cn.zhaoxusheng.pathtojsondata;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

public class PathToJsonData {

	private static List<String> ignoreFile = Arrays.asList(".json",".ignore",".vswp",".xmind",".drawio");
	private static List<String> ignorePath = Arrays.asList("_v_recycle_bin","_v_images");

	private static File basePath = new File("E:/笔记");
	
	public static void main(String[] args) {
		JSONArray articleJsonData = new JSONArray();
		System.setProperty("file.separator","/");

		int id = 1;
		for(File file : basePath.listFiles()) {
			if(file.isDirectory()) {
				if(ignorePath.contains(file.getName())) {
					continue;
				}
				JSONObject foler = new JSONObject();
				foler.put("id", "" + id++);
				foler.put("title", file.getName());
				foler.put("isFolder", true);
				foler.put("children", list(file,(id-1) + ""));
				articleJsonData.add(foler);
				continue;
			}

			if(file.isFile()) {
				if(ignoreFile.contains(file.getName().substring(file.getName().lastIndexOf(".")))) {
					continue;
				}
				JSONObject fileObj = new JSONObject();
				fileObj.put("id", "" + id++);
				fileObj.put("title", file.getName());
				fileObj.put("isFolder", false);
				fileObj.put("pPath", file.getPath().replace(PathToJsonData.basePath.getPath(), "").replace("\\", "/").substring(1).replace(file.getName(), ""));
				fileObj.put("path", file.getPath().replace(PathToJsonData.basePath.getPath(), "").replace("\\", "/").substring(1));
				articleJsonData.add(fileObj);
				continue;
			}
		}
		System.out.println(articleJsonData.toJSONString());
	}
	
	public static JSONArray list(File basePath, String pId) {
		JSONArray articleJsonData = new JSONArray();
		int id = 1;
		for(File file : basePath.listFiles()) {
			if(file.isDirectory()) {
				if(ignorePath.contains(file.getName())) {
					continue;
				}
				JSONObject foler = new JSONObject();
				foler.put("id", pId + id++);
				foler.put("title", file.getName());
				foler.put("isFolder", true);
				foler.put("children", list(file,(id-1) + ""));
				articleJsonData.add(foler);
				continue;
			}

			if(file.isFile()) {
				if(ignoreFile.contains(file.getName().substring(file.getName().lastIndexOf(".")))) {
					continue;
				}
				JSONObject fileObj = new JSONObject();
				fileObj.put("id", pId + id++);
				fileObj.put("title", file.getName());
				fileObj.put("isFolder", false);
				fileObj.put("pPath", file.getPath().replace(PathToJsonData.basePath.getPath(), "").replace("\\", "/").substring(1).replace(file.getName(), ""));
				fileObj.put("path", file.getPath().replace(PathToJsonData.basePath.getPath(), "").replace("\\", "/").substring(1));
				articleJsonData.add(fileObj);
				continue;
			}
		}
		if(articleJsonData.isEmpty()) {
			return null;
		}
		return articleJsonData;
	}
}

```

## 待完成
无

## 关于嵌入视频等
vNode会将图片资源放入"_v_images"文件夹下,因此，针对此目录下资源，做了专门的路径替换，理论上，只要放入此目录的多媒体资源，通过src方式加载，都没有问题。
但是目前我只用到了图像和视频，本身vNote是支持图像嵌入的，mp4视频可以按照以下方式嵌入，但是在vNote中无法显示视频，但是通过本工具在浏览器中可以正常显示。
### 已验证嵌入视频
<video id="video" controls="" preload="none">
  <source id="mp4" src="_v_images/Gossip协议传播示意.mp4" type="video/mp4">
</video>

## 所使用的框架
vue2
ant-design-vue
mavon-editor(根据需要自己做了写修改，代码见：node_modules/mavon-editor)

## 关于使用和分发
写着玩儿的小工具，大家有需要拿走直接用就好了，没有什么协议约束，开心就好^_^！

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
