<script lang="ts" setup>
import { ref } from "vue";
import { useNettraversalNetforward } from "./utils/hook";
import ReBaseTable from "@/components/ReBaseTable";

defineOptions({
  name: "NettraversalNetforward"
});

const tableRef = ref();

const { api, auth, columns, editForm } = useNettraversalNetforward(tableRef);

</script>

<template>
  <ReBaseTable
    ref="tableRef"
    :api="api"
    :auth="auth"
    :edit-form="editForm"
    :table-columns="columns"
    locale-name="nettraversalNetforward"
  />
</template>
