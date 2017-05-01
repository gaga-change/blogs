module.exports = {
  variants: {
    article: {
      resize: {
        detail: 'x440'
      },
      crop: {

      },
      resizeAndCrop: {
        mini: { resize: '63504@', crop: '252x210' }
      }
    },

    gallery: {
      crop: {
        thumb: '100x100'
      }
    }
  },

  storage: {
    S3: {
      key: 'YYqfoBITq4FDayvHkgUplOYKeU0xBG-M0ajhaMCC',
      secret: 'i5EnqP2JAuwS3bUuXEdKQ6lKC7x2ocxsxHoBvXRG',
      bucket: 'op9l4cwx1.bkt.clouddn.com'
    }
  },

  debug: true
}
