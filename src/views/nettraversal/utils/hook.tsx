import { netforwardApi } from "./api";
import { hasAuth } from "@/router/utils";
import { renderOption, renderSwitch } from "@/views/system/render";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { reactive, ref, onMounted, type Ref, shallowRef } from "vue";

export function useNettraversalNetforward(tableRef: Ref) {
  const { t } = useI18n();
  // Permission judgment, used to determine whether the permission exists
  const api = reactive(netforwardApi);

  const auth = reactive({
    choices: hasAuth("choices:nettraversalNetForward"),
    list: hasAuth("list:nettraversalNetForward"),
    create: hasAuth("create:nettraversalNetForward"),
    delete: hasAuth("delete:nettraversalNetForward"),
    update: hasAuth("update:nettraversalNetForward"),
    export: hasAuth("export:nettraversalNetForward"),
    import: hasAuth("import:nettraversalNetForward"),
    batchDelete: hasAuth("batchDelete:nettraversalNetForward")
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
    title: t("nettraversalNetforward.netForward"),
    formProps: {
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
          prop: "origin_ip",
          valueType: "input",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "origin_port",
          valueType: "input-number",
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "origin_protocol",
          valueType: "select",
          options: formatOptions(choicesDict.value["origin_protocol"] ?? []),
          colProps: { xs: 24, sm: 24, md: 24, lg: 12, xl: 12 }
        },
        {
          prop: "is_active",
          valueType: "radio",
          renderField: renderOption()
        }
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
      prop: "origin_ip",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.origin_ip}>{row.origin_ip}</span>
      )
    },
    {
      prop: "origin_port",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.origin_port}>{row.origin_port}</span>
      )
    },
    {
      prop: "origin_protocol",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.origin_protocol.label}>
          {row.origin_protocol.label}
        </span>
      )
    },
    {
      prop: "is_active",
      minWidth: 130,
      cellRenderer: renderSwitch(auth.update, tableRef, "is_active", scope => {
        return (
          scope.row.origin_ip +
          ":" +
          scope.row.origin_port +
          ":" +
          scope.row.origin_protocol.label
        );
      })
    },
    {
      prop: "forward_ip",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.forward_ip}>{row.forward_ip}</span>
      )
    },
    {
      prop: "forward_port",
      minWidth: 150,
      cellRenderer: ({ row }) => (
        <span v-copy={row.forward_port}>{row.forward_port}</span>
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
