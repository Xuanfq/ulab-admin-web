<script lang="ts" setup>
import { ref } from "vue";
import { useApcPduPower } from "./utils/hook";
import ReBaseTable from "@/components/ReBaseTable";

defineOptions({
  name: "PowerApcPduPower"
});

const tableRef = ref();

const { api, auth, columns, editForm } = useApcPduPower(tableRef);

</script>

<template>
  <ReBaseTable
    ref="tableRef"
    :api="api"
    :auth="auth"
    :edit-form="editForm"
    :table-columns="columns"
    locale-name="power"
  />
</template>
