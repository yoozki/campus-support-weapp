Page({
  data: {
    fileList: [],
  },

  afterRead(event) {
    const { file } = event.detail;
    const that = this
    const fileList = that.data.fileList
    wx.uploadFile({
      url: 'http://localhost:10021/image',
      filePath: file.url,
      name: 'image',
      formData: { user: 'test' },
      success(res) {
        const tmp = JSON.parse(res.data)
        const image = {
          url: tmp.data,
          isImage: true,
        }
        console.log(image)
        fileList.push(image);
        that.setData({
          fileList: fileList,
          tmp: tmp
        });
      },
    });
  },
});