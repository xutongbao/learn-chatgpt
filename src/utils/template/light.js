// 全局替换一次  saleUser
// 替换完复制，不要保存，以后还要使用

const Api = {
  //#region 列表
  saleUserSearch: (data) => common({ url: urls.light.saleUserSearch, data, method: 'post' }),
  saleUserAdd: (data) => common({ url: urls.light.saleUserAdd, data, method: 'post' }),
  saleUserDelete: (data) => common({ url: urls.light.saleUserDelete, data, method: 'post' }),
  saleUserEdit: (data) => common({ url: urls.light.saleUserEdit, data, method: 'post' }),
  saleUserUp: (data) => common({ url: urls.light.saleUserUp, data, method: 'post' }),

  //#endregion
}

const urls = {
  //#region 列表
  saleUserSearch: '/zlhx/admin/saleUser/search',
  saleUserAdd: '/zlhx/admin/saleUser/add',
  saleUserDelete: '/zlhx/admin/saleUser/delete',
  saleUserEdit: '/zlhx/admin/saleUser/edit',
  saleUserUp: '/zlhx/admin/saleUser/up',
  //#endregion
}




