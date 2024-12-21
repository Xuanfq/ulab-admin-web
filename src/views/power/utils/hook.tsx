import { apcPduPowerApi } from "./api";
import { hasAuth } from "@/router/utils";
import { renderOption, renderSwitch } from "@/views/system/render";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { reactive, ref, onMounted, type Ref, shallowRef } from "vue";

export function useApcPduPower(tableRef: Ref) {
  const { t } = useI18n();
  // Permission judgment, used to determine whether the permission exists
  const api = reactive(apcPduPowerApi);

  const auth = reactive({
    choices: hasAuth("choices:powerApcPduPower"),
    list: hasAuth("list:powerApcPduPower"),
    create: hasAuth("create:powerApcPduPower"),
    delete: hasAuth("delete:powerApcPduPower"),
    update: hasAuth("update:powerApcPduPower"),
    export: hasAuth("export:powerApcPduPower"),
    import: hasAuth("import:powerApcPduPower"),
    batchDelete: hasAuth("batchDelete:powerApcPduPower")
  });

  const choicesDict = ref([]);

  onMounted(() => {
    api.choices().then(res => {
      if (res.code === 1000) {
        choicesDict.value = res.choices_dict;
      }
    });
  });

  /**
   * @description Format backend output
   * @param data
   */
  const formatOptions = (data: Array<any>) => {
    const result = [];
    data?.forEach(item => {
      result.push({
        label: item?.label,
        value: item?.value,
        fieldItemProps: {
          disabled: item?.disabled
        }
      });
    });
    return result;
  };

  // Newly added or updated form forms
  const editForm = shallowRef({
    title: t("power.apcpdupower"),
    formProps: {
      labelWidth: "130px",
      rules: {}
    },
    row: {
      is_active: row => {
        return row?.is_active ?? true;
      }
    },
    columns: () => {
      return [
        {
          prop: "name",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "type",
          valueType: "select",
          options: formatOptions(choicesDict.value["type"] ?? []),
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "ip",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "port",
          valueType: "input-number",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "username",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "password",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "description",
          valueType: "textarea",
        },
      ];
    }
  });

  // Used for displaying table fields in the frontend. 
  // The first two, selection, are fixed and used to control multiple selections
  const columns = ref<TableColumnList>([
    {
      type: "selection",
      fixed: "left",
      reserveSelection: true
    },
    {
      prop: "id",
      minWidth: 100
    },
    {
      prop: "name",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.name}>{row.name}</span>
      )
    },
    {
      prop: "type",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.type.label}>
          {row.type.label}
        </span>
      )
    },
    {
      prop: "ip",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.ip}>{row.ip}</span>
      )
    },
    {
      prop: "port",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.port}>{row.port}</span>
      )
    },
    {
      prop: "description",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.description}>{row.description}</span>
      )
    },
    {
      prop: "creator",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.creator.username}>{row.creator.username}</span>
      )
    },
    {
      minWidth: 180,
      prop: "created_time",
      formatter: ({ created_time }) =>
        dayjs(created_time).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      fixed: "right",
      width: 160,
      slot: "operation",
      hide: !(auth.update || auth.delete)
    }
  ]);

  return {
    t,
    api,
    auth,
    columns,
    editForm
  };
}
