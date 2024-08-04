import { BaseApi } from "@/api/base";

const netforwardApi = new BaseApi("/api/nettraversal/netforward");
netforwardApi.update = netforwardApi.patch;
export { netforwardApi };
