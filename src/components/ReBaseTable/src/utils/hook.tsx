import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import type { FormProps, SearchFieldsProps } from "./types";
import { h, onMounted, ref, type Ref, toRaw } from "vue";
import {
  cloneDeep,
  delay,
  deviceDetection,
  getKeyList,
  isArray,
  isEmpty
} from "@pureadmin/utils";
import { useI18n } from "vue-i18n";
import { ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import { formatColumnsLabel, formatFormColumns } from "@/views/system/hooks";
import exportDataForm from "../form/exportData.vue";
import importDataForm from "../form/importData.vue";
import addOrEdit from "../form/addOrEdit.vue";
import { resourcesIDCacheApi } from "@/api/common";
import { getFieldsData } from "./index";
import { getNameAvatar, getDefaultAvatar } from "@/utils/avatar";

export function useBaseTable(
  emit: any,
  tableRef: Ref,
  api: FormProps["api"],
  editForm: FormProps["editForm"],
  tableColumns: FormProps["tableColumns"],
  pagination: FormProps["pagination"],
  resultFormat: FormProps["resultFormat"],
  localeName: FormProps["localeName"]
) {
  const { t, te } = useI18n();
  const formRef = ref();
  const searchFields = ref<SearchFieldsProps>({
    page: 1,
    size: 10,
    ordering: "-created_time"
  });
  const defaultValue = ref({
    page: searchFields.value.page,
    size: searchFields.value.size
  });
  const searchColumns = ref([]);
  const selectedNum = ref(0);
  const dataList = ref([]);
  const loading = ref(true);
  const showColumns = ref([]);
  const route = useRoute();
  const getParameter = isEmpty(route.params) ? route.query : route.params;
  const handleDelete = row => {
    api.delete(row.pk ?? row.id).then(res => {
      if (res.code === 1000) {
        message(t("results.success"), { type: "success" });
        onSearch();
      } else {
        message(`${t("results.failed")}，${res.detail}`, { type: "error" });
      }
    });
  };

  const handleSizeChange = (val: number) => {
    searchFields.value.page = 1;
    searchFields.value.size = val;
    onSearch();
  };

  const handleCurrentChange = (val: number) => {
    searchFields.value.page = val;
    onSearch();
  };

  const handleSelectionChange = val => {
    selectedNum.value = val.length;
    emit("selectionChange", getSelectPks);
  };

  const onSelectionCancel = () => {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  };

  const getSelectPks = (key = "pk") => {
    const manySelectData = tableRef.value.getTableRef().getSelectionRows();
    return getKeyList(manySelectData, key);
  };

  const handleManyDelete = () => {
    if (selectedNum.value === 0) {
      message(t("results.noSelectedData"), { type: "error" });
      return;
    }
    api.batchDelete(getSelectPks("pk")).then(res => {
      if (res.code === 1000) {
        message(t("results.batchDelete", { count: selectedNum.value }), {
          type: "success"
        });
        onSelectionCancel();
        onSearch();
      } else {
        message(`${t("results.failed")}，${res.detail}`, { type: "error" });
      }
    });
  };

  const formatColumns = (results, columns) => {
    if (results.length > 0) {
      showColumns.value = Object.keys(results[0]);
      cloneDeep(columns).forEach(column => {
        if (
          column?.prop &&
          showColumns.value.indexOf(column?.prop.split(".")[0]) === -1
        ) {
          columns.splice(
            columns.findIndex(obj => {
              return obj.label === column.label;
            }),
            1
          );
        }
      });
    }
  };

  const formatSearchPks = params => {
    Object.keys(params).forEach(key => {
      const value = params[key];
      const pks = [];
      if (isArray(value)) {
        value.forEach(item => {
          if (item.pk) {
            pks.push(item.pk);
          }
        });
        if (pks.length > 0) {
          params[key] = pks;
        }
      }
    });
  };

  const getFormatLabel = label => {
    if (te(label)) {
      return t(label);
    }
    return label;
  };

  const onSearch = (init = false) => {
    if (init) {
      pagination.currentPage = searchFields.value.page =
        defaultValue.value?.page ?? 1;
      pagination.pageSize = searchFields.value.size =
        defaultValue.value?.size ?? 10;
    }
    loading.value = true;
    ["created_time", "updated_time"].forEach(key => {
      if (searchFields.value[key]?.length === 2) {
        searchFields.value[`${key}_after`] = searchFields.value[key][0];
        searchFields.value[`${key}_before`] = searchFields.value[key][1];
      } else {
        searchFields.value[`${key}_after`] = "";
        searchFields.value[`${key}_before`] = "";
      }
    });
    const params = cloneDeep(toRaw(searchFields.value));
    // 该方法为了支持pk多选操作将如下格式 [{pk:1},{pk:2}] 转换为 [1,2]
    formatSearchPks(params);

    api
      .list(params)
      .then(res => {
        if (res.code === 1000 && res.data) {
          for(let i=0;i<tableColumns.length;i++){
            let column=tableColumns[i]
            if (column?.prop === "avatar") {
              for(let i=0;i<res.data.results.length;i++){
                if (!res.data.results[i].avatar){
                  if (res.data.results[i].nickname){
                    res.data.results[i].avatar = getNameAvatar(res.data.results[i].nickname)
                  } else if (res.data.results[i].username){
                    res.data.results[i].avatar = getNameAvatar(res.data.results[i].username)
                  } else {
                    res.data.results[i].avatar = getDefaultAvatar()
                  }
                }
              }
              break
            }
          }
          formatColumns(res.data?.results, tableColumns);
          if (resultFormat && typeof resultFormat === "function") {
            dataList.value = resultFormat(res.data.results);
          } else {
            dataList.value = res.data.results;
          }
          pagination.total = res.data.total;
        } else {
          message(`${t("results.failed")}，${res.detail}`, { type: "error" });
        }
        emit("searchEnd", getParameter, searchFields, dataList, res);
        delay(500).then(() => {
          loading.value = false;
        });
      })
      .catch(() => {
        loading.value = false;
      });
  };

  // 数据导出
  function exportData() {
    const pks = getSelectPks();
    addDialog({
      title: t("exportImport.export"),
      props: {
        formInline: {
          type: "xlsx",
          range: pks.length > 0 ? "selected" : "all",
          pks: pks
        }
      },
      width: "600px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(exportDataForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = cloneDeep(options.props.formInline);
        FormRef.validate(valid => {
          if (valid) {
            if (curData.range === "all") {
              api.export(curData);
            } else if (curData.range === "search") {
              searchFields.value["type"] = curData["type"];
              api.export(toRaw(searchFields.value));
            } else if (curData.range === "selected") {
              resourcesIDCacheApi(curData.pks).then(res => {
                curData["spm"] = res.spm;
                delete curData.pks;
                api.export(curData);
              });
            }
            done();
          }
        });
      }
    });
  }

  // 数据导入
  function importData() {
    addDialog({
      title: t("exportImport.import"),
      props: {
        formInline: {
          action: "create",
          api: api
        }
      },
      width: "600px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(importDataForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = cloneDeep(options.props.formInline);
        const chores = () => {
          message(t("results.success"), { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        };
        FormRef.validate(valid => {
          if (valid) {
            api.import(curData.action, curData.upload[0].raw).then(res => {
              if (res.code === 1000) {
                chores();
              } else {
                message(`${t("results.failed")}，${res.detail}`, {
                  type: "error"
                });
              }
            });
          }
        });
      }
    });
  }

  const openDialog = (isAdd = true, row = {}) => {
    let title = t("buttons.edit");
    if (isAdd) {
      title = t("buttons.add");
    }
    const rowResult = {};
    Object.keys(editForm?.row ?? {}).forEach(key => {
      const getValue = editForm.row[key];
      if (typeof editForm.row[key] === "function") {
        rowResult[key] = getValue(row, isAdd, dataList.value);
      } else {
        rowResult[key] = getValue;
      }
    });
    const propsResult = {};
    Object.keys(editForm?.props ?? {}).forEach(key => {
      const getValue = editForm.props[key];
      if (typeof editForm.props[key] === "function") {
        propsResult[key] = getValue(row, isAdd, dataList.value);
      } else {
        propsResult[key] = getValue;
      }
    });
    if (typeof editForm?.columns === "function") {
      editForm.columns = editForm.columns({ row, isAdd, data: dataList.value });
    }
    formatFormColumns(
      { isAdd, showColumns: showColumns.value },
      editForm?.columns as Array<any>,
      t,
      te,
      localeName
    );
    addDialog({
      title: `${title} ${editForm.title ?? ""}`,
      props: {
        formInline: {
          ...row,
          ...rowResult
        },
        ...propsResult,
        showColumns: showColumns.value,
        columns: editForm?.columns ?? [],
        formProps: editForm?.formProps ?? {},
        isAdd: isAdd
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm.form ?? addOrEdit, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = cloneDeep(options.props.formInline);

        const chores = () => {
          message(t("results.success"), { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        };

        FormRef.validate(valid => {
          if (valid) {
            if (isAdd) {
              // todo 接口监测方法
              let apiCreate = api.create;
              if (api.create.length === 3) {
                apiCreate = apiCreate(row, isAdd, curData);
              }
              apiCreate(curData).then(async res => {
                if (res.code === 1000) {
                  chores();
                } else {
                  message(`${t("results.failed")}，${res.detail}`, {
                    type: "error"
                  });
                }
              });
            } else {
              let apiUpdate = api.update;
              if (api.update.length === 3) {
                apiUpdate = apiUpdate(row, isAdd, curData);
              }
              apiUpdate(curData.pk, curData).then(res => {
                if (res.code === 1000) {
                  chores();
                } else {
                  message(`${t("results.failed")}，${res.detail}`, {
                    type: "error"
                  });
                }
              });
            }
          }
        });
      },
      ...editForm.options
    });
  };
  const onChange = (
    switchLoadMap,
    { row, index },
    actKey,
    msg,
    updateApi = null,
    actMsg = null
  ) => {
    if (!actMsg) {
      actMsg = row[actKey] === false ? t("labels.disable") : t("labels.enable");
    }
    ElMessageBox.confirm(
      `${t("buttons.operateConfirm", {
        action: `<strong>${actMsg}</strong>`,
        message: `<strong style="color:var(--el-color-primary)">${msg}</strong>`
      })}`,
      {
        confirmButtonText: t("buttons.sure"),
        cancelButtonText: t("buttons.cancel"),
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        if (!updateApi) {
          updateApi = api.update;
        }
        const data = {};
        data[actKey] = row[actKey];
        updateApi(row.pk, data)
          .then(res => {
            if (res.code === 1000) {
              message(t("results.success"), { type: "success" });
            } else {
              message(`${t("results.failed")}，${res.detail}`, {
                type: "error"
              });
            }
            switchLoadMap.value[index] = Object.assign(
              {},
              switchLoadMap.value[index],
              {
                loading: false
              }
            );
          })
          .catch(e => {
            row[actKey] === false
              ? (row[actKey] = true)
              : (row[actKey] = false);
            switchLoadMap.value[index] = Object.assign(
              {},
              switchLoadMap.value[index],
              {
                loading: false
              }
            );
            throw e;
          });
      })
      .catch(() => {
        row[actKey] === false ? (row[actKey] = true) : (row[actKey] = false);
      });
  };

  onMounted(() => {
    getFieldsData(
      api.fields,
      searchFields,
      searchColumns,
      localeName,
      pagination.currentPage,
      pagination.pageSize
    ).then(() => {
      defaultValue.value = cloneDeep(searchFields.value);
      if (getParameter) {
        const parameter = cloneDeep(getParameter);
        Object.keys(parameter).forEach(param => {
          searchFields.value[param] = parameter[param];
        });
      }
      formatColumnsLabel(tableColumns, t, te, localeName);
      onSearch();
    });
  });

  return {
    t,
    route,
    loading,
    dataList,
    pagination,
    selectedNum,
    showColumns,
    defaultValue,
    searchFields,
    tableColumns,
    searchColumns,
    onChange,
    onSearch,
    exportData,
    importData,
    openDialog,
    getSelectPks,
    handleDelete,
    getFormatLabel,
    handleManyDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
