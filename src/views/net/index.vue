<script lang="ts" setup>
import { ref } from "vue";
import { usePortForward } from "./utils/hook";
import ReBaseTable from "@/components/ReBaseTable";

defineOptions({
  name: "PortForward"
});

const tableRef = ref();

const { api, auth, columns, editForm } = usePortForward(tableRef);

</script>

<template>
  <ReBaseTable
    ref="tableRef"
    :api="api"
    :auth="auth"
    :edit-form="editForm"
    :table-columns="columns"
    locale-name="net"
  />
</template>
