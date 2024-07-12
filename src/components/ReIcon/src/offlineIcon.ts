// 这里存放本地图标，在 src/layout/index.vue 文件中加载，避免在首启动加载
import { addIcon } from "@iconify/vue/dist/offline";

// 本地菜单图标，后端在路由的 icon 中返回对应的图标字符串并且前端在此处使用 addIcon 添加即可渲染菜单图标
// @iconify-icons/ep
import Menu from "@iconify-icons/ep/menu";
import Edit from "@iconify-icons/ep/edit";
import SetUp from "@iconify-icons/ep/set-up";
import Guide from "@iconify-icons/ep/guide";
import Monitor from "@iconify-icons/ep/monitor";
import Lollipop from "@iconify-icons/ep/lollipop";
import Histogram from "@iconify-icons/ep/histogram";
import HomeFilled from "@iconify-icons/ep/home-filled";
// @iconify-icons/ri
import Tag from "@iconify-icons/ri/bookmark-2-line";
import Ppt from "@iconify-icons/ri/file-ppt-2-line";
import Card from "@iconify-icons/ri/bank-card-line";
import Role from "@iconify-icons/ri/admin-fill";
import Info from "@iconify-icons/ri/file-info-line";
import Dept from "@iconify-icons/ri/git-branch-line";
import Table from "@iconify-icons/ri/table-line";
import Links from "@iconify-icons/ri/links-fill";
import Search from "@iconify-icons/ri/search-line";
import FlUser from "@iconify-icons/ri/admin-line";
import Setting from "@iconify-icons/ri/settings-3-line";
import BarChart from "@iconify-icons/ri/bar-chart-horizontal-line";
import LoginLog from "@iconify-icons/ri/window-line";
import Artboard from "@iconify-icons/ri/artboard-line";
import SystemLog from "@iconify-icons/ri/file-search-line";
import ListCheck from "@iconify-icons/ri/list-check";
import UbuntuFill from "@iconify-icons/ri/ubuntu-fill";
import OnlineUser from "@iconify-icons/ri/user-voice-line";
import EditBoxLine from "@iconify-icons/ri/edit-box-line";
import OperationLog from "@iconify-icons/ri/history-fill";
import InformationLine from "@iconify-icons/ri/information-line";
import TerminalWindowLine from "@iconify-icons/ri/terminal-window-line";
import CheckboxCircleLine from "@iconify-icons/ri/checkbox-circle-line";

addIcon("ep:menu", Menu);
addIcon("ep:edit", Edit);
addIcon("ep:set-up", SetUp);
addIcon("ep:guide", Guide);
addIcon("ep:monitor", Monitor);
addIcon("ep:lollipop", Lollipop);
addIcon("ep:histogram", Histogram);
addIcon("ep:home-filled", HomeFilled);
addIcon("ri:bookmark-2-line", Tag);
addIcon("ri:file-ppt-2-line", Ppt);
addIcon("ri:bank-card-line", Card);
addIcon("ri:admin-fill", Role);
addIcon("ri:file-info-line", Info);
addIcon("ri:git-branch-line", Dept);
addIcon("ri:links-fill", Links);
addIcon("ri:table-line", Table);
addIcon("ri:search-line", Search);
addIcon("ri:admin-line", FlUser);
addIcon("ri:settings-3-line", Setting);
addIcon("ri:bar-chart-horizontal-line", BarChart);
addIcon("ri:window-line", LoginLog);
addIcon("ri:file-search-line", SystemLog);
addIcon("ri:artboard-line", Artboard);
addIcon("ri:list-check", ListCheck);
addIcon("ri:ubuntu-fill", UbuntuFill);
addIcon("ri:user-voice-line", OnlineUser);
addIcon("ri:edit-box-line", EditBoxLine);
addIcon("ri:history-fill", OperationLog);
addIcon("ri:information-line", InformationLine);
addIcon("ri:terminal-window-line", TerminalWindowLine);
addIcon("ri:checkbox-circle-line", CheckboxCircleLine);
