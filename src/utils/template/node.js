// 全局替换一次  testTemplate
// 全局替换一次 template
// 替换完复制，不要保存，以后还要使用

const Api = {
  //#region 列表(node)
  testTemplateSearch: (data) => common({ url: urls.light.testTemplateSearch, data, method: 'post' }),
  testTemplateAdd: (data) => common({ url: urls.light.testTemplateAdd, data, method: 'post' }),
  testTemplateDelete: (data) => common({ url: urls.light.testTemplateDelete, data, method: 'post' }),
  testTemplateEdit: (data) => common({ url: urls.light.testTemplateEdit, data, method: 'post' }),
  testTemplateUp: (data) => common({ url: urls.light.testTemplateUp, data, method: 'post' }),
  
  
  //#endregion
}

const urls = {
  //#region 列表(node)
  testTemplateSearch: nodeBaseURL + '/api/template/search',
  testTemplateAdd: nodeBaseURL + '/api/template/add',
  testTemplateDelete: nodeBaseURL + '/api/template/delete',
  testTemplateEdit: nodeBaseURL + '/api/template/edit',
  testTemplateUp: nodeBaseURL + '/api/template/up',


  //#endregion
}




