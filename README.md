# html5-compress-image

前端压缩图像demo

## 用法

1. 导入ImageCompress.js

```html
<script src="ImageCompress.1.1.js"></script>
```

2. 创建默认配置

```javascript
var option = ImageCompress.getOptions();
```
配置说明

|属性|含义|
|----|----|
|maxLength|最大长度或宽度，默认值800，单位px，可空|
|maxNotCompressSize|不压缩指定大小以内的文件，默认值200，单位KB，可空|
|quality|图片压缩质量，0-1之间小数，1为最好，默认值0.8，可空|
|file|input中的图片文件，不能为空|
|success(dataURL)|压缩成功的回调，返回图片的dataURL，不能为空|
|error(msg)|失败的回调，返回错误信息msg，可空|

3. 获取file对象，压缩图片

```javascript
inputFile.addEventListener('change', function () {
    var file = inputFile.files[0];
    if (file == null) {
        return;
    }

    var option = ImageCompress.getOptions();
    option.file = file;
    option.success = function(dataURL) {
        img.src = dataURL;
    };
    ImageCompress.compressImage(option);
});
```

4. 其他小工具

|方法|说明|
|----|----|
|checkFileType(file)|检查file文件名，是否为图片  返回值:true/false|
|dataURLtoBlob(dataURL)|dataURL转为Blob二进制对象  返回值:Blob|
