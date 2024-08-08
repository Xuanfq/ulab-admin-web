import { BaseApi } from "@/api/base";

const netforwardApi = new BaseApi("/api/nettraversal/admin/netforward");
netforwardApi.update = netforwardApi.patch;
export { netforwardApi };
