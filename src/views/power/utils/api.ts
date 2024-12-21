import { BaseApi } from "@/api/base";

const apcPduPowerApi = new BaseApi("/api/power/admin/apcpdupower");
apcPduPowerApi.update = apcPduPowerApi.patch;
export { apcPduPowerApi };
