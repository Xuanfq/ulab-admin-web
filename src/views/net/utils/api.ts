import { BaseApi } from "@/api/base";

const portForwardApi = new BaseApi("/api/net/user/portforward");
portForwardApi.update = portForwardApi.patch;
export { portForwardApi };
