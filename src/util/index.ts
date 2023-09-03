import { formatUserAvatar } from "./Format";
import { totalGuildCount } from "./Guild";

interface Utils {
  totalGuildCount: typeof totalGuildCount;
  formatUserAvatar: typeof formatUserAvatar;
}

const Utils: Utils = {
  totalGuildCount: totalGuildCount,
  formatUserAvatar: formatUserAvatar,
};

export { Utils };
