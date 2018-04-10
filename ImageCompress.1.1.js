/**
 * 前端压缩图像demo
 * Created by Sunny  An on 2017/1/4.
 */
(function () {
    var maxLength = 800; // 最大长度或宽度为800px
    var maxNotCompressSize = 200;  // 200KB以内的文件不压缩
    var quality = 0.8;  // 图片压缩质量 0-1之间 1最好
    var img = document.createElement('img');
    // 解决 Tainted canvases may not be exported 问题
    img.setAttribute('crossOrigin', 'Anonymous');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    /**
     * 获得一个默认配置
     * @returns {{maxLength: number, maxNotCompressSize: number, quality: number, file: null, success: null, error: null}}
     */
    var getOptions = function() {
        return {
            'maxLength': maxLength, // 最大长度或宽度
            'maxNotCompressSize': maxNotCompressSize, // 不压缩指定大小以内的文件 单位 KB
            'quality': quality,   // 图片压缩质量 0-1之间 1最好
            'file': null, // 必须，input中的文件
            'success': null,  // 必须，成功的回调
            'error': null  // 失败的回调
        };
    };

    /**
     * 压缩图片
     * @param option 配置
     */
    var compressImage = function (option) {
        if (option == null || option.file == null || option.success == null) {
            return;
        }
        if (option.maxLength == null) {
            option.maxLength = maxLength;
        }
        if (option.maxNotCompressSize == null) {
            option.maxNotCompressSize = maxNotCompressSize;
        }
        if (option.quality == null) {
            option.quality = quality;
        }

        // image file -> data URL
        var reader = new FileReader();
        reader.onload = function (event) {
            if (option.file.size / 1024 <= option.maxNotCompressSize) {
                option.success(event.target.result);
                return;
            }
            img.src = event.target.result;
        };
        reader.readAsDataURL(option.file);

        // image onload
        img.onload = function () {
            // 缩放的宽高
            var nowWidth = 0;
            var nowHeight = 0;
            // 图片真实宽高
            var realWidth = 0;
            var realHeight = 0;
            realWidth = img.naturalWidth;  // html5 新属性
            realHeight = img.naturalHeight;
            if (realWidth == 0 || realHeight == 0) {
                if(option.error) {
                    option.error('图片加载失败');
                }
                return;
            }

            // 计算缩放后大小
            if (realHeight > option.maxLength && realHeight >= realWidth) {  // 高度 > 宽度
                nowHeight = option.maxLength;
                nowWidth = parseInt((nowHeight / realHeight) * realWidth);
            } else if (realWidth > option.maxLength && realWidth >= realHeight) {  // 宽度 > 高度
                nowWidth = option.maxLength;
                nowHeight = parseInt((nowWidth / realWidth) * realHeight);
            } else {
                nowWidth = realWidth;
                nowHeight = realHeight;
            }

            // 压缩图片
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = nowWidth;
            canvas.height = nowHeight;
            ctx.drawImage(img, 0, 0, nowWidth, nowHeight);
            option.success(canvas.toDataURL('image/jpeg', option.quality));  // 取值范围为 0 到 1
        };
    };

    /**
     * dataURL 转 Blob
     */
    var dataURLtoBlob = function (dataURL) {
        var arr = dataURL.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        var decodedData = atob(arr[1]);
        var length = decodedData.length;
        var u8arr = new Uint8Array(length);
        while (length--) {
            u8arr[length] = decodedData.charCodeAt(length);
        }
        return new Blob([u8arr], {type: mime});
    };

    /**
     * 检查文件类型
     */
    var checkFileType = function(file) {
        if (file == null) {
            return false;
        }
        var patten = /^.+\.(jpg|jpeg|gif|png)$/i;
        return file.name.match(patten) != null;
    };

    // 公开的方法
    window.ImageCompress = {
        'compressImage': compressImage,
        'getOptions': getOptions,
        'dataURLtoBlob': dataURLtoBlob,
        'checkFileType': checkFileType
    };

})();
