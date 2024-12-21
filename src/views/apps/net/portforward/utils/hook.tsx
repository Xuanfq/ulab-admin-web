import { portForwardApi } from "./api";
import { hasAuth } from "@/router/utils";
import { renderOption, renderSwitch } from "@/views/system/render";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { reactive, ref, onMounted, type Ref, shallowRef } from "vue";

export function usePortForward(tableRef: Ref) {
  const { t } = useI18n();
  // Permission judgment, used to determine whether the permission exists
  const api = reactive(portForwardApi);

  const auth = reactive({
    choices: hasAuth("choices:netPortForward"),
    list: hasAuth("list:netPortForward"),
    create: hasAuth("create:netPortForward"),
    delete: hasAuth("delete:netPortForward"),
    update: hasAuth("update:netPortForward"),
    export: hasAuth("export:netPortForward"),
    import: hasAuth("import:netPortForward"),
    batchDelete: hasAuth("batchDelete:netPortForward")
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
    title: t("net.PortForward"),
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
          prop: "dst_ip",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "dst_port",
          valueType: "input-number",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "protocol",
          valueType: "select",
          options: formatOptions(choicesDict.value["protocol"] ?? []),
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "is_active",
          valueType: "radio",
          renderField: renderOption()
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
      prop: "pk",
      minWidth: 100
    },
    {
      prop: "creator",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.creator.username}>{row.creator.username}</span>
      )
    },
    {
      prop: "dst_ip",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.dst_ip}>{row.dst_ip}</span>
      )
    },
    {
      prop: "dst_port",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.dst_port}>{row.dst_port}</span>
      )
    },
    {
      prop: "protocol",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.protocol.label}>
          {row.protocol.label}
        </span>
      )
    },
    {
      prop: "is_active",
      minWidth: 130,
      cellRenderer: renderSwitch(auth.update, tableRef, "is_active", scope => {
        return (
          scope.row.dst_ip +
          ":" +
          scope.row.dst_port +
          ":" +
          scope.row.protocol.label
        );
      })
    },
    {
      prop: "src_ip",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.src_ip}>{row.src_ip}</span>
      )
    },
    {
      prop: "src_port",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.src_port}>{row.src_port}</span>
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
