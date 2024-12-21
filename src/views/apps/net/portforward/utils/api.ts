import { BaseApi } from "@/api/base";

const portForwardApi = new BaseApi("/api/net/admin/portforward");
portForwardApi.update = portForwardApi.patch;
export { portForwardApi };
