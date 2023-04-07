
//图标 https://www.iconfont.cn/ (github账号登录，edu项目) 添加图标
//更新public/index.html里的css链接
import Icon from './Icon'
//demo组件
import PriceInput from './PriceInput'
//上传图片,可通过配置accept允许上传文件，自动处理url，只需提供一个url，不需要提供name
import UploadImgLight from './UploadImgLight'
//上传图片，多张，自动处理url，只需提供一个url，不需要提供name
import UploadImgPlusLight from './UploadImgPlusLight'
//新增支持调整图片顺序功能
import UploadImgPlusLightWithOrder from './UploadImgPlusLightWithOrder'
//可以向富文本框里插入图片
import UploadImgPlusLightForEditor from './UploadImgPlusLightForEditor'
//上传图片到CND
import UploadImgToCND from './UploadImgToCND'
//上传图片到CND,antd mobile
import UploadImgToCNDMobile from './UploadImgToCNDMobile'
//上传视频到CND
import UploadVideoToCND from './UploadVideoToCND'
//省市区级联
import AreaCascader from './AreaCascader'
//省市级联
import AreaCityCascader from './AreaCityCascader'
//营业日 周一至周日
import WorkDay from './WorkDay'
//营业日 周一至周日 value是1~7
import WorkDayNum from './WorkDayNum'
//搜索,表单
import Search from './Search'
//表格,包括分页和复选框
import MyTable from './MyTable'
//表格，不包括分页，和复选框
import MyTableForEasy from './MyTableForEasy'
//编辑或查看商户时对话框顶部的信息
import CompanyState from './CompanyState'
//所属分类，可以动态添加和删除
import Category from './Category'
//所属分类，多选
import CategoryPlus from './CategoryPlus'
//礼品优惠
import Gift from './Gift'
//富文本
//import MyEditor from './MyEditor'
//工具条
import Toolbar from './Toolbar'
// 直销管理-线下商户-商户列表 -编辑 顶部的信息
import BaiduInfo from './BaiduInfo'
// 线上商户管理-商户管理-商户列表-课程常见问题
import Question from './Question'
//线上商户管理-物料管理-课程列表-课程日期
import CourseDate from './CourseDate'
//线上商户管理-物料管理-课程列表-上课时间
import CourseTime from './CourseTime'
// 我的工作台
import MenuListSidebar from './MenuListSidebar'
//错误边界
import ErrorBoundary from './ErrorBoundary'
//回到顶部
import MyBackTop from './MyBackTop'
//水印
import Watermark from './Watermark'
//loading
import Loading from './Loading'
//搜索tab
import SearchTab from './SearchTab'
//课程信息
import ClassInfo from './ClassInfo'
//编辑单元格
import EditCell from './EditCell'
//独立页面header
import SinglePageHeader from './SinglePageHeader'
import './index.css'

export {
  Icon,
  PriceInput,
  UploadImgLight,
  UploadImgPlusLight,
  UploadImgPlusLightWithOrder,
  UploadImgPlusLightForEditor,
  UploadImgToCND,
  UploadImgToCNDMobile,
  UploadVideoToCND,
  AreaCascader,
  AreaCityCascader,
  WorkDay,
  WorkDayNum,
  Search,
  MyTable,
  MyTableForEasy,
  CompanyState,
  Category,
  CategoryPlus,
  Gift,
  //MyEditor,
  Toolbar,
  BaiduInfo,
  Question,
  CourseDate,
  CourseTime,
  MenuListSidebar,
  ErrorBoundary,
  MyBackTop,
  Watermark,
  Loading,
  SearchTab,
  ClassInfo,
  //编辑单元格
  EditCell,
  SinglePageHeader,
}
