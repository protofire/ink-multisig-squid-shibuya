import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";

const FACTORY_ADDRESS_SS58 = "aoZu9coGWyNk2Ghn455CErz8zzcABQyhGB7dQ3pkDsqRKyJ";
const FACTORY_ADDRESS = toHex(ss58.decode(FACTORY_ADDRESS_SS58).bytes);
const SS58_PREFIX = ss58.decode(FACTORY_ADDRESS_SS58).prefix;
const FACTORY_DEPLOYMENT_BLOCK = 4571160;

export { FACTORY_ADDRESS, FACTORY_ADDRESS_SS58, SS58_PREFIX, FACTORY_DEPLOYMENT_BLOCK };