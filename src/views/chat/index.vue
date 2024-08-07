<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { message } from "@/utils/message";
import { PureWebSocket, WS } from "@/utils/websocket";

defineOptions({
  name: "Chat"
});
const msgData = ref([]);
const chatMsg = ref("");
const scroller = ref();
const userinfo = reactive({
  username: "",
  pk: ""
});
const ws = ref<WS>();

const scrollToBottom = () => {
  scroller.value?.scrollToBottom();
};

interface MessageProps {
  time: string;
  action: string;
  message: string;
  data: {
    pk: string;
    userinfo: {
      username: string;
    };
  };
}

const onMessage = (json_data: MessageProps) => {
  if (json_data.time) {
    switch (json_data.action) {
      case "userinfo":
        userinfo.username = json_data.data?.userinfo?.username;
        userinfo.pk = json_data.data.pk;
        break;
      case "chat_message":
        msgData.value.push(json_data.data);
        scrollToBottom();
        break;
      case "error":
        console.log(json_data);
        break;
    }
  } else {
    message(json_data.message, { type: "error" });
  }
};

const chatHandle = () => {
  if (chatMsg.value) {
    ws.value.send(
      JSON.stringify({ action: "chat_message", data: { text: chatMsg.value } })
    );
    chatMsg.value = "";
  } else {
    message("Message is not exist", { type: "warning" });
  }
};
const enter = ref(false);

onMounted(() => {
  ws.value = new PureWebSocket("system_default_websocket", "ulab", {
    openCallback: () => {
      message("Connected Successfully", { type: "success" });
      enter.value = true;
      ws.value.send(JSON.stringify({ action: "userinfo", data: {} }));
      ws.value.onMessage(data => {
        onMessage(data);
      });
    },
    errorCallback() {
      message(`Connection disconnected. Retrying ${ws.value.reconnectCount} time(s)`, {
        type: "warning"
      });
    }
  });
});

onUnmounted(() => {
  if (ws.value) ws.value.close();
});
const search = ref("");
const filteredItems = computed(() => {
  if (!search.value) return msgData.value;
  const lowerCaseSearch = search.value;
  return msgData.value.filter(i => i.text == lowerCaseSearch);
});
</script>

<template>
  <el-row :gutter="24" style="padding: 20px 10px;">
    <el-col :lg="13" :md="13" :sm="24" :xl="13" :xs="24">
      <el-card class="mb-4 box-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="font-medium">Chat Room</span>
          </div>
        </template>
        <div class="h-[500px]">
          <DynamicScroller
            ref="scroller"
            :items="filteredItems"
            :min-item-size="20"
            class="scroller"
            key-field="time"
            @resize="scrollToBottom"
          >
            <template #default="{ item, index, active }">
              <DynamicScrollerItem
                :active="active"
                :class="[userinfo.pk === item.pk ? 'message-me' : 'message']"
                :data-active="active"
                :data-index="index"
                :item="item"
                :size-dependencies="[item.text]"
                :title="`${index} ${item.username}  ${item.pk}`"
              >
                <div class="flex items-center">
                  <el-text type="info">{{ item.username }}：</el-text>
                  <el-text type="primary">{{ item.text }}</el-text>
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </el-card>
      <el-card>
        <el-form-item label="Please input: ">
          <div class="w-[60%]">
            <el-input
              v-model="chatMsg"
              placeholder="Enter message and press enter to send..."
              @keyup.enter="chatHandle"
            />
          </div>
          <el-button @click="chatHandle">Send</el-button>
        </el-form-item>
      </el-card>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.main-content {
  margin: 0 !important;
}

.message {
  box-sizing: border-box;
  display: flex;
  min-height: 28px;
  padding: 12px;
}

.message-me {
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  min-height: 28px;
  padding: 12px;
}

.scroller {
  flex: auto 1 1;
  height: 100%;
}

:deep(.vue-recycle-scroller__item-view.hover) {
  color: white;
  background: #4fc08d;
}
</style>
